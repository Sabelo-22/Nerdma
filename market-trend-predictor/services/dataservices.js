const axios = require("axios");
const cheerio = require("cheerio");

const fetchTwitterData = async (query) => {
	// Use Twitter API to fetch data
	// Replace `TWITTER_API_URL` and `BEARER_TOKEN` with actual values
	const response = await axios.get(`TWITTER_API_URL`, {
		headers: { Authorization: `Bearer BEARER_TOKEN` },
		params: { query },
	});
	return response.data;
};

const fetchNewsData = async () => {
	const response = await axios.get("NEWS_RSS_FEED_URL");
	const $ = cheerio.load(response.data);
	let newsData = [];
	$("item").each((index, element) => {
		newsData.push({
			title: $(element).find("title").text(),
			link: $(element).find("link").text(),
			description: $(element).find("description").text(),
		});
	});
	return newsData;
};

module.exports = { fetchTwitterData, fetchNewsData };
