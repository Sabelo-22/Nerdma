const express = require("express");
const fs = require("fs");
const path = require("path");
const { SentimentAnalyzer, PorterStemmer } = require("natural");
const sentiment = new SentimentAnalyzer("English", PorterStemmer, "afinn");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/analyze", (req, res) => {
	fs.readFile("tweets.json", "utf8", (err, data) => {
		if (err) {
			console.error("Error reading tweets.json:", err);
			return res.status(500).send("Internal Server Error");
		}

		const tweets = JSON.parse(data);
		const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

		tweets.forEach((tweet) => {
			const analysis = sentiment.getSentiment(tweet.text.split(" "));
			if (analysis > 0) {
				sentimentCounts.positive += 1;
			} else if (analysis < 0) {
				sentimentCounts.negative += 1;
			} else {
				sentimentCounts.neutral += 1;
			}
		});

		res.json({ statistics: sentimentCounts });
	});
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
