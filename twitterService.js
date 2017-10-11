angular
    .module("twitterApp.services", [])
    /* define constants for service module*/
    .constant('config', {
        OAuthKey: 'v14C5RyEBjTw8eqR4bByoSn68WI',
        TweetSearchUrl: '/1.1/search/tweets.json',
        ConnectingAccont: 'twitter'
    })
    .factory("twitterService", ['$q', 'config', function ($q, config) {
        var authResult = false;
        return {

            /* initialization of OAuth with twitter account */
            initialize: function () {
                OAuth.initialize(config.OAuthKey, {
                    cache: true
                });
                authResult = OAuth.create(config.ConnectingAccont);
            },

            /* Check for Ready State */
            isReady: function () {
                return authResult;
            },

            /* Connect to twitter account */
            connectTwitter: function () {
                var deferred = $q.defer();
                OAuth.popup(config.ConnectingAccont, {
                    cache: true
                }, function (error, result) {
                    if (!error) {
                        authResult = result;
                        deferred.resolve();
                    } else {
                        console.log("Error occured while connecting to twitter");
                    }
                });
                return deferred.promise;
            },

            /* clear OAuth cache while signout */
            clearCache: function () {
                OAuth.clearCache(config.ConnectingAccont);
                authResult = false;
            },

            /* get latest tweets from twitter account */
            getLatestTweets: function (searchItem) {
                var deferred = $q.defer();
                var url = config.TweetSearchUrl;
                if (searchItem) {
                    url += '?q=' + searchItem + '&count=100';
                }
                var promise = authResult.get(url).done(function (data) {
                    deferred.resolve(data);
                }).fail(function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        }
}]);
