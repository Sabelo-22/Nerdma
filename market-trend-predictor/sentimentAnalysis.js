const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function sentimentAnalysis(text) {
	const result = sentiment.analyze(text);
	return result.score > 0
		? "positive"
		: result.score < 0
		? "negative"
		: "neutral";
}

module.exports = { sentimentAnalysis };
