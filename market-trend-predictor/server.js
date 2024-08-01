const express = require("express");
const bodyParser = require("body-parser");
const { TwitterApi } = require("twitter-api-v2");
const natural = require("natural");

const app = express();
app.use(bodyParser.json());

const SentimentAnalyzer = natural.SentimentAnalyzer;
const PorterStemmer = natural.PorterStemmer;
const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

// Replace these with your actual Twitter API credentials
const client = new TwitterApi({
	appKey: "BoXfRHG7qN5FOYSjUunOi4eEJ",
	appSecret: "jLwhoU9IDP9k2aYSuWq0fwKpcoKRxIM1SBqW2AA2kgJ4aHWRS9",
	accessToken: "1807137009237942272-6b06c9YfQ3wnwUs9y9X8KZgaMiIQzM",
	accessSecret: "kL3sjQMJYjIKF5myxjRkoNYAUZdK867VSa8MEwH0mpHwf",
});

const twitterClient = client.readOnly;

// Basic route
app.get("/", (req, res) => {
	res.send("Market Trend Predictor API");
});

// Fetch and analyze data
app.get("/analyze", async (req, res) => {
	try {
		const twitterData = await fetchTwitterData("Naspers");
		const sentimentScores = twitterData.map((item) =>
			analyzeSentiment(item.text)
		);

		let positive = 0;
		let negative = 0;
		let neutral = 0;

		sentimentScores.forEach((score) => {
			if (score > 0) {
				positive++;
			} else if (score < 0) {
				negative++;
			} else {
				neutral++;
			}
		});

		res.json({
			twitterData,
			sentimentScores,
			statistics: {
				positive,
				negative,
				neutral,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const fetchTwitterData = async (query) => {
	try {
		const tweets = await twitterClient.v2.search(query, { max_results: 10 });
		return tweets.data.map((tweet) => ({ text: tweet.text }));
	} catch (error) {
		console.error("Error fetching tweets:", error);
		return [];
	}
};

const analyzeSentiment = (text) => {
	return analyzer.getSentiment(text.split(" "));
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
