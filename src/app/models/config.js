const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  ocb_host: String,
  ocb_port: Number,
  ngsi_proxy_host: String,
  ngsi_proxy_port: Number,
  curr_floorplan_id: String,
  created: Date,
  updated: Date,
});

module.exports = mongoose.model('Config', configSchema);
