import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DevDet = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [dataEntry, setDataEntry] = useState(null);
  const [allData, setAllData] = useState([]);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;
  const [showChart, setShowChart] = useState(false);
  // State for scheduling
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [onTime, setOnTime] = useState('');
  const [offTime, setOffTime] = useState('');
  const [showAutomationOptions, setShowAutomationOptions] = useState(false);
  const [automationMode, setAutomationMode] = useState('Custom');
  const deviceType = device?.type?.toLowerCase();

  const [showThermostatAutomation, setShowThermostatAutomation] = useState(false);
const [thermoMode, setThermoMode] = useState('Eco');
const [targetTemp, setTargetTemp] = useState(24); // default custom temp
const [weather, setWeather] = useState(null);
const [ecoTemp, setEcoTemp] = useState(20);
const [comfortTemp, setComfortTemp] = useState(24);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/devices/${id}`);
        const deviceData = res.data;
        setDevice(deviceData);
        // Initialize schedule fields with device data
        if (deviceData.autoSchedule) {
          setScheduleEnabled(deviceData.autoSchedule.enabled || false);
          setOnTime(deviceData.autoSchedule.onTime || '');
          setOffTime(deviceData.autoSchedule.offTime || '');
        }
      } catch (err) {
        setError('Device not found.');
      }
    };

    
    const fetchDeviceData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/devicedata/${id}/data`);
        if (res.data.length > 0) {
          setDataEntry(res.data[0]);
          setAllData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch device data.');
      }
    };

    fetchDevice();
    fetchDeviceData();
  }, [id]);

  const refreshData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/devicedata/${id}/data`);
      if (res.data.length > 0) {
        setDataEntry(res.data[0]);
        setAllData(res.data);
      }
    } catch (err) {
      console.error('Failed to refresh device data.');
    }
  };
//fn for Thermostat
//Start and Stop functions
const handleThermostatStart = async () => {
  try {
    const res = await axios.patch(`http://localhost:5000/api/devices/${device._id}`, {
      status: 'on'
    });
    setDevice(res.data);
  } catch (err) {
    alert('Failed to start thermostat manually.');
  }
};


//Handle stop

const handleThermostatStop = async () => {
  try {
    const res = await axios.patch(`http://localhost:5000/api/devices/${device._id}`, {
      status: 'off'
    });
    setDevice(res.data);
  } catch (err) {
    alert('Failed to stop thermostat manually.');
  }
};

//Thermostat Automation Start
const handleStartAutomation = async () => {
  try {
    await axios.post(`http://localhost:5000/api/devices/${device._id}/start-automation`);
    alert('Automation process started.');
  } catch (err) {
    alert('Failed to start automation.');
  }
};






