var Config = require('../app/models/config');
var request = require('request');

exports.delTaskSpecs = function(signal) {

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
                    var jsonarr = JSON.parse(body);
                    for (i = 0; i < jsonarr.length; i++) {
                        delete jsonarr[i].TaskSpec;
                    }
//https://fiware-orion.readthedocs.io/en/master/user/walkthrough_apiv2/index.html#batch-operations
//  Orion's batch delete behaviour is that it empties only attrs of entity,
// and deletes the entities only if they are empty
                    request.post({url:ocb_url2,
                                json : true,
                                body : {"actionType": "delete", "entities": JSON.parse(body)}},
                                function(er, re, bo) {
                                    if (er) {
                                        console.log(er);
                                        resolve();
                                    }
                                    else {
                                        console.log("TaskSpecs emptied, response.statusCode " + re.statusCode);
                                        request.post({url:ocb_url2,
                                                    json : true,
                                                    body : {"actionType": "delete", "entities": jsonarr}},
                                                    function(e, r, b) {
                                                        if (e) {
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
                                }
                    );
                }
            });
        });
    });
}
