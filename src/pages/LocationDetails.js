import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function LocationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResidents, setLoadingResidents] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const residentsPerPage = 8;

  // Lade Standortdaten
  const fetchLocationData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
      
      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.status}`);
      }
      
      const data = await response.json();
      setLocation(data);
      
      // Erste Seite der Bewohner laden, falls vorhanden
      if (data.residents.length > 0) {
        fetchResidents(data.residents, 1);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Standortdetails:", err);
      setError('Fehler beim Laden der Standortdetails. Bitte versuche es später erneut.');
      setLoading(false);
    }
  }, [id]);

  // Bewohner des Standorts laden
  const fetchResidents = useCallback(async (residentUrls, pageNum) => {
    if (!residentUrls || residentUrls.length === 0) return;
    
    setLoadingResidents(true);
    
    // Paginierung der Bewohner-URLs
    const startIndex = (pageNum - 1) * residentsPerPage;
    const endIndex = Math.min(startIndex + residentsPerPage, residentUrls.length);
    const currentPageUrls = residentUrls.slice(startIndex, endIndex);
    
    // Charakter-IDs extrahieren
    const characterIds = currentPageUrls.map(url => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    });
    
    try {
      // Multi-Charakter-Abfrage, wenn mehr als ein Bewohner vorhanden ist
      let endpoint = `https://rickandmortyapi.com/api/character/${characterIds.length > 1 ? characterIds.join(',') : characterIds[0]}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.status}`);
      }
      
      let data = await response.json();
      
      // Wenn nur ein Bewohner zurückgegeben wird, in ein Array verpacken
      if (!Array.isArray(data)) {
        data = [data];
      }
      
      setResidents(data);
      setLoadingResidents(false);
      setLoading(false);
    } catch (err) {
      console.error("Fehler beim Laden der Bewohner:", err);
      setLoadingResidents(false);
      setLoading(false);
    }
  }, []);

  // Seitenwechsel für Bewohner
  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (location) {
      fetchResidents(location.residents, newPage);
    }
    // Scroll zum Bewohnerabschnitt
    document.getElementById('residents-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Zurück-Button-Funktion
  const handleGoBack = () => {
    navigate(-1); // Geht zur vorherigen Seite zurück
  };

  // Neuversuch bei Fehler
  const handleRetry = () => {
    fetchLocationData();
  };

  // Initialer Datenaufruf
  useEffect(() => {
    fetchLocationData();
  }, [fetchLocationData]);

  // Lade- und Fehleranzeigen
  if (loading && !location) {
    return (
      <div className="loading-container">
        <div className="portal-spinner"></div>
        <p>Dimensionsportal wird geöffnet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Fehler beim Laden</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={handleRetry} className="retry-button">
            Erneut versuchen
          </button>
          <button onClick={handleGoBack} className="back-button">
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  if (!location) return null;

  // Berechne die Gesamtzahl der Seiten für die Bewohnerpaginierung
  const totalPages = location.residents.length > 0 
    ? Math.ceil(location.residents.length / residentsPerPage) 
    : 0;

  return (
    <div className="location-details-page fade-in">
      {/* Zurück-Button */}
      <div className="back-navigation">
        <button onClick={handleGoBack} className="back-button">
          <span className="back-icon">←</span> Zurück
        </button>
      </div>
      
      {/* Location Infokarte */}
      <div className="location-details-card">
        <div className="location-header">
          <h1 className="location-name">{location.name}</h1>
          <div className="location-badges">
            <span className="location-badge type">{location.type}</span>
            <span className="location-badge dimension">{location.dimension}</span>
          </div>
        </div>
        
        <div className="location-stats">
          <div className="stat-card">
            <span className="stat-value">{location.residents.length}</span>
            <span className="stat-label">Bewohner</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value">#{id}</span>
            <span className="stat-label">Standort-ID</span>
          </div>
          
          <div className="stat-card">
            <span className="stat-value dimension">{location.dimension === "unknown" ? "Unbekannt" : location.dimension}</span>
            <span className="stat-label">Dimension</span>
          </div>
        </div>
        
        <div className="location-description">
          <h3>Über diesen Ort</h3>
          <p>
            {location.type === "Planet" && `${location.name} ist ein Planet in der ${location.dimension} Dimension. `}
            {location.type === "Space station" && `${location.name} ist eine Raumstation in der ${location.dimension} Dimension. `}
            {location.type === "Microverse" && `${location.name} ist ein Mikroversum in der ${location.dimension} Dimension. `}
            {location.type === "Dream" && `${location.name} ist eine Traumwelt in der ${location.dimension} Dimension. `}
            {location.type === "Dimension" && `${location.name} ist eine eigene Dimension innerhalb des ${location.dimension} Multiversums. `}
            {location.type !== "Planet" && location.type !== "Space station" && location.type !== "Microverse" && location.type !== "Dream" && location.type !== "Dimension" && 
             `${location.name} ist ein Ort vom Typ "${location.type}" in der ${location.dimension} Dimension. `}
            {location.residents.length > 0 
              ? `${location.residents.length} bekannte Charaktere sind mit diesem Ort verbunden.`
              : `Aktuell sind keine bekannten Charaktere mit diesem Ort verbunden.`
            }
          </p>
        </div>
      </div>
      
      {/* Bewohner-Sektion */}
      <div id="residents-section" className="residents-section">
        <h2 className="section-title">Bekannte Bewohner</h2>
        
        {location.residents.length === 0 ? (
          <div className="no-residents">
            <p>Keine Bewohner gefunden für diesen Standort.</p>
            <div className="empty-portal"></div>
          </div>
        ) : loadingResidents ? (
          <div className="residents-loading">
            <div className="mini-spinner"></div>
            <p>Bewohner werden gesucht...</p>
          </div>
        ) : (
          <>
            <div className="residents-grid fade-in">
              {residents.map(resident => (
                <div key={resident.id} className="resident-card slide-up">
                  <Link to={`/character/${resident.id}`} className="resident-link">
                    <div className="resident-image-container">
                      <img 
                        src={resident.image} 
                        alt={resident.name}
                        className="resident-image" 
                      />
                      <div className={`status-indicator ${resident.status.toLowerCase()}`}>
                        <span className="status-dot"></span>
                        {resident.status}
                      </div>
                    </div>
                    <div className="resident-info">
                      <h3 className="resident-name">{resident.name}</h3>
                      <p className="resident-species">{resident.species}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Paginierung für Bewohner */}
            {totalPages > 1 && (
              <div className="residents-pagination">
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="pagination-button"
                >
                  &laquo; Vorherige
                </button>
                
                <div className="pagination-info">
                  Seite {page} von {totalPages}
                </div>
                
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-button"
                >
                  Nächste &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Weitere Infos und Aktionen */}
      <div className="location-actions">
        <Link to="/locations" className="explore-button">
          Weitere Standorte erkunden
        </Link>
      </div>
    </div>
  );
}

export default LocationDetails;