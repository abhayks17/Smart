const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.get('/times', (req, res) => {
  const pyPath = path.join(__dirname, '../Scripts/lightpredvalue.py');
  const pythonProcess = spawn('/home/abhay/smart-home/venv/bin/python3', [pyPath]);

  let data = '';

  pythonProcess.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on('data', (err) => {
    console.error(`Python error: ${err}`);
  });

  pythonProcess.on('close', (code) => {
    try {
      const result = JSON.parse(data);

      const convert = (t) => {
        const [time, modifier] = t.split(' ');
        let [h, m] = time.split(':');
        h = parseInt(h);
        if (modifier === 'PM' && h !== 12) h += 12;
        if (modifier === 'AM' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${m}`;
      };

      res.json({
        lightOnTime: convert(result.onTime),
        lightOffTime: convert(result.offTime),
      });
    } catch (e) {
      console.error('Parsing failed:', e, 'Output was:', data);
      res.status(500).json({ error: 'Failed to parse Python output', details: data });
    }
  });
});

module.exports = router;