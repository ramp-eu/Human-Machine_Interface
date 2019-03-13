var Config = require('../app/models/config');
var request = require('request');

exports.delTaskSpecs = function(signal) {
    
    //Config.find().sort({ _id: -1 }).limit(1)
    
    return new Promise((resolve) => {
        console.log('... called signal: ' + signal);

        console.log('... deleting TaskSpecs');
        
        Config.find().sort({ _id: -1 }).limit(1).find(function (err, data) {
            
            var ocb_url = 'http://' + data[0].ocb_host + ':' + data[0].ocb_port + '/v2/entities?type=TaskSpec';
            var ocb_url2 = 'http://' + data[0].ocb_host + ':' + data[0].ocb_port + '/v2/op/update';
            
            request.get(ocb_url, function(err, resp, body) {
                if (err) {
                    console.log(err);
                    resolve();
                }
                else {
                    request.post({url:ocb_url2,
                                json : true,
                                body : {"actionType": "delete", "entities": JSON.parse(body)}},
                                function(er, r, b) {
                                    if (er) {
                                        console.log(er);
                                        resolve();
                                    }
                                    else {
                                        console.log("TaskSpecs deleted, response.statusCode " + r.statusCode);
                                        resolve();
                                    }
                                }
                    );
                }
            });
        });
    });
}
