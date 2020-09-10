const { body, validationResult } = require('express-validator');
const productCreationRules = () => {
	return [
		body('name')
			.isLength({ min: 4, max: 50 })
			.withMessage('Product name must be at least 4 characters long'),
		body('description')
            .notEmpty()
            .isLength({ min: 12 })
			.withMessage('Enter a detailed description of the product'),
		body('tags')
            .notEmpty()
			.withMessage('Include tags to easily identify products'),
		body('amountNeeded')
            .notEmpty()
            .isFloat()
			.withMessage('Enter the amount needed for funding/investment in 0.00 format'),
		body('status')
			.notEmpty()
			.withMessage('Status of the product is required')
			.isIn(['profitting-already', 'not-profitting-already']),
		body('profitGenerated')
			.if(body('status').exists().equals('profitting-already'))
			.notEmpty().isNumeric()
			.withMessage('Make sure the profit generated is in the format 0.00'),
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
    productCreationRules,
	validate,
};
