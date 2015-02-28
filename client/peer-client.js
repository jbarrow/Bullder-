function establishConnection() {
	var peer = new Peer('19234', {host: 'localhost', port: 9000, path: ''});

	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
	});

}

establishConnection();
