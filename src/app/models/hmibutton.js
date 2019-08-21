var mongoose = require('mongoose');

var hmibuttonSchema = mongoose.Schema({
    ocb_id      : String,
    ocb_type    : String,
    name        : String,
    created     : Date,
    updated     : Date
});

module.exports = mongoose.model('Hmibutton', hmibuttonSchema);
