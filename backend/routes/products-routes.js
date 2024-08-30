const express = require('express');
const { check } = require('express-validator');

const productsControllers = require('../controllers/products-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// Route to get a product by its ID
router.get('/:pid', productsControllers.getProductById);

// Route to get products by user ID
router.get('/user/:uid', productsControllers.getProductsByUserId);

// Route to filter products based on location and price range
router.get('/', productsControllers.getFilteredProducts);

// Middleware for authentication
router.use(checkAuth);

// Route to create a new product
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('quantity').not().isEmpty(),
    check('unit').not().isEmpty(),
    check('price').not().isEmpty(),
    check('category').not().isEmpty()
  ],
  productsControllers.createProduct
);

// Route to update a product by its ID
router.patch(
  '/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  productsControllers.updateProduct
);

// Route to delete a product by its ID
router.delete('/:pid', productsControllers.deleteProduct);

module.exports = router;
