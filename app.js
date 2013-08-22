var Bot = require('./node_modules/twit/examples/bot');
var config = require('./node_modules/twit/config.js');

var bot = new Bot(config);

console.log('twitbot3: Running.');

//get date string for today's date (e.g. '2011-01-01')
function datestring () {
  var d = new Date(Date.now() - 8*60*60*1000);  //mst timezone
  return d.getUTCFullYear()   + '-' 
     +  (d.getUTCMonth() + 1) + '-'
     +   d.getDate();
};

setInterval(function() {
  bot.twit.get('followers/ids', function(err, reply) {
    if(err) return handleError(err)
    console.log('\n# followers:' + reply.ids.length.toString());
  });
  var rand = Math.random();
  
  if(rand <= .40) {      
    // favorite popular web development tweets
    var params = {
        q: 'web development'
      , since: datestring()
      , result_type: 'mixed'
      , limit: 10
    };
    bot.twit.get('search/tweets', params, function (err, reply) {
      if(err) 
        return handleError(err);

      // console.log(reply);
      if(reply.code == "88") {
        // console.log(reply);
        return;
      }

      var max = 0, popular;
      
      var tweets = reply.statuses
        , i = tweets.length;

      var temp_tweet;
      
      while(i--) {
        var tweet = tweets[i]
          , popularity = tweet.retweet_count;
        
        if(popularity > max) {
          max = popularity;
          temp_tweet = tweet;
        }
      }

      console.log(temp_tweet.id);

      var fparams = {
        id: temp_tweet.id
      } 
      if(rand <= .30) {
        bot.twit.post('favorites/create', fparams, function(err2, reply2) {
          if(err2) 
            return handleError(err2);
          console.log("Favorite response: " + reply2);
        });
      } else {
        bot.twit.post('statuses/retweet', fparams, function(err2, reply2) {
          if(err2)
            return handleError(err2);
          console.log("Retweet response: " + reply2);
        });
      }


    });


  } else if(rand <= 0.55) { //  make a friend
    bot.mingle(function(err, reply) {
      if(err) return handleError(err);

      var name = reply.screen_name;
      console.log('\nMingle: followed @' + name);
    });
  } else {                  //  prune a friend
    bot.prune(function(err, reply) { 
      if(err) return handleError(err);
      
      var name = reply.screen_name
      console.log('\nPrune: unfollowed @'+ name);
    });
  }
}, 10000);

function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}
