import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function DailyBonus() {
  const { addCoins } = useContext(UserContext);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [bonusAvailable, setBonusAvailable] = useState(false);
  const bonusAmount = 10; // Bonus coins
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
        <p>Daily bonus already claimed!</p>
      </div>
    );
  }

  if (bonusAvailable) {
    return (
      <div className="daily-bonus">
        <p>Today's daily bonus: {bonusAmount} coins!</p>
        <button onClick={claimBonus} className="bonus-button">
          Claim Bonus
        </button>
      </div>
    );
  }
  
  return null;
}

export default DailyBonus;
