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
    const fetchCharacterDetails = async () => {
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
          const epResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
          if (!epResponse.ok) {
            throw new Error('Fehler beim Laden der Episoden.');
          }
          const epData = await epResponse.json();
          // Falls nur ein einzelnes Ergebnis vorliegt, in ein Array packen
          setEpisodes(Array.isArray(epData) ? epData : [epData]);
        } else {
          setEpisodes([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setEpisodesLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [id]);

  if (loading) return <p>Lade Charakterdetails...</p>;
  if (error) return <p>{error}</p>;

  // Destrukturierung zur besseren Lesbarkeit
  const {
    name,
    image,
    status,
    species,
    gender,
    origin,
    location,
    rarity
  } = character;

  return (
    <div className="character-details-page">
      <div className="character-card-detail">
        <img src={image} alt={name} className="detail-image" />
        <div className="detail-info">
          <h2>{name}</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Spezies:</strong> {species}</p>
          <p><strong>Geschlecht:</strong> {gender}</p>
          <p><strong>Ursprung:</strong> {origin?.name}</p>
          <p><strong>Letzter Aufenthaltsort:</strong> {location?.name}</p>
          {rarity && <p><strong>Rarity:</strong> {rarity}</p>}
        </div>
      </div>
      <div className="episode-list">
        <h3>Episoden, in denen {name} erscheint:</h3>
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
