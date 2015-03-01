'use strict';

var peer;
var clientId;
var neighborConnections = {};

function connect() {
	peer = new Peer({key: '0bgupmxgrt1sv2t9', debug: 3});

	peer.on('open', function(id) {
		console.log(id);
		clientId = id;
	});

	peer.on('error', function(err) {
		console.log(err);
	});

	peer.on('connection', getData);

}

function connectToMasterPeer() {
	// send data to master peer
	sendData(peer.connect('master-104', {reliable: true}), {id: clientId, pos: [window.position.coords.latitude, window.position.coords.longitude]});
}

function sendFileChunk(peerId, fileChunk) {
	// send fileChunk to peerId
	sendData(peerId, {file_chunk: fileChunk, type: "filechunk"});
}

function sendConnectionRequest(conn) {
	// send connection request to peer
	sendData(conn, {id: clientId, type: "connection"});
}

function sendData(conn, data) {

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

			// grab neighbors and create connections if passed
			if (data.hasOwnProperty('neighbors')) {

				for (var i = 0; i < data.neighbors.length; i++) {
					neighborConnections[data.neighbors[i]] = peer.connect(data.neighbors[i], {reliable: true});
				}

			}

			// close connection on acknowledgement
			if (data.hasOwnProperty('acknowledge') && data.acknowledge) {
				console.log("Data sent and acknowledged - closing connection.");
				conn.close();

				// if neighbors passed, send connection requests to them
				if (data.hasOwnProperty('neighbors')) {
					connectToNeighbors();
				}
			}

		});
	});

}




function receiveFileChunk(data) {



}


function getData(connection) {

	connection.on('data', function(data) {

		console.log('Retrieved data from connection ' + connection.id + ': ' + data);

		// handle data
		if (data.hasOwnProperty('type')) {
			
			if (data.type == "filechunk") {

			} else if (data.type == "connection" && data.hasOwnProperty('id')) {
				console.log("Received connection request from " + data.id);
				neighborConnections[data.id] = connection;
			}

		}

		// don't acknowledge, want the connection open

	});

}



function connectToNeighbors() {

	for (var neighbor in neighborConnections) {

		if (neighborConnections.hasOwnProperty(neighbor)) {
			console.log("Send connection request to " + neighbor);
			sendConnectionRequest(neighborConnections[neighbor]);
		}

	}

}

connect();
