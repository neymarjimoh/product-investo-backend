const router = require('express').Router();
const userController = require('../controllers/user.controller');
const {
    userProfileUpdate,
    validate
} = require('../validation/user.validation');

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getSingleUser);
router.put('/:userId', userProfileUpdate(), validate, userController.updateProfile);
router.delete('/:userId', userController.deleteUser);
router.get("/search/:name", userController.searchUsers);

module.exports = router;