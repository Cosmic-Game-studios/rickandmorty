import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function CharacterDetails() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCharacterDetails() {
      try {
        // Charakterdaten abrufen
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (!response.ok) {
          throw new Error('Fehler beim Laden des Charakters.');
        }
        const data = await response.json();
        setCharacter(data);
        setLoading(false);

        // Episodendaten abrufen, falls vorhanden
        if (data.episode && data.episode.length > 0) {
          const episodeIds = data.episode.map(ep => ep.split('/').pop());
          try {
            const epResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
            if (!epResponse.ok) {
              throw new Error('Fehler beim Laden der Episoden.');
            }
            const epData = await epResponse.json();
            setEpisodes(Array.isArray(epData) ? epData : [epData]);
          } catch (epError) {
            console.error(epError);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setEpisodesLoading(false);
      }
    }

    fetchCharacterDetails();
  }, [id]);

  if (loading) return <p>Lade Charakterdetails...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="character-details-page">
      <div className="character-card-detail">
        <img src={character.image} alt={character.name} className="detail-image" />
        <div className="detail-info">
          <h2>{character.name}</h2>
          <p><strong>Status:</strong> {character.status}</p>
          <p><strong>Spezies:</strong> {character.species}</p>
          <p><strong>Geschlecht:</strong> {character.gender}</p>
          <p><strong>Ursprung:</strong> {character.origin?.name}</p>
          <p><strong>Letzter Aufenthaltsort:</strong> {character.location?.name}</p>
          {/* Falls ein Seltenheitswert gesetzt ist, anzeigen */}
          {character.rarity && <p><strong>Rarity:</strong> {character.rarity}</p>}
        </div>
      </div>
      <div className="episode-list">
        <h3>Episoden, in denen {character.name} erscheint:</h3>
        {episodesLoading ? (
          <p>Lade Episoden...</p>
        ) : episodes.length > 0 ? (
          <ul>
            {episodes.map(ep => (
              <li key={ep.id}>
                <Link to={`/episode/${ep.id}`}>
                  {ep.name} ({ep.episode})
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Episoden gefunden.</p>
        )}
      </div>
      <Link to="/characters" className="back-link">
        Zurück zu Charakteren
      </Link>
    </div>
  );
}

export default CharacterDetails;