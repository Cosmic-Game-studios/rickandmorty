import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Episodes() {
  const [episodes, setEpisodes] = useState([]);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/episode?page=${page}`)
      .then(response => response.json())
      .then(data => {
        setEpisodes(data.results);
        setInfo(data.info);
        setLoading(false);
      })
      .catch(err => {
        setError('Error loading episodes.');
        setLoading(false);
      });
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (info && page < info.pages) setPage(page + 1);
  };

  return (
    <div className="episodes-page">
      <h2>Episodes</h2>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading episodes...</p>}
      <div className="episodes-grid">
        {episodes.map(episode => (
          <div key={episode.id} className="episode-card">
            <h3>{episode.name}</h3>
            <p>{episode.episode}</p>
            <Link to={`/episode/${episode.id}`} className="details-link">
              Details
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 1}>Previous</button>
        <span>Page {page} of {info ? info.pages : '...'}</span>
        <button onClick={handleNext} disabled={info && page === info.pages}>Next</button>
      </div>
    </div>
  );
}

export default Episodes;
