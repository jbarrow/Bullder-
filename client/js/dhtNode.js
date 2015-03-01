var kad = require("kademlia-dht");

var bullderDht = angular.module('bullderDht', []);

bullderDht.factory('bullderDhtController', ['$q', function($q) {
    var theDht;

    return {
        startServer: function(rpc, seeds) {
            if (theDht != undefined) {
                return
            }

            var defer = $q.defer();
            kad.Dht.spawn(rpc, seeds, function(err, dht) {
                if (err == undefined) {
                    defer.resolve(dht);
                    return
                }

                defer.reject(err);
            })
            return defer.promise;
        },
        set: function(key, value) {
            var defer = $q.defer();
            theDht.set(key, value, function(err) {
                if(err == undefined) {
                    defer.resolve();
                    return
                }

                defer.reject(err);
            });
            return defer.promise;
        },
        get: function(key) {
            var defer = $q.defer();
            theDht.get(key, function(err, value) {
                if(err == undefined) {
                    defer.resolve(value);
                    return
                }

                defer.reject(err);
            })
            return defer.promise;
        },
        close: function() {
            theDht.close();
        }
    }
}]);

