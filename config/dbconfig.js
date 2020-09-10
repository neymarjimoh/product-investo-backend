const mongoose = require('mongoose');
const config = require('./index');

const mongoDbUrl = config[config.NODE_ENV].MONGODBURI;

module.exports = () => {
	mongoose.connect(mongoDbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	});

	mongoose.connection.on('connected', function () {
		console.log(
			`Mongoose connection to ${mongoDbUrl} is open... Database connected successfully!`
		);
	});

	mongoose.connection.on('error', function (error) {
		console.log(`Mongoose connection was not successful due to: ${error}`);
	});

	mongoose.connection.on('disconnected', function () {
		console.log('Mongoose default connection is disconnected');
	});
};
