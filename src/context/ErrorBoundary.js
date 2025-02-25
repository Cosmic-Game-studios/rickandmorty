import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary Komponente zum Abfangen von Fehlern in Kind-Komponenten
 */
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
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // Fallback UI oder Custom Fallback
      return fallback || (
        <div className="error-boundary">
          <h3>Etwas ist schiefgelaufen</h3>
          <p>Die Anwendung hat ein Problem festgestellt. Bitte versuche es später erneut.</p>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

export default ErrorBoundary;