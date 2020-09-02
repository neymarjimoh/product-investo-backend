const express = require('express');
const productRouter = express.Router();
const {
    createProduct,
    updateProduct,
} = require('../controllers/product.controller');
const { 
    validate, 
    productCreationRules,
} = require('../validation/product.validation');
const { validateProfileId } = require('../middlewares/validateMongooseId');

// get all products
// get a product
// get products by creator
// delete product
// report product
// get products by tags
// get products by title/slug
// get a product investors

productRouter.post('/new', productCreationRules(), validate, createProduct);
productRouter.patch('/update/:productId', validateProfileId, updateProduct);
productRouter.delete('/:productId');
productRouter.get('/');
productRouter.get('/:productId');
productRouter.get('/:productId'); // get product by tag

module.exports = productRouter;
