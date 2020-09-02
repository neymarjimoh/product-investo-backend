const express = require('express');
const authRouter = express.Router();
const {
    register,
    activateAccount,
    resendVerifyUrl,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
} = require('../controllers/auth.controller');

const {
    userSignUpValidationRules,
    userSignInValidationRules,
    userEmailRules,
    resetPasswordRules,
    changePasswordRules,
    validate,
} = require('../validation/auth.validation');

authRouter.post('/register', userSignUpValidationRules(), validate, register);
authRouter.patch('/verify', activateAccount);
authRouter.post('/resend-verify', userEmailRules(), validate, resendVerifyUrl);
authRouter.post('/login', userSignInValidationRules(), validate, login);
authRouter.post('/logout', logout);
authRouter.post('/forgot-password', userEmailRules(), validate, forgotPassword);
authRouter.patch('/reset-password', resetPasswordRules(), validate, resetPassword);
authRouter.patch('/change-password', changePasswordRules(), validate, changePassword);

module.exports = authRouter;
