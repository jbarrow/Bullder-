$(document).ready(function() {
  var found_location = function(pos) {
      console.dir(pos);
      window.position = pos;
      connectToMasterPeer();
  }

  navigator.geolocation.getCurrentPosition(found_location);
});

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
    }).otherwise({
       templateUrl: "partials/home.html",
        controller: "BullderController",
    });
}]);



bullderApp.controller('BullderNewController', ['$scope', function($scope) {
    $scope.showImage = "images/Neighborhood.png";
    $scope.$watch("distance", function(val) {
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
    })
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

bullderApp.controller('BullderController', ['$scope', 'bullderProtocol', function($scope, bullderProtocol) {
    $scope.sortOrder = "-time";

    $scope.data = undefined;
    bullderProtocol.getAllData().then(function(data) {
       $scope.data = data;

    });

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
