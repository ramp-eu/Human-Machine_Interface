var mongoose = require('mongoose');

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

module.exports = mongoose.model('Floorplan', fpSchema);
