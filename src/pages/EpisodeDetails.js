import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function EpisodeDetails() {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/episode/${id}`)
      .then(response => response.json())
      .then(data => {
        setEpisode(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Fehler beim Laden der Episoden-Details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Lade Episoden-Details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="episode-details">
      <h2>{episode.name}</h2>
      <p><strong>Episoden-Code:</strong> {episode.episode}</p>
      <p><strong>Ausstrahlungsdatum:</strong> {episode.air_date}</p>
      <h3>Charaktere in dieser Episode:</h3>
      <ul>
        {episode.characters.map(url => {
          const parts = url.split('/');
          const charId = parts[parts.length - 1];
          return (
            <li key={charId}>
              <Link to={`/character/${charId}`}>Charakter {charId}</Link>
            </li>
          );
        })}
      </ul>
      <Link to="/episodes" className="back-link">Zurück zu Episoden</Link>
    </div>
  );
}

export default EpisodeDetails;