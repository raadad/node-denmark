'use strict';

var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    cluster = require('cluster'),
    numCPUs = Number(process.env.NODE_CPU) || require('os').cpus().length,
    port = process.env.NODE_PORT || 3000;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        var child = cluster.fork();
        console.log("Worker " + child.process.pid + " spawned.");
    }
} else {

    http.createServer(function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        if (req.url === '/healthcheck' ) {
            res.end(JSON.stringify({
                "status": "ok",
                "errorCount": 0,
                "fatalCount": 0
            }));
        }

        var queryObject = url.parse(req.url, true).query,
            latmin = 0,
            latmax = 0;

        if (queryObject.latmin) latmin = queryObject.latmin;
        if (queryObject.latmax) latmax = queryObject.latmax;
        if (!queryObject.latmax || !queryObject.latmin) {
            if (latmin) latmax = latmin;
            if (latmax) latmin = latmax;
        }

        var timeout = latmin;
        if (latmin !== latmax) timeout = Math.random() * latmax + latmin;


        var paymin = 0,
            paymax = 0;

        if (queryObject.paymin) paymin = queryObject.paymin;
        if (queryObject.paymax) paymax = queryObject.paymax;
        if (!queryObject.paymax || !queryObject.paymin) {
            if (paymin) paymax = paymin;
            if (paymax) paymin = paymax;
        }
        var payload;

        if (paymin !== paymax) {
            payload = new Buffer(Number(Math.floor(Math.random() * paymax + paymin) * 1024));
        }
        else {
            payload = new Buffer(Number(paymin) * 1024);
        }

        setTimeout(function() {
            res.end(payload);
        }, timeout);

    }).listen(port, '0.0.0.0').on('error', function(e) {
        console.log(e);
    });

    process.on('uncaughtException', function(err) {
        console.error(err.stack);
    });

    console.log('Server running at http://0.0.0.0:' + port + '/');
}
