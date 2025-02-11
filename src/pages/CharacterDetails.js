// src/pages/CharacterDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';

function CharacterDetails() {
  const isMobile = useIsMobile();
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Lade Character-Daten
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (!response.ok) {
          throw new Error('Error loading character.');
        }
        const data = await response.json();
        setCharacter(data);
        setLoading(false);

        // Lade Episoden-Daten, falls vorhanden
        if (data.episode && data.episode.length > 0) {
          const episodeIds = data.episode.map(ep => ep.split('/').pop());
          const epResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
          if (!epResponse.ok) {
            throw new Error('Error loading episodes.');
          }
          const epData = await epResponse.json();
          // Falls nur ein einzelnes Ergebnis zurückkommt, in ein Array packen
          setEpisodes(Array.isArray(epData) ? epData : [epData]);
        } else {
          setEpisodes([]);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      } finally {
        setEpisodesLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [id]);

  if (loading) return <p>Loading character details...</p>;
  if (error) return <p>{error}</p>;

  // Destrukturierung für bessere Lesbarkeit
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
    <div className={`character-details-page ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="character-card-detail">
        <img src={image} alt={name} className="detail-image" loading="lazy" />
        <div className="detail-info">
          <h2>{name}</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Species:</strong> {species}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Origin:</strong> {origin?.name}</p>
          <p><strong>Last known location:</strong> {location?.name}</p>
          {rarity && <p><strong>Rarity:</strong> {rarity}</p>}
        </div>
      </div>
      <div className="episode-list">
        <h3>Episodes in which {name} appears:</h3>
        {episodesLoading ? (
          <p>Loading episodes...</p>
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
          <p>No episodes found.</p>
        )}
      </div>
      <Link to="/characters" className="back-link">
        Back to Characters
      </Link>
    </div>
  );
}

export default CharacterDetails;
