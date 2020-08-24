const mongoose = require('mongoose');

const hmiinstanceSchema = new mongoose.Schema({
  hmi_id: String,
  created: Date,
  updated: Date,
});

module.exports = mongoose.model('Hmiinstance', hmiinstanceSchema);
