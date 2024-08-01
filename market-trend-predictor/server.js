const express = require("express");
const bodyParser = require("body-parser");
const natural = require("natural");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const SentimentAnalyzer = natural.SentimentAnalyzer;
const PorterStemmer = natural.PorterStemmer;
const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

// Basic route
app.get("/", (req, res) => {
	res.send("Market Trend Predictor API");
});

// Fetch and analyze data
app.get("/analyze", async (req, res) => {
	try {
		const twitterData = await fetchTwitterData();
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

const fetchTwitterData = async () => {
	try {
		const dataPath = path.join(__dirname, "tweets.json");
		const data = fs.readFileSync(dataPath, "utf8");
		return JSON.parse(data);
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
