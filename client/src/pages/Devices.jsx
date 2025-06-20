import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlug, FaThermometerHalf, FaLightbulb, FaVideo } from 'react-icons/fa';

const iconMap = {
  thermostat: <FaThermometerHalf style={{ marginRight: 8 }} />,
  light: <FaLightbulb style={{ marginRight: 8 }} />,
  security: <FaVideo style={{ marginRight: 8 }} />
};

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    type: 'thermostat',
    status: 'Online',
    ipAddress: '',
    location: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDevices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/devices');
      setDevices(res.data);
    } catch (err) {
      setError('Could not fetch devices.');
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/locations');
      setLocations(res.data);
      if (res.data.length && !form.location) {
        setForm(f => ({ ...f, location: res.data[0].name }));
      }
    } catch (err) {
      setError('Could not fetch locations.');
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchLocations();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/devices', form);
      setForm({ name: '', type: 'thermostat', status: 'Online', ipAddress: '', location: locations[0]?.name || '' });
      fetchDevices();
      setError('');
    } catch (err) {
      setError('Could not add device.');
    }
  };

  return (
    <div style={{ color: 'white', padding: 32 }}>
      <h2><FaPlug style={{ marginRight: 8 }} />Connected Devices</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Device Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <select name="type" value={form.type} onChange={handleChange} style={{ marginRight: 8 }}>
          <option value="thermostat">Thermostat</option>
          <option value="light">Smart Light</option>
          <option value="security">Security Camera</option>
        </select>
        <input
          type="text"
          name="ipAddress"
          placeholder="IP Address"
          value={form.ipAddress}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        >
          {locations.length === 0 ? (
            <option value="">No locations</option>
          ) : (
            locations.map(loc => (
              <option key={loc._id || loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))
          )}
        </select>
        <button type="submit">Add Device</button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {devices.map((device, idx) => (
          <li key={idx}
            onClick={() => navigate(`/device/${device._id}`)}
            style={{
              background: '#232323',
              margin: '10px 0',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
            <span>
              {iconMap[device.type]}
              {device.name}
              {device.location && (
                <span style={{ color: '#aaa', fontSize: 14 }}> ({device.location})</span>
              )}
              {" - "}
              <small style={{ color: '#aaa' }}>{device.ipAddress}</small>
            </span>
            <span style={{ color: '#4caf50', fontWeight: 500 }}>{device.status}</span>
          </li>
        ))}
        {devices.length === 0 && (
          <li style={{ color: '#aaa', padding: 12 }}>No devices found.</li>
        )}
      </ul>
    </div>
  );
};

export default Devices;
