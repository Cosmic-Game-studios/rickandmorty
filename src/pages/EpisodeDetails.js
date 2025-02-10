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
        setError('Error loading episode details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading episode details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="episode-details">
      <h2>{episode.name}</h2>
      <p><strong>Episode Code:</strong> {episode.episode}</p>
      <p><strong>Air Date:</strong> {episode.air_date}</p>
      <h3>Characters in this episode:</h3>
      <ul>
        {episode.characters.map(url => {
          const parts = url.split('/');
          const charId = parts[parts.length - 1];
          return (
            <li key={charId}>
              <Link to={`/character/${charId}`}>Character {charId}</Link>
            </li>
          );
        })}
      </ul>
      <Link to="/episodes" className="back-link">Back to Episodes</Link>
    </div>
  );
}

export default EpisodeDetails;
