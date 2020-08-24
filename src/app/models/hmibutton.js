const mongoose = require('mongoose');

const hmibuttonSchema = new mongoose.Schema({
  ocb_id: String,
  text: String,
  user_id: String,
  created: Date,
  updated: Date,
});

module.exports = mongoose.model('Hmibutton', hmibuttonSchema);
