const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const natural = require("natural");

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
		const twitterData = await fetchTwitterData("Naspers");
		const sentimentScores = twitterData.map((item) =>
			analyzeSentiment(item.text)
		);
		res.json({ twitterData, sentimentScores });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Analyze custom text
app.post("/analyze-text", (req, res) => {
	const { text } = req.body;
	if (!text) {
		return res.status(400).json({ error: "Text is required" });
	}
	const sentimentScore = analyzeSentiment(text);
	res.json({ text, sentimentScore });
});

const fetchTwitterData = async (query) => {
	// Use Twitter API to fetch data (replace with actual API details)
	// This is a mock function for illustration
	return [
		{ text: "Naspers stock is rising" },
		{ text: "Naspers faces challenges in the market" },
	];
};

const analyzeSentiment = (text) => {
	return analyzer.getSentiment(text.split(" "));
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
