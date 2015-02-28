'use strict';

var peer = new Peer('master-1', {key: 'lwjd5qra8257b9'});

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
    console.log("Data received");
  });
}
