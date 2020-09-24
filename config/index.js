require('dotenv').config();
module.exports = {
	PORT: process.env.PORT,
	EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	JWT_SECRET: process.env.JWT_SECRET,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
	FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
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
