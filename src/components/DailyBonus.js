import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function DailyBonus() {
  const { addCoins } = useContext(UserContext);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [bonusAvailable, setBonusAvailable] = useState(false);
  const bonusAmount = 10; // Bonuscoins
  const bonusKey = 'dailyBonusLastClaim';

  useEffect(() => {
    const lastClaim = localStorage.getItem(bonusKey);
    const today = new Date().toDateString();
    if (lastClaim === today) {
      setBonusClaimed(true);
    } else {
      setBonusAvailable(true);
    }
  }, []);

  const claimBonus = () => {
    const today = new Date().toDateString();
    localStorage.setItem(bonusKey, today);
    addCoins(bonusAmount);
    setBonusClaimed(true);
    setBonusAvailable(false);
  };

  if (bonusClaimed) {
    return (
      <div className="daily-bonus">
        <p>Daily Bonus bereits eingelöst!</p>
      </div>
    );
  }

  if (bonusAvailable) {
    return (
      <div className="daily-bonus">
        <p>Heute gibt es einen Daily Bonus von {bonusAmount} Coins!</p>
        <button onClick={claimBonus} className="bonus-button">
          Bonus einlösen
        </button>
      </div>
    );
  }
  
  return null;
}

export default DailyBonus;