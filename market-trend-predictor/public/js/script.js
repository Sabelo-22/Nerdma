document
	.getElementById("sentiment-analysis-btn")
	.addEventListener("click", function () {
		document
			.getElementById("sentiment-analysis-section")
			.classList.remove("hidden");
		document.getElementById("market-data-section").classList.add("hidden");
	});

document
	.getElementById("market-data-btn")
	.addEventListener("click", function () {
		document
			.getElementById("sentiment-analysis-section")
			.classList.add("hidden");
		document.getElementById("market-data-section").classList.remove("hidden");
	});

const ctxSentiment = document.getElementById("sentimentChart").getContext("2d");
const sentimentChart = new Chart(ctxSentiment, {
	type: "bar",
	data: {
		labels: ["Positive", "Negative", "Neutral"],
		datasets: [
			{
				label: "Sentiment Count",
				data: [0, 0, 0], // Initial data
				backgroundColor: [
					"rgba(75, 192, 192, 0.2)",
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 205, 86, 0.2)",
				],
				borderColor: [
					"rgba(75, 192, 192, 1)",
					"rgba(255, 99, 132, 1)",
					"rgba(255, 205, 86, 1)",
				],
				borderWidth: 1,
			},
		],
	},
	options: {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	},
});

fetch("http://localhost:3000/analyze")
	.then((response) => response.json())
	.then((data) => {
		sentimentChart.data.datasets[0].data = [
			data.statistics.positive,
			data.statistics.negative,
			data.statistics.neutral,
		];
		sentimentChart.update();
	})
	.catch((error) => console.error("Error fetching data:", error));

const ctxMarket = document.getElementById("marketChart").getContext("2d");
const marketChart = new Chart(ctxMarket, {
	type: "line",
	data: {
		labels: [], // Add labels for market data
		datasets: [
			{
				label: "Market Data",
				data: [], // Add data for market data
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	},
	options: {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	},
});
