'use strict';

var bullderPeers = angular.module('bullderPeers', ['bullderDht']);

bullderPeers.factory('bullderPeerController', ['bullderDhtController', '$q', function(bullderDhtController, $q) {
    var peer;
    var clientId;

    var openConnections = {};

    var masterPeer = "master-107";

    var dhtReceivers = {};
    var regReceivers = {};

    var rpcSend = function(message, endpoint, payload, cb) {
        var conn = openConnections[endpoint];
        if (conn == undefined) {
            console.log("Couldn't find endpoint for DHT Operation", message, endpoint);
            return
        }
        if (!conn.connected) {
            return
        }

        dhtReceivers[message].cb = cb;

        sendData(conn.conn, {
            type: "dht",
            dhtType: message,
            payload: payload,
        });
    }

    var rpcInterface = {
        endpoint: "",
        ping: function(e, p, cb) {
            rpcSend('ping', e, p, cb);
        },
        store: function(e, p, cb) {
            rpcSend('store', e, p, cb)
        },
        findNode: function() {
            rpcSend('findNode', e, p, cb);
        },
        findValue: function() {
            rpcSend('findValue', e, p, cb);
        },
        send: rpcSend,
        receive: function(message, handler) {
            dhtReceivers[message] = {
                handler: handler,
                cb: undefined,
            }
        }
    };

    var gotLocation = $q.defer();
    function createPeerLocation(master) {
        gotLocation.promise.then(function() {
           createPeer(master); 
        });
    }

    function createPeer(master) {
        if (master == undefined) {
	    peer = new Peer({key: '0bgupmxgrt1sv2t9', debug: 1});

	    peer.on('connection', function(c) {
                openConnections[c.id] = {
                    conn: c,
                    connected: true,
                }
                c.on("data", neighborHandler(c.id));
            });
        } else {
            peer = new Peer(masterPeer, {key: '0bgupmxgrt1sv2t9', debug: 1});

            peer.on('connection', masterNewConnection);
        }

	peer.on('error', function(err) {
	    console.log(err);
	});

        var seeds = !master ? [masterPeer] : [];
        peer.on('open', function(id) {
	    console.log(id);
	    clientId = id;
            rpcInterface.endpoint = clientId;

            bullderDhtController.startServer(rpcInterface, seeds);

            if (master !== true) {
                bootstrapPeers();
            }
	});
    }

    function masterNewConnection(c) {
        console.log("connected through:", c.id);
        
        c.on('data', function(data) {
            if(data.pos === undefined)
                return

            console.log('Data received!');
            
            openConnections[data.id] = {
                conn: c,
                connected: true,
                pos: data.pos,
            }

            c.send({
                acknowledge: true,
                neighbors: get_neighbors(data.id, 1.0),
            });
        })
    }


    // A function to calculate the distance (in miles)
    // between any two points in latitude/longitude
    function distance(pos1, pos2) {
        // Access the latitude and longitudes
        var lat1 = pos1[0];
        var lat2 = pos2[0];
        var lon1 = pos1[1];
        var lon2 = pos2[1];

        // Run the calculations -- lovingly ripped from
        // http://www.geodatasource.com/developers/javascript
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var radlon1 = Math.PI * lon1/180;
        var radlon2 = Math.PI * lon2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        return dist;
    }

    // Get the "neighbors" based on a max distance. Here we
    // assume that all peers connect to one master.
    function get_neighbors(client, max_distance) {
        if(typeof(max_distance) === 'undefined') max_distance = 1.0;

        var neighbors = [];

        for (var potential in openConnections) {
            console.log(potential);
            if(potential == null) {
                console.log("RIP");
                continue
            }

            if(client !== potential && distance(openConnections[client].pos, openConnections[potential].pos) < max_distance) {
                neighbors.push(potential);
            }
        }

        return neighbors;
    }

    var found_location = function(pos) {
        console.log("Found Location", pos);
        window.position = pos;
        gotLocation.resolve();
    }

    navigator.geolocation.getCurrentPosition(found_location);
    function bootstrapPeers() {
	// send data to master peer
        var connection = peer.connect(masterPeer, {reliable: true});
        var connectionObj = {
            connected: true,
            conn: connection,
        }
        openConnections[masterPeer] = connectionObj;

        connection.on("open", function() {
           sendData(connection, {
               id: clientId,
               pos: [window.position.coords.latitude, window.position.coords.longitude],
           });
        });

        connection.on("data", masterHandler);
    }

    function neighborHandler(id) {
        return function(data) {
            if(data.type === "dht") {
                var result = dhtHandler[data.dhtType].handler(id, data.payload);
                dhtHandler[data.dhtType].cb(null, result);
            } else {
                console.dir(data);
                if(regReceivers[data.type] == undefined) {
                    console.log("Couldn't find receiver for", data.type);
                }
                regReceivers[data.type](data.payload);
            }
        }
    }

    function masterHandler(data) {
	// grab neighbors and create connections if passed
	if (data.hasOwnProperty('neighbors')) {
	    for (var i = 0; i < data.neighbors.length; i++) {
                var conn = peer.connect(data.neighbors[i], {reliable: true}) 
                openConnections[data.neighbors[i]] = {
                    conn: conn,
                    connected: false,
                }

                conn.on("open", function() {
                    if (openConnections[data.neighbors[i]] != undefined)
                        openConnections[data.neighbors[i]].connected = true;
                });
                conn.on("data", neighborHandler(data.neighbors[i]));
	    }
	}

	// close connection on acknowledgement
	if (data.hasOwnProperty('acknowledge') && data.acknowledge) {
	    console.log("Data sent and acknowledged.");
	    // conn.close();
	}
    }

    function sendData(conn, data) {
        if (clientId != undefined) {
            console.log("Sending data", data.type, "to client", conn.id);
	    // send data to peerId
	    conn.send(data);
	} else {
	    // error - close connection
	    console.log("clientId has not been set, possibly not yet connected to PeerServer");
	    conn.close();
	}
    }

    function sendDataOnOpen(conn, data) {
	conn.on('open', function() {
	    sendData(conn, data);
	});
    }

    return {
        createPeer: createPeerLocation,
        rpcInterface: rpcInterface,
        broadcast: function(typ, data) {
            for (var i in openConnections) {
                var theConn = openConnections[i];
                if (theConn.connected) {
                    sendData(theConn.conn, {
                        type: typ,
                        payload: data,
                    });
                }
            }
        },
        registerHandler: function(typ, handler) {
            regReceivers[typ] = handler;
        },
        get : function(key) {
            return bullderDhtController.get(key);
        },
        set: function(key, value) {
            return bullderDhtController.set(key);
        }
    }
}]);
