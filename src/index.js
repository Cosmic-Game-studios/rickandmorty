import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import './index.css';
import './mobile-optimizations.css';

// Lazy Loading: Die App wird erst geladen, wenn sie benötigt wird
const App = React.lazy(() => import('./App'));

// Error Boundary zum Auffangen von Fehlern in der Komponenten-Hierarchie
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    // Setze den Fehlerzustand, um das Fallback-UI anzuzeigen
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Hier kannst du den Fehler an einen Logging-Service senden
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // Fallback-UI bei Fehlern
      return <h1>Es ist ein Fehler aufgetreten.</h1>;
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<div>Lädt...</div>}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
