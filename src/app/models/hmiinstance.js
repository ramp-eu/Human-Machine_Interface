var mongoose = require('mongoose');

var hmiinstanceSchema = mongoose.Schema({
    hmi_id     : String,
    created     : Date,
    updated     : Date
});

module.exports = mongoose.model('Hmiinstance', hmiinstanceSchema);
