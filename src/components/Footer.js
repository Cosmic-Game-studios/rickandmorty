import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Rick and Morty Adventure. Alle Rechte vorbehalten.</p>
    </footer>
  );
}

export default Footer;