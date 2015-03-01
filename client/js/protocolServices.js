var bullderServices = angular.module('bullderServices', []);

bullderServices.factory("bullderProtocol", ["$q", "$timeout", function($q, $timeout) {
    var rpc = window.rpcHandler;

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
            score: 5,
            distance: "< 1 mile away",
            comments: mockComments,
            title: "Pellentesque dapibus suscipit ligula.  Donec posuere augue in quam.",
            photo: "http://placehold.it/420x320",
        },
        {
            id: 1,
            time: "4 hours ago",
            score: 20,
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

    var isOp = function(obj) {
        return false;
    }

    return {
      postItem: function(obj) {
          
      },
      postComment: function(obj, comment) {
          comment.time = "Just now";
          comment.op = isOp(obj);
          obj.comments.push(comment);
      },
      upvoteItem: function(obj) {
          if (obj.voted == undefined) {
              obj.voted = 1;
              obj.score++;
          }
      },
      downvoteItem: function(obj) {
          if (obj.voted == undefined) {
              obj.voted = -1;
              obj.score--;
          }
      },
      getAllData: function() {
          var defer = $q.defer();
          $timeout(function() {
              defer.resolve(mockData);
          }, 0);

          return defer.promise;
      },
      getDataWithId: function(id) {
          var defer = $q.defer();
          $timeout(function() {
              defer.resolve(mockData[id])
          }, 0);
          
          return defer.promise;
      },
    };
}]);
