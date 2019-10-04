var mongoose = require('mongoose');

var hmibuttonSchema = mongoose.Schema({
    ocb_id      : String,
    text        : String,
    user_id     : String,
    created     : Date,
    updated     : Date
});

module.exports = mongoose.model('Hmibutton', hmibuttonSchema);
