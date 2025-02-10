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

// Lazy-load the CharacterCard component
const CharacterCard = React.lazy(() => import('../components/CharacterCard'));

function Characters() {
  const { unlockedCharacters } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const loadMoreRef = useRef(null);

  // Asynchronously load characters
  const loadCharacters = useCallback(async (pageNumber) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Error loading characters');
      }
      const data = await response.json();

      // Add new characters without duplicates
      setCharacters((prevChars) => {
        const existingIds = new Set(prevChars.map((c) => (c ? c.id : null)));
        const startingIndex = prevChars.length;
        const newCharacters = data.results
          .filter((character) => character && !existingIds.has(character.id))
          .map((character, index) => ({
            ...character,
            // If requiredLevel is not set, compute it based on the index
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

  // Load characters when the page number changes
  useEffect(() => {
    loadCharacters(page);
  }, [page, loadCharacters]);

  // Function to load the next page
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  // Infinite scrolling using IntersectionObserver
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
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

  // Memoize the rendered CharacterCards and filter out any undefined/null entries
  const renderedCharacters = useMemo(() => {
    return characters
      .filter((character) => character !== undefined && character !== null)
      .map((character, index) => {
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
      <h2>All Characters</h2>
      {error && <p className="error">{error}</p>}
      <Suspense fallback={<div>Loading characters...</div>}>
        <div className="character-grid">
          {renderedCharacters}
        </div>
      </Suspense>
      {loading && <p>Loading more characters...</p>}
      {/* This empty div triggers loading more characters via IntersectionObserver */}
      <div ref={loadMoreRef} style={{ height: '1px' }} />
    </div>
  );
}

export default React.memo(Characters);
