const { body, validationResult } = require('express-validator');
const userSignUpValidationRules = () => {
	return [
		body('email')
			.notEmpty()
			.withMessage('Email is required')
			.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
			.withMessage('Enter a valid email'),
		body('firstName')
			.notEmpty()
			.withMessage('First name is required')
			.trim()
			.isLength({ min: 3, max: 15 })
			.withMessage('First name must be between 3 to 15 characters')
			.matches((/^[a-z]{1,}[\s]{0,1}[-']{0,1}[a-z]+$/i))
			.withMessage('First name can only contain letters'),
		body('lastName')
			.notEmpty()
			.withMessage('Last name is required')
			.trim()
			.isLength({ min: 3, max: 15 })
			.withMessage('Last name must be between 3 to 15 characters')
			.matches((/^[a-z]{1,}[\s]{0,1}[-']{0,1}[a-z]+$/i))
			.withMessage('Last name can only contain letters'),
		body('password')
			.notEmpty()
			.withMessage('Password is required')
			// .not()
			// .matches(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/)
			// .withMessage('Password invalid.') tried this since negating regex works better
			.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, 'i')
			.withMessage('Password must contain at least one uppercase letter, one lowercase letter and one numeric digit')
			.trim()
			.isLength({ min: 8 })
			.withMessage('Password must have at least 8 characters'),
		body('confirmPassword', 'Passwords do not match')
			.exists()
			.custom((value, { req }) => value === req.body.password),
		body('userType')
			.notEmpty()
			.withMessage('Specify the type of user you are registering as')
			.isIn(['entrepreneur', 'investor']),
		body('investorType')
			.if(body('userType').exists().equals('investor'))
			.notEmpty().isIn([ 'small-scale', 'medium-scale', 'large-scale']),
	];
};
const userSignInValidationRules = () => {
	return [
		body('email')
			.notEmpty()
			.isEmail()
			.withMessage('Enter a valid email')
			.normalizeEmail(),
		body('password')
			.notEmpty()
			.isLength({ min: 8 })
			.withMessage('Password must have at least 8 characters'),
	];
};

const userEmailRules = () => {
	return [
		body('email')
			.notEmpty()
			.isEmail()
			.withMessage('Enter a valid email address'),
	];
};

const resetPasswordRules = () => {
	return [
		body('password')
			.notEmpty()
			.withMessage('Password is required')
			.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, 'i')
			.withMessage('Password must contain at least one uppercase letter, one lowercase letter and one numeric digit')
			.trim()
			.isLength({ min: 8 })
			.withMessage('Password must have at least 8 characters'),
	];
};

const changePasswordRules = () => {
	return [
		body('oldPassword')
			.if(body('newPassword').exists())
			.notEmpty()
			.custom((value, { req }) => value !== req.body.newPassword),
		body('newPassword')
			.notEmpty()
			.withMessage('A new password is required')
			.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, 'i')
			.withMessage('Password must contain at least one uppercase letter, one lowercase letter and one numeric digit')
			.trim()
			.isLength({ min: 8 })
			.withMessage('Password must have at least 8 characters'),
		body("confirmPassword", "passwords do not match")
			.exists()
			.custom((val, { req }) => val === req.body.newPassword),
	]
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
	userEmailRules,
	changePasswordRules,
	resetPasswordRules,
	validate,
};
