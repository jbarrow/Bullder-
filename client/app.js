var bullderApp = angular.module('bullderApp', ["ngRoute", "bullderServices"]).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/new', {
        templateUrl: "partials/new.html",
        controller: "BullderNewController",
    }).when('/new/upload', {
        templateUrl: "partials/newUpload.html",
        controller: "BullderNewController",
    }).when('/view/:id', {
        templateUrl: "partials/info.html",
        controller: "BullderViewController",
    }).when('/master', {
        templateUrl: "partials/master.html",
        controller: "BullderMasterController",
    }).when('/client', {
        templateUrl: "partials/client.html",
        controller: "BullderClientController",
    }).otherwise({
       templateUrl: "partials/home.html",
        controller: "BullderController",
    });
}]);

bullderApp.controller('BullderClientController', ["bullderPeerController", "$location", function(bullderPeerController, $location) {
    bullderPeerController.createPeer();
    console.log("You are the client.");
    $location.path("/");
}]);

bullderApp.controller('BullderMasterController', ["bullderPeerController", function(bullderPeerController) {
    bullderPeerController.createPeer(true);
}]);

bullderApp.controller('BullderNewController', ['$scope', 'bullderProtocol', function($scope, bullderProtocol) {
    $scope.showImage = "images/Neighborhood.png";
    $scope.currentDistance = 2;
    $scope.$watch("distance", function(val) {
        $scope.currentDistance = val;
        // OneHouse [0.1]
        // ThreeHouse [0.25]
        // Street [0.5]
        // CityBlockGreen [1]
        // Neighborhood [3]
        // Area [6]
        // City [10]
        if (val <= 0.2) {
            $scope.showImage = "images/OneHouse.png"
        } else if (val > 0.2 && val <= 0.3) {
            $scope.showImage = "images/ThreeHouse.png"
        } else if (val > 0.3 && val <= 0.5) {
            $scope.showImage = "images/Street.png"
        } else if (val > 0.5 && val <= 1) {
            $scope.showImage = "images/CityBlockGreen.png"
        } else if (val > 1 && val <= 3) {
            $scope.showImage = "images/Neighborhood.png"
        } else if (val > 3 && val <= 6) {
            $scope.showImage = "images/Area.png"
        } else if (val > 6 && val <= 10) {
            $scope.showImage = "images/City.png"
        }
    });

    $scope.newSnapBullder = function() {
        context.drawImage(video, 0, 0, 640, 480);
    }

    $scope.newUploadBullder = function() {
        var theFile = $("#fileInput")[0].files[0];
        console.log("Uploading... ", theFile.name.split(".")[1], theFile.size, theFile.type);
        var theObject = {
            id: false,
            time: new Date(),
            score: 0,
            location: [window.position.coords.latitude, window.position.coords.longitude],
            distanceToLive: $scope.currentDistance,
            comments: [],
            title: $scope.title,
            data: {
                extension: theFile.name.split(".")[1],
                mime: theFile.type,
                size: theFile.size,
                download: "",
            }
        };

        bullderProtocol.postItem(theObject, theFile);
    }
}]);

bullderApp.controller('BullderViewController', ['$scope', '$route', 'bullderProtocol', function($scope, $route, bullderProtocol) {
    $scope.data = undefined;
    bullderProtocol.getDataWithId($route.current.params["id"]).then(function(data) {
        $scope.data = data;
    })

    $scope.vote = function(obj, vote) {
        if (vote == 1) {
            bullderProtocol.upvoteItem(obj);
        } else {
            bullderProtocol.downvoteItem(obj);
        }
    }

    $scope.displayDate = function(d) {
        return moment(d).fromNow()
    }

    $scope.postComment = function() {
        console.log($scope.newComment);
        bullderProtocol.postComment($scope.data, $scope.newComment);

        // Clear the New Comment Fields
        $scope.newComment = {
            name: "",
            text: "",
        };
    }
}]);

bullderApp.controller('BullderController', ['$scope', 'bullderProtocol', '$interval', function($scope, bullderProtocol, $interval) {
    $scope.sortOrder = "-time";

    $scope.data = undefined;
    
    var refresh = function() {
        bullderProtocol.getAllData().then(function(data) {
            $scope.data = data;
        });   
    }
    $interval(refresh, 3000);
    refresh();

    $scope.vote=function(obj, vote) {
        if(vote == 1) {
            bullderProtocol.upvoteItem(obj);
        } else {
            bullderProtocol.downvoteItem(obj);
        }
    }
}]);

bullderApp.directive('bullderViewer', function() {
    return {
        restrict: 'E',
        scope: {
            data: "=data",
            votefunc: "=votefunc",
        },
        link: function(scope, elm, attrs) {
            scope.displayDate = function(d) {
                return moment(d).fromNow();
            }
        },
        templateUrl: 'partials/viewer.html',
    }
});

bullderApp.directive('bullderLoading', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/loading.html',
    }
})

bullderApp.directive('bullderDistance', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/distance.html',
    }
})

bullderApp.directive('bullderPlural', function() {
    return {
        restrict: 'E',
        scope: {
            singular: "=singular",
            plural: "=plural",
            count: "=count"
        },
        template: "<span ng-if='count == 1'>{{ singular }}</span><span ng-if='count != 1'>{{ plural }}</span>",
    }
});

bullderApp.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});

