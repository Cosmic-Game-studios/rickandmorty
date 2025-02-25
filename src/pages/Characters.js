import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
  Suspense,
  Fragment
} from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useIsMobile from '../hooks/useIsMobile';

// Lazy-load the CharacterCard component
const CharacterCard = React.lazy(() => import('../components/CharacterCard'));

// LoadingIndicator Komponente für bessere Wiederverwendbarkeit
const LoadingIndicator = ({ message }) => (
  <div className="characters-loading" role="status" aria-live="polite">
    <div className="characters-loading-animation">
      <div className="characters-loading-spinner"></div>
    </div>
    <p>{message || 'Loading...'}</p>
  </div>
);

// ErrorMessage Komponente
const ErrorMessage = ({ message, onRetry }) => (
  <div className="characters-error" role="alert">
    <p>{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="characters-retry-button"
      >
        Try Again
      </button>
    )}
  </div>
);

// EmptyState Komponente
const EmptyState = () => (
  <div className="characters-empty">
    <h3>No Characters Found</h3>
    <p>There are no characters available at the moment.</p>
  </div>
);

function Characters() {
  const isMobile = useIsMobile();
  const { unlockedCharacters = [] } = useContext(UserContext) || {};
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const loadMoreRef = useRef(null);

  // Asynchrones Laden der Characters mit verbesserten Fehlermeldungen
  const loadCharacters = useCallback(async (pageNumber, isInitialLoad = false) => {
    if (isInitialLoad) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }
    setError('');
    
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${pageNumber}`,
        { signal: AbortSignal.timeout(10000) } // 10 Sekunden Timeout
      );
      
      if (!response.ok) {
        throw new Error(
          response.status === 404 
            ? 'No more characters available' 
            : `Error loading characters (${response.status})`
        );
      }
      
      const data = await response.json();

      // Verarbeite die Ergebnisse - Neue Characters hinzufügen ohne Duplikate
      setCharacters((prevChars) => {
        const existingIds = new Set(prevChars.map((c) => (c ? c.id : null)));
        const startingIndex = prevChars.length;
        
        const newCharacters = data.results
          .filter((character) => character && !existingIds.has(character.id))
          .map((character, index) => ({
            ...character,
            // Falls requiredLevel nicht gesetzt ist, berechne es anhand des Index
            requiredLevel: character.requiredLevel || Math.max(1, startingIndex + index + 1),
          }));
          
        return [...prevChars, ...newCharacters];
      });

      // Prüfe, ob es weitere Seiten gibt
      setHasMore(Boolean(data.info && data.info.next));
      
    } catch (err) {
      // Verbesserte Fehlerbehandlung
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to load characters');
      }
      console.error('Error loading characters:', err);
      
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Lade Characters, wenn sich die Seitenzahl ändert
  useEffect(() => {
    loadCharacters(page, page === 1);
  }, [page, loadCharacters]);

  // Funktion zum Laden der nächsten Seite
  const loadMore = useCallback(() => {
    if (hasMore && !loading && !initialLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading, initialLoading]);

  // Funktion zum Wiederholen bei Fehler
  const handleRetry = useCallback(() => {
    loadCharacters(page, page === 1);
  }, [loadCharacters, page]);

  // Infinite Scrolling mit IntersectionObserver und Debounce
  useEffect(() => {
    if (loading || initialLoading || !hasMore) return;
    
    let debounceTimer;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Debounce, um zu schnelles Laden zu verhindern
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            loadMore();
          }, 300);
        }
      },
      { 
        threshold: 0.5,
        rootMargin: '100px'
      }
    );
    
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      clearTimeout(debounceTimer);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, initialLoading, hasMore, loadMore]);

  // Memoize the rendered character cards
  const renderedCharacters = useMemo(() => {
    // Filtere ungültige Einträge heraus
    return characters
      .filter((character) => character && character.id)
      .map((character) => {
        const isUnlocked = unlockedCharacters.some((c) => c && c.id === character.id);
        
        return (
          <Suspense 
            key={`character-${character.id}`} 
            fallback={
              <div className="character-card-skeleton" aria-hidden="true">
                <div className="skeleton-image"></div>
                <div className="skeleton-title"></div>
              </div>
            }
          >
            <CharacterCard
              character={character}
              unlocked={isUnlocked}
            />
          </Suspense>
        );
      });
  }, [characters, unlockedCharacters]);

  return (
    <section className={`characters-page ${isMobile ? 'characters-page-mobile' : ''}`}>
      <header className="characters-header">
        <h1 className="characters-title">Character Collection</h1>
        <p className="characters-subtitle">
          Discover and unlock characters from across the multiverse
        </p>
        <div className="characters-actions">
          <Link to="/" className="characters-back-button">Back to Home</Link>
        </div>
      </header>

      <div className="characters-content">
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry} 
          />
        )}
        
        {initialLoading ? (
          <LoadingIndicator message="Loading characters from the multiverse..." />
        ) : characters.length === 0 && !loading && !error ? (
          <EmptyState />
        ) : (
          <Fragment>
            <div 
              className="characters-status" 
              aria-live="polite"
              aria-atomic="true"
            >
              <p>Showing {characters.length} characters</p>
              {unlockedCharacters.length > 0 && (
                <p>{unlockedCharacters.length} unlocked</p>
              )}
            </div>
            
            <div 
              className="character-grid" 
              aria-label="Character collection grid"
              role="list"
            >
              {renderedCharacters}
            </div>
            
            {loading && (
              <LoadingIndicator message="Loading more characters..." />
            )}
          </Fragment>
        )}
        
        {/* Trigger für Infinite Scrolling */}
        {hasMore && !initialLoading && !error && (
          <div 
            ref={loadMoreRef} 
            className="load-more-trigger" 
            aria-hidden="true"
          />
        )}
      </div>
      
      <footer className="characters-footer">
        <button 
          onClick={loadMore} 
          disabled={!hasMore || loading || initialLoading}
          className="load-more-button"
          aria-hidden={hasMore ? "false" : "true"}
        >
          {loading ? 'Loading...' : hasMore ? 'Load More Characters' : 'No More Characters'}
        </button>
      </footer>
    </section>
  );
}

export default React.memo(Characters);