const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { sentimentAnalysis } = require("./sentimentAnalysis"); // Import your sentiment analysis function

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(__dirname)); // Serve files from the current directory

// Route to serve tweets and sentiment analysis
app.get("/api/tweets", (req, res) => {
	fs.readFile(path.join(__dirname, "tweets.json"), "utf-8", (err, data) => {
		if (err) {
			return res.status(500).json({ error: "Error reading tweets file" });
		}

		const tweets = JSON.parse(data);
		const results = tweets.map((tweet) => ({
			text: tweet.text,
			sentiment: sentimentAnalysis(tweet.text),
		}));

		res.json(results);
	});
});

// Route to serve market data
app.get("/api/market-data", (req, res) => {
	const results = [];
	fs.createReadStream(path.join(__dirname, "data", "market_data.csv"))
		.pipe(csv())
		.on("data", (row) => results.push(row))
		.on("end", () => {
			res.json(results);
		});
});

// Serve the HTML file
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
