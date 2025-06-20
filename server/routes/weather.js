const express = require('express');
const axios = require('axios');
const router = express.Router();

const WEATHER_API_KEY = 'e8e3efe5cb3e4218b62105717251906'; // put in .env ideally

router.get('/current', async (req, res) => {
  const city = req.query.city || 'Kochi';

  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
        aqi: 'no'
      }
    });

    const data = response.data;

    const weather = {
      city: data.location.name,
      country: data.location.country,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      icon: data.current.condition.icon
    };

    res.json(weather);
  } catch (err) {
    console.error('Weather fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
