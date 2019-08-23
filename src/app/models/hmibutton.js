var mongoose = require('mongoose');

var hmibuttonSchema = mongoose.Schema({
    ocb_id      : String,
    text        : String,
    created     : Date,
    updated     : Date
});

module.exports = mongoose.model('Hmibutton', hmibuttonSchema);
