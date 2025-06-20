const express = require('express');
const router = express.Router();
const DeviceData = require('../models/DeviceData');
const Device = require('../models/Device');

// POST usage data for a specific device
router.post('/:deviceId/data', async (req, res) => {
  const { deviceId } = req.params;
  const {
    unitReading,
    unitType,
    powerUsageWatts,
    status,
    startTime,      // NEW
    endTime         // NEW
  } = req.body;

  try {
    const device = await Device.findById(deviceId);
    if (!device) return res.status(404).json({ error: 'Device not found' });

    const dataEntry = new DeviceData({
      deviceId,
      unitReading,
      unitType,
      powerUsageWatts,
      status,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined
    });

    await dataEntry.save();
    res.status(201).json(dataEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save device data' });
  }
});

// GET usage data for a specific device
router.get('/:deviceId/data', async (req, res) => {
  try {
    const data = await DeviceData.find({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch device data' });
  }
});

// PUT to update a device data entry (e.g., add endTime)
router.put('/:entryId', async (req, res) => {
  try {
    const updatedEntry = await DeviceData.findByIdAndUpdate(
      req.params.entryId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedEntry) return res.status(404).json({ error: 'Entry not found' });

    res.json(updatedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update device data entry' });
  }
});
// Utility: convert "HH:mm" string into Date object today
function getTimeToday(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// ✅ Thermostat Automation Endpoint
router.post('/:id/start-automation', async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid device ID' });
  }

  try {
    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ error: 'Device not found' });

    // Check if AutoSchedule is enabled
    if (!device.autoSchedule?.enabled) {
      return res.status(400).json({ error: 'AutoSchedule is not enabled.' });
    }

    const onTime = getTimeToday(device.autoSchedule.onTime || '00:00');
    const offTime = getTimeToday(device.autoSchedule.offTime || '00:00');
    const now = new Date();

    // If offTime is before onTime, treat as next-day off
    if (offTime <= onTime) offTime.setDate(offTime.getDate() + 1);

    const delayUntilOn = onTime - now;
    const delayUntilOff = offTime - now;
    const durationMs = offTime - onTime;

    const durationMinutes = Math.round(durationMs / 60000);
    const durationHours = +(durationMinutes / 60).toFixed(2);

    // Simulate power usage: 0.1 kWh per hour
    const unitReading = +(durationHours * 0.1).toFixed(3);
    const powerUsageWatts = +(unitReading * 1000).toFixed(2);

    // Determine target temperature
    const thermoMode = device.thermoMode || 'Eco';
    let temp = 22;
    if (thermoMode === 'Eco') temp = 20;
    else if (thermoMode === 'Comfort') temp = 24;
    else if (thermoMode === 'Custom') temp = device.targetTemp || 22;

    // Schedule device ON
    if (delayUntilOn > 0) {
      setTimeout(async () => {
        await Device.findByIdAndUpdate(id, { status: 'On' });
        console.log(`[Thermostat] ${device.name} turned ON`);
      }, delayUntilOn);
    } else {
      await Device.findByIdAndUpdate(id, { status: 'On' });
    }

    // Schedule device OFF and log usage
    setTimeout(async () => {
      await Device.findByIdAndUpdate(id, { status: 'Off' });

      await DeviceData.create({
        deviceId: id,
        unitReading,
        unitType: 'kWh',
        powerUsageWatts,
        status: 'Stopped',
        startTime: onTime,
        endTime: offTime,
        durationMinutes,
        durationHours,
        timestamp: new Date()
      });

      console.log(`[Thermostat] ${device.name} turned OFF and data logged.`);
    }, delayUntilOff);

    res.json({
      message: `Automation scheduled: ${device.autoSchedule.onTime} to ${device.autoSchedule.offTime}`,
      temp,
      powerUsageWatts,
      durationMinutes
    });

  } catch (err) {
    console.error('[Automation Error]', err);
    res.status(500).json({ error: 'Failed to start automation', details: err.message });
  }
});


module.exports = router;
