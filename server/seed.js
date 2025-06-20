const axios = require('axios');
const { faker } = require('@faker-js/faker'); // Make sure you're using this import

const deviceId = '684418b1abd30a0516126d80'; // Replace with your actual device ID

async function insertSampleData() {
  for (let i = 0; i < 100; i++) {
    const date = faker.date.past(); // random past date
    const start = new Date(date.setHours(faker.number.int({ min: 6, max: 22 }))); // generate realistic daytime start

    const duration = faker.number.int({ min: 15, max: 120 }); // minutes
    const end = new Date(start.getTime() + duration * 60000);

    const durationHours = +(duration / 60).toFixed(2);
    const power = faker.number.int({ min: 50, max: 200 }); // watts
    const usage = +(power * durationHours).toFixed(2); // energy in watt-hours or similar

    try {
      await axios.post(`http://localhost:5000/api/devicedata/${deviceId}/data`, {
        unitReading: usage,
        unitType: 'kWh',
        powerUsageWatts: power,
        status: 'Stopped',
        startTime: start,
        endTime: end,
        durationMinutes: duration,
        durationHours,
        timestamp: new Date()
      });
      console.log(`Inserted record ${i + 1}`);
    } catch (err) {
      console.error('Insert failed:', err.message);
    }
  }
}

insertSampleData();
