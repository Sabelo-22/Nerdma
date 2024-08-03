const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "../../public/data/market_data.csv"),
			"utf8"
		);
		const rows = data.split("\n").slice(1);
		const marketData = rows.map((row) => {
			const [timestamp, location, value, likes, retweets, replies] =
				row.split(",");
			return { timestamp, location, value, likes, retweets, replies };
		});
		return {
			statusCode: 200,
			body: JSON.stringify(marketData),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: "Error reading market data",
		};
	}
};
