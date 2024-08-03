const express = require("express");
const fs = require("fs");
const Sentiment = require("sentiment");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

const sentiment = new Sentiment();

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/tweets", (req, res) => {
	fs.readFile("public/tweets.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send("Error reading tweets data");
			return;
		}
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
		res.json(analyzedTweets);
	});
});

app.get("/api/market-data", (req, res) => {
	fs.readFile(
		path.join(__dirname, "public", "data", "market_data.csv"),
		"utf8",
		(err, data) => {
			if (err) {
				console.error(err);
				res.status(500).send("Error reading market data");
				return;
			}
			const rows = data.split("\n").slice(1);
			const marketData = rows.map((row) => {
				const [timestamp, location, value, likes, retweets, replies] =
					row.split(",");
				return { timestamp, location, value, likes, retweets, replies };
			});
			res.json(marketData);
		}
	);
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
