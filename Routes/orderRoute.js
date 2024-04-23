const express = require('express')
const router = express.Router();
const {authenticateUser,authorizationPermission} = require('../middleware/authentication')
const {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder
} = require("../Controllers/orderController")

router.route('/')
    .post(authenticateUser,createOrder)
    .get(authenticateUser,authorizationPermission('admin'),getAllOrders)

router.route('/showAllMyOrders')
    .get(authenticateUser,getCurrentUserOrders)

router.route('/:id')
    .get(authenticateUser,getSingleOrder)
    .patch(authenticateUser,updateOrder)

module.exports = router