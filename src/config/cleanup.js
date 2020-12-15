const Hmiinstance = require('../app/models/hmiinstance');
const request = require('request');
const ocbUrl = 'http://' + process.env.ocb_host + ':' + process.env.ocb_port +
                '/v2/entities?type=Materialflow&type=SensorAgent';
const ocbUrlUpdate = 'http://' + process.env.ocb_host + ':' + process.env.ocb_port +
                '/v2/op/update';

exports.cleanOCB = function(signal) {
  return new Promise((resolve) => {
    console.log('... called signal: ' + signal);

    Hmiinstance.find().sort({_id: -1}).limit(1).find(function(err, hmi) {
      request.get(ocbUrl, function(err, resp, body) {
        if (err) {
          console.log(err);
          resolve();
        } else {
          const jsonarr3 = [];
          const jsonarr2 = JSON.parse(body);
          const jsonarr = JSON.parse(body);
          if (jsonarr.length > 0) {
            console.log('... deleting SensorAgent.HMI buttons');
            for (let i = jsonarr.length-1; i >= 0; i--) {
              if (jsonarr[i].type == 'SensorAgent' &&
                  jsonarr[i].sensorType.value !== undefined &&
                  jsonarr[i].sensorType.value == 'HMI button') {
                delete jsonarr[i].measurementType;
                delete jsonarr[i].modifiedTime;
                delete jsonarr[i].readings;
                delete jsonarr[i].sanID;
                delete jsonarr[i].sensorID;
                delete jsonarr[i].sensorManufacturer;
                delete jsonarr[i].sensorType;
                delete jsonarr[i].units;
              } else if (jsonarr[i].type == 'Materialflow') {
                //    delete jsonarr[i].TaskSpec;
                if (jsonarr[i].ownerId.value !== undefined &&
                    jsonarr[i].ownerId.value == hmi[0].hmi_id) {
                  jsonarr[i].active.value = false;
                  jsonarr3.push({'id': jsonarr[i].id,
                    'type': jsonarr[i].type,
                    'active': jsonarr[i].active});
                }
                jsonarr.splice(i, 1);
                jsonarr2.splice(i, 1);
              } else {
                jsonarr.splice(i, 1);
                jsonarr2.splice(i, 1);
              }
            }
            // https://fiware-orion.readthedocs.io/en/master/user/walkthrough_apiv2/index.html#batch-operations
            // Orion's batch delete behaviour is that it empties only attrs
            // of entity, and deletes the entities only if they are empty
            if (jsonarr2.length > 0) {
              request.post({url: ocbUrlUpdate,
                json: true,
                body: {'actionType': 'DELETE', 'entities': jsonarr2}},
              function(er, re, bo) {
                if (er) {
                  console.log(er);
                  resolve();
                } else {
                  console.log('SensorAgent.HMI buttons emptied, ' +
                              'response.statusCode ' + re.statusCode);
                  request.post({url: ocbUrlUpdate,
                    json: true,
                    body: {'actionType': 'DELETE', 'entities': jsonarr}},
                  function(e, r, b) {
                    if (e) {
                      console.log(e);
                      resolve();
                    } else {
                      console.log('SensorAgent.HMI buttons deleted, ' +
                                  'response.statusCode ' + r.statusCode);

                      if (jsonarr3.length > 0) {
                        console.log('... setting Materialflow ' +
                                    'entities to non-active');
                        request.post({url: ocbUrlUpdate,
                          json: true,
                          body: {'actionType': 'UPDATE',
                            'entities': jsonarr3}},
                        function(er, re, bo) {
                          if (er) {
                            console.log(er);
                            resolve();
                          } else {
                            console.log('Materialflow entities set to ' +
                              'non-active, response.statusCode ' +
                              re.statusCode);
                            resolve();
                          }
                        },
                        );
                      } else {
                        console.log('... Materialflow entities not found');
                        resolve();
                      }
                    }
                  },
                  );
                }
              },
              );
            } else {
              if (jsonarr3.length > 0) {
                console.log('... setting Materialflow entities ' +
                            'to non-active');
                request.post({url: ocbUrlUpdate,
                  json: true,
                  body: {'actionType': 'UPDATE', 'entities': jsonarr3}},
                function(er, re, bo) {
                  if (er) {
                    console.log(er);
                    resolve();
                  } else {
                    console.log('Materialflow entities set to non-active, ' +
                                'response.statusCode ' + re.statusCode);
                    resolve();
                  }
                },
                );
              } else {
                console.log('... Materialflows or SensorAgent.HMI ' +
                            'buttons not found');
                resolve();
              }
            }
          } else {
            console.log('... Materialflows or SensorAgent.HMI ' +
                        'buttons not found');
            resolve();
          }
        }
      });
    });
  });
};
