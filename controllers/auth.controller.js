require('dotenv').config();
const statusCode = require('http-status');
const gravatar = require('gravatar');
const authHelper = require('../helpers/authHelper');
const ErrorHelper = require('../helpers/errorHelper');
const { User, Profile, BlackListedToken } = require('../models');
const sendMail = require('../utils/sendMail');
const config = require('../config/index');

const register = async (req, res, next) => {
    const { 
        email, 
        password, 
        lastName,
        firstName,
        role, 
        userType,
        investorType, 
    } = req.body;
    let err;
    try {
        const genericWordsArray = ['password', 'Password', 123, firstName, lastName];
        const genericWord = genericWordsArray.find(word => password.includes(word));
        if (genericWord) {
            err = new ErrorHelper(400, '400 Error', 'Do not use a common word as passwords for security reasons.');
            return next(err, req, res, next);
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            err = new ErrorHelper(409, "conflict", "User already exists");
            return next(err, req, res, next);
        }
        const hashedPassword = authHelper.hashPassword(password);
        const user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            userType,
            investorType,
        });
        const savedUser = await user.save();
        const generatedToken = authHelper.generateToken({ userId: savedUser._id }, '1d');
        const verifyUrl = `http:\/\/${req.headers.host}\/api\/v1\/auth\/verify?s=${generatedToken}`;
        if (process.env.NODE_ENV !== 'test') {
            sendMail(
                'no-reply@product-investo.com',
                savedUser.email, 
                'Product-Investo Registration',
                `
                    <h2 style="display: flex; align-items: center;">Welcome to Product-Investo</h2>
                    <p>Hello ${lastName} ${firstName}, </p>
                    <p>You can verify your account using this <a href=${verifyUrl}>link</a></p>
                    <br>
                    <br>
                    <p>Best Regards, <b><span style="color: red;">Product-Investo</span></b>Team</p>
                `
            );
        }
        const avatarImage = gravatar.url(email, {
            s: '200', 
            f: 'y', 
            d: 'mm',
        });
        console.log("77777777");
        const userProfile = new Profile({
            userId: savedUser._id,
            image: req.file ? req.file.path : avatarImage,
            lastName: savedUser.lastName,
            firstName: savedUser.firstName,
        });
        const savedProfile = await userProfile.save();
        console.log(savedProfile);
        return res.status(statusCode.CREATED).json({
            message: 'Account registration was successful. Please check your mail to verify your account',
        });
    } catch (error) {
		console.log(`Error from user registration >>> ${error}`);
		return next(error);
    }
};

const activateAccount = async (req, res, next) => {
    const { s } = req.query;
    let err;
    try {
        const  { userId } = authHelper.verifyToken(s);
        const user = await User.findOneAndUpdate(
            { _id: userId }, 
            { isVerified: true }, 
            { new: true }
        );
        if (!user) {
            err = new ErrorHelper(404, "not found", "Invalid verification link");
            return next(err, req, res, next);
        }
        if (user.isVerified) {
            err = new ErrorHelper(412, "conflict", "This account has already been verified.");
            return next(err, req, res, next);
        }
        return res.status(statusCode.OK).json({
            message: 'User account has been verified successfully. You can login.'
        });
    } catch (error) {
        console.log('Error from user verification >>>> ', error);
        return next(error);
    }
};

