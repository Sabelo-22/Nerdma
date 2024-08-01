const natural = require("natural");
const { SentimentAnalyzer, PorterStemmer } = natural;

const sentimentAnalyzer = new SentimentAnalyzer(
	"English",
	PorterStemmer,
	"afinn"
);

const analyzeSentiment = (text) => {
	return sentimentAnalyzer.getSentiment(text.split(" "));
};

module.exports = { analyzeSentiment };
