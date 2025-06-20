// POST add a location (only name)
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

router.post('/', async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add location' });
  }
});

router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

module.exports = router;
