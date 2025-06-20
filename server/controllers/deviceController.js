const Device = require('../models/Device');
const DeviceSimulator = require('../services/DeviceSimulator');

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching devices' });
  }
};

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Private
exports.getDevice = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching device' });
  }
};

// @desc    Create device
// @route   POST /api/devices
// @access  Private
exports.createDevice = async (req, res) => {
  try {
    const device = new Device({
      ...req.body,
      userId: req.user.id,
      predictiveData: {
        preferredSettings: {},
        patterns: [],
        energyEfficiencyScore: 0
      }
    });
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: 'Error creating device' });
  }
};

// @desc    Update device
// @route   PUT /api/devices/:id
// @access  Private
exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating device' });
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting device' });
  }
};

// Simulate device behavior
exports.simulateDevice = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    let simulationResult;
    switch (device.type) {
      case 'thermostat':
        simulationResult = await DeviceSimulator.simulateThermostat(device._id);
        break;
      case 'light':
        simulationResult = await DeviceSimulator.simulateLight(device._id);
        break;
      case 'camera':
        simulationResult = await DeviceSimulator.simulateCamera(device._id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid device type' });
    }

    res.json(simulationResult);
  } catch (error) {
    res.status(500).json({ error: 'Error simulating device' });
  }
};

// Get device predictions
exports.getDevicePredictions = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const patterns = await DeviceSimulator.updatePredictivePatterns(device._id);
    res.json(patterns);
  } catch (error) {
    res.status(500).json({ error: 'Error getting device predictions' });
  }
};

// Get device efficiency report
exports.getEfficiencyReport = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = device.usageHistory.filter(h => h.timestamp >= thirtyDaysAgo);
    const patterns = device.predictiveData.patterns;
    const efficiencyScore = device.predictiveData.energyEfficiencyScore;

    const report = {
      deviceId: device._id,
      type: device.type,
      efficiencyScore,
      totalEnergyUsage: history.reduce((sum, h) => sum + h.energyUsage, 0),
      averageDailyUsage: history.reduce((sum, h) => sum + h.energyUsage, 0) / 30,
      patterns: patterns.map(p => ({
        dayOfWeek: p.dayOfWeek,
        timeSlot: p.timeSlot,
        confidence: p.confidence,
        predictedSettings: p.predictedSettings
      })),
      recommendations: this.generateRecommendations(device.type, patterns, history)
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error getting efficiency report' });
  }
};

// Helper method to generate recommendations
exports.generateRecommendations = (deviceType, patterns, history) => {
  const recommendations = [];

  switch (deviceType) {
    case 'thermostat':
      // Check for extreme temperature settings
      const temps = history.map(h => h.value);
      const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
      
      if (avgTemp > 24) {
        recommendations.push({
          type: 'energy_saving',
          message: 'Consider lowering your average temperature to save energy',
          potentialSavings: '10-15%'
        });
      }
      break;

    case 'light':
      // Check for lights left on during typical sleep hours
      const nightPatterns = patterns.filter(p => p.timeSlot === 'night');
      const unnecessaryNightUse = nightPatterns.some(p => p.predictedSettings.isOn);
      
      if (unnecessaryNightUse) {
        recommendations.push({
          type: 'automation',
          message: 'Consider setting up auto-off schedules for nighttime',
          potentialSavings: '5-10%'
        });
      }
      break;

    case 'camera':
      // Check for continuous recording vs motion detection
      const continuousRecording = patterns.some(p => 
        p.predictedSettings.recordingEnabled && !p.predictedSettings.motionDetection
      );
      
      if (continuousRecording) {
        recommendations.push({
          type: 'efficiency',
          message: 'Switch to motion-triggered recording to save energy',
          potentialSavings: '20-30%'
        });
      }
      break;
  }

  return recommendations;
}; 