const Product = require('../models/Product');
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors')
const path = require('path')

const createProduct = async (req,res)=>{
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product})
}

const getAllProducts = async (req,res)=>{
    const products = await Product.find({})

    if(!products) throw new CustomErrors.NotFoundError('No products found!')

    res.status(StatusCodes.OK).json({products})
}

const getSingleProduct = async (req,res)=>{
    const {id:productId} = req.params;

    const product = await Product.findOne({_id:productId}).populate('review')

    if(!product) throw new CustomErrors.NotFoundError(`No product found with id : ${productId}`)

    res.status(StatusCodes.OK).json({product})
}

const updateProduct = async (req,res)=>{
    const {id:productId} = req.params;

    const product = await Product.findOneAndUpdate({_id:productId},req.body,{new:true,runValidators:true})

    if(!product) throw new CustomErrors.NotFoundError(`No product found with id : ${productId}`)

    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async (req,res)=>{
    const {id:productId} = req.params;

    const product = await Product.findOne({productId})

    if(!product) throw new CustomErrors.NotFoundError(`No product found with id : ${productId}`)

    await product.remove();

    res.status(StatusCodes.OK).json({msg:'Product removed successfully'})
}

const uploadImage = async (req,res)=>{
    if(!req.files){
        throw new CustomErrors.BadRequestError('No files found')
    }

    const productImage = req.files.image;

    if(!productImage.mimetype.startsWith('image')) throw new CustomErrors.BadRequestError('please upload image file')

    const maxSize = 1024 * 1024;

    if(productImage.size>maxSize) throw new CustomErrors.BadRequestError('Please upload image size lesser than 1 MB')

    const imagePath = path.join(__dirname,'../public/uploads/' + `${productImage.name}`);

    await productImage.mv(imagePath)

    res.status(StatusCodes.OK).json({image : `/uploads/${productImage.name}`})
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}
