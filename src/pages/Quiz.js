import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

// Helper function: Shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function Quiz() {
  const { completeMission } = useContext(UserContext);
  const [allQuestions, setAllQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load quiz questions from the JSON file in the public folder
  useEffect(() => {
    fetch('/quizData.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error loading quiz questions.');
        }
        return response.json();
      })
      .then(data => {
        setAllQuestions(data);
        const shuffledData = shuffleArray(data);
        // Select 10 randomly shuffled questions and add a shuffled version of the answer options
        const selectedQuestions = shuffledData.slice(0, 10).map(q => ({
          ...q,
          shuffledOptions: shuffleArray(q.options || [])
        }));
        setQuizQuestions(selectedQuestions);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Function to update the daily quiz counter in localStorage
  const updateDailyQuizCount = () => {
    const today = new Date().toISOString().slice(0, 10);
    let data = { date: today, count: 0 };
    const stored = localStorage.getItem('dailyQuizData');
    if (stored) {
      const parsed = JSON.parse(stored);
      // If the stored date is not today, reset the counter
      if (parsed.date !== today) {
        data = { date: today, count: 0 };
      } else {
        data = parsed;
      }
    }
    data.count = data.count + 1;
    localStorage.setItem('dailyQuizData', JSON.stringify(data));
  };

  if (loading) return <p>Loading quiz questions...</p>;
  if (error) return <p>{error}</p>;
  if (!quizQuestions || quizQuestions.length === 0)
    return <p>No quiz questions available.</p>;

  const handleAnswer = () => {
    const currentQuiz = quizQuestions[currentQuestion];
    if (!currentQuiz) return;

    if (selected === currentQuiz.answer) {
      setScore(prev => prev + 1);
      completeMission(50); // 50 points for a correct answer
      setFeedback('Correct answer! +50 points');
    } else {
      setFeedback('Wrong answer.');
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelected('');
        setFeedback('');
      } else {
        setQuizCompleted(true);
        updateDailyQuizCount(); // Update the daily counter when the quiz is completed
      }
    }, 1500);
  };

  if (quizCompleted) {
    return (
      <div className="quiz-page">
        <h2>Quiz Completed!</h2>
        <p>
          You answered {score} out of {quizQuestions.length} questions correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h2>Rick and Morty Quiz</h2>
      <div className="question-card">
        <p className="question-text">
          {quizQuestions[currentQuestion]?.question}
        </p>
        <div className="options-grid">
          {(quizQuestions[currentQuestion]?.shuffledOptions || []).map((option, index) => (
            <div
              key={index}
              className={`option ${selected === option ? 'selected' : ''}`}
              onClick={() => setSelected(option)}
            >
              {option}
            </div>
          ))}
        </div>
        {feedback && <p className="feedback">{feedback}</p>}
        <button onClick={handleAnswer} disabled={!selected} className="submit-button">
          Submit Answer
        </button>
      </div>
    </div>
  );
}

export default Quiz;
