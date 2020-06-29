const { body, validationResult } = require('express-validator');
const userSignUpValidationRules = () => {
	return [
		body('fullName')
			.isLength({ min: 8, max: 50 })
			.withMessage('Full name must be at least 8 characters long'),
		body('email')
			.not()
			.isEmpty()
			// .isEmail()
			.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
			.withMessage('Enter a valid email'),
			// .normalizeEmail(),
		body('password')
			.not()
			.isEmpty()
			.isLength({ min: 8 })
			.withMessage('Password must have at least 8 characters'),
		body('phoneNumber')
			.not()
			.isEmpty()
			// .isLength({ min: 8, max: 18 })
			// .matches(/^[+-\d]+$/)
			.withMessage('Mobile Number must be a valid phone number'),
	];
};
const userSignInValidationRules = () => {
	return [
		body('email')
			.not()
			.isEmpty()
			.isEmail()
			.withMessage('Enter a valid email')
			.normalizeEmail(),
		body('password')
			.not()
			.isEmpty()
			.isLength({ min: 8 })
			.withMessage('Password must have at least 8 characters'),
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
	userSignUpValidationRules,
	userSignInValidationRules,
	validate,
};
