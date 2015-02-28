'use strict';

function establishConnection() {
	var peer = new Peer({host: 'localhost', port: 9000, path: ''});

	peer.on('open', function(id) {
		var conn = peer.connect('master-1');
		conn.send('Test!');
	});
}

establishConnection();
