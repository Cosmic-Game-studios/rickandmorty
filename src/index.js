import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import './index.css';

// Dynamisches Importieren der Haupt-Komponente (Code Splitting)
// Dadurch wird der Code der App-Komponente erst geladen, wenn er benötigt wird.
const App = lazy(() => import('./App'));

//
// Globale Performance-Optimierungen: Funktionen und Logik
//

/**
 * Debounce-Funktion zur Reduzierung häufig ausgelöster Events (z. B. resize).
 * @param {Function} fn - Die Funktion, die debounced werden soll.
 * @param {number} delay - Die Verzögerung in Millisekunden.
 * @returns {Function} - Die debounced Funktion.
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Initialisiert eine Optimierung für das Fenster-Resize-Event.
 * Das Event wird debounced, um unnötige Aufrufe zu vermeiden.
 */
function initResizeOptimization() {
  window.addEventListener(
    'resize',
    debounce(() => {
      console.log('Optimiertes Resize-Event ausgeführt.');
      // Hier können weitere globale Aktionen bei Resize eingebunden werden.
    }, 200)
  );
}

/**
 * Registriert einen Service Worker, um Caching-Strategien und weitere
 * Performance-Verbesserungen (z. B. Offline-Funktionalität) zu ermöglichen.
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registriert mit Scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker Registrierung fehlgeschlagen:', error);
        });
    });
  }
}

/**
 * Initialisiert alle globalen Performance-Optimierungen.
 */
function initGlobalPerformanceOptimizations() {
  initResizeOptimization();
  registerServiceWorker();
}

// Initialisierung der globalen Optimierungen, sobald der DOM vollständig geladen ist.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalPerformanceOptimizations);
} else {
  initGlobalPerformanceOptimizations();
}

//
// React-App starten
//
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        {/* 
          Suspense zeigt einen Fallback an, während der dynamisch importierte App-Code geladen wird.
          Durch Code Splitting wird nur der tatsächlich benötigte Code geladen.
        */}
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
