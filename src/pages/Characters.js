import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
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

  // Asynchrone Funktion zum Laden von Charakteren
  const loadCharacters = useCallback(async (pageNumber) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Charaktere');
      }
      const data = await response.json();

      // Aktualisiere den Characters-State, ohne Duplikate hinzuzufügen
      setCharacters((prevChars) => {
        const existingIds = new Set(prevChars.map((c) => c.id));
        const startingIndex = prevChars.length;
        const newCharacters = data.results
          .filter((character) => !existingIds.has(character.id))
          .map((character, index) => ({
            ...character,
            requiredLevel: startingIndex + index + 2,
          }));
        return [...prevChars, ...newCharacters];
      });

      setHasMore(data.info.next !== null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lade neue Charaktere, wenn sich die Seitenzahl ändert
  useEffect(() => {
    loadCharacters(page);
  }, [page, loadCharacters]);

  // Memoisierte Funktion, um die nächste Seite zu laden
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  // Memoisiere die gerenderten Charakterkarten, um unnötige Berechnungen zu vermeiden
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
      {/* Suspense-Wrapper sorgt für einen Fallback, solange die CharacterCard-Komponente geladen wird */}
      <Suspense fallback={<div>Lade Charaktere...</div>}>
        <div className="character-grid">{renderedCharacters}</div>
      </Suspense>
      {loading && <p>Lade mehr Charaktere...</p>}
      {hasMore && !loading && (
        <button onClick={loadMore} className="load-more-button">
          Mehr laden
        </button>
      )}
    </div>
  );
}

export default Characters;
