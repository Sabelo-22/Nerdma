const express = require("express");
const path = require("path");
const {
	preprocessMarketData,
	calculateDailyReturns,
	calculateRollingAverages,
} = require("./preprocess");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/analyze", async (req, res) => {
	try {
		const data = await preprocessMarketData(
			path.join(__dirname, "data", "market_data.csv")
		);
		const returnsData = calculateDailyReturns(data);
		const rollingMean10 = calculateRollingAverages(data, 10);
		const rollingMean50 = calculateRollingAverages(data, 50);

		const trendSlope =
			(returnsData[returnsData.length - 1].close - returnsData[0].close) /
			returnsData.length;

		res.json({
			data: returnsData,
			rollingMean10,
			rollingMean50,
			trendSlope,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to analyze market data" });
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
