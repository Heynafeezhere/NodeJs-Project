const express = require('express')
const router = express.Router();
const { authenticateUser, authorizationPermission } = require('../middleware/authentication')

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../Controllers/productController')

const {getSingleProductReviews} =require('../Controllers/reviewController')

router
    .route('/')
    .post([authenticateUser, authorizationPermission('admin')], createProduct)
    .get(getAllProducts);

router
    .route('/uploadImage')
    .post([authenticateUser, authorizationPermission('admin')], uploadImage)

router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizationPermission('admin')], updateProduct)
    .delete([authenticateUser, authorizationPermission('admin')], deleteProduct)

router
    .route('/:id/reviews')
    .get(getSingleProductReviews)

module.exports = router;