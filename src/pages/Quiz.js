import React, { useState, useEffect, useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import useIsMobile from '../hooks/useIsMobile';

// Helper function: Shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Helper function: Determine question difficulty based on ID
function determineQuestionDifficulty(question) {
  const id = question.id;
  
  if (id <= 100) return "easy"; 
  if (id <= 150) return "medium"; 
  if (id <= 200) return "hard"; 
  if (id <= 300) return "very-hard"; 
  return "extreme";
}

function Quiz() {
  const { completeMission } = useContext(UserContext);
  const isMobile = useIsMobile();

  // State for language selection: "en" or "de"
  const [language, setLanguage] = useState(() => {
    // Try to get language preference from localStorage
    const saved = localStorage.getItem('quizLanguage');
    return saved || "de"; // Default to German if not set
  });

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState('all');

  // State for tracking overall quiz statistics
  const [quizStats, setQuizStats] = useState(() => {
    const saved = localStorage.getItem('quizStatistics');
    return saved ? JSON.parse(saved) : { totalAnswered: 0, totalCorrect: 0 };
  });

  // Translation object for UI texts
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
        restartQuiz: "Restart Quiz",
        difficulty: "Difficulty",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        veryHard: "Very Hard",
        extreme: "Extreme",
        selectDifficulty: "Select difficulty",
        all: "All Difficulties",
        points: "points",
        questionPoints: (points) => `Worth ${points} points`
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
        restartQuiz: "Quiz neu starten",
        difficulty: "Schwierigkeit",
        easy: "Einfach",
        medium: "Mittel",
        hard: "Schwer",
        veryHard: "Sehr Schwer",
        extreme: "Extrem",
        selectDifficulty: "Schwierigkeitsgrad wählen",
        all: "Alle Schwierigkeitsgrade",
        points: "Punkte",
        questionPoints: (points) => `Wert: ${points} Punkte`
      }
    };
  }, []);

  // Calculate points based on difficulty
  const getPointsForDifficulty = (difficulty) => {
    const difficultyMap = {
      'easy': 30,
      'medium': 50,
      'hard': 80,
      'very-hard': 120,
      'extreme': 200
    };
    
    return difficultyMap[difficulty] || 50;
  };

  // Get difficulty label based on the difficulty value
  const getDifficultyLabel = (difficulty) => {
    // Convert to lowercase and handle edge cases
    const difficultyKey = difficulty ? difficulty.toLowerCase().replace(/\s+/g, '') : 'medium';
    
    // Map difficulty values to t keys
    const difficultyMap = {
      'easy': 'easy',
      'einfach': 'easy',
      'medium': 'medium',
      'mittel': 'medium',
      'hard': 'hard',
      'schwer': 'hard',
      'veryhard': 'veryHard',
      'very-hard': 'veryHard',
      'sehrschwer': 'veryHard',
      'extreme': 'extreme',
      'extrem': 'extreme'
    };
    
    return t[language][difficultyMap[difficultyKey] || 'medium'];
  };

  // Get CSS class for difficulty
  const getDifficultyClass = (difficulty) => {
    if (!difficulty) return 'medium';
    
    const difficultyLower = difficulty.toLowerCase().replace(/\s+/g, '');
    
    if (difficultyLower === 'easy' || difficultyLower === 'einfach') return 'easy';
    if (difficultyLower === 'medium' || difficultyLower === 'mittel') return 'medium';
    if (difficultyLower === 'hard' || difficultyLower === 'schwer') return 'hard';
    if (difficultyLower === 'veryhard' || difficultyLower === 'very-hard' || difficultyLower === 'sehrschwer') return 'very-hard';
    if (difficultyLower === 'extreme' || difficultyLower === 'extrem') return 'extreme';
    
    return 'medium'; // Default
  };

  // Fetch quiz questions from JSON file
  useEffect(() => {
    if (!language) return;

    setLoading(true);
    setError('');

    // Determine which JSON file to load based on language
    const quizFile = language === 'en' ? '/quizData.en.json' : '/quizData.de.json';

    fetch(quizFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch questions (${response.status} ${response.statusText})`);
        }
        return response.json();
      })
      .then(data => {
        // Add difficulty and points properties to each question
        const processedQuestions = data.map(q => ({
          ...q,
          difficulty: determineQuestionDifficulty(q),
          points: getPointsForDifficulty(determineQuestionDifficulty(q))
        }));

        setAllQuestions(processedQuestions);
        selectQuizQuestions(processedQuestions, difficultyLevel);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading quiz questions:", err);
        setError(err.message || 'Error loading quiz questions');
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('quizLanguage', language);
  }, [language]);

  // Save quiz statistics to localStorage
  useEffect(() => {
    localStorage.setItem('quizStatistics', JSON.stringify(quizStats));
  }, [quizStats]);

  // Select quiz questions based on difficulty level
  const selectQuizQuestions = (questions, difficulty) => {
    let filteredQuestions = questions;
    
    // Filter by difficulty if not "all"
    if (difficulty !== 'all') {
      filteredQuestions = questions.filter(q => q.difficulty === difficulty);
    }
    
    // Shuffle the filtered questions
    const shuffledQuestions = shuffleArray(filteredQuestions);
    
    // Take 10 questions or fewer if not enough available
    const selectedQuestions = shuffledQuestions.slice(0, 10).map(q => ({
      ...q,
      shuffledOptions: shuffleArray(q.options || [])
    }));
    
    setQuizQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setFeedback('');
    setShowCorrectAnswer(false);
    setIsAnswerCorrect(null);
    setWaitingForNext(false);
    setQuizCompleted(false);
  };

  // Update quiz when difficulty changes
  useEffect(() => {
    if (allQuestions.length > 0) {
      selectQuizQuestions(allQuestions, difficultyLevel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyLevel]);

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    setDifficultyLevel(newDifficulty);
  };

  // Update daily quiz counter in localStorage
  const updateDailyQuizCount = () => {
    const today = new Date().toISOString().slice(0, 10);
    let data = { date: today, count: 0 };
    
    try {
      const stored = localStorage.getItem('dailyQuizData');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          data = parsed;
        }
      }
      
      data.count = data.count + 1;
      localStorage.setItem('dailyQuizData', JSON.stringify(data));
    } catch (error) {
      console.error('Error updating daily quiz count:', error);
    }
  };

  // Handler for answering a question
  const handleAnswer = () => {
    const currentQuiz = quizQuestions[currentQuestion];
    if (!currentQuiz) return;

    setWaitingForNext(true);
    
    // Update overall statistics for each answered question
    setQuizStats(prev => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1
    }));
    
    if (selected === currentQuiz.answer) {
      setScore(prev => prev + currentQuiz.points);
      completeMission(currentQuiz.points); // Points based on difficulty
      setFeedback(t[language].correctFeedback);
      setIsAnswerCorrect(true);
      
      // Update correct answers count
      setQuizStats(prev => ({
        ...prev,
        totalCorrect: prev.totalCorrect + 1
      }));
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
    // Reshuffle questions with the current difficulty
    if (allQuestions.length > 0) {
      selectQuizQuestions(allQuestions, difficultyLevel);
    }
  };

  // LANGUAGE SELECTION UI
  if (!language) {
    return (
      <div className="quiz-page">
        <header className="hero-section">
          <h1 className="hero-title">{t.en.selectLanguage}</h1>
        </header>
        <section className="language-selection">
          <div className="hero-buttons" style={{ justifyContent: 'center', gap: '1rem' }}>
            <button
              className="hero-button"
              onClick={() => setLanguage('en')}
            >
              {t.en.english}
            </button>
            <button
              className="hero-button"
              onClick={() => setLanguage('de')}
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
        
        {/* Show overall statistics */}
        <p className="score-summary">
          {language === 'de' 
            ? `Sie haben ${quizStats.totalCorrect} von ${quizStats.totalAnswered} Fragen richtig beantwortet.`
            : `You answered ${quizStats.totalCorrect} out of ${quizStats.totalAnswered} questions correctly.`
          }
        </p>
        
        {/* Current quiz score */}
        <p className="current-quiz-score">
          {t[language].progress(score, quizQuestions.reduce((total, q) => total + q.points, 0))}
        </p>
        
        {/* Difficulty selector for next quiz */}
        <div className="difficulty-selector">
          <label htmlFor="difficulty-select">{t[language].selectDifficulty}:</label>
          <select 
            id="difficulty-select"
            value={difficultyLevel}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="difficulty-select"
          >
            <option value="all">{t[language].all}</option>
            <option value="easy">{t[language].easy}</option>
            <option value="medium">{t[language].medium}</option>
            <option value="hard">{t[language].hard}</option>
            <option value="very-hard">{t[language].veryHard}</option>
            <option value="extreme">{t[language].extreme}</option>
          </select>
        </div>
        
        <button 
          className="restart-button"
          onClick={handleRestartQuiz}
        >
          {t[language].restartQuiz}
        </button>
      </div>
    );
  }

  const currentQuizQuestion = quizQuestions[currentQuestion] || {};
  const difficultyClass = getDifficultyClass(currentQuizQuestion.difficulty);

  return (
    <div className={`quiz-page ${isMobile ? 'mobile' : ''}`}>
      <h2>{t[language].quizTitle}</h2>
      
      {/* Difficulty selector */}
      <div className="difficulty-selector">
        <label htmlFor="difficulty-select">{t[language].selectDifficulty}:</label>
        <select 
          id="difficulty-select"
          value={difficultyLevel}
          onChange={(e) => handleDifficultyChange(e.target.value)}
          className="difficulty-select"
        >
          <option value="all">{t[language].all}</option>
          <option value="easy">{t[language].easy}</option>
          <option value="medium">{t[language].medium}</option>
          <option value="hard">{t[language].hard}</option>
          <option value="very-hard">{t[language].veryHard}</option>
          <option value="extreme">{t[language].extreme}</option>
        </select>
      </div>
      
      <div className="question-card">
        <div className="question-header">
          <div className="question-progress">
            {currentQuestion + 1}/{quizQuestions.length}
          </div>
          
          <div className="question-info">
            <div className={`difficulty-badge ${difficultyClass}`}>
              {getDifficultyLabel(currentQuizQuestion.difficulty)}
            </div>
            <div className="points-badge">
              {t[language].questionPoints(currentQuizQuestion.points)}
            </div>
          </div>
        </div>
        
        <p className="question-text">
          {currentQuizQuestion.question}
        </p>
        
        <div className="options-grid">
          {(currentQuizQuestion.shuffledOptions || []).map((option, index) => (
            <div
              key={index}
              className={`option 
                ${selected === option ? 'selected' : ''} 
                ${waitingForNext && option === currentQuizQuestion.answer ? 'correct-answer' : ''}
                ${waitingForNext && selected === option && option !== currentQuizQuestion.answer ? 'wrong-answer' : ''}
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
              <p className="correct-answer-text">{currentQuizQuestion.answer}</p>
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
      
      {/* Current Score Display */}
      <div className="current-score">
        {t[language].progress(score, quizQuestions.slice(0, currentQuestion + 1).reduce((total, q) => {
          // Only count points for answered questions and the current one
          return total + (waitingForNext || currentQuestion > quizQuestions.indexOf(q) ? q.points : 0);
        }, 0))}
      </div>
    </div>
  );
}

export default Quiz;