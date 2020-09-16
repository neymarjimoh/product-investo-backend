require('dotenv').config();
const express = require('express');
const passport = require('passport');
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
const passportSetup = require('../config/passport-setup');
const authHelper = require('../helpers/authHelper');

authRouter.post('/register', userSignUpValidationRules(), validate, register);
authRouter.patch('/verify', activateAccount);
authRouter.post('/resend-verify', userEmailRules(), validate, resendVerifyUrl);
authRouter.post('/login', userSignInValidationRules(), validate, login);
authRouter.post('/logout', logout);
authRouter.post('/forgot-password', userEmailRules(), validate, forgotPassword);
authRouter.post('/forgot-password', userEmailRules(), validate, forgotPassword);
authRouter.patch('/reset-password', resetPasswordRules(), validate, resetPassword);
authRouter.patch('/change-password', changePasswordRules(), validate, changePassword);
//social login
authRouter.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ["profile", "email"],
        accessType: "offline",
        approvalPrompt: "force",
    })
);
authRouter.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = authHelper.generateToken({ userId: req.user._id }, '1d');
        return res.status(200).json({
            message: "User signed in successfully",
            token,
            user: req.user,
        });
    }
);
authRouter.get(
    '/facebook', 
    passport.authenticate('facebook',  {
        session: false, 
        scope: ['public_profile', 'email'],
    })
);
authRouter.get(
    '/facebook/callback',
    passport.authenticate('facebook', { 
        session: false, 
    }),
    (req, res) => {
        const token = authHelper.generateToken({ userId: req.user._id }, '1d');
        return res.status(200).json({
            message: "User signed in successfully",
            token,
            user: req.user,
        });
    }
);

module.exports = authRouter;