const handleStart = async () => {
  console.log('[HANDLE START] Called');
  if (!id) {
    console.error('Device ID is missing');
    alert('Device ID is missing.');
    return;
  }

  console.log('Device ID from useParams:', id);
  const now = new Date();
  setStartTime(now);

  try {
    // Check current device status
    if (device.status === 'On') {
      alert(`Device is already On. Started at ${now.toLocaleString()}`);
      return;
    }

    // Update device status in the devices table
    const response = await axios.patch(`http://localhost:5000/api/devices/${id}`, {
      status: 'On',
    });

    // Refresh device state to update UI
    const res = await axios.get(`http://localhost:5000/api/devices/${id}`);
    setDevice(res.data);

    // Check if backend indicates device was already On
    if (response.data.message === 'Device is already On') {
      alert(`Device was already On. Started at ${now.toLocaleString()}`);
    } else {
      alert(`Device started at ${now.toLocaleString()}`);
    }
  } catch (err) {
    const status = err.response?.status || 'Unknown';
    const message = err.response?.data?.message || err.message;
    console.error('Error in handleStart:', { id, status, message, error: err });
    if (status === 404) {
      alert('Device not found. Please check the device ID.');
      setError('Device not found.');
    } else {
      alert(`Failed to start device: ${message}`);
    }
  }
};
  

  const handleStop = async () => {
  if (!startTime || !device) {
    alert('Please press Start first.');
    return;
  }

  const endTime = new Date();
  const durationMs = endTime - new Date(startTime);
  const durationMinutes = Math.floor(durationMs / 60000);
  const durationHours = +(durationMinutes / 60).toFixed(2);

  let unitReading = 0;
  let unitType = 'Unit';
  let powerUsageWatts = 0;

  switch (device.type?.toLowerCase()) {
    case 'light':
      unitReading = 50;
      unitType = 'Lumens';
      break;
    case 'fan':
      unitReading = 20;
      unitType = 'RPM';
      break;
    case 'ac':
    case 'heater':
    case 'power':
      unitReading = +(device.powerRating * durationHours).toFixed(2);
      unitType = 'kWh';
      break;
    default:
      unitReading = 10;
      unitType = 'Units';
  }

  powerUsageWatts = +(device.powerRating * durationHours).toFixed(2) || 0;

  try {
    // Post usage data to devicedata table
    await axios.post(`http://localhost:5000/api/devicedata/${id}/data`, {
      unitReading,
      unitType,
      powerUsageWatts,
      status: 'Stopped',
      startTime,
      endTime,
      durationMinutes,
      durationHours,
    });

    // Update device status to 'Off' in devices table
    await axios.patch(`http://localhost:5000/api/devices/${id}`, {
      status: 'Off',
    });

    // Refresh device state to update UI
    const res = await axios.get(`http://localhost:5000/api/devices/${id}`);
    setDevice(res.data);

    alert(`Device stopped. Duration: ${durationMinutes} mins (${durationHours} hrs)`);
    setStartTime(null);
    refreshData();
  } catch (err) {
    console.error('Error in handleStop:', err.response?.status, err.response?.data);
    alert('Failed to stop device: ' + (err.response?.data?.message || err.message));
  }
};
const handleScheduleUpdate = async () => {
  try {
    // Step 1: Prepare the autoSchedule object
    const autoSchedule = {
      enabled: scheduleEnabled,
      onTime,
      offTime,
    };

    // Step 2: Determine current status based on time and schedule
    let status = 'Off'; // default
    if (scheduleEnabled && onTime && offTime) {
      const now = new Date();
      const [onHour, onMinute] = onTime.split(':').map(Number);
      const [offHour, offMinute] = offTime.split(':').map(Number);

      const onDate = new Date(now);
      onDate.setHours(onHour, onMinute, 0);

      const offDate = new Date(now);
      offDate.setHours(offHour, offMinute, 0);

      if (onDate <= now && now <= offDate) {
        status = 'On';
      }
    }
    // Step 3: Update the device with autoSchedule
    await axios.patch(`http://localhost:5000/api/devices/${id}`, {
      autoSchedule,
    });
    // Step 4: Log status to devicedata table
    await axios.post(`http://localhost:5000/api/devicedata/${id}/data`, {
      status,
    });

    // Step 5: Refresh UI
    const res = await axios.get(`http://localhost:5000/api/devices/${id}`);
    setDevice(res.data);

    alert('Schedule updated successfully!');
  } catch (err) {
    console.error('Failed to update schedule:', err.response?.status, err.response?.data);
    alert('Failed to update schedule: ' + (err.response?.data?.error || err.message));
  }
};
const handleThermoScheduleSave = () => {
  alert(`Saved: Mode = ${thermoMode}, Target Temp = ${targetTemp}°C`);
};


  const usageDurations = allData
    .filter(entry => typeof entry.durationMinutes === 'number')
    .map(entry => entry.durationMinutes);

  const avgUsage = usageDurations.length
    ? (usageDurations.reduce((a, b) => a + b, 0) / usageDurations.length).toFixed(2)
    : 0;

  const lightStartHours = allData
    .filter(entry => entry.unitType === 'kWh' && entry.startTime)
    .map(entry => new Date(entry.startTime).getHours());

  let lightUsageWindow = '';
  let minHour = null;
  let maxHour = null;

  if (lightStartHours.length > 0) {
    minHour = Math.min(...lightStartHours);
    maxHour = Math.max(...lightStartHours);

    const formatHour = hour => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour} ${period}`;
    };

    lightUsageWindow = `between ${formatHour(minHour)} and ${formatHour(maxHour)}`;
  }

  const chartData = allData.slice(0, 100).map(entry => ({
    timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    duration: entry.durationMinutes || 0,
    power: entry.powerUsageWatts || 0,
  }));

  useEffect(() => {
 axios.get('http://localhost:5000/api/predict/comfort-eco')
    .then((res) => {
      setEcoTemp(res.data.eco);
      setComfortTemp(res.data.comfort);
    })
    .catch((err) => {
      console.error('Failed to fetch predicted temps:', err);
    });
}, []);


useEffect(() => {
  axios.get('http://localhost:5000/api/weather/current?city=Kochi')
    .then(res => setWeather(res.data))
    .catch(err => console.error('Failed to fetch weather:', err));
}, []);

  // Update onTime and offTime when automationMode changes to 'User'
  useEffect(() => {
    if (automationMode === 'User' && minHour !== null && maxHour !== null || device?.type?.toLowerCase() === 'thermostat') {
      const padZero = num => (num < 10 ? '0' + num : num);
      setOnTime(`${padZero(minHour)}:00`);
      setOffTime(`${padZero(maxHour)}:00`);
    }
  }, [automationMode, minHour, maxHour]);



useEffect(() => {
  if (automationMode === 'Auto'|| device?.type?.toLowerCase() === 'thermostat') {
    const fetchAutoTimes = async () => {
      try {
        const res = await axios.get('/api/python/times');
        const { lightOnTime, lightOffTime } = res.data;

        setOnTime(lightOnTime); // already "HH:mm"
        setOffTime(lightOffTime);
        setScheduleEnabled(true);
      } catch (err) {
        console.error('Failed to fetch auto lighting times:', err);
      }
    };
    fetchAutoTimes();
  }
}, [automationMode]);


useEffect(() => {
  const interval = setInterval(() => {
    if (automationMode !== 'Custom' || !scheduleEnabled || !onTime || !offTime || device?.type?.toLowerCase() === 'thermostat') return;

    const now = new Date();
    const [onHour, onMinute] = onTime.split(':').map(Number);
    const [offHour, offMinute] = offTime.split(':').map(Number);

    const onDate = new Date(now);
    onDate.setHours(onHour, onMinute, 0);

    const offDate = new Date(now);
    offDate.setHours(offHour, offMinute, 0);

    let newStatus = device?.status;

    if (onDate <= now && now <= offDate) {
      newStatus = 'On';
    } else {
      newStatus = 'Off';
    }

    // Only trigger update if status has changed
    if (device?.status !== newStatus) {
      axios
        .patch(`http://localhost:5000/api/devices/${id}`, {
          status: newStatus,
        })
        .then(() => {
          return axios.post(`http://localhost:5000/api/devicedata/${id}/data`, {
            status: newStatus,
          });
        })
        .then(() => axios.get(`http://localhost:5000/api/devices/${id}`))
        .then((res) => {
          setDevice(res.data);
          refreshData(); // Update history/chart
        })
        .catch((err) => {
          console.error('Automation status update failed:', err);
        });
    }
  }, 1000); // Check every 60 seconds

  return () => clearInterval(interval);
}, [automationMode, scheduleEnabled, onTime, offTime, device, id]);

  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;
  if (!device) return <div style={{ color: 'white', padding: 20 }}>Loading...</div>;

  const paginatedData = allData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div style={{ color: 'white', padding: '2rem', fontFamily: 'Arial' }}>
      <h2 style={{ marginBottom: '1rem' }}>Device Details</h2>
      <div style={{ lineHeight: '1.6' }}>
        <p><strong>Name:</strong> {device.name}</p>
        <p><strong>Type:</strong> {device.type}</p>
        <p><strong>Status:</strong> {device.status}</p>
        <p><strong>IP Address:</strong> {device.ipAddress}</p>
        <p><strong>Location:</strong> {device.location || 'N/A'}</p>
      </div>
{device?.type?.toLowerCase() === 'light' && (
  <>


      <div  style={{ marginTop: 30 }}>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop} style={{ marginLeft: 10 }}>Stop</button>
        <button style={{ marginLeft: 10 }} onClick={() => alert('Rebooting...')}>Reboot</button>
        <button style={{ marginLeft: 10 }} onClick={() => alert('Shutting down...')}>Shutdown</button>
        <button style={{ marginLeft: 10 }} onClick={() => setShowChart(!showChart)}>
          {showChart ? 'Hide' : 'Show'} Usage Chart
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <button onClick={() => setShowAutomationOptions(!showAutomationOptions)}>
          {showAutomationOptions ? 'Hide Automate' : 'Automate'}
        </button>

        {showAutomationOptions && (
          <div style={{ marginTop: 20 }}>
            <h3>Automation Mode</h3>
            <div>
              <label>
                <input
                  type="radio"
                  name="automationMode"
                  value="Custom"
                  checked={automationMode === 'Custom'}
                  onChange={() => setAutomationMode('Custom')}
                />
                Custom
              </label>
              <label style={{ marginLeft: 20 }}>
                <input
                  type="radio"
                  name="automationMode"
                  value="Auto"
                  checked={automationMode === 'Auto'}
                  onChange={() => setAutomationMode('Auto')}
                />
                Auto
              </label>
              <label style={{ marginLeft: 20 }}>
                <input
                  type="radio"
                  name="automationMode"
                  value="User"
                  checked={automationMode === 'User'}
                  onChange={() => setAutomationMode('User')}
                />
                User
              </label>
            </div>

            {(automationMode === 'Custom' || automationMode === 'User' || automationMode === 'Auto') && (
  <div style={{ marginTop: 20 }}>
    <h4>{automationMode} Schedule Settings</h4>

    <div style={{ marginBottom: 10 }}>
      <label>
        <input
          type="checkbox"
          checked={scheduleEnabled}
          onChange={(e) => setScheduleEnabled(e.target.checked)}
        />
        Enable Auto Schedule
      </label>
    </div>

    {automationMode === 'Auto' && (
      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
        Auto mode uses predicted times based on sunset and environment. You cannot edit them.
      </p>
    )}

    <div style={{ marginBottom: 10 }}>
      <label style={{ marginRight: 10 }}>On Time (HH:mm):</label>
      <input
        type="time"
        value={onTime}
        onChange={(e) => setOnTime(e.target.value)}
        disabled={!scheduleEnabled || automationMode === 'Auto'}
        style={{
          padding: '5px',
          opacity: automationMode === 'Auto' ? 0.6 : 1,
          cursor: automationMode === 'Auto' ? 'not-allowed' : 'text',
        }}
      />
    </div>

    <div style={{ marginBottom: 10 }}>
      <label style={{ marginRight: 10 }}>Off Time (HH:mm):</label>
      <input
        type="time"
        value={offTime}
        onChange={(e) => setOffTime(e.target.value)}
        disabled={!scheduleEnabled || automationMode === 'Auto'}
        style={{
          padding: '5px',
          opacity: automationMode === 'Auto' ? 0.6 : 1,
          cursor: automationMode === 'Auto' ? 'not-allowed' : 'text',
        }}
      />
    </div>
                <button onClick={handleScheduleUpdate} disabled={!scheduleEnabled}>
                  Save Schedule
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showChart && (
        <div style={{ marginTop: 20 }}>
          <h3>Usage Overview</h3>
          <p><strong>Average Usage Duration:</strong> {avgUsage} min</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="duration" name="Duration (min)" stroke="#82ca9d" />
              <Line type="monotone" dataKey="power" name="Power Usage (W)" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          {lightUsageWindow && (
            <p><strong>Common Light Usage Period:</strong> {lightUsageWindow}</p>
          )}
        </div>
      )}

      {allData.length > 1 && (
        <div style={{ marginTop: 30 }}>
          <button onClick={() => setShowHistory(!showHistory)} style={{ marginBottom: 10 }}>
            {showHistory ? 'Hide' : 'Show'} Recent Usage History
          </button>

          {showHistory && (
            <>
              <table style={{ width: '100%', color: 'white', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Timestamp</th>
                    <th style={thStyle}>Reading</th>
                    <th style={thStyle}>Unit</th>
                    <th style={thStyle}>Power (W)</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>ON</th>
                    <th style={thStyle}>OFF</th>
                    <th style={thStyle}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((entry, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{new Date(entry.timestamp).toLocaleString()}</td>
                      <td style={tdStyle}>{entry.unitReading}</td>
                      <td style={tdStyle}>{entry.unitType}</td>
                      <td style={tdStyle}>{entry.powerUsageWatts}</td>
                      <td style={tdStyle}>{entry.status}</td>
                      <td style={tdStyle}>{entry.startTime ? new Date(entry.startTime).toLocaleString() : '-'}</td>
                      <td style={tdStyle}>{entry.endTime ? new Date(entry.endTime).toLocaleString() : '-'}</td>
                      <td style={tdStyle}>
                        {typeof entry.durationMinutes === 'number'
                          ? `${entry.durationMinutes} min (${entry.durationHours} hrs)`
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <span style={{ margin: '0 1rem' }}>Page {currentPage + 1}</span>
                <button
                  onClick={() =>
                    setCurrentPage(p => (p + 1) * itemsPerPage < allData.length ? p + 1 : p)
                  }
                  disabled={(currentPage + 1) * itemsPerPage >= allData.length}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      </>
)}

   {device?.type?.toLowerCase() === 'thermostat' && (
  <>
    {weather && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: '#222',
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
        color: 'white'
      }}>
        <img src={`https:${weather.icon}`} alt={weather.condition} width="64" />
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            {weather.city}, {weather.country}
          </div>
          <div style={{ fontSize: 16 }}>
            {weather.temperature}°C — {weather.condition}
          </div>
        </div>
      </div>
    )}

    {/* Always show Automation Section */}
    <div style={{ marginTop: 20 }}>
      <h3>Thermostat Automation</h3>

      {/* Mode Selection */}
      <div>
        {['Eco', 'Comfort', 'Custom'].map((mode) => (
          <label key={mode} style={{ marginRight: 20 }}>
            <input
              type="radio"
              name="thermoMode"
              value={mode}
              checked={thermoMode === mode}
              onChange={() => setThermoMode(mode)}
            />
            {mode}
          </label>
        ))}
      </div>

      {/* Temperature Display/Input + Action Buttons */}
      <div style={{ marginTop: 20 }}>
        <label>
          Temperature (°C):
          <input
  type="number"
  readOnly={thermoMode !== 'Custom'}
  value={
    thermoMode === 'Eco'
      ? ecoTemp
      : thermoMode === 'Comfort'
      ? comfortTemp
      : targetTemp
  }
  onChange={(e) => setTargetTemp(e.target.value)}
  style={{
    marginLeft: 10,
    padding: '5px',
    backgroundColor: thermoMode === 'Custom' ? '#fff' : '#333',
    color: thermoMode === 'Custom' ? '#000' : '#aaa',
    border: '1px solid #555'
  }}
/>

        </label>

        <div style={{ marginTop: 10 }}>
  {/* Set Temperature & Turn On */}
  <button
  onClick={async () => {
    try {const temp =
  thermoMode === 'Eco'
    ? ecoTemp
    : thermoMode === 'Comfort'
    ? comfortTemp
    : parseFloat(targetTemp);


      // ✅ Assign response to a variable!
      const response = await axios.patch(`http://localhost:5000/api/devices/${device._id}`, {
        status: 'On',
        temp: temp
      });

      // ✅ Update UI
      setDevice(response.data);
      alert(`Device turned ON and temperature set to ${temp}°C`);
    } catch (error) {
      console.error('Set Temperature Error:', error.response?.data || error.message);
      alert('Failed to set temperature.');
    }
  }}
  style={{ marginRight: 10 }}
>
  Set Temperature
</button>


  {/* Stop Device */}
  <button
    onClick={async () => {
      try {
        await axios.patch(`http://localhost:5000/api/devices/${device._id}`, {
          status: 'off'
        });

        alert('Device turned OFF.');
      } catch (error) {
        console.error(error);
        alert('Failed to stop device.');
      }
    }}
  >
    Stop
  </button>
  {ecoTemp && comfortTemp && (
  <div style={{
    marginTop: 20,
    background: '#111',
    padding: 15,
    borderRadius: 10,
    color: '#ccc',
    border: '1px solid #444'
  }}>
    <h4>Predicted Temperature Settings</h4>

    <p>
      <strong>Eco Temperature:</strong> {ecoTemp}°C — Optimal for energy savings while maintaining acceptable comfort.
    </p>
    <p>
      <strong>Comfort Temperature:</strong> {comfortTemp}°C — Aimed at providing the best indoor comfort, typically used when people are present.
    </p>
  </div>
)}

</div>

      </div>
    </div>
  </>
)}


    </div>



  );
};

const thStyle = {
  borderBottom: '1px solid gray',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#222',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #444',
};

export default DevDet;