$(document).ready(function() {
   var found_location = function(pos) {
       console.dir(pos);
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
    $scope.view = "new";

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
        templateUrl: 'partials/viewer.html',
    }
});

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
