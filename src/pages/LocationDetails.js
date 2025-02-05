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
        setError('Fehler beim Laden der Orts-Details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Lade Orts-Details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="location-details">
      <h2>{location.name}</h2>
      <p><strong>Typ:</strong> {location.type}</p>
      <p><strong>Dimension:</strong> {location.dimension}</p>
      <h3>Bewohner:</h3>
      {location.residents.length > 0 ? (
        <ul>
          {location.residents.map(url => {
            const parts = url.split('/');
            const charId = parts[parts.length - 1];
            return (
              <li key={charId}>
                <Link to={`/character/${charId}`}>Charakter {charId}</Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Keine Bewohner gefunden.</p>
      )}
      <Link to="/locations" className="back-link">Zurück zu Orten</Link>
    </div>
  );
}

export default LocationDetails;