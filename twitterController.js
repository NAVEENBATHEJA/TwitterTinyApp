/* twitter controller */
app.controller('TwitterController', function ($scope, $q, twitterService) {
    $scope.tweets = [];

    // initialization of twitter service
    twitterService.initialize();


    //watch for user input for search new item if changed
    $scope.$watch('searchItem', function (searchString) {
        console.log("watch  ", $scope.checkforsearch);
        if (!$scope.checkforsearch) {
            searchTweets(searchString);
            searchString = "";
        }
    });


    //search item when user pressed enter key  
    $scope.refreshTimeline = function () {
        var element = document.getElementById("searchBox");
        if (element) {
            var searchString = angular.element(element);
            if (searchString && searchString.val().trim() !== "") {
                searchTweets(searchString.val().trim());
            }
        }
    }

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function () {
        twitterService.connectTwitter().then(function () {
            if (twitterService.isReady()) {
                $scope.connectedTwitter = true;
            }
        });
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function () {
        twitterService.clearCache();
        $scope.searchItem = "";
        $scope.tweets = [];
        $scope.connectedTwitter = false;
    }

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        $scope.connectedTwitter = true;
        $scope.refreshTimeline();
    }

    //search tweet based on user search
    function searchTweets(searchString) {
        if (searchString && searchString.trim() !== "") {
            twitterService.getLatestTweets(searchString).then(function (data) {
                $scope.tweets = data.statuses;
            }, function (response) {
                var error = JSON.parse(response.responseText);
                if (error.errors.length > 0)
                    console.log(error.errors[0].message);
            });
        }
    }
});
