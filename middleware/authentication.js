const CustomErrors = require('../errors')
const {isTokenValid} = require('../Utils')

const authenticateUser = async (req,res,next) => {
    const token = req.signedCookies.token;
    if(!token){
        throw new CustomErrors.UnauthenticatedError('No token Presented')
    }
    try {
        const {name,userId,role} = isTokenValid({token})
        req.user = {name,userId,role};
        next();
    } catch (error) {
        throw new CustomErrors.UnauthenticatedError('Authentication Invalid')   
    }
}

const authorizationPermission = (...roles) =>{
    return (req,res,next) => {
        if(!roles.includes( req.user.role)){
            throw new CustomErrors.UnAuthorizedError('User has no access to this route')
        }
        next();
    }
}

module.exports = {authenticateUser,authorizationPermission}