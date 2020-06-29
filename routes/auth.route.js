const express = require('express');
const authRouter = express.Router();

const {
    register,
    activateAccount,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
} = require('../controllers/auth.controller');

const {
    userSignUpValidationRules,
    userSignInValidationRules,
    validate,
} = require('../validation/auth.validation');

authRouter.post('/register', userSignUpValidationRules(), validate, register);
authRouter.patch('/verify-account/:email-:token', activateAccount);
authRouter.post('/login', userSignInValidationRules(), validate, login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);
authRouter.post('/change-password', changePassword);

module.exports = authRouter;
