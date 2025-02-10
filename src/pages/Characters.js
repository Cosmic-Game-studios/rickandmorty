import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from 'react';
import { UserContext } from '../context/UserContext';

// Lazy-Loading der CharacterCard-Komponente
const CharacterCard = React.lazy(() => import('../components/CharacterCard'));

function Characters() {
  const { unlockedCharacters } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const loadMoreRef = useRef(null);

  // Asynchrones Laden der Charaktere
  const loadCharacters = useCallback(async (pageNumber) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Charaktere');
      }
      const data = await response.json();

      // Füge neue Charaktere hinzu, ohne Duplikate
      setCharacters((prevChars) => {
        const existingIds = new Set(prevChars.map((c) => c.id));
        const startingIndex = prevChars.length;
        const newCharacters = data.results
          .filter((character) => !existingIds.has(character.id))
          .map((character, index) => ({
            ...character,
            // Falls requiredLevel nicht gesetzt ist, wird es anhand des Index berechnet
            requiredLevel: character.requiredLevel || startingIndex + index + 2,
          }));
        return [...prevChars, ...newCharacters];
      });

      setHasMore(Boolean(data.info.next));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lade Charaktere, wenn sich die Seitenzahl ändert
  useEffect(() => {
    loadCharacters(page);
  }, [page, loadCharacters]);

  // Funktion zum Laden der nächsten Seite
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore, loading]);

  // Infinite Scrolling über IntersectionObserver
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { threshold: 1 });
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore, loadMore]);

  // Memoisiere die gerenderten CharacterCards
  const renderedCharacters = useMemo(() => {
    return characters.map((character, index) => {
      const unlocked = unlockedCharacters.some((c) => c.id === character.id);
      return (
        <CharacterCard
          key={`${character.id}-${index}`}
          character={character}
          unlocked={unlocked}
        />
      );
    });
  }, [characters, unlockedCharacters]);

  return (
    <div className="characters-page">
      <h2>Alle Charaktere</h2>
      {error && <p className="error">{error}</p>}
      <Suspense fallback={<div>Lade Charaktere...</div>}>
        <div className="character-grid">
          {renderedCharacters}
        </div>
      </Suspense>
      {loading && <p>Lade mehr Charaktere...</p>}
      {/* Dieser leere div-Block löst das Nachladen per IntersectionObserver aus */}
      <div ref={loadMoreRef} style={{ height: '1px' }} />
    </div>
  );
}

export default React.memo(Characters);
