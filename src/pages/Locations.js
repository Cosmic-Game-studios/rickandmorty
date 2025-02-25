import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [locationTypes, setLocationTypes] = useState([]);

  // Animation Varianten
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Datenabruf-Funktion
  const fetchLocations = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/location?page=${pageNum}`);
      
      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.status}`);
      }
      
      const data = await response.json();
      setLocations(data.results);
      setInfo(data.info);
      
      // Extrahiere alle eindeutigen Standorttypen
      if (pageNum === 1) {
        const types = [...new Set(data.results.map(loc => loc.type))];
        setLocationTypes(types);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Locations:", err);
      setError('Fehler beim Laden der Standorte. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialer Datenabruf
  useEffect(() => {
    fetchLocations(page);
  }, [page, fetchLocations]);

  // Standorte suchen
  const searchLocations = useCallback(async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/location/?name=${searchTerm}`);
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`API-Fehler: ${response.status}`);
      }
      
      if (response.status === 404) {
        setSearchResults([]);
      } else {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error("Suchfehler:", err);
      setError('Die Suche konnte nicht durchgeführt werden.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Suche ausführen, wenn sich der Suchbegriff ändert (mit Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchLocations();
      } else {
        setIsSearching(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, searchLocations]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    if (info && page < info.pages) setPage(page + 1);
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setIsSearching(false);
  };

  const handleRetry = () => {
    fetchLocations(page);
  };

  // Filtere die anzuzeigenden Standorte
  const displayedLocations = isSearching 
    ? searchResults 
    : filterType 
      ? locations.filter(loc => loc.type === filterType)
      : locations;

  return (
    <motion.div 
      className="locations-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="locations-header">
        <h2 className="locations-title">Locations im Multiversum</h2>
        <p className="locations-subtitle">
          Entdecke die außergewöhnlichsten Orte aus Rick and Mortys Abenteuern durch das Multiversum
        </p>
      </div>

      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Suche nach Standorten..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        <div className="filter-container">
          <select 
            value={filterType} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">Alle Typen</option>
            {locationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {(searchTerm || filterType) && (
            <button className="clear-filters-button" onClick={clearFilters}>
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">
            Erneut versuchen
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Portale werden geöffnet...</p>
        </div>
      ) : displayedLocations.length === 0 ? (
        <div className="no-results">
          <h3>Keine Standorte gefunden</h3>
          <p>Versuche es mit anderen Suchbegriffen oder Filtern.</p>
          <button onClick={clearFilters} className="reset-search-button">
            Suche zurücksetzen
          </button>
        </div>
      ) : (
        <>
          <div className="results-info">
            {isSearching ? (
              <p>{displayedLocations.length} {displayedLocations.length === 1 ? 'Ergebnis' : 'Ergebnisse'} für "{searchTerm}"</p>
            ) : filterType ? (
              <p>Zeige {displayedLocations.length} {displayedLocations.length === 1 ? 'Standort' : 'Standorte'} vom Typ "{filterType}"</p>
            ) : (
              <p>Seite {page} von {info?.pages || '...'}</p>
            )}
          </div>

          <motion.div 
            className="locations-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {displayedLocations.map(location => (
                <motion.div 
                  key={location.id} 
                  className="location-card"
                  variants={cardVariants}
                  layout
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 20px rgba(0,0,0,0.4)"
                  }}
                >
                  <div className="location-card-content">
                    <h3 className="location-name">{location.name}</h3>
                    
                    <div className="location-details">
                      <div className="location-info">
                        <span className="info-label">Typ:</span>
                        <span className="info-value">{location.type}</span>
                      </div>
                      
                      <div className="location-info">
                        <span className="info-label">Dimension:</span>
                        <span className="info-value">{location.dimension}</span>
                      </div>
                      
                      <div className="location-info">
                        <span className="info-label">Bewohner:</span>
                        <span className="info-value">{location.residents.length}</span>
                      </div>
                    </div>
                    
                    <Link to={`/location/${location.id}`} className="details-link">
                      Details ansehen
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {!isSearching && !filterType && (
            <div className="pagination">
              <button 
                onClick={handlePrev} 
                disabled={page === 1}
                className="pagination-button prev"
              >
                ← Vorherige
              </button>
              
              <div className="pagination-info">
                Seite {page} von {info ? info.pages : '...'}
              </div>
              
              <button 
                onClick={handleNext} 
                disabled={info && page === info.pages}
                className="pagination-button next"
              >
                Nächste →
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default Locations;