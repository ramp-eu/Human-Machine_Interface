var request = require('request');

exports.test = function(ocb_host, ocb_port, ngsi_proxy_host, ngsi_proxy_port) {
    
    let promise =  new Promise((resolve, reject) => {
        
        console.log('... testing OCB connection with URL:');
        
        var ocb_url = 'http://' + ocb_host + ':' + ocb_port + '/version';
        
        console.log(ocb_url);
        
        var ngsi_proxy_url = 'http://' + ngsi_proxy_host + ':' + ngsi_proxy_port;

        request(ocb_url, {timeout: 2000}, function(err, resp, body) {
            
            if (err) {
                reject(new Error('OCB connection test error ' + err));
            }
            else {
                console.log('OCB response body: ' + body);
                                    
                console.log('... testing NGSI Proxy connection with URL:');                            
                console.log(ngsi_proxy_url);

                request(ngsi_proxy_url, {timeout: 2000}, function(err, resp, body) {
                    
                    if (err) {
                        reject(new Error('NGSI Proxy connection test error ' + err));
                    }
                    else {
                        console.log('NGSI Proxy response body (NOTICE Error 404 means it,s still alive): ' + body);
                        resolve('OCB and NGSI Proxy connection test OK!');
                    }
                });
            }
        });
    });
    
    promise.then(
        result => console.log(result),
        error => console.error(error) 
    );
}
