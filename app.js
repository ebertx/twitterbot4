var Bot = require('./node_modules/twit/examples/bot');
var config = require('./node_modules/twit/config.js');

var bot = new Bot(config);

console.log('twitbot4: Running.');

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

	if(rand <= .50) {
		// favorite or retweet popular web development tweets
		var params = {
			q: 'html'
			, since: datestring()
			, result_type: 'mixed'
			, limit: 10
		};


		if(rand <= .25) {
			console.log("Begin favoriting");
			bot.twit.post('favorites/create', fparams, function(err2, reply2) {
				if(err2) 
					return handleError(err2);
				console.log("Favorite response: " + reply2);
			});
		} else {
			console.log("Begin retweeting");
			bot.twit.post('statuses/retweet', fparams, function(err2, reply2) {
				if(err2)
					return handleError(err2);
				console.log("Retweet response: " + reply2);
			});
		}
	} else if(rand <= .60) {
		bot.mingle(function(err, reply) {
			if(err) return handleError(err);

			var name = reply.screen_name;
			console.log('\nMingle: followed @' + name);
		});
	} else {
		bot.prune(function(err, reply) { 
			if(err) return handleError(err);

			var name = reply.screen_name;
			console.log('\nPrune: unfollowed @'+ name);
		});
	}
}, config.interval);

function handleError(err) {
	console.error('response status:', err.statusCode);
	console.error('data:', err.data);
}
