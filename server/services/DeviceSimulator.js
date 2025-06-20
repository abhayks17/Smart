const Device = require('../models/Device');

class DeviceSimulator {
  constructor() {
    this.timeSlots = [
      'morning', // 6AM-12PM
      'afternoon', // 12PM-6PM
      'evening', // 6PM-10PM
      'night' // 10PM-6AM
    ];
  }

  // Get current time slot based on hour
  getCurrentTimeSlot() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  // Simulate thermostat behavior
  async simulateThermostat(deviceId) {
    const device = await Device.findById(deviceId);
    if (!device || device.type !== 'thermostat') return null;

    const timeSlot = this.getCurrentTimeSlot();
    const outsideTemp = this.generateOutsideTemp(timeSlot);
    const currentPattern = device.predictiveData.patterns.find(
      p => p.dayOfWeek === new Date().getDay() && p.timeSlot === timeSlot
    );

    // Adjust temperature based on patterns and external factors
    let targetTemp = currentPattern ? currentPattern.predictedSettings.temp : 22;
    const humidity = Math.floor(Math.random() * (60 - 30) + 30);

    // Simulate energy usage
    const energyUsage = this.calculateThermostatEnergy(
      device.settings.currentTemp,
      targetTemp,
      outsideTemp
    );

    // Update device settings
    await Device.findByIdAndUpdate(deviceId, {
      $set: {
        'settings.currentTemp': targetTemp,
        'settings.humidity': humidity
      },
      $push: {
        usageHistory: {
          timestamp: new Date(),
          action: 'temp_adjustment',
          value: targetTemp,
          energyUsage
        }
      }
    });

    return { targetTemp, humidity, energyUsage };
  }

  // Simulate smart light behavior
  async simulateLight(deviceId) {
    const device = await Device.findById(deviceId);
    if (!device || device.type !== 'light') return null;

    const timeSlot = this.getCurrentTimeSlot();
    const currentPattern = device.predictiveData.patterns.find(
      p => p.dayOfWeek === new Date().getDay() && p.timeSlot === timeSlot
    );

    // Adjust brightness based on time and patterns
    let brightness = currentPattern ? currentPattern.predictedSettings.brightness : 70;
    const isOn = this.shouldLightBeOn(timeSlot);

    // Calculate energy usage
    const energyUsage = this.calculateLightEnergy(brightness, isOn);

    // Update device settings
    await Device.findByIdAndUpdate(deviceId, {
      $set: {
        'settings.brightness': brightness,
        'settings.isOn': isOn
      },
      $push: {
        usageHistory: {
          timestamp: new Date(),
          action: isOn ? 'turned_on' : 'turned_off',
          value: brightness,
          energyUsage
        }
      }
    });

    return { brightness, isOn, energyUsage };
  }

  // Simulate security camera behavior
  async simulateCamera(deviceId) {
    const device = await Device.findById(deviceId);
    if (!device || device.type !== 'camera') return null;

    const timeSlot = this.getCurrentTimeSlot();
    const motionDetected = Math.random() > 0.7; // 30% chance of motion detection
    const recordingEnabled = this.shouldRecord(timeSlot, motionDetected);

    // Calculate energy usage
    const energyUsage = this.calculateCameraEnergy(recordingEnabled);

    // Update device settings
    await Device.findByIdAndUpdate(deviceId, {
      $set: {
        'settings.motionDetection': motionDetected,
        'settings.recordingEnabled': recordingEnabled
      },
      $push: {
        usageHistory: {
          timestamp: new Date(),
          action: motionDetected ? 'motion_detected' : 'monitoring',
          value: recordingEnabled,
          energyUsage
        }
      }
    });

    return { motionDetected, recordingEnabled, energyUsage };
  }

