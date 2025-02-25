import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Aktualisiert den State, damit der nächste Render die Fallback-UI anzeigt
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Fehlerinformationen in den State speichern
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Optional: Fehler an einen Logging-Service senden
    console.error("Fehler in Komponente aufgetreten:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback-UI bei Fehler
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h2>Oops! Etwas ist schiefgelaufen</h2>
            <p>Ein unerwarteter Fehler ist aufgetreten.</p>
            
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                Seite neu laden
              </button>
              <Link to="/" className="back-link">
                Zurück zur Startseite
              </Link>
            </div>
            
            {/* In der Entwicklungsumgebung: Details anzeigen */}
            {process.env.NODE_ENV === 'development' && (
              <div className="error-details">
                <h3>Fehlerdetails:</h3>
                <p>{this.state.error?.toString()}</p>
                <div>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Wenn kein Fehler vorliegt, die Kind-Komponenten rendern
    return this.props.children;
  }
}

export default ErrorBoundary;