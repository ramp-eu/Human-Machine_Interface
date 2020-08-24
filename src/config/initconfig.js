const Config = require('../app/models/config');

exports.init = function(ocbHost, ocbPort, ngsiProxyHost, ngsiProxyPort) {
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
        const date = new Date().toISOString();

        // create the Config
        const newConfig = new Config();
        newConfig.ocb_host = ocbHost;
        newConfig.ocb_port = ocbPort;
        newConfig.ngsi_proxy_host = ngsiProxyHost;
        newConfig.ngsi_proxy_port = ngsiProxyPort;
        newConfig.curr_floorplan_id = '';
        newConfig.created = date;
        newConfig.updated = date;

        newConfig.save(function(err) {
          if (err) console.log(err);
          else console.log('... Config created');
          resolve();
        });
      }
    });
  });
};

