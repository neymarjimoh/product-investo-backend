const { body, check, param, validationResult } = require('express-validator');
const userProfileUpdate = () => {
	return [
		check('image')
			.optional(),
	  	check('bio')
			.optional()
			.not()
			.isInt()
			.withMessage('Bio is not a valid string, please input a valid string'),
	  	check('firstName')
			.optional()
			.isAlpha()
			.trim()
			.withMessage('FirstName is not a valid String, please input a valid string'),
	  	check('lastName')
			.optional()
			.isAlpha()
			.trim()
			.withMessage('LastName is not a valid string, please input a valid string'),
		check('address')
			.optional()
			.not()
			.isInt()
			.withMessage('Address is not a valid string, please input a valid string'),
		check('phoneNumber')
			.optional(),
	];
};

const getUserById = () => {
	return [
		param('userId', 'Ensure you enter a valid USER ID').isMongoId(),
	];
};

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	return res.status(422).json({
		errors: extractedErrors,
	});
};

module.exports = {
	userProfileUpdate,
	getUserById,
	validate,
};
