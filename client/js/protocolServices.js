var bullderServices = angular.module('bullderServices', ['bullderPeers']);

bullderServices.factory("bullderProtocol", ["$q", "$timeout", "bullderPeerController", function($q, $timeout, bullderPeerController) {
    var rpc = window.rpcHandler;

    var cachedData = {};

    var isOp = function(obj) {
        return false;
    }

    var gotNewComment = function(comment) {
        if(cachedData[comment.id] === undefined) {
            return
        }

        cachedData[comment.id].comments.push(comment.payload);
        bullderPeerController.broadcast("newComment", comment);
    }
    var gotNewPost = function(post) {
        if(cachedData[post.payload.id] !== undefined) {
            console.log("We already have this post.")
            return
        }

        var blankObj = {};
        blankObj[post.payload.id] = post.payload

        angular.extend(cachedData, blankObj);
        // cachedData[post.payload.id] = post.payload;
        bullderPeerController.broadcast("newPost", post);
    }
    bullderPeerController.registerHandler("newComment", gotNewComment);
    bullderPeerController.registerHandler("newPost", gotNewPost);

    var gotNewVote = function(vote) {
        if(cachedData[vote.id] === undefined) {
            return
        }

        cachedData[vote.id].score += vote.vote;
        bullderPeerController.broadcast("newVote", vote);
    }
    bullderPeerController.registerHandler("newVote", gotNewVote);

    return {
      postItem: function(obj) {
          obj.id = Math.random();
          cachedData[obj.id] = obj;

          bullderPeerController.broadcast("newPost", {
              payload: obj,
          })
      },
      postComment: function(obj, comment) {
          comment.time = "Just now";
          comment.op = isOp(obj);
          obj.comments.push(comment);

          bullderPeerController.broadcast("newComment", {
              payload: comment,
              id: obj.id,
          })
      },
      upvoteItem: function(obj) {
          if (obj.voted == undefined) {
              obj.voted = 1;
              obj.score++;
          }

          bullderPeerController.broadcast("newVote", {
              id: obj.id,
              vote: 1,
          })
      },
      downvoteItem: function(obj) {
          if (obj.voted == undefined) {
              obj.voted = -1;
              obj.score--;
          }

          bullderPeerController.broadcast("newVote", {
              id: obj.id,
              vote: -1,
          })
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
