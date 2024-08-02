const axios = require("axios");

// Hugging Face API endpoint and key
const API_URL =
	"https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"; // Replace with your chosen model
const API_KEY = "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"; // Replace with your Hugging Face API key

async function getSentiment(text) {
	try {
		const response = await axios.post(
			API_URL,
			{ inputs: text },
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error(`Error analyzing sentiment: ${error}`);
		return null;
	}
}

async function analyzeTexts() {
	const texts = [
		"I love this product!",
		"I hate the service.",
		"This is okay.",
	];

	for (const text of texts) {
		const sentiment = await getSentiment(text);
		console.log(`Text: ${text}`);
		console.log(`Sentiment: ${JSON.stringify(sentiment)}`);
	}
}

analyzeTexts();
