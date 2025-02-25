import React, { useState, useEffect, useContext, useMemo } from 'react';
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

  // New state for language selection: "en" or "de"
  const [language, setLanguage] = useState(null);

  // Quiz states
  const [allQuestions, setAllQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitingForNext, setWaitingForNext] = useState(false);

  // Translation object for basic UI texts
  const t = useMemo(() => {
    return {
      en: {
        selectLanguage: "Select your language for the quiz",
        english: "English",
        german: "Deutsch",
        loading: "Loading quiz questions...",
        noQuestions: "No quiz questions available.",
        quizTitle: "Rick and Morty Quiz",
        quizCompleted: "Quiz Completed!",
        progress: (score, total) =>
          `You answered ${score} out of ${total} questions correctly.`,
        submit: "Submit Answer",
        correctFeedback: "Correct answer! +50 points",
        wrongFeedback: "Wrong answer.",
        correctAnswerWas: "The correct answer was:",
        next: "Next Question",
        restartQuiz: "Restart Quiz"
      },
      de: {
        selectLanguage: "Wählen Sie Ihre Sprache für das Quiz",
        english: "Englisch",
        german: "Deutsch",
        loading: "Quizfragen werden geladen...",
        noQuestions: "Keine Quizfragen verfügbar.",
        quizTitle: "Rick and Morty Quiz",
        quizCompleted: "Quiz abgeschlossen!",
        progress: (score, total) =>
          `Sie haben ${score} von ${total} Fragen richtig beantwortet.`,
        submit: "Antwort absenden",
        correctFeedback: "Richtige Antwort! +50 Punkte",
        wrongFeedback: "Falsche Antwort.",
        correctAnswerWas: "Die richtige Antwort war:",
        next: "Nächste Frage",
        restartQuiz: "Quiz neu starten"
      }
    };
  }, []);

  // Fetch quiz questions when language is selected
  useEffect(() => {
    if (!language) return;
    setLoading(true);
    setError('');
    // Determine file based on language (adjust file paths as needed)
    const quizFile = language === 'en' ? '/quizData.en.json' : '/quizData.de.json';
    fetch(quizFile)
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
  }, [language]);

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

  // Handler for answering a question
  const handleAnswer = () => {
    const currentQuiz = quizQuestions[currentQuestion];
    if (!currentQuiz) return;

    setWaitingForNext(true);
    
    if (selected === currentQuiz.answer) {
      setScore(prev => prev + 1);
      completeMission(50); // 50 points for a correct answer
      setFeedback(t[language].correctFeedback);
      setIsAnswerCorrect(true);
    } else {
      setFeedback(t[language].wrongFeedback);
      setShowCorrectAnswer(true);
      setIsAnswerCorrect(false);
    }
  };

  // Handler for moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelected('');
      setFeedback('');
      setShowCorrectAnswer(false);
      setIsAnswerCorrect(null);
      setWaitingForNext(false);
    } else {
      setQuizCompleted(true);
      updateDailyQuizCount(); // Update the daily counter when the quiz is completed
    }
  };

  // Handler for restarting the quiz
  const handleRestartQuiz = () => {
    // Reshuffle questions
    const shuffledData = shuffleArray(allQuestions);
    const selectedQuestions = shuffledData.slice(0, 10).map(q => ({
      ...q,
      shuffledOptions: shuffleArray(q.options || [])
    }));
    
    // Reset states
    setQuizQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setSelected('');
    setScore(0);
    setQuizCompleted(false);
    setFeedback('');
    setShowCorrectAnswer(false);
    setIsAnswerCorrect(null);
    setWaitingForNext(false);
  };

  // LANGUAGE SELECTION UI
  if (!language) {
    return (
      <div className="quiz-page">
        <header className="hero-section">
          <h1 className="hero-title">{t.en.selectLanguage}</h1>
          <p className="hero-subtitle">
            {t.en.selectLanguage}
          </p>
        </header>
        <section className="language-selection">
          <div className="hero-buttons" style={{ justifyContent: 'center', gap: '1rem' }}>
            <button
              className="hero-button"
              onClick={() => setLanguage('en')}
              style={{ padding: '10px 20px' }}
            >
              {t.en.english}
            </button>
            <button
              className="hero-button"
              onClick={() => setLanguage('de')}
              style={{ padding: '10px 20px' }}
            >
              {t.en.german}
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (loading) return <p className="loading-message">{t[language].loading}</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!quizQuestions || quizQuestions.length === 0)
    return <p className="no-questions-message">{t[language].noQuestions}</p>;

  if (quizCompleted) {
    return (
      <div className="quiz-page quiz-completed">
        <h2>{t[language].quizCompleted}</h2>
        <p className="score-summary">{t[language].progress(score, quizQuestions.length)}</p>
        <button 
          className="restart-button" 
          onClick={handleRestartQuiz}
        >
          {t[language].restartQuiz}
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h2>{t[language].quizTitle}</h2>
      <div className="question-card">
        <div className="question-progress">
          {currentQuestion + 1}/{quizQuestions.length}
        </div>
        <p className="question-text">
          {quizQuestions[currentQuestion]?.question}
        </p>
        <div className="options-grid">
          {(quizQuestions[currentQuestion]?.shuffledOptions || []).map((option, index) => (
            <div
              key={index}
              className={`option 
                ${selected === option ? 'selected' : ''} 
                ${waitingForNext && option === quizQuestions[currentQuestion].answer ? 'correct-answer' : ''}
                ${waitingForNext && selected === option && option !== quizQuestions[currentQuestion].answer ? 'wrong-answer' : ''}
              `}
              onClick={() => !waitingForNext && setSelected(option)}
            >
              {option}
            </div>
          ))}
        </div>
        
        <div className="feedback-container">
          {feedback && <p className={`feedback ${isAnswerCorrect ? 'correct' : 'wrong'}`}>{feedback}</p>}
          
          {showCorrectAnswer && (
            <div className="correct-answer-container">
              <p>{t[language].correctAnswerWas}</p>
              <p className="correct-answer-text">{quizQuestions[currentQuestion]?.answer}</p>
            </div>
          )}
        </div>
        
        {!waitingForNext ? (
          <button 
            onClick={handleAnswer} 
            disabled={!selected} 
            className="submit-button"
          >
            {t[language].submit}
          </button>
        ) : (
          <button 
            onClick={handleNextQuestion} 
            className="next-button"
          >
            {t[language].next}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;