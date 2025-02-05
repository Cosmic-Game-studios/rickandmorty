import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/location/${id}`)
      .then(response => response.json())
      .then(data => {
        setLocation(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error loading location details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading location details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="location-details">
      <h2>{location.name}</h2>
      <p><strong>Type:</strong> {location.type}</p>
      <p><strong>Dimension:</strong> {location.dimension}</p>
      <h3>Residents:</h3>
      {location.residents.length > 0 ? (
        <ul>
          {location.residents.map(url => {
            const parts = url.split('/');
            const charId = parts[parts.length - 1];
            return (
              <li key={charId}>
                <Link to={`/character/${charId}`}>Character {charId}</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No residents found.</p>
      )}
      <Link to="/locations" className="back-link">Back to Locations</Link>
    </div>
  );
}

export default LocationDetails;
