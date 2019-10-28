var Hmiinstance = require('../app/models/hmiinstance');

// https://www.npmjs.com/package/uuid
const uuidv4 = require('uuid/v4');

exports.init = function() {

    return new Promise((resolve) => {
        
        console.log('... creating Hmiinstance');

        Hmiinstance.find({ }, function(err, hmiinstance) {
            // if there are any errors, return the error
            if (err) {
                console.log(err);
                resolve();
            }

            // check to see if theres already a Hmiinstance
            if (hmiinstance.length > 0) {
                console.log('... Hmiinstance already created found');
                resolve();
            } else {
                var id = uuidv4();
                var date = new Date().toISOString();

                // create the Hmiinstance
                var newHmiinstance = new Hmiinstance();
                newHmiinstance.hmi_id   = id;
                newHmiinstance.created  = date;
                newHmiinstance.updated  = date;

                newHmiinstance.save(function(err) {
                    if (err) console.log(err);
                    else console.log('... Hmiinstance created');
                    resolve();
                });
            }
        });
    });
}
