'use strict';

var peer = new Peer('master-1', {host: 'localhost', port: 9000, path: ''});

peer.on('open', function(id) {
  peer.on('connection', function(conn) {

    conn.on('open', function() {
      conn.on('data', function(data) {
        console.log('Received', data);
      });
    });

  });
});
