const mongoose = require('mongoose');
const Device = require('./models/Device');

const MONGODB_URI = 'mongodb+srv://abhayks0007:Abhayks%4013@cluster0.dg59tsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function updateDeviceSchedules() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const devices = await Device.find({}); // Or filter by type: { type: 'light' }

    console.log(`🔍 Found ${devices.length} devices to update.`);

    for (const device of devices) {
      device.autoSchedule = {
        enabled: true,
        onTime: '18:00',
        offTime: '21:00'
      };
      device.status = 'Off';

      try {
        await device.save();
        console.log(`✅ Updated device: ${device.name} (${device._id})`);
      } catch (saveErr) {
        console.error(`❌ Failed to update ${device._id}:`, saveErr.message);
      }
    }

    console.log('🎉 All devices updated with autoSchedule.');
    mongoose.disconnect();
  } catch (err) {
    console.error('🚫 Update failed:', err);
    mongoose.disconnect();
  }
}

updateDeviceSchedules();