  // Update predictive patterns based on usage history
  async updatePredictivePatterns(deviceId) {
    const device = await Device.findById(deviceId);
    if (!device) return null;

    // Get usage history for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = device.usageHistory.filter(h => h.timestamp >= thirtyDaysAgo);
    const patterns = [];

    // Analyze patterns for each day and time slot
    for (let day = 0; day < 7; day++) {
      for (const timeSlot of this.timeSlots) {
        const timeSlotHistory = history.filter(h => {
          const historyDate = new Date(h.timestamp);
          return historyDate.getDay() === day && this.getTimeSlotForDate(historyDate) === timeSlot;
        });

        if (timeSlotHistory.length > 0) {
          const predictedSettings = this.calculatePredictedSettings(device.type, timeSlotHistory);
          const confidence = this.calculateConfidence(timeSlotHistory.length);

          patterns.push({
            dayOfWeek: day,
            timeSlot,
            predictedSettings,
            confidence
          });
        }
      }
    }

    // Update device with new patterns
    await Device.findByIdAndUpdate(deviceId, {
      $set: {
        'predictiveData.patterns': patterns,
        'predictiveData.energyEfficiencyScore': this.calculateEfficiencyScore(history)
      }
    });

    return patterns;
  }

  // Helper methods
  generateOutsideTemp(timeSlot) {
    const baseTemp = 20;
    switch (timeSlot) {
      case 'morning': return baseTemp + Math.random() * 5;
      case 'afternoon': return baseTemp + Math.random() * 10;
      case 'evening': return baseTemp + Math.random() * 3;
      case 'night': return baseTemp - Math.random() * 5;
    }
  }

  calculateThermostatEnergy(currentTemp, targetTemp, outsideTemp) {
    const tempDiff = Math.abs(currentTemp - targetTemp);
    const outsideDiff = Math.abs(outsideTemp - targetTemp);
    return (tempDiff * 0.5 + outsideDiff * 0.3) * 100; // Watts
  }

  calculateLightEnergy(brightness, isOn) {
    return isOn ? (brightness / 100) * 60 : 0; // Max 60 Watts
  }

  calculateCameraEnergy(recording) {
    return recording ? 15 : 5; // 15W recording, 5W standby
  }

  shouldLightBeOn(timeSlot) {
    return ['evening', 'night'].includes(timeSlot) || Math.random() > 0.7;
  }

  shouldRecord(timeSlot, motionDetected) {
    return motionDetected || ['night'].includes(timeSlot);
  }

  getTimeSlotForDate(date) {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  calculatePredictedSettings(deviceType, history) {
    switch (deviceType) {
      case 'thermostat':
        return {
          temp: this.calculateAverageValue(history, 'value'),
          mode: this.getMostFrequentValue(history, 'mode')
        };
      case 'light':
        return {
          brightness: this.calculateAverageValue(history, 'value'),
          isOn: this.calculatePercentage(history, h => h.action === 'turned_on') > 0.5
        };
      case 'camera':
        return {
          motionDetection: true,
          recordingEnabled: this.calculatePercentage(history, h => h.value) > 0.3
        };
    }
  }

  calculateAverageValue(history, key) {
    return Math.round(
      history.reduce((sum, h) => sum + h[key], 0) / history.length
    );
  }

  getMostFrequentValue(history, key) {
    const frequency = history.reduce((acc, h) => {
      acc[h[key]] = (acc[h[key]] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0][0];
  }

  calculatePercentage(history, predicate) {
    return history.filter(predicate).length / history.length;
  }

  calculateConfidence(sampleSize) {
    // More samples = higher confidence, max 0.95
    return Math.min(0.95, sampleSize / 100);
  }

  calculateEfficiencyScore(history) {
    if (history.length === 0) return 0;
    
    // Calculate average energy usage
    const avgEnergy = history.reduce((sum, h) => sum + h.energyUsage, 0) / history.length;
    
    // Score from 0-100, lower energy usage = higher score
    // Assuming 1000W as baseline maximum usage
    return Math.round(Math.max(0, 100 - (avgEnergy / 10)));
  }
}

module.exports = new DeviceSimulator(); 