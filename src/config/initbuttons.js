const request = require('request');
const Hmibutton = require('../app/models/hmibutton');

exports.init = function(ocbHost, ocbPort) {
  return new Promise((resolve) => {
    console.log('... creating HMI buttons if found from local MongoDB');

    Hmibutton.find({}).exec(function(err, buttons) {
      if (err) {
        console.log(err);
        resolve();
      } else if (buttons.length > 0) {
        buttons.forEach(function(button) {
          const entity = {
            'id': button.ocb_id,
            'type': 'SensorAgent',
            'modifiedTime': {
              'type': 'string',
              'value': new Date().toISOString(),
            },
            'readings': {
              'type': 'array',
              'value': [
                {
                  'type': 'SensorReading',
                  'value': {
                    'reading': {
                      'type': 'boolean',
                      'value': false,
                    },
                  },
                },
              ],
            },
            'sensorType': {
              'type': 'string',
              'value': 'HMI button',
            },
            'sensorID': {
              'type': 'string',
              'value': button.ocb_id,
            },
            'sensorManufacturer': {
              'type': 'string',
              'value': '-',
            },
            'units': {
              'type': 'string',
              'value': 'boolean',
            },
            'measurementType': {
              'type': 'string',
              'value': 'boolean',
            },
            'sanID': {
              'type': 'string',
              'value': 'SAN1_' + button.ocb_id,
            },
          };
          const ocbUrl = 'http://' + ocbHost + ':' +
                        ocbPort + '/v2/entities';
          request.post({url: ocbUrl,
            json: true,
            body: entity},
          function(err, resp, body) {
            if (err) console.log(err);
            else if (resp.statusCode == 201) {
              console.log('Created OCB entity id: ' +
                                            button.ocb_id);
            }
            resolve();
          },
          );
        });
      } else {
        console.log('... not any HMI buttons found from local MongoDB');
        resolve();
      }
    });
  });
};
