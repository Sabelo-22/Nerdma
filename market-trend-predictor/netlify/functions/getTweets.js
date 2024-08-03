const fs = require("fs");
const Sentiment = require("sentiment");

const sentiment = new Sentiment();

exports.handler = async (event, context) => {
	try {
		const data = fs.readFileSync("public/tweets.json", "utf8");
		const tweets = JSON.parse(data);
		const analyzedTweets = tweets.map((tweet) => {
			const result = sentiment.analyze(tweet.tweet);
			if (result.score > 0) {
				tweet.sentiment = "positive";
			} else if (result.score < 0) {
				tweet.sentiment = "negative";
			} else {
				tweet.sentiment = "neutral";
			}
			return tweet;
		});
		return {
			statusCode: 200,
			body: JSON.stringify(analyzedTweets),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: "Error reading tweets data",
		};
	}
};
