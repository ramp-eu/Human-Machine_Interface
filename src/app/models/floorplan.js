// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var fpSchema = mongoose.Schema({
    fieldname   : String,
    originalname: String,
    encoding    : String,
    mimetype    : String,
    size        : Number,
    filename    : String,
    imgurl      : String,
    name        : String,
    scale       : Number,
    xoffset     : Number,
    yoffset     : Number,
    created     : Date,
    updated     : Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Floorplan', fpSchema);
