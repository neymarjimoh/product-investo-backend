const routes = require('../constants/routesGroup');
const jwt = require('jsonwebtoken');
const config = require('../config');

// middleware to authenticate users accessing secure routes 
module.exports = (req, res, next) => {
    if (!routes.secureRoutes.includes(req.path)) {
        return next();
    } else {

        if (!req.headers.authorization) {
            return res.status(412).json({
                error: true,
                message: 'Access denied!! Missing authorization credentials'
            });
        }

        let token = req.headers.authorization;

        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            console.log("Error from user authentication >>>>> ", error);
			return res.status(401).json({
				message: 'You must be logged in..'
			});
        }
    }
};