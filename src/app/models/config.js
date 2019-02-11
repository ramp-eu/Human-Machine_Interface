// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var configSchema = mongoose.Schema({
    ocb_host            : String,
    ocb_port            : Number,
    ngsi_proxy_host     : String,
    ngsi_proxy_port     : Number,
    curr_floorplan_id   : String,
    created             : Date,
    updated             : Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Config', configSchema);
