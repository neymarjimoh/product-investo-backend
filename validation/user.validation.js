const { body, check, param, validationResult } = require('express-validator');
const userProfileUpdate = () => {
	return [
		check('email')
			.isEmpty()
            .withMessage('Email can\'t be updated. Try registering with another email'),
		check('password')
            .isEmpty()
            .withMessage('You have to request for change of password')
			.isLength({ max: 0 })
			.withMessage('Password can\'t be updated from here'),
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
