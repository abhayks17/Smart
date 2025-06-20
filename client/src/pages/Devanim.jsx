import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLightbulb, FaThermometerHalf, FaVideo } from 'react-icons/fa';

const iconMap = {
  thermostat: <FaThermometerHalf />,
  light: <FaLightbulb />,
  security: <FaVideo />
};

const Devanim = () => {
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchDevices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/devices');
      setDevices(res.data);
      if (!selected) setSelected(res.data[0]); // auto-select first
    } catch (err) {
      console.error("Failed to fetch devices");
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleControlChange = (key, value) => {
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    axios.put(`http://localhost:5000/api/devices/${selected._id}`, updated); // optional: save to DB
  };

  const renderControls = () => {
    if (!selected) return null;

    switch (selected.type) {
      case 'light':
        return (
          <div className="mt-4">
            <label>Brightness: {selected.brightness || 50}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={selected.brightness || 50}
              onChange={(e) => handleControlChange('brightness', parseInt(e.target.value))}
            />
          </div>
        );
      case 'thermostat':
        return (
          <div className="mt-4">
            <label>Temperature: {selected.temperature || 22}°C</label>
            <input
              type="range"
              min="10"
              max="40"
              value={selected.temperature || 22}
              onChange={(e) => handleControlChange('temperature', parseInt(e.target.value))}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderAnimation = () => {
    if (!selected) return <div>Select a device</div>;

    switch (selected.type) {
      case 'light':
        return (
          <motion.div
            className="rounded-full mx-auto"
            style={{
              width: '200px',
              height: '200px',
              background: 'yellow',
              boxShadow: `0 0 60px rgba(255,255,0,${(selected.brightness || 50) / 100})`
            }}
            animate={{ opacity: (selected.brightness || 50) / 100 }}
            transition={{ duration: 0.4 }}
          />
        );
      case 'thermostat':
        return (
          <motion.div
            className="rounded-full border-8 border-blue-500 flex items-center justify-center text-3xl font-bold"
            style={{ width: '200px', height: '200px' }}
            animate={{ scale: 1 + (selected.temperature || 22) / 100 }}
            transition={{ duration: 0.5 }}
          >
            {selected.temperature || 22}°C
          </motion.div>
        );
      case 'security':
        return (
          <motion.div
            className="bg-black text-white flex items-center justify-center"
            style={{ width: '200px', height: '200px', borderRadius: '10px' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            📹 Live Feed Active
          </motion.div>
        );
      default:
        return <div>No animation for this device type</div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', color: '#fff' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#1e1e1e', padding: 20, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 20 }}>Devices</h2>
        {devices.map((device) => (
          <div
            key={device._id}
            onClick={() => setSelected(device)}
            style={{
              padding: '12px',
              marginBottom: '10px',
              borderRadius: '8px',
              background: selected?._id === device._id ? '#444' : '#2a2a2a',
              cursor: 'pointer'
            }}
          >
            <span style={{ marginRight: 8 }}>{iconMap[device.type]}</span>
            {device.name}
          </div>
        ))}
      </div>

      {/* Animation Panel */}
      <div style={{ flex: 1, background: '#111', padding: 40 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 20 }}>
          {selected?.name || "No Device Selected"}
        </h1>

        {renderAnimation()}
        {renderControls()}
      </div>
    </div>
  );
};

export default Devanim;
