import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';

function CharacterDetails() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedCharacters, setRelatedCharacters] = useState([]);
  const [sortBy, setSortBy] = useState('episode');

  // Verbesserte Funktion zum Laden der Charakterdetails
  const fetchCharacterDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Lade Character-Daten mit Timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 Sekunden Timeout
      
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Character not found. They might be in another dimension!');
        }
        throw new Error(`Error loading character (${response.status})`);
      }
      
      const data = await response.json();
      setCharacter(data);
      
      // Lade Episoden-Daten gleich mit, falls vorhanden
      if (data.episode && data.episode.length > 0) {
        const episodeIds = data.episode.map(ep => ep.split('/').pop());
        
        const epResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
        
        if (!epResponse.ok) {
          throw new Error('Error loading episodes.');
        }
        
        const epData = await epResponse.json();
        // Stelle sicher, dass wir immer ein Array zurückgeben
        setEpisodes(Array.isArray(epData) ? epData : [epData]);

        // Lade ähnliche Charaktere (aus der gleichen Spezies)
        try {
          const relatedResponse = await fetch(`https://rickandmortyapi.com/api/character/?species=${encodeURIComponent(data.species)}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filtere aktuellen Charakter heraus und begrenze auf 4
            const filtered = relatedData.results
              .filter(char => char.id !== data.id)
              .slice(0, 4);
            setRelatedCharacters(filtered);
          }
        } catch (err) {
          console.error('Error loading related characters:', err);
        }
      } else {
        setEpisodes([]);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError(err.message || 'Failed to load character');
      }
      console.error('Error loading character details:', err);
    } finally {
      setLoading(false);
      setEpisodesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCharacterDetails();
  }, [fetchCharacterDetails]);

  // Zurück-Navigation mit Browser-History
  const handleGoBack = () => {
    navigate(-1); // Geht zur vorherigen Seite zurück
  };

  // Episoden nach dem gewählten Kriterium sortieren
  const sortedEpisodes = episodes.length > 0 
    ? [...episodes].sort((a, b) => {
        if (sortBy === 'episode') {
          return a.episode.localeCompare(b.episode);
        } else if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'airDate') {
          return new Date(a.air_date) - new Date(b.air_date);
        }
        return 0;
      })
    : [];

  // Helfer-Funktion für Status-Farbe
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'alive': return 'status-alive';
      case 'dead': return 'status-dead';
      default: return 'status-unknown';
    }
  };

  if (loading) {
    return (
      <div className="character-loading">
        <div className="character-loading-spinner"></div>
        <p>Loading character details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="character-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <div className="character-error-actions">
          <button onClick={fetchCharacterDetails} className="retry-button">Try Again</button>
          <Link to="/characters" className="back-link">Back to Characters</Link>
        </div>
      </div>
    );
  }

  // Destrukturierung für bessere Lesbarkeit
  const {
    name,
    image,
    status,
    species,
    gender,
    origin,
    location,
    type,
    created
  } = character;

  return (
    <div className={`character-details-page ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* Zurück-Button für bessere Navigation */}
      <div className="character-details-header">
        <button onClick={handleGoBack} className="back-button">
          <span className="back-icon">←</span> Back
        </button>
      </div>

      <div className="character-card-detail">
        {/* Bild mit Status-Indikator */}
        <div className="detail-image-container">
          <img 
            src={image} 
            alt={name} 
            className="detail-image" 
            loading="lazy" 
          />
          <span className={`status-badge ${getStatusClass(status)}`}>
            <span className="status-indicator"></span>
            {status}
          </span>
        </div>

        <div className="detail-info">
          <h2 className="character-name">{name}</h2>
          
          <div className="character-stats">
            <div className="stat-badge">
              <span className="stat-label">Species</span>
              <span className="stat-value">{species}</span>
            </div>
            
            <div className="stat-badge">
              <span className="stat-label">Gender</span>
              <span className="stat-value">{gender}</span>
            </div>
            
            <div className="stat-badge">
              <span className="stat-label">Origin</span>
              <span className="stat-value">{origin?.name}</span>
            </div>
            
            <div className="stat-badge">
              <span className="stat-label">Location</span>
              <span className="stat-value">{location?.name}</span>
            </div>
            
            {type && (
              <div className="stat-badge">
                <span className="stat-label">Type</span>
                <span className="stat-value">{type}</span>
              </div>
            )}
          </div>
          
          <div className="character-meta">
            <div className="character-created">
              <span>Added to database: </span>
              <span>{new Date(created).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Episoden-Abschnitt mit Sortierung */}
      <div className="episode-list">
        <div className="episode-header">
          <h3>Episodes featuring {name}</h3>
          <div className="episode-sort">
            <span>Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="episode-sort-select"
            >
              <option value="episode">Episode Number</option>
              <option value="name">Name</option>
              <option value="airDate">Air Date</option>
            </select>
          </div>
        </div>

        {episodesLoading ? (
          <p>Loading episodes...</p>
        ) : sortedEpisodes.length > 0 ? (
          <div className="episodes-grid">
            {sortedEpisodes.map(ep => (
              <div key={ep.id} className="episode-card">
                <div className="episode-card-header">
                  <span className="episode-code">{ep.episode}</span>
                  <span className="episode-air-date">{ep.air_date}</span>
                </div>
                <h4 className="episode-title">{ep.name}</h4>
                <Link to={`/episode/${ep.id}`} className="episode-link">
                  View Episode Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No episodes found.</p>
        )}
      </div>

      {/* Ähnliche Charaktere Abschnitt */}
      {relatedCharacters.length > 0 && (
        <div className="related-characters">
          <h3>Similar Characters</h3>
          <div className="related-characters-grid">
            {relatedCharacters.map(char => (
              <Link 
                key={char.id} 
                to={`/character/${char.id}`}
                className="related-character-card"
              >
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="related-character-image" 
                  loading="lazy" 
                />
                <div className="related-character-info">
                  <h4>{char.name}</h4>
                  <span className={`status-badge small ${getStatusClass(char.status)}`}>
                    <span className="status-indicator"></span>
                    {char.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link to="/characters" className="back-link">
        Back to All Characters
      </Link>
    </div>
  );
}

export default CharacterDetails;