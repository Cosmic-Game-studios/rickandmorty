import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import './index.css';

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
  window.addEventListener('resize', debounce(() => {
    console.log('Optimiertes Resize-Event ausgeführt.');
    // Hier können weitere globale Aktionen bei Resize eingebunden werden.
  }, 200));
}

/**
 * Registriert einen Service Worker, um Caching-Strategien und weitere
 * Performance-Verbesserungen zu ermöglichen.
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
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
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
