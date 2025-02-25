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
const LoadingIndicator = ({ message, small }) => (
  <div className={`characters-loading ${small ? 'characters-loading-small' : ''}`} role="status" aria-live="polite">
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

// Character Filterleiste für Mobile
const MobileFilterBar = ({ onFilterChange, filterActive, onClearFilter }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  
  const handleApplyFilter = () => {
    onFilterChange({ status: statusFilter, species: speciesFilter });
    setShowFilters(false);
  };
  
  const handleClearFilter = () => {
    setStatusFilter('');
    setSpeciesFilter('');
    onClearFilter();
    setShowFilters(false);
  };
  
  return (
    <div className="mobile-filter-container">
      <button 
        className={`mobile-filter-button ${filterActive ? 'active' : ''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <span className="filter-icon">🔍</span>
        Filter {filterActive && <span className="filter-badge">•</span>}
      </button>
      
      {showFilters && (
        <div className="mobile-filter-dropdown">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Any</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="species-filter">Species:</label>
            <select 
              id="species-filter" 
              value={speciesFilter} 
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Any</option>
              <option value="Human">Human</option>
              <option value="Alien">Alien</option>
              <option value="Robot">Robot</option>
              <option value="Humanoid">Humanoid</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button 
              onClick={handleApplyFilter} 
              className="apply-filter-button"
            >
              Apply Filters
            </button>
            <button 
              onClick={handleClearFilter} 
              className="clear-filter-button"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
  
  // State für Filter
  const [filters, setFilters] = useState({});
  const [filterActive, setFilterActive] = useState(false);
  
  // Merkt sich die Position beim Scrollen
  const scrollPositionRef = useRef(0);
  
  // Pull-to-refresh für Mobile
  const [isPulling, setIsPulling] = useState(false);
  const pullStartY = useRef(0);
  const containerRef = useRef(null);

  // API URL mit Filtern
  const getApiUrl = useCallback((pageNumber) => {
    let url = `https://rickandmortyapi.com/api/character?page=${pageNumber}`;
    
    // Füge Filter hinzu, falls vorhanden
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.species) queryParams.append('species', filters.species);
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `&${queryString}`;
    }
    
    return url;
  }, [filters]);

  // Asynchrones Laden der Characters mit verbesserten Fehlermeldungen
  const loadCharacters = useCallback(async (pageNumber, isInitialLoad = false, isRefresh = false) => {
    if (isInitialLoad || isRefresh) {
      setInitialLoading(true);
      
      // Reset characters list when refreshing or applying new filters
      if (isRefresh) {
        setCharacters([]);
        setPage(1);
        pageNumber = 1;
      }
    } else {
      setLoading(true);
    }
    setError('');
    
    // Speichere die aktuelle Scrollposition
    if (!isRefresh && !isInitialLoad) {
      scrollPositionRef.current = window.scrollY;
    }
    
    try {
      // Optimales Timeout für Mobile (5 Sekunden statt 10)
      const response = await fetch(
        getApiUrl(pageNumber),
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (!response.ok) {
        throw new Error(
          response.status === 404 
            ? 'No characters found' 
            : `Error loading characters (${response.status})`
        );
      }
      
      const data = await response.json();

      // Verarbeite die Ergebnisse - Neue Characters hinzufügen ohne Duplikate
      setCharacters((prevChars) => {
        // Bei Refresh oder neuem Filter komplett ersetzen
        if (isRefresh || (isInitialLoad && Object.keys(filters).length > 0)) {
          const newCharacters = data.results.map((character, index) => ({
            ...character,
            requiredLevel: character.requiredLevel || Math.max(1, index + 1),
          }));
          return newCharacters;
        }
        
        // Sonst normal anhängen
        const existingIds = new Set(prevChars.map((c) => (c ? c.id : null)));
        const startingIndex = prevChars.length;
        
        const newCharacters = data.results
          .filter((character) => character && !existingIds.has(character.id))
          .map((character, index) => ({
            ...character,
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
      if (isInitialLoad || isRefresh) {
        setInitialLoading(false);
        // Scrolle nach oben bei neuer Filterung
        if (isRefresh && isMobile) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setLoading(false);
        // Stelle die Scrollposition wieder her
        if (isMobile) {
          setTimeout(() => {
            window.scrollTo({ top: scrollPositionRef.current });
          }, 100);
        }
      }
      
      // Reset pull-to-refresh state
      setIsPulling(false);
    }
  }, [getApiUrl, filters, isMobile]);

  // Lade Characters, wenn sich die Seitenzahl oder Filter ändern
  useEffect(() => {
    const isFilterChange = Object.keys(filters).length > 0;
    loadCharacters(page, page === 1, isFilterChange);
  }, [page, loadCharacters, filters]);

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
  
  // Funktionen für Filter
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setFilterActive(Object.values(newFilters).some(Boolean));
    setPage(1); // Zurücksetzen auf Seite 1 bei Filteränderung
  }, []);
  
  const handleClearFilter = useCallback(() => {
    setFilters({});
    setFilterActive(false);
    setPage(1); // Zurücksetzen auf Seite 1 bei Filterentfernung
  }, []);

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
        // Optimierte Werte für Mobile
        threshold: isMobile ? 0.1 : 0.5,
        rootMargin: isMobile ? '50px' : '100px'
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
  }, [loading, initialLoading, hasMore, loadMore, isMobile]);
  
  // Pull-to-refresh Funktionalität für Mobilgeräte
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;
    
    const container = containerRef.current;
    
    const handleTouchStart = (e) => {
      pullStartY.current = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      // Nur am Anfang der Seite aktivieren
      if (window.scrollY > 5) return;
      
      const pullMoveY = e.touches[0].clientY;
      const pullDistance = pullMoveY - pullStartY.current;
      
      // Aktiviere Pull-to-refresh bei Abwärtsbewegung
      if (pullDistance > 50 && !isPulling) {
        setIsPulling(true);
      }
    };
    
    const handleTouchEnd = () => {
      if (isPulling) {
        // Lade Daten neu
        loadCharacters(1, true, true);
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isPulling, loadCharacters]);

  // Mobile-optimierte Ausgabe der Character-Karten
  const renderedCharacters = useMemo(() => {
    // Filtere ungültige Einträge heraus
    return characters
      .filter((character) => character && character.id)
      .map((character) => {
        const isUnlocked = unlockedCharacters.some((c) => c && c.id === character.id);
        
        // Optimierte Suspense-Fallbacks für Mobile
        const fallback = isMobile ? (
          <div className="character-card-skeleton-mobile" aria-hidden="true">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
          </div>
        ) : (
          <div className="character-card-skeleton" aria-hidden="true">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
          </div>
        );
        
        return (
          <Suspense 
            key={`character-${character.id}`} 
            fallback={fallback}
          >
            <CharacterCard
              character={character}
              unlocked={isUnlocked}
              isMobile={isMobile}
            />
          </Suspense>
        );
      });
  }, [characters, unlockedCharacters, isMobile]);

  return (
    <section 
      ref={containerRef}
      className={`characters-page ${isMobile ? 'characters-page-mobile' : ''}`}
    >
      {isPulling && (
        <div className="pull-refresh-indicator">
          <div className="pull-refresh-spinner"></div>
          <span>Release to refresh</span>
        </div>
      )}
      
      <header className={`characters-header ${isMobile ? 'characters-header-mobile' : ''}`}>
        <h1 className="characters-title">Characters</h1>
        
        {isMobile ? (
          <div className="mobile-header-actions">
            <Link to="/" className="mobile-back-button">
              <span className="mobile-back-icon">←</span>
            </Link>
            
            <p className="characters-subtitle-mobile">
              Discover and unlock characters
            </p>
            
            <MobileFilterBar 
              onFilterChange={handleFilterChange}
              filterActive={filterActive}
              onClearFilter={handleClearFilter}
            />
          </div>
        ) : (
          <>
            <p className="characters-subtitle">
              Discover and unlock characters from across the multiverse
            </p>
            <div className="characters-actions">
              <Link to="/" className="characters-back-button">Back to Home</Link>
            </div>
          </>
        )}
      </header>

      <div className="characters-content" aria-busy={initialLoading || loading}>
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={handleRetry} 
          />
        )}
        
        {initialLoading ? (
          <LoadingIndicator message={isMobile ? "Loading characters..." : "Loading characters from the multiverse..."} />
        ) : characters.length === 0 && !loading && !error ? (
          <EmptyState />
        ) : (
          <Fragment>
            <div 
              className={`characters-status ${isMobile ? 'characters-status-mobile' : ''}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <p>Showing {characters.length} characters</p>
              {unlockedCharacters.length > 0 && (
                <p>{unlockedCharacters.length} unlocked</p>
              )}
            </div>
            
            <div 
              className={`character-grid ${isMobile ? 'character-grid-mobile' : ''}`}
              aria-label="Character collection grid"
              role="list"
            >
              {renderedCharacters}
            </div>
            
            {loading && (
              <LoadingIndicator 
                message={isMobile ? "Loading..." : "Loading more characters..."} 
                small={isMobile}
              />
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
      
      {isMobile ? (
        <div className={`mobile-floating-actions ${loading || !hasMore ? 'hidden' : ''}`}>
          <button 
            onClick={loadMore} 
            disabled={!hasMore || loading || initialLoading}
            className="mobile-load-more-button"
            aria-hidden={hasMore ? "false" : "true"}
          >
            {loading ? '...' : hasMore ? 'Load More' : 'No More'}
          </button>
        </div>
      ) : (
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
      )}
    </section>
  );
}

export default React.memo(Characters);