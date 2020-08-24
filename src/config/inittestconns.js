const request = require('request');

exports.test = function(ocbHost, ocbPort, ngsiProxyHost, ngsiProxyPort) {
  const promise = new Promise((resolve, reject) => {
    console.log('... testing OCB connection with URL:');

    const ocbUrl = 'http://' + ocbHost + ':' + ocbPort + '/version';

    console.log(ocbUrl);

    const ngsiProxyUrl = 'http://' + ngsiProxyHost + ':' + ngsiProxyPort;

    request(ocbUrl, {timeout: 2000}, function(err, resp, body) {
      if (err) {
        reject(new Error('OCB connection test error ' + err));
      } else {
        console.log('OCB response body: ' + body);

        console.log('... testing NGSI Proxy connection with URL:');
        console.log(ngsiProxyUrl);

        request(ngsiProxyUrl, {timeout: 2000},
            function(err, resp, body) {
              if (err) {
                reject(new Error('NGSI Proxy connection test error ' +
                            err));
              } else {
                console.log('NGSI Proxy response body (NOTICE Error' +
                            '404 means it,s still alive): ' + body);
                resolve('OCB and NGSI Proxy connection test OK!');
              }
            });
      }
    });
  });

  promise.then(
      (result) => console.log(result),
      (error) => console.error(error),
  );
};
