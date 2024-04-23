const Order = require('../models/Order');
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors')
const {checkPermissions} = require('../Utils')

const fakeStripeAPI = async ({amount,currency}) => {
    const client_secret = 'someRandomValue';
    return {client_secret,amount}
} 
const createOrder = async (req,res) => {
    const {items:cartItems,tax,shippingFee} = req.body;

    if(!cartItems && cartItems.length<1){
        throw new CustomErrors.BadRequestError('No items found in the cart')
    }

    if(!tax && !shippingFee){
        throw new CustomErrors.BadRequestError('Please provide Tex & Shipping fee')
    }

    let orderItems = []
    let subtotal = 0

    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id:item.product})
        if(!dbProduct){
            throw new CustomErrors.NotFoundError(`No product fount with id : ${item.product}`)
        }
        const {name,price,image,_id} = dbProduct
        const singleOrderItem = {
            amount : item.amount,
            name,
            price,
            image,
            product : _id
        };

        //add Items to the Order items
        orderItems = [...orderItems,singleOrderItem]
    
        //Calculate subtotal where amount is quantity
        subtotal += item.amount * price;
    }
    //Calculate Total
    total = tax + shippingFee + subtotal;
    //get Client Secret
    const paymentIntent = await fakeStripeAPI({
        amount : total,
        currency : 'usd'
    }) 

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret : paymentIntent.client_secret,
        user : req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret})
}

const getAllOrders = async (req,res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders,count:orders.length})
}

const getSingleOrder = async (req,res) => {
    const {id:orderId} = req.params
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomErrors.NotFoundError(`No orders found with id : ${orderId}`)
    }
    checkPermissions(req.user,order.user)
    res.status(StatusCodes.OK).json({order})
}

const updateOrder = async (req,res) => {
    const {id:orderId} = req.params;
    const {paymentIntentId} = req.body;
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomErrors.NotFoundError(`No orders found with id : ${orderId}`)
    }
    checkPermissions(req.user,order.user)
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid'

    await order.save();

    res.status(StatusCodes.OK).json({order})
}

const getCurrentUserOrders = async (req,res) => {
    const order = await Order.findOne({user:req.user.userId})
    res.status(StatusCodes.OK).json({order,count:order.length})
}

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder
}