var bullderServices = angular.module('bullderServices', ['bullderDht']);

bullderServices.factory("bullderProtocol", ["$q", "$timeout", "bullderDhtController", function($q, $timeout, bullderDhtController) {
    var rpc = window.rpcHandler;

    var mockComments = [
        {
            id: 0,
            text: "Hello, world",
            op: false,
            time: Date.parse("Feb 25, 2015"),
        },
        {
            id: 1,
            text: "This is a cool comment.",
            op: true,
            time: Date.parse("Feb 29, 2015"),
        }
    ];

    var cachedData = [
        {
            id: 0,
            time: Date.parse("Feb 28, 2015"),
            score: 5,
            distance: "< 1 mile away",
            comments: mockComments,
            title: "Pellentesque dapibus suscipit ligula.  Donec posuere augue in quam.",
            photo: "http://placehold.it/420x320",
        },
        {
            id: 1,
            time: Date.parse("Feb 27, 2015"),
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
          cachedData.push(obj);
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
              defer.resolve(cachedData);
          }, 0);

          return defer.promise;
      },
      getDataWithId: function(id) {
          var defer = $q.defer();
          $timeout(function() {
              if(id > cachedData.length || id < 0) {
                  defer.resolve(false);
                  return;
              }
              defer.resolve(cachedData[id])
          }, 0);
          
          return defer.promise;
      },
    };
}]);
