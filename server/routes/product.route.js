const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const productController = require('../controllers/product.controller');
const authenticateAdmin = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', 
  authenticateAdmin,
  isAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Home', 'Sports', 'Other']),
    body('imageUrl').optional().isURL().withMessage('Invalid image URL')
  ], 
  validate, 
  productController.createProduct
);

router.put('/:id', 
  authenticateAdmin,
  isAdmin,
  productController.updateProduct
);

router.delete('/:id', 
  authenticateAdmin,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;