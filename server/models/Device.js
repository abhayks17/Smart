const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  onTime: { type: String, default: null },   // Format: "HH:mm" (24-hour)
  offTime: { type: String, default: null }   // Format: "HH:mm" (24-hour)
}, { _id: false });

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['thermostat', 'light', 'security', 'fan', 'ac', 'heater', 'power'],
    required: true
  },
  status: {
    type: String,
    enum: ['On', 'Off', 'Online', 'Offline'],
    default: 'Off'
  },
  temp: Number,
  ipAddress: { type: String, required: true },
  location: { type: String },
  autoSchedule: scheduleSchema
}, {
  collection: 'devices',
  timestamps: true
});



module.exports = mongoose.model('Device', deviceSchema);
