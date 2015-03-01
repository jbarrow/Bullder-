'use strict';

var peer = new Peer('master-104', {key: '0bgupmxgrt1sv2t9', debug: 3});
var clients = {};

peer.on('open', function(id) {
  console.log(id);
});

peer.on('connection', connect);

peer.on('close', close);

peer.on('error', function(err) {
  console.log(err);
});

function connect(c) {
  console.log("connected through:", c.id);

  c.on('data', function(data) {
    console.log('Data received!');
    clients[data.id] = data.pos;
    c.send({acknowledge: true, neighbors: get_neighbors(data.id, 1.0)});
  });
}


var bullderMaster = angular.module("bullderMaster", ["bullderDht"]);
bullderMaster.
