var Config = require('../app/models/config');

exports.init = function(ocb_host, ocb_port, ngsi_proxy_host, ngsi_proxy_port) {

    return new Promise((resolve) => {
        
        console.log('... creating Config');

        Config.find({ }, function(err, config) {
            // if there are any errors, return the error
            if (err) {
                console.log(err);
                resolve();
            }

            // check to see if theres already a Config
            if (config.length > 0) {
                console.log('... Config already created found');
                resolve();
            } else {
                var date = new Date().toISOString();

                // create the Config
                var newConfig = new Config();
                newConfig.ocb_host          = ocb_host;
                newConfig.ocb_port          = ocb_port;
                newConfig.ngsi_proxy_host   = ngsi_proxy_host;
                newConfig.ngsi_proxy_port   = ngsi_proxy_port;
                newConfig.curr_floorplan_id = "";
                newConfig.created           = date;
                newConfig.updated           = date;

                newConfig.save(function(err) {
                    if (err) console.log(err);
                    else console.log('... Config created');
                    resolve();
                });
            }
        });
    });
}
 
