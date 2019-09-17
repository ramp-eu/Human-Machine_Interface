var request = require('request');
var Hmibutton = require('../app/models/hmibutton');

exports.init = function(ocb_host, ocb_port) {
    
    return new Promise((resolve) => {
        
    console.log('... creating HMI buttons');

        Hmibutton.find({}).exec(function(err, buttons) {
            if (err) {
                console.log(err);
                resolve();
            }
            else {
                buttons.forEach(function(button) {
                    var entity = {
                        "id": button.ocb_id,
                        "type": "SensorAgent",
                        "modifiedTime": {
                            "type": "string",
                            "value": new Date().toISOString()
                        },
                        "readings": {
                            "type": "array",
                            "value": [
                                {
                                    "type": "SensorReading",
                                    "value": {
                                        "reading": {
                                            "type": "boolean",
                                            "value": false
                                        }
                                    }
                                }
                            ]
                        },
                        "sensorType": {
                            "type": "string",
                            "value": "HMI button"
                        },
                        "sensorID": {
                            "type": "string",
                            "value": button.ocb_id
                        },
                        "sensorManufacturer": {
                            "type": "string",
                            "value": "-"
                        },
                        "units": {
                            "type": "string",
                            "value": "boolean"
                        },
                        "measurementType": {
                            "type": "string",
                            "value": "boolean"
                        },
                        "sanID": {
                            "type": "string",
                            "value": "SAN1_" + button.ocb_id
                        }
                    };
                    var ocb_url = 'http://' + ocb_host + ':' + ocb_port + '/v2/entities';
                    request.post({url:ocb_url,
                                json : true,
                                body : entity},
                                function(err, resp, body) {
                                    if (err) console.log(err);
                                    else if (resp.statusCode == 201)
                                        console.log('Created OCB entity id: ' + button.ocb_id);
                                    resolve();
                                }
                    );
                });
            }
        });
    });
}
