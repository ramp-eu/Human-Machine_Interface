var Config = require('../app/models/config');
var request = require('request');

exports.delTaskSpecs = function(signal) {

    return new Promise((resolve) => {
        console.log('... called signal: ' + signal);
        console.log('... deleting TaskSpecs & SensorAgent.HMI buttons');

        Config.find().sort({ _id: -1 }).limit(1).find(function (err, data) {

            var ocb_url = 'http://' + data[0].ocb_host + ':' + data[0].ocb_port + '/v2/entities?type=TaskSpec&type=SensorAgent';
            var ocb_url2 = 'http://' + data[0].ocb_host + ':' + data[0].ocb_port + '/v2/op/update';

            request.get(ocb_url, function(err, resp, body) {
                if (err) {
                    console.log(err);
                    resolve();
                }
                else {
                    var jsonarr2 = JSON.parse(body);
                    var jsonarr = JSON.parse(body);
                    if (jsonarr.length > 0) {
                        for (var i = jsonarr.length-1; i >= 0; i--) {
                            if (jsonarr[i].type == "SensorAgent" && jsonarr[i].sensorType.value !== undefined && jsonarr[i].sensorType.value == "HMI button") {
                                delete jsonarr[i].measurementType;
                                delete jsonarr[i].modifiedTime;
                                delete jsonarr[i].readings;
                                delete jsonarr[i].sanID;
                                delete jsonarr[i].sensorID;
                                delete jsonarr[i].sensorManufacturer;
                                delete jsonarr[i].sensorType;
                                delete jsonarr[i].units;
                            }
                            else if (jsonarr[i].type == "TaskSpec") {
                                delete jsonarr[i].TaskSpec;
                            }
                            else {
                                jsonarr.splice(i, 1);
                                jsonarr2.splice(i, 1);
                            }
                        }
                    }
                    if (jsonarr.length > 0) {
//https://fiware-orion.readthedocs.io/en/master/user/walkthrough_apiv2/index.html#batch-operations
//  Orion's batch delete behaviour is that it empties only attrs of entity,
// and deletes the entities only if they are empty
                        request.post({url:ocb_url2,
                                    json : true,
                                    body : {"actionType": "delete", "entities": jsonarr2}},
                                    function(er, re, bo) {
                                        if (er) {
                                            console.log(er);
                                            resolve();
                                        }
                                        else {
                                            console.log("TaskSpecs & SensorAgent.HMI buttons emptied, response.statusCode " + re.statusCode);
                                            request.post({url:ocb_url2,
                                                        json : true,
                                                        body : {"actionType": "delete", "entities": jsonarr}},
                                                        function(e, r, b) {
                                                            if (e) {
                                                                console.log(e);
                                                                resolve();
                                                            }
                                                            else {
                                                                console.log("TaskSpecs & SensorAgent.HMI buttons deleted, response.statusCode " + r.statusCode);
                                                                resolve();
                                                            }
                                                        }
                                            );
                                        }
                                    }
                        );
                    }
                    else resolve();
                }
            });
        });
    });
}
