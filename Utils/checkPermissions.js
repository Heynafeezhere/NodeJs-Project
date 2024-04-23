const CustomErrors = require('../errors')

const checkPermissions = (reqestUser,resourceUserId) => {
    if(reqestUser.role === 'admin') return;
    if(reqestUser.userId === resourceUserId.toString()) return;
    throw new CustomErrors.UnAuthorizedError('Not authorized to access this route') 
} 

module.exports = checkPermissions;