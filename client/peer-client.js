'use strict';

var peer;
var clientId;

function connect() {
	peer = new Peer({key: 'lwjd5qra8257b9', debug: 3});

	peer.on('open', function(id) {
		console.log(id);
		clientId = id;
	});

	peer.on('error', function(err) {
		console.log(err);
	});

}

function connectToMasterPeer() {
	// send data to master peer
	sendData('master-101', {id: clientId, pos: [window.position.coords.latitude, window.position.coords.longitude]});
}

function sendFileChunk(peerId, fileChunk) {

	//TODO

}

function sendData(peerId, data) {

	var conn = peer.connect(peerId, {reliable: true});

	conn.on('open', function() {

		if (clientId != undefined) {
			// send data to peerId
			conn.send(data);
		} else {
			// error - close connection
			console.log("clientId has not been set, possibly not yet connected to PeerServer");
			conn.close();
		}

		// get response back
		conn.on('data', function(data) {

			// close connection on acknowledgement
			if (data.acknowledge) {
				console.log("Data sent and acknowledged - closing connection.");
				conn.close();
			}

		});
	});
}

function receiveFileChunk(peerId) {

}

connect();
