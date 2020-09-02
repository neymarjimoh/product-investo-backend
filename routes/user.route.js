const router = require('express').Router();
const {
    updateProfile,
    getAllUsers,
    getSingleUser,
    deleteUser,
    searchUsersByName,
}= require('../controllers/user.controller');
const {
    userProfileUpdate,
    getUserById,
    validate
} = require('../validation/user.validation');
const { validateUserId } = require('../middlewares/validateMongooseId');

router.patch(
    '/profile/update/:userId', 
    validateUserId, 
    userProfileUpdate(), 
    validate, 
    updateProfile
);
router.get('/', getAllUsers);
router.get('/:userId', validateUserId, getSingleUser);
router.delete('/:userId', validateUserId, deleteUser);
router.get("/search/:name", searchUsersByName); 

// here
// view profile
// can reach out to an investor
// can search investors based on tags, interests, investortype etc (custom search)
module.exports = router;
