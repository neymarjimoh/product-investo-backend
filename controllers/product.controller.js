const { Product, User } = require('../models');
const ErrorHelper = require('../helpers/errorHelper');

const createProduct = async (req, res, next) => {
    let err;
    const { name, description, tags, profitGenerated, amountNeeded, dateCreated, status } = req.body;
    const { _id, userType } = req.user;
    if (userType !== 'entrepreneur') {
        err = new ErrorHelper(403, 'failed', 'You are not eligible to have or add products');
        return next(err, req, res, next);
    }
    try {
        const product = new Product({
            name,
            description,
            tags,
            profitGenerated,
            amountNeeded,
            dateCreated,
            status,
            productOwner: _id,
        });
        const savedProduct = await product.save();
        const foundUser = await User.findByIdAndUpdate(
            _id,
            {
                $push: {
                    products: savedProduct._id,
                },
            },
            {
                new: true,
            }
        );
        if (!foundUser) {
            err = new ErrorHelper(400, '400 Error', 'Unable to update User with the new product');
            return next(err, req, res, next);
        }
        console.log('added product to user array', foundUser._id);
        return res.status(201).json({
            message: 'Product added successfully',
            data: savedProduct,
        });
    } catch (error) {
        console.log('Error from adding product >>>> \n', error);
        return next(error);
    }
};

const updateProduct = async (req, res, next) => {
    const { _id, role } = req.user, { productId } = req.params;
    let err;
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { ...req.body },
            { new: true }
        );
        if (!product) {
            err = new ErrorHelper(404, 'not found', 'Product not found or has been deleted.');
            return next(err, req, res, next);
        }
        if (product.productOwner !== _id || role !== 'ADMIN') {
            err = new ErrorHelper(403, '401 Error', 'You have no write access to this product');
            return next(err, req, res, next);
        }
        if (Object.keys(req.body).length === 0 ) {
            err = new ErrorHelper(422, '422 Error', 'No changes/updates made yet.');
            return next(err, req, res, next);
        } 
        return res.status(200).json({
            status: '200 OK',
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        console.log('Error from updating product >>>> \n', error);
        return next(error);
    }
};

//  other codes here
module.exports = {
    createProduct,
    updateProduct,
};