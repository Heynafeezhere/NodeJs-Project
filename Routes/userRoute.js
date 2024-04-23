const express = require('express')
const router = express.Router();
const {authenticateUser,authorizationPermission} = require('../middleware/authentication')

const {
    getAllUsers,
    getSingleUser,
    ShowCurrentUser,
    updateUser,
    updateUserPassword
} = require('../Controllers/userController')

router.route('/').get(authenticateUser,authorizationPermission('admin','owner'),getAllUsers);

router.route('/showMe').get(authenticateUser,ShowCurrentUser);
router.route('/updateUser').patch(authenticateUser,updateUser);
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword);

router.route('/:id').get(authenticateUser,getSingleUser);


module.exports = router;