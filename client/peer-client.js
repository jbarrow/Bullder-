function establishConnection() {
	var peer = new Peer({host: 'localhost', port: 9000, path: ''});

	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
	});

}

establishConnection();
