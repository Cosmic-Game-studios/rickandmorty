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

  // State declarations
  const [language, setLanguage] = useState(null); // "en" or "de"
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Translation object
  const t = useMemo(() => ({
    en: {
      selectLanguage: "Select your language for the quiz",
      english: "English",
      german: "Deutsch",
      loading: "Loading quiz questions...",
      noQuestions: "No quiz questions available.",
      quizTitle: "Rick and Morty Quiz",
      quizCompleted: "Quiz Completed!",
      progress: (score, total) => `You answered ${score} out of ${total} questions correctly.`,
      submit: "Submit Answer",
      correctFeedback: "Correct answer! +50 points",
      wrongFeedback: "Wrong answer.",
      back: "Back to Language Selection",
      retry: "Retry"
    },
    de: {
      selectLanguage: "Wählen Sie Ihre Sprache für das Quiz",
      english: "Englisch",
      german: "Deutsch",
      loading: "Quizfragen werden geladen...",
      noQuestions: "Keine Quizfragen verfügbar.",
      quizTitle: "Rick and Morty Quiz",
      quizCompleted: "Quiz abgeschlossen!",
      progress: (score, total) => `Sie haben ${score} von ${total} Fragen richtig beantwortet.`,
      submit: "Antwort absenden",
      correctFeedback: "Richtige Antwort! +50 Punkte",
      wrongFeedback: "Falsche Antwort.",
      back: "Zurück zur Sprachauswahl",
      retry: "Erneut versuchen"
    }
  }), []);

  // Fetch quiz questions when language is selected
  useEffect(() => {
    if (!language) return;
    setLoading(true);
    setError('');
    const quizFile = language === 'en' ? '/quizData.en.json' : '/quizData.de.json';
    fetch(quizFile)
      .then(response => {
        if (!response.ok) throw new Error(t[language].loadingError || 'Error loading quiz questions.');
        return response.json();
      })
      .then(data => {
        const shuffledData = shuffleArray(data);
        const selectedQuestions = shuffledData.slice(0, 10).map(q => ({
          ...q,
          shuffledOptions: shuffleArray(q.options || [])
        }));
        if (selectedQuestions.length === 0) {
          setError(t[language].noQuestions);
        } else {
          setQuizQuestions(selectedQuestions);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [language, t]);

  // Update daily quiz count in localStorage
  const updateDailyQuizCount = () => {
    const today = new Date().toISOString().slice(0, 10);
    let data = { date: today, count: 0 };
    const stored = localStorage.getItem('dailyQuizData');
    if (stored) {
      const parsed = JSON.parse(stored);
      data = parsed.date === today ? parsed : { date: today, count: 0 };
    }
    data.count += 1;
    localStorage.setItem('dailyQuizData', JSON.stringify(data));
  };

  // Handle answer submission
  const handleAnswer = () => {
    const currentQuiz = quizQuestions[currentQuestion];
    if (!currentQuiz || !selected) return;

    const isCorrect = selected === currentQuiz.answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      completeMission(50);
      setFeedback(t[language].correctFeedback);
    } else {
      setFeedback(t[language].wrongFeedback);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelected('');
        setFeedback('');
      } else {
        setQuizCompleted(true);
        updateDailyQuizCount();
      }
    }, 1500);
  };

  // Language selection UI
  if (!language) {
    return (
      <div className="quiz-page">
        <header className="hero-section">
          <h1 className="hero-title">{t.en.selectLanguage}</h1>
          <p className="hero-subtitle">{t.en.selectLanguage}</p>
        </header>
        <section className="info-section">
          <div className="hero-buttons" style={{ justifyContent: 'center', gap: '1rem' }}>
            <button className="hero-button" onClick={() => setLanguage('en')}>
              {t.en.english}
            </button>
            <button className="hero-button" onClick={() => setLanguage('de')}>
              {t.en.german}
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="quiz-page">
        <div className="loading-spinner" aria-label={t[language].loading}></div>
        <p>{t[language].loading}</p>
      </div>
    );
  }

  // Error state with retry and back options
  if (error) {
    return (
      <div className="quiz-page">
        <div className="error-message">
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setLanguage(null)}>
              {t[language].back}
            </button>
            <button className="btn" onClick={() => window.location.reload()}>
              {t[language].retry}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No questions available
  if (quizQuestions.length === 0) {
    return (
      <div className="quiz-page">
        <p>{t[language].noQuestions}</p>
      </div>
    );
  }

  // Quiz completed UI
  if (quizCompleted) {
    return (
      <div className="quiz-page">
        <h2>{t[language].quizCompleted}</h2>
        <p>{t[language].progress(score, quizQuestions.length)}</p>
        <button className="restart-button" onClick={() => window.location.reload()}>
          {t[language].retry}
        </button>
      </div>
    );
  }

  // Main quiz UI
  return (
    <div className="quiz-page">
      <h2>{t[language].quizTitle}</h2>
      <p>Question {currentQuestion + 1} of {quizQuestions.length}</p>
      <div className="question-card">
        <p className="question-text">{quizQuestions[currentQuestion]?.question}</p>
        <div className="options-grid">
          {quizQuestions[currentQuestion]?.shuffledOptions.map((option, index) => (
            <label key={index} className="option">
              <input
                type="radio"
                name="quiz-option"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="sr-only"
              />
              <span
                className={`option ${selected === option ? 'selected' : ''}`}
                onClick={() => setSelected(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && setSelected(option)}
              >
                {option}
              </span>
            </label>
          ))}
        </div>
        {feedback && (
          <p className={`feedback ${feedback.includes('Correct') || feedback.includes('Richtige') ? 'correct' : 'wrong'}`}>
            {feedback}
          </p>
        )}
        <button
          onClick={handleAnswer}
          disabled={!selected}
          className="submit-button"
          aria-label={t[language].submit}
        >
          {t[language].submit}
        </button>
      </div>
    </div>
  );
}

export default Quiz;