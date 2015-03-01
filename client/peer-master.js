'use strict';

var peer = new Peer('master-101', {key: 'lwjd5qra8257b9', debug: 3});
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
    console.log(data.id);
    console.log(data.pos[0] + ', ' + data.pos[1]);
    c.send({acknowledge: true});
    clients[data.id] = data.pos;
    console.log(clients);
    console.log(get_neighbors(data.id, 1.0));
  });
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

  neighbors = [];

  for (var potential in clients) {
    if(distance(clients[client], clients[potential]) < max_distance) {
      neighbors.append(potential);
    }
  }

  return neighbors;
}
