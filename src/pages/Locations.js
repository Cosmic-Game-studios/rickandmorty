import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/location?page=${page}`)
      .then(response => response.json())
      .then(data => {
        setLocations(data.results);
        setInfo(data.info);
        setLoading(false);
      })
      .catch(err => {
        setError('Error loading locations.');
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
    <div className="locations-page">
      <h2>Locations</h2>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading locations...</p>}
      <div className="locations-grid">
        {locations.map(location => (
          <div key={location.id} className="location-card">
            <h3>{location.name}</h3>
            <p>Type: {location.type}</p>
            <Link to={`/location/${location.id}`} className="details-link">Details</Link>
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

export default Locations;
