import React, { useState } from 'react';

const Thermostat = () => {
  const [temperature, setTemperature] = useState(24);
  const [mode, setMode] = useState('optimal');
  const [customTemp, setCustomTemp] = useState(24);

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'optimal') setTemperature(22);
    else if (selectedMode === 'cool') setTemperature(18);
    else if (selectedMode === 'custom') setTemperature(customTemp);
  };

  const handleCustomTempChange = (e) => {
    const value = Number(e.target.value);
    setCustomTemp(value);
    if (mode === 'custom') setTemperature(value);
  };

  return (
    <div style={{ color: 'white', padding: 32, maxWidth: 400 }}>
      <h2>Thermostat Control</h2>
      <div style={{
        fontSize: 48,
        fontWeight: 'bold',
        margin: '24px 0',
        textAlign: 'center'
      }}>
        {temperature}°C
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          style={{
            flex: 1,
            padding: 12,
            background: mode === 'optimal' ? '#1976d2' : '#222',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => handleModeChange('optimal')}
        >
          Optimal
        </button>
        <button
          style={{
            flex: 1,
            padding: 12,
            background: mode === 'cool' ? '#1976d2' : '#222',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => handleModeChange('cool')}
        >
          Cool
        </button>
        <button
          style={{
            flex: 1,
            padding: 12,
            background: mode === 'custom' ? '#1976d2' : '#222',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => handleModeChange('custom')}
        >
          Custom
        </button>
      </div>
      {mode === 'custom' && (
        <div style={{ marginBottom: 16 }}>
          <label>
            Set Custom Temperature:&nbsp;
            <input
              type="number"
              min={10}
              max={35}
              value={customTemp}
              onChange={handleCustomTempChange}
              style={{
                width: 60,
                padding: 6,
                borderRadius: 4,
                border: '1px solid #444',
                background: '#222',
                color: 'white'
              }}
            />°C
          </label>
        </div>
      )}
      <div style={{ marginTop: 24, color: '#aaa' }}>
        <strong>Mode:</strong> {mode.charAt(0).toUpperCase() + mode.slice(1)}
      </div>
    </div>
  );
};

export default Thermostat;