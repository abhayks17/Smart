const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
},{ collection: 'locations' });;

module.exports = mongoose.model('Location', locationSchema);
