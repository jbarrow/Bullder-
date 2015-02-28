'use strict';

var peer = new Peer('master-3', {key: 'lwjd5qra8257b9', debug: 3});

peer.on('open', function(id) {
  console.log(id);
});

peer.on('connection', connect);

peer.on('error', function(err) {
  console.log(err);
})

function connect(c) {
  console.log("connected through:", c.id);

  c.on('data', function(data) {
    console.log('Data received!');
  });
}
