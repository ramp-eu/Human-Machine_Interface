var mongoose = require('mongoose');

var subscriptionSchema = mongoose.Schema({
    subs_id     : String,
    created     : Date,
    updated     : Date
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
