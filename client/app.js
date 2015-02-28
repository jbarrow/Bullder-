var bullderApp = angular.module('bullderApp', ["ngRoute"]).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/new', {
        templateUrl: "partials/new.html",
        controller: "BullderNewController",
    }).when('/new/upload', {
        templateUrl: "partials/newUpload.html",
        controller: "BullderNewController",
    }).otherwise({
       templateUrl: "partials/home.html",
        controller: "BullderController",
    });
}]);

bullderApp.controller('BullderNewController', ['$scope', function($scope) {
    
}]);

bullderApp.controller('BullderController', ['$scope', function($scope) {
    $scope.view = "new";
    $scope.data = [{
        time: "4 hours ago",
        distance: "< 1 mile away",
        comments: ["hi"],
        title: "Pellentesque dapibus suscipit ligula.  Donec posuere augue in quam.",
        photo: "http://placehold.it/420x320",
        // data: {
        //     extension: "pdf",
        //     size: "4MB",
        //     download: "http://google.com",
        // }
    }];
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
