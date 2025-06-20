// models/DeviceData.js
const mongoose = require('mongoose');

const deviceDataSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  unitReading: {
    type: Number,
    required: false
  },
  unitType: {
    type: String,
    enum: ['kWh', 'Wh', 'J', 'MJ','Lumens','Minutes'],
    default: 'kWh'
  },
  powerUsageWatts: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['Running', 'Stopped', 'Idle','On','Off'],
    default: 'Stopped'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  durationMinutes: {
    type: Number
  },
  durationHours: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeviceData', deviceDataSchema);
