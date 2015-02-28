$(document).ready(function() {
   var found_location = function(pos) {
       console.dir(pos);
   }
   navigator.geolocation.getCurrentPosition(found_location); 
});

var bullderApp = angular.module('bullderApp', ["ngRoute"]).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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

var mockComments = [
    {
        id: 0,
        text: "Hello, world",
        op: false,
        time: "1 minute ago",
    },
    {
        id: 1,
        text: "This is a cool comment.",
        op: true,
        time: "Just now",
    }
];

var mockData = [
    {
        id: 0,
        time: "4 hours ago",
        distance: "< 1 mile away",
        comments: mockComments,
        title: "Pellentesque dapibus suscipit ligula.  Donec posuere augue in quam.",
        photo: "http://placehold.it/420x320",
    },
    {
        id: 1,
        time: "4 hours ago",
        distance: "< 1 mile away",
        comments: mockComments,
        title: "Pellentesque dapibus suscipit ligula.  Donec posuere augue in quam.",
        data: {
            extension: "pdf",
            size: "4MB",
            download: "http://google.com",
        }
    },
]

bullderApp.controller('BullderNewController', ['$scope', function($scope) {
    
}]);

bullderApp.controller('BullderViewController', ['$scope', '$route', function($scope, $route) {
    $scope.data = mockData[$route.current.params["id"]];
}]);

bullderApp.controller('BullderController', ['$scope', function($scope) {
    $scope.view = "new";
    $scope.data = mockData;
}]);

bullderApp.directive('bullderViewer', function() {
    return {
        restrict: 'E',
        scope: {
            data: "=data",
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
