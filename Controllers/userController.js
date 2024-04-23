const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors');
const { createTokenUser, attachCookiesToResponse,checkPermissions } = require('../Utils');

const getAllUsers = async (req,res) => {
    const users = await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
}
const getSingleUser = async (req,res) => {
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new CustomErrors.NotFoundError(`No user with id : ${req.params.id}`)
    }
    checkPermissions(req.user,user._id)
    res.status(StatusCodes.OK).json({user})
}
const ShowCurrentUser = async (req,res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}
//Update user with User.save()

const updateUser = async (req,res) => {
    const {email,name} = req.body;
    if(!email || !name){
        throw new CustomErrors.BadRequestError('Please provide both name & email')
    }
    
    const user = await User.findOne({_id:req.user.userId})


   user.email = email;
   user.name = name;

   user.save();

    const tokenUser = createTokenUser(user);

    attachCookiesToResponse({res,user:tokenUser});

    res.status(StatusCodes.OK).json({user : tokenUser})
}
const updateUserPassword = async (req,res) => {
    const {oldPassword,newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new CustomErrors.BadRequestError('Please enter Both values');
    }

    const user = await User.findOne({_id:req.user.userId});

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomErrors.UnauthenticatedError('Invalid Credentials');
    }

    user.password = newPassword;

    await user.save();

    res.status(StatusCodes.OK).json({msg:'Password Updated Successfully!'})
}

module.exports = {
    getAllUsers,
    getSingleUser,
    ShowCurrentUser,
    updateUser,
    updateUserPassword
}


//UpdateUser with User.findOneanUpdate 

//const updateUser = async (req,res) => {
    //     const {email,name} = req.body;
    //     if(!email || !name){
    //         throw new CustomErrors.BadRequestError('Please provide both name & email')
    //     }
        
    //     const user = await User.findOneAndUpdate(
    //         {_id:req.user.userId},
    //         {email,name},
    //         {new:true,runValidators:true}
    //         )
    //     const tokenUser = createTokenUser(user);
    
    //     attachCookiesToResponse({res,user:tokenUser});
    
    //     res.status(StatusCodes.OK).json({user : tokenUser})
    // }