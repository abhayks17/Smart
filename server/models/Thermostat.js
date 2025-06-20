// models/Thermostat.js
const mongoose = require('mongoose');
const Device = require('./Device');

const thermostatSchema = new mongoose.Schema({
  temp: { type: Number, default: null }
});

module.exports = Device.discriminator('thermostat', thermostatSchema);
