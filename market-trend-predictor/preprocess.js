const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function preprocessMarketData(filePath) {
	return new Promise((resolve, reject) => {
		const data = [];
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => {
				row.date = new Date(row.date);
				row.open = parseFloat(row.open);
				row.high = parseFloat(row.high);
				row.low = parseFloat(row.low);
				row.close = parseFloat(row.close);
				row.volume = parseInt(row.volume, 10);
				data.push(row);
			})
			.on("end", () => {
				resolve(data);
			})
			.on("error", (err) => {
				reject(err);
			});
	});
}

function calculateDailyReturns(data) {
	for (let i = 1; i < data.length; i++) {
		data[i].return = (data[i].close - data[i - 1].close) / data[i - 1].close;
	}
	data.shift(); // Remove the first entry which doesn't have a return value
	return data;
}

function calculateRollingAverages(data, windowSize) {
	const rollingAverages = [];
	for (let i = 0; i < data.length; i++) {
		if (i >= windowSize - 1) {
			const windowData = data.slice(i - windowSize + 1, i + 1);
			const average =
				windowData.reduce((sum, row) => sum + row.close, 0) / windowSize;
			rollingAverages.push(average);
		} else {
			rollingAverages.push(null); // Not enough data points to calculate the average
		}
	}
	return rollingAverages;
}

module.exports = {
	preprocessMarketData,
	calculateDailyReturns,
	calculateRollingAverages,
};
