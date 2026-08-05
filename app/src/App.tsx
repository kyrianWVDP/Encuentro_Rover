import { useState } from 'react'
import { RouletteWheel } from './ui/RouletteWheel'
import { CLANS } from './game/clans'
import { targetWheelRotationDeg } from './game/spin'
import './App.css'

function App() {
  const [spinning, setSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [selectedClanId, setSelectedClanId] = useState<string | null>(null);

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setSelectedClanId(null);
    
    // Pick a random clan index (0 to 7)
    const randomIndex = Math.floor(Math.random() * CLANS.length);
    const targetClan = CLANS[randomIndex];
    
    // Calculate target rotation
    const targetDeg = targetWheelRotationDeg(randomIndex);
    setRotationDeg(targetDeg);
    
    // Stop spinning after duration
    setTimeout(() => {
      setSpinning(false);
      setSelectedClanId(targetClan.id);
    }, 3500);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Encuentro Rover - Ruleta</h1>
      <RouletteWheel 
        playedClanIds={[CLANS[0].id, CLANS[2].id]} // Just for demo, dim some clans
        rotationDeg={rotationDeg}
        spinning={spinning}
        selectedClanId={selectedClanId}
      />
      <button 
        onClick={handleSpin} 
        disabled={spinning}
        style={{ marginTop: '2rem', padding: '10px 20px', fontSize: '18px', cursor: spinning ? 'not-allowed' : 'pointer' }}
      >
        {spinning ? 'Girando...' : 'Girar Ruleta'}
      </button>
      
      {selectedClanId && !spinning && (
        <h2 style={{ marginTop: '1rem', color: '#f1c40f' }}>
          ¡Seleccionado: {CLANS.find(c => c.id === selectedClanId)?.nombre}!
        </h2>
      )}
    </div>
  )
}

export default App
