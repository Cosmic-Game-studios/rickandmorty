import React, { useState, useEffect, useContext } from 'react';
import CharacterCard from '../components/CharacterCard';
import { UserContext } from '../context/UserContext';

function Characters() {
  const { unlockedCharacters } = useContext(UserContext);
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lade Charakterdaten asynchron
  const loadCharacters = async (pageNumber) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Charaktere');
      }
      const data = await response.json();

      setCharacters(prevChars => {
        // Erzeuge eine Liste bereits vorhandener IDs, um Duplikate zu vermeiden
        const existingIds = new Set(prevChars.map(c => c.id));
        const startingIndex = prevChars.length;
        // Filtere neue Charaktere, die noch nicht vorhanden sind, und erweitere sie mit requiredLevel
        const newCharacters = data.results
          .filter(character => !existingIds.has(character.id))
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
  };

  useEffect(() => {
    loadCharacters(page);
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="characters-page">
      <h2>Alle Charaktere</h2>
      {error && <p className="error">{error}</p>}
      <div className="character-grid">
        {characters.map((character, index) => {
          const unlocked = unlockedCharacters.some(c => c.id === character.id);
          return (
            <CharacterCard
              key={`${character.id}-${index}`}
              character={character}
              unlocked={unlocked}
            />
          );
        })}
      </div>
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