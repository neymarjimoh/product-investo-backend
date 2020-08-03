require('dotenv').config();
const { User } = require('../models');
const statusCode = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');
const sendMail = require('../utils/sendMail');
const config = require('../config/index');

exports.register = async (req, res) => {
    const { email, password, phoneNumber, fullName } = req.body;
    const image = req.file && req.file.path;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(statusCode.CONFLICT).json({
                message: 'User already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const generatedToken = cryptoRandomString({length: 15, type: 'url-safe'});
        const user = new User({
            email,
            password: hashedPassword,
            phoneNumber,
            fullName,
            image,
            verificationToken: generatedToken,
        });
        const savedUser = await user.save();
        const verifyUrl = `http://${req.headers.host}/api/v1/auth/verify-account/${savedUser.email}-${generatedToken}`;
        if (process.env.NODE_ENV !== 'test'){
            sendMail(
                'no-reply@product-investo.com',
                savedUser.email, 
                'Product-Investo Registration',
                `
                    <h2 style="display: flex; align-items: center;">Welcome to Product-Investo</h2>
                    <p>Hello ${savedUser.email}, </p>
                    <p>Thank you for registering on <b><span style="color: red;">Product-Investo</span></b>.</p>
                    <p>You can verify your account using this <a href=${verifyUrl}>link</a></p>
                    <br>
                    <p>For more enquiries, contact us via this <a href="mailto: ${config.EMAIL_ADDRESS}">account</a></p>
                    <p>You can call us on <b>+1234568000</b></p>
                    <br>
                    <br>
                    <p>Best Regards, <b><span style="color: red;">Product-Investo</span></b>Team</p>
                `
            );   
        }
        return res.status(statusCode.CREATED).json({
            message: 'Account registration was successful. Please check your mail to verify your account',
        });
    } catch (error) {
        console.log('Error from user sign up >>>> ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.activateAccount = async (req, res) => {
    const { email, token } = req.params;
    try {
        const user = await User.findOneAndUpdate(
            { 
                email, 
                verificationToken: token 
            }, 
            { 
                isVerified: true, 
                verificationToken: null 
            }, 
            { 
                new: true 
            }
        );
        if (!user) {
			return res.status(statusCode.NOT_FOUND).json({
				message: `Account ${email} doesn't exist . or ensure you enter the right url`,
			});
        }
        return res.status(statusCode.OK).json({
            message: 'User account has been verified successfully. You can login.'
        });
        // user.isVerified = true;
        // user.verificationToken = null;
        // const updatedUser = await user.save();
        // console.log(updatedUser);
    } catch (error) {
        console.log('Error from user verification >>>> ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.login = async (req, res) => {
    let token;
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: 'Ensure you enter the right credentials'
            });
        }
        if (!user.isVerified) {
            return res.status(statusCode.UNAUTHORIZED).json({
                status: `${statusCode.UNAUTHORIZED} Error`,
                message: 'You have to verify your account'
            });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(statusCode.FORBIDDEN).json({
                message: 'Ensure you enter the right credentials',
            });
        }
        if (process.env.NODE_ENV === 'test') {
            token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id,
                    role: user.role,
                },
                "token-secret",
                {
                    expiresIn: '1d'
                }
            );
    
        } else {
            token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id,
                    role: user.role,
                },
                config.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            );    
        }
        return res.status(statusCode.OK).json({
            status: `${statusCode.OK} Success`,
            message: "User signed in successfully",
            user,
            token
        });
    } catch (error) {
        console.log('Error from user sign in >>>> ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const buffer = crypto.randomBytes(32);
        const token = buffer.toString();
        const expirationTime = Date.now() + 3600000; // 1 hour
        const user = await User.findOneAndUpdate(
            {
                email
            },
            {
                resetToken: token,
                expireToken: expirationTime
            },
            {
                new: true
            }
        );
        if (!user){
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: `Sorry an Account with Email: ${email} doesn't exist`
            });
        }
        const resetUrl = `http://${req.headers.host}/api/v1/auth/reset-password/${token}`;
        if (process.env.NODE_ENV !== 'test') {
            sendMail(
                'no-reply@product-investo.com',
                user.email,
                'PASSWORD RESET',
                `   
                    <p>Hello ${user.fullName}, </p>
                    <p>There was a request to reset your password</p>
                    <p>Please click on the button below to get a new password</p>
                    <a href='${resetUrl}'><button>Reset Password</button></a>
                    <br>
                    <p>If you did not make this request, just ignore this mail as nothing has changed.</p>
                    <br>
                    <p>For more enquiries, contact us via this <a href="mailto: ${config.EMAIL_ADDRESS}">account</a></p>
                    <p>You can call us on <b>+1234568000</b></p>
                    <br>
                    <br>
                    <p>Best Regards, <b><span style="color: red;">Product-Investo</span></b>Team</p>
                `
            );   
        }
        return res.status(statusCode.OK).json({
            status: `${statusCode.OK} Success`,
            message: `A password reset link has been sent to ${user.email}`
        });
    } catch (error) {
        console.log('Error from user forget password >>>> ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedPw = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            { 
                resetToken: token, 
                expireToken: { 
                    $gt: Date.now() 
                }
            },
            {
                password: hashedPw,
                expireToken: null,
                resetToken: null
            },
            {
                new: true
            }
        );
        if (!user) {
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: 'Password reset token is invalid or has expired.'
            });
        }
        if (process.env.NODE_ENV !== "test") {
            sendMail(
                'no-reply@product-investo.com',
                user.email,
                'PASSWORD RESET SUCCESSFUL',
                `   
                    <p>Hello ${user.fullName}, </p>
                    <p>Your request to update your password was successful</p>
                    <br>
                    <p>If you did not make this request, contact us via this <a href="mailto: ${config.EMAIL_ADDRESS}">account</a></p>
                    <p>You can call us on <b>+1234568000</b></p>
                    <br>
                    <br>
                    <p>Best Regards, <b><span style="color: red;">Product-Investo</span></b>Team</p>
                `
            );    
        }
        return res.status(statusCode.OK).json({
            ststus: `${statusCode.OK} Success`,
            message: 'Password updated successfully. You may login'
        });
        // user.resetToken = null;
        // user.expireToken = null;
        // user.password = hashedPw;
        // const savedUser = await user.save();
        
    } catch (error) {
        console.log('Error from user reset password >>>> ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Please Try again.',
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { email, userId } = req.user;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(statusCode.UNAUTHORIZED).json({
                message: 'Make sure you\'re logged in'
            });
        }
        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatched) {
            return res.status(statusCode.NOT_ACCEPTABLE).json({
                message: 'Ensure you enter the right credentials'
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        const updatedUser = await user.save();
        return res.status(statusCode.OK).json({
            message: 'Password update was successful',
            data: updatedUser
        });
    } catch (error) {
        console.log('Error from changing user password >>>> ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Please Try again.',
        });
    }
};