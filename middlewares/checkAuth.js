require('dotenv').config();
const routes = require('../constants/routesGroup');
const authHelper = require('../helpers/authHelper');
const ErrorHelper = require('../helpers/errorHelper');
const { User, BlackListedToken } = require('../models');

const checkAuth = async (req, res, next) => {
    let err;
    if (
        routes.secureRoutes.includes(req.path) &&
        !routes.unsecureRoutes.includes(req.path)
    ) {
        if (!req.headers.authorization) {
            err = new ErrorHelper(412, 'Fail', 'Access denied!! Missing authorization credentials');
            return next(err, req, res, next);
        }
        let token = req.headers.authorization;
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        try {
            const blackListedToken = await BlackListedToken.findOne({ token });
            if (blackListedToken) {
                err = new ErrorHelper(401, 'Fail', 'Invalid token provided, please sign in.');
                return next(err, req, res, next);
            }
            const decoded = authHelper.verifyToken(token);
            const user = await User.findById(decoded.userId);
            if (!user) {
                err = new ErrorHelper(401, 'Fail', 'You are not authorized to access this route.');
                return next(err, req, res, next);
            }
            req.user = user;
            return next();
        } catch (error) {
            console.log("Error from user authentication >>>>> ", error);
            if (error.name === 'TokenExpiredError') {
                err = new ErrorHelper(401, 'Fail', 'Token expired.');
                return next(err, req, res, next);
            }
            return next(error);
        }
    } else {
        return next();
    }
};

const verifyAdmin = async (req, res, next) => {

};

const verifySuperAdmin = async (req, res, next) => {

};

const verifiedUserOnly = async (req, res, next) => {
    let err;
    const { isVerified } = req.user;

    if (!isVerified) {
        err = new ErrorHelper(401, 'Fail', 'Your account has not been verified, please verify to continue');
        return next(err, req, res, next);
    }
    return next();
};

module.exports = {
    checkAuth,
    verifyAdmin,
    verifySuperAdmin,
    verifiedUserOnly,
};
