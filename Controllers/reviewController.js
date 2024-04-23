const Review = require('../models/Review');
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors')
const {checkPermissions} = require('../Utils')

const createReview = async (req,res) =>{
   const {product:productId} = req.body;

   const isValidProduct = await Product.findOne({_id:productId});

   if(!isValidProduct){
      throw new CustomErrors.NotFoundError(`No Products fount with id : ${productId}`)
   } 

   const alreadySubmitted = await Review.findOne({user:req.user.userId, product:productId}) 
   
   req.body.user = req.user.userId

   const review = await Review.create(req.body);

   res.status(StatusCodes.CREATED).json({review})

}

const getAllReviews = async (req,res) =>{
    const reviews = await Review.find({}).populate({
      path:'product',
      select:'name price company'
    });

    if(!reviews){
      throw new CustomErrors.NotFoundError(`No reviews have created yet`)
    }

    res.status(StatusCodes.OK).json({reviews,count:reviews.length})
 }

 const getSingleReview = async (req,res) =>{
    const {id:reviewId} = req.params;

    const review = await Review.findOne({_id:reviewId});

    if(!review){
      throw new CustomErrors.NotFoundError(`No review found with id : ${reviewId}`)
    }

    res.status(StatusCodes.OK).json({review})
 }

 const updateReview = async (req,res) =>{
   const {id:reviewId} = req.params;

   const {title,rating,comment} = req.body;

   const review = await Review.findOne({_id:reviewId});

   if(!review){
      throw new CustomErrors.NotFoundError(`No review found with id : ${reviewId}`)
   }

   checkPermissions(req.user,review.user)

   review.title = title;
   review.rating = rating;
   review.comment = comment;

   await review.save();

   res.status(StatusCodes.OK).json({review})
 }

 const deleteReview = async (req,res) =>{
   const {id:reviewId} = req.params;

   const review = await Review.findOne({_id:reviewId})

   if(!review)
   {
      throw new CustomErrors.NotFoundError(`No review found with id : ${reviewId}`)
   }

   checkPermissions(req.user,review.user)

   await review.remove();
   
   res.status(StatusCodes.OK).json({msg: 'Item Successfully removed'})
 }

const getSingleProductReviews = async(req,res)=>{
   const {id:productId} = req.params

   const reviews = await Review.find({product:productId})

   res.status(StatusCodes.OK).json({reviews,count:reviews.length})
}
module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}