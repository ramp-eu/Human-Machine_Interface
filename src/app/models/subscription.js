const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subs_id: String,
  created: Date,
  updated: Date,
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
