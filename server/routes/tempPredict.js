// routes/tempPredict.js
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const axios = require('axios');

router.get('/comfort-eco', async (req, res) => {
  try {
    // Get current temperature from your weather API
    const weatherRes = await axios.get('http://localhost:5000/api/weather/current?city=Kochi');
    const currentTemp = weatherRes.data?.temperature;

    if (!currentTemp) {
      return res.status(400).json({ error: 'Weather temperature not found' });
    }

    // Run the Python script
    const scriptPath = '/home/abhay/smart-home/server/Scripts/Temppredict.py';
    exec(`python3 ${scriptPath} ${currentTemp}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Python script execution failed' });
      }
      try {
        const result = JSON.parse(stdout);
        res.json(result);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({ error: 'Failed to parse Python output' });
      }
    });
  } catch (err) {
    console.error('Weather fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch current weather' });
  }
});

module.exports = router;
