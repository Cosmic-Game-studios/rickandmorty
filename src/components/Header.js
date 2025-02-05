import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Coin from './Coin';

function Header() {
  const { coins } = useContext(UserContext);

  return (
    <header className="header">
      <div className="header-top">
        {/* Coin-Display wird absolut positioniert */}
        <div className="coin-display">
          <Coin />
          <span>{coins} Coins</span>
        </div>
        <h1 className="site-title">Rick and Morty Adventure</h1>
      </div>
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/characters">Charaktere</Link></li>
          <li><Link to="/episodes">Episoden</Link></li>
          <li><Link to="/locations">Orte</Link></li>
          <li><Link to="/missions">Missionen</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to="/profile">Profil</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;