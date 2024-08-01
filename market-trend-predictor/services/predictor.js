const tf = require("@tensorflow/tfjs-node");

const trainModel = async (trainingData, trainingLabels) => {
	const model = tf.sequential();
	model.add(
		tf.layers.dense({
			units: 10,
			activation: "relu",
			inputShape: [trainingData[0].length],
		})
	);
	model.add(tf.layers.dense({ units: 1, activation: "linear" }));

	model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

	const xs = tf.tensor2d(trainingData);
	const ys = tf.tensor2d(trainingLabels, [trainingLabels.length, 1]);

	await model.fit(xs, ys, { epochs: 50 });

	return model;
};

const predict = (model, inputData) => {
	const xs = tf.tensor2d([inputData]);
	const prediction = model.predict(xs);
	return prediction.dataSync();
};

module.exports = { trainModel, predict };
