require('dotenv').config();
module.exports = {
	PORT: process.env.PORT,
	EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	JWT_SECRET: process.env.JWT_SECRET,
	NODE_ENV: process.env.NODE_ENV || 'development',
	development: {
		MONGODBURI: process.env.MONGOURI,
	},
	production: {
		MONGODBURI: process.env.MONGOURI,
	},
	test: {
		MONGODBURI: process.env.TEST_MONGO_DBURI,
	},
};
