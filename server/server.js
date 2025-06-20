const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

const deviceRoutes = require('./routes/devices');
const authRoutes = require('./routes/auth');
const locationRoutes = require("./routes/locations");
const deviceDataRoutes = require('./routes/devicedata');
const lightpredict= require('./routes/lightvalue');
const weatherRoutes = require('./routes/weather');
const tempPredictRoutes = require('./routes/tempPredict');


// Load environment variables
dotenv.config({ path: './config.env' });

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// const lightingRoutes = require('./routes/lightpredict');

// Use lighting prediction routes
// app.use('/api/lighting', lightingRoutes);
// Routes
app.use('/api/devices', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/devicedata', deviceDataRoutes);
app.use('/api/python', lightpredict);
app.use('/api/weather', weatherRoutes);
app.use('/api/predict', tempPredictRoutes);
app.get('/', (req, res) => {
  res.send('Smart Home API is running');
});



// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// CRON JOB TO AUTO ON/OFF DEVICES BASED ON SCHEDULE
const Device = require('./models/Device');



cron.schedule('* * * * *', async () => {
  // Get current time in IST (UTC+5:30)
  const now = new Date();
  const offsetIST = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds (IST offset)
  const nowIST = new Date(now.getTime() + offsetIST);
  const currentTime = nowIST.toISOString().slice(11, 16); // "HH:mm" in IST

  console.log(`Cron job running at ${currentTime} IST (${now.toISOString()} UTC)`);

  try {
    const devices = await Device.find({
  'autoSchedule.enabled': true,
  type: { $ne: 'thermostat' }  // Exclude thermostats
});

    console.log(`Found ${devices.length} devices with autoSchedule enabled`);

    for (let device of devices) {
      const { onTime, offTime } = device.autoSchedule || {};

      if (currentTime === onTime && device.status !== 'On') {
        device.status = 'On';
        await device.save();
        console.log(`[${currentTime}] Turned ON: ${device.name}`);
      }

      if (currentTime === offTime && device.status !== 'Off') {
        device.status = 'Off';
        await device.save();
        console.log(`[${currentTime}] Turned OFF: ${device.name}`);
      }
    }
  } catch (err) {
    console.error('Error running cron job:', err);
  }
});