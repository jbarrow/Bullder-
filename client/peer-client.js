'use strict';

var peer = new Peer({key: 'lwjd5qra8257b9', debug: 3});
var client_id = 0;

peer.on('open', function(id) {
	console.log(id);
	client_id = id;
});

peer.on('error', function(err) {
	console.log(err);
});

var conn = peer.connect('master-3', {reliable: true});
conn.on('open', function() {
	conn.send({id: client_id, pos: [window.position.coords.latitude, window.position.coords.longitude]});
});

