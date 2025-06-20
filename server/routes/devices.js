const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// GET all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single device by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid device ID' });
  }

  try {
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching device' });
  }
});

// POST add a device
router.post('/', async (req, res) => {
  const { name, type, status, ipAddress, location } = req.body;

  if (!name || !type || !ipAddress) {
    return res.status(400).json({ error: 'Name, type, and IP address are required' });
  }

  try {
    const newDevice = new Device({ name, type, status: status || 'Online', ipAddress, location });
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add device' });
  }
});

// PATCH update a device (for autoSchedule)
// PATCH update a device (status, temp, or autoSchedule)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid device ID' });
  }

  try {
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const { autoSchedule, status, temp } = req.body;

    // Handle status change
    if (typeof status === 'string') {
      console.log('[PATCH] Updating status to:', status);
      device.status = status;
      console.log('[PATCH] Body received:', req.body);

      console.trace();
    }

    // Handle temp for thermostat
    if (typeof temp === 'number') {
      if (device.type !== 'thermostat') {
        return res.status(400).json({ error: 'Only thermostats can have a temperature.' });
      }

      console.log(`[PATCH] Setting thermostat temperature to: ${temp}°C`);
      device.temp = temp;
    }

    // Handle autoSchedule for lights and others
    if (device.type !== 'thermostat' &&autoSchedule) {
      if (
        typeof autoSchedule.enabled !== 'boolean' ||
        !autoSchedule.onTime ||
        !autoSchedule.offTime
      ) {
        return res.status(400).json({ error: 'Invalid autoSchedule data' });
      }

      device.autoSchedule = {
        enabled: autoSchedule.enabled,
        onTime: autoSchedule.onTime,
        offTime: autoSchedule.offTime,
      };
    }

    // Save and respond
    device.updatedAt = new Date();
    await device.save();

    console.log('[PATCH] Updated device:', {
      id: device._id,
      type: device.type,
      status: device.status,
      temp: device.temp,
    });

    res.status(200).json(device);
  } catch (err) {
    console.error('Error updating device:', err);
    res.status(500).json({ error: 'Failed to update device' });
  }
});


// //Thermostat start endpoint

// // POST /api/devices/:id/start — Turn on thermostat device
// router.post('/:id/start', async (req, res) => {
//   const { id } = req.params;

//   if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//     return res.status(400).json({ error: 'Invalid device ID' });
//   }

//   try {
//     const device = await Device.findById(id);
//     if (!device) {
//       return res.status(404).json({ error: 'Device not found' });
//     }

//     // Update status
//     device.status = 'On';

//     // Optionally also auto-schedule if needed
//     if (device.type.toLowerCase() === 'thermostat') {
//       device.autoSchedule = {
//         enabled: true,
//         onTime: device.autoSchedule?.onTime || '08:00',
//         offTime: device.autoSchedule?.offTime || '20:00',
//       };
//     }

//     await device.save();
//     res.status(200).json(device);
//   } catch (err) {
//     console.error('Error starting device:', err);
//     res.status(500).json({ error: 'Failed to start device' });
//   }
// });

// // POST stop a device
// router.post('/:id/stop', async (req, res) => {
//   const { id } = req.params;

//   if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//     return res.status(400).json({ error: 'Invalid device ID' });
//   }

//   try {
//     const device = await Device.findById(id);
//     if (!device) {
//       return res.status(404).json({ error: 'Device not found' });
//     }

//     // Simulate stopping the device
//     device.status = 'Off';
//     device.updatedAt = new Date();

//     await device.save();

//     res.status(200).json({ message: 'Device stopped', device });
//   } catch (err) {
//     console.error('Error stopping device:', err);
//     res.status(500).json({ error: 'Failed to stop device' });
//   }
// });




// // Utility function to convert "HH:mm" to Date object for today
// function getTimeToday(timeStr) {
//   const [hours, minutes] = timeStr.split(':').map(Number);
//   const now = new Date();
//   now.setHours(hours, minutes, 0, 0);
//   return now;
// }

// // POST /api/devices/:id/start-automation — Schedule ON/OFF based on autoSchedule
// router.post('/:id/start-automation', async (req, res) => {
//   const { id } = req.params;

//   if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//     return res.status(400).json({ error: 'Invalid device ID' });
//   }

//   try {
//     const device = await Device.findById(id);
//     if (!device) return res.status(404).json({ error: 'Device not found' });

//     if (!device.autoSchedule?.enabled) {
//       return res.status(400).json({ error: 'AutoSchedule is not enabled' });
//     }

//     const onTime = getTimeToday(device.autoSchedule.onTime || '08:00');
//     const offTime = getTimeToday(device.autoSchedule.offTime || '20:00');
//     const now = new Date();

//     if (offTime <= onTime) offTime.setDate(offTime.getDate() + 1);

//     const delayUntilOn = onTime - now;
//     const delayUntilOff = offTime - now;

//     const durationMs = offTime - onTime;
//     const durationMinutes = Math.round(durationMs / 60000);
//     const durationHours = +(durationMinutes / 60).toFixed(2);
//     const unitReading = +(durationHours * 0.1).toFixed(3); // Example: 0.1kWh/hr
//     const powerUsageWatts = +(unitReading * 1000).toFixed(2);

//     // Determine temperature from device mode
//     const thermoMode = device.thermoMode || 'Eco';
//     let temperature = 22;
//     if (thermoMode === 'Eco') temperature = 20;
//     else if (thermoMode === 'Comfort') temperature = 24;
//     else if (thermoMode === 'Custom') temperature = device.targetTemp || 22;

//     // Schedule device ON
//     if (delayUntilOn > 0) {
//       setTimeout(async () => {
//         await Device.findByIdAndUpdate(id, { status: 'On' });
//         console.log(`[Automation] ${device.name} turned ON`);
//       }, delayUntilOn);
//     } else {
//       await Device.findByIdAndUpdate(id, { status: 'On' });
//     }

//     // Schedule device OFF and log usage
//     setTimeout(async () => {
//       await Device.findByIdAndUpdate(id, { status: 'Off' });

//       await DeviceData.create({
//         deviceId: id,
//         unitReading,
//         unitType: 'kWh',
//         powerUsageWatts,
//         status: 'Stopped',
//         startTime: onTime,
//         endTime: offTime,
//         durationMinutes,
//         durationHours,
//         timestamp: new Date()
//       });

//       console.log(`[Automation] ${device.name} turned OFF and usage logged.`);
//     }, delayUntilOff);

//     res.json({
//       message: `Automation scheduled from ${device.autoSchedule.onTime} to ${device.autoSchedule.offTime}`,
//       mode: thermoMode,
//       temperature,
//       powerUsageWatts,
//       durationMinutes
//     });

//   } catch (err) {
//     console.error('[Automation Error]', err);
//     res.status(500).json({ error: 'Failed to start automation', details: err.message });
//   }
// });



module.exports = router;