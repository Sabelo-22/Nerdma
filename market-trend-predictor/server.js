const { fetchTwitterData, fetchNewsData } = require("./services/dataService");
const { analyzeSentiment } = require("./services/dataProcessor");
const { trainModel, predict } = require("./services/predictor");

let model;

// Fetch and analyze data
app.get("/analyze", async (req, res) => {
	try {
		const twitterData = await fetchTwitterData("Naspers");
		const newsData = await fetchNewsData();

		const combinedData = [...twitterData, ...newsData];
		const sentimentScores = combinedData.map((item) =>
			analyzeSentiment(item.description || item.text)
		);

		res.json({ combinedData, sentimentScores });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Train model
app.post("/train", async (req, res) => {
	try {
		const { trainingData, trainingLabels } = req.body;
		model = await trainModel(trainingData, trainingLabels);
		res.json({ message: "Model trained successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Predict
app.post("/predict", async (req, res) => {
	try {
		const { inputData } = req.body;
		if (!model) {
			return res.status(400).json({ error: "Model not trained yet" });
		}
		const prediction = predict(model, inputData);
		res.json({ prediction });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