const resendVerifyUrl = async (req, res, next) => {
    const { email } = req.body;
    let err;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            err = new ErrorHelper(404, "not found", "User doesn\'t exist. Ensure you enter the right credentials");
            return next(err, req, res, next);
        }
        if (user.isVerified) {
            err = new ErrorHelper(statusCode.UNAUTHORIZED, "conflict", "Your account has been verified already.");
            return next(err, req, res, next);
        }
        const generatedToken = authHelper.generateToken({ userId: user._id }, '1d');
        const resendUrl = `http:\/\/${req.headers.host}\/api\/v1\/auth\/verify?s=${generatedToken}`;
        const { firstName, lastName } = user;
        if (process.env.NODE_ENV !== 'test') {
            sendMail(
                'no-reply@product-investo.com',
                user.email, 
                'Product-Investo Verification',
                `
                    <h2 style="display: flex; align-items: center;">Welcome to Product-Investo</h2>
                    <p>Hello ${lastName} ${firstName}, </p>
                    <p>Thank you for registering on <b><span style="color: red;">Product-Investo</span></b>.</p>
                    <p>You can verify your account using this <a href=${resendUrl}>link</a></p>
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
            message: 'Please check your mail to verify your account',
        });
    } catch (error) {
        console.log('Error from requesting for a new verification link >>>> ', error);
        return next(error);
    }
};


const login = async (req, res, next) => {
    let err;
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            err = new ErrorHelper(404, "not found", "Ensure you enter the right credentials");
            return next(err, req, res, next);
        }
        if (!user.isVerified) {
            err = new ErrorHelper(statusCode.UNAUTHORIZED, "fail", "You have to verify your account");
            return next(err, req, res, next);
        }
        if (user.status === 'inactive') {
            err = new ErrorHelper(403, "failed", "You Have been deactivated, Please contact an admin");
            return next(err, req, res, next);
        }
        const isValid = authHelper.comparePassword(password, user.password);
        if (!isValid) {
            err = new ErrorHelper(statusCode.FORBIDDEN, "failed", "Ensure you enter the right credentials");
            return next(err, req, res, next);
        }
        const token = authHelper.generateToken({ userId: user._id }, '1d');
        return res.status(statusCode.OK).json({
            message: "User signed in successfully",
            user,
            token,
        });
    } catch (error) {
        console.log('Error from user sign in >>>> ', error);
        return next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { authorization } = req.headers, { _id } = req.user;
        let token = authorization;
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        await BlackListedToken.create({
            token, 
            userId: _id, 
        });
        console.log(token);
        return res.status(200).json({
            message: 'Successfully logged out', 
        });
    } catch (err) {
        console.log('Error from user sign out >>>> ', err);
        return next(err);
    }
};

const forgotPassword = async (req, res, next) => {
    let err;
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
		if (!user || !user.isVerified) {
            err = new ErrorHelper(404, "failed", "The email that you provided is not registered or has not been activated");
            return next(err, req, res, next);
		}
        const token = authHelper.generateToken({ userId: user._id }, '1d');
        const resetUrl = `http:\/\/${req.headers.host}\/api\/v1\/auth\/reset-password?token=${token}`;
        if (process.env.NODE_ENV !== 'test') {
            sendMail(
                'no-reply@product-investo.com',
                user.email,
                'PASSWORD RESET',
                `   
                    <p>Hello ${user.lastName} ${user.firstName} , </p>
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
            message: `A password reset link has been sent to ${user.email}`,
        });
    } catch (error) {
        console.log('Error from user forget password >>>> ', error);
        return next(error);
    }
};

const resetPassword = async (req, res, next) => {
    let err;
    try {
        const { token } = req.query;
        const { password, confirmPassword } = req.body;
        const genericWordsArray = ['Password123', 'Qwerty123', 'Password', 123];
        const genericWord = genericWordsArray.find(word => password.includes(word));
        if (genericWord) {
            err = new ErrorHelper(422, "failed", "Do not use a common word as the password");
            return next(err, req, res, next);
        }
        if (password !== confirmPassword) {
            err = new ErrorHelper(422, "failed", "Password doesn\'t match, Please check you are entering the right thing!");
            return next(err, req, res, next);
        }
        const { userId } = authHelper.verifyToken(token);
        const hashedPassword = authHelper.hashPassword(password);
		const user = await User.findOneAndUpdate(
			{ _id: userId },
			{ $set: { password: hashedPassword } }
		);
        if (!user) {
            err = new ErrorHelper(404, "failed", "Password reset token is invalid or has expired.");
            return next(err, req, res, next);
        }
        if (process.env.NODE_ENV !== 'test') {
            sendMail(
                'no-reply@product-investo.com',
                user.email,
                'PASSWORD RESET SUCCESSFUL',
                `   
                    <p>Hello ${user.lastName} ${user.firstName}, </p>
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
            status: `${statusCode.OK} Success`,
            message: 'Password updated successfully. You may login',
        });        
    } catch (error) {
        console.log('Error from user reset password >>>> ', error);
        return next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        let err;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const { password, _id } = req.user;
        const isPasswordMatched = authHelper.comparePassword(
			oldPassword,
			password
        );
        if (!isPasswordMatched) {
            err = new ErrorHelper(401, "failed", "Ensure you enter the right credentials");
            return next(err, req, res, next);
        }
		const hashedPassword = authHelper.hashPassword(newPassword);
		const user = await User.findOneAndUpdate(
			{ _id },
			{ $set: { password: hashedPassword } }
        );
        if (!user) {
            err = new ErrorHelper(404, "not found", "User does not exist");
            return next(err, req, res, next);
		}
        return res.status(statusCode.OK).json({
            message: 'Password update was successful',
            data: user,
        });
    } catch (error) {
        console.log('Error from changing user password >>>> ', error);
        return next(error);
    }
};

module.exports = {
    register,
    activateAccount,
    login,
    logout,
    resetPassword,
    changePassword,
    forgotPassword,
    resendVerifyUrl,
};
