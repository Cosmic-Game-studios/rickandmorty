import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

// Hilfsfunktion: Array mischen (Fisher-Yates Shuffle)
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

  // Lade Quizfragen aus der JSON-Datei im public-Ordner
  useEffect(() => {
    fetch('/quizData.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Quizfragen.');
        }
        return response.json();
      })
      .then(data => {
        setAllQuestions(data);
        const shuffledData = shuffleArray(data);
        // Wähle 10 zufällig gemischte Fragen aus und füge eine gemischte Version der Antwortoptionen hinzu
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

  // Funktion zum Aktualisieren des täglichen Quiz-Zählers in localStorage
  const updateDailyQuizCount = () => {
    const today = new Date().toISOString().slice(0, 10);
    let data = { date: today, count: 0 };
    const stored = localStorage.getItem('dailyQuizData');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Wenn das gespeicherte Datum nicht gleich heute ist, setze den Zähler zurück
      if (parsed.date !== today) {
        data = { date: today, count: 0 };
      } else {
        data = parsed;
      }
    }
    data.count = data.count + 1;
    localStorage.setItem('dailyQuizData', JSON.stringify(data));
  };

  if (loading) return <p>Lade Quizfragen...</p>;
  if (error) return <p>{error}</p>;
  if (!quizQuestions || quizQuestions.length === 0) return <p>Keine Quizfragen verfügbar.</p>;

  const handleAnswer = () => {
    const currentQuiz = quizQuestions[currentQuestion];
    if (!currentQuiz) return;

    if (selected === currentQuiz.answer) {
      setScore(prev => prev + 1);
      completeMission(50); // 50 Punkte für eine richtige Antwort
      setFeedback('Richtige Antwort! +50 Punkte');
    } else {
      setFeedback('Falsche Antwort.');
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelected('');
        setFeedback('');
      } else {
        setQuizCompleted(true);
        updateDailyQuizCount(); // Aktualisiere den täglichen Zähler, wenn das Quiz abgeschlossen ist
      }
    }, 1500);
  };

  if (quizCompleted) {
    return (
      <div className="quiz-page">
        <h2>Quiz abgeschlossen!</h2>
        <p>Du hast {score} von {quizQuestions.length} Fragen richtig beantwortet.</p>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h2>Rick and Morty Quiz</h2>
      <div className="question-card">
        <p className="question-text">{quizQuestions[currentQuestion]?.question}</p>
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
          Antwort absenden
        </button>
      </div>
    </div>
  );
}

export default Quiz;