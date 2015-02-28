'use strict';

var peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open', function(id) {
	console.log(id);
});

peer.on('error', function(err) {
	console.log(err);
});

peer.connect('master-1').send('Test!');
