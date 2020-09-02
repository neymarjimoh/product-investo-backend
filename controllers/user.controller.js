const statusCode = require('http-status');
const mongoose = require('mongoose');
const { User, Profile } = require('../models');
const ErrorHelper = require('../helpers/errorHelper');

exports.getAllUsers = async (req, res, next) => {
    try {
        let users, err;
        const { page = 1, limit = 10 } = req.query;
        const { role, userType } = req.user;
        if (role === 'USER' && userType == 'entrepreneur') {
            users = await User.find({ userType: 'investor'})
                .populate('investments', 'product product.name')
                .select('-password')
                .limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
        } else if (role === 'USER' && userType == 'investor') {
            users = await User.find({ userType: 'entrepreneur'})
                .populate('investors', 'fullName email investorType')
                .select('-password')
                .limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
        } else {
            //  ADMIN role
            users = await User.find()
                .sort({ createdAt: -1 })
                .limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
        }
        const count = users.length;
        if (count === 0) {
            err = new ErrorHelper(404, '404 Error', 'No records found.');
            return next(err, req, res, next);
        }
        return res.status(statusCode.OK).json({
            status: `${statusCode.OK} Success`,
            message: `${count} ${count > 1 ? `Users`: `user`} found`,
            data: users,
            totalPages: Math.ceil(count / limit),
			currentPage: page,
        });

    } catch (error) {
        console.log('Error from getting all users >>>> \n ', error);
        return next(error);
    }
};

exports.getSingleUser = async (req, res, next) => {
    try {
        let err;
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            err = new ErrorHelper(404, '404 Error', `User with the ID: ${userId} doesn't exist or has been deleted`);
            return next(err, req, res, next);
        }
        return res.status(statusCode.OK).json({
            status: `${statusCode.OK} Success`,
            message: 'User found ',
            data: user,
        });
    } catch (error) {
        console.log('Error from getting user >>>> \n ', error);
        if (error.name === 'CastError') {
            err = new ErrorHelper(422, '404 Error', 'Enter the name of the users to search');
            return next(err, req, res, next);
        }
        return next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        let err;
        const { userId } = req.params, 
            image = req.file && req.file.path, 
            {
                address,
                bio,
                firstName,
                lastName,
                phoneNumber,
            } = req.body,
            hasProfile = await Profile.findOne({ userId });
        if (userId !== req.user._id) {
            err = new ErrorHelper(403, '403 Error', 'You are not allowed to edit this profile');
            return next(err, req, res, next);
        }
        if (!hasProfile) {
            err = new ErrorHelper(404, 'not found', 'You don\'t have a profile, please create a profile');
            return next(err, req, res, next);
        }
        const profile = await Profile.findOneAndUpdate(
            {
                userId,
            },
            {
                $set: {
                    ...req.body,
                    image,
                },
            }
        );
        const user = await User.findByIdAndUpdate(
            userId, 
            { 
                firstName, 
                lastName, 
                profile: profile._id, 
            }, 
            { 
                new: true, 
            }
        );
        const resData = {
            message: 'Your profile has been updated successfully',
            profile: {
                lastName: profile.lastName,
                bio: profile.bio,
                phoneNumber: profile.phoneNumber,
                firstName: profile.firstName,
                userId: user._id,
            },
        };
        return res.status(200).json(resData);
    } catch (error) {
        console.log('Error from updating user profile >>>> \n ', error);
        return next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    let err;
    const { _id, role } = req.user;
    const { userId } = req.params;
    if (_id !== userId || role !== 'ADMIN') {
        err = new ErrorHelper(403, 'Unathorised, you do not have authorization to delete this account');
        return next(err, req, res, next);
    }
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            err = new ErrorHelper(404, 'not found', 'User does not exist or has been deleted');
            return next(err, req, res, next);
        }
        return res.status(statusCode.OK).json({
            status: `${statusCode.OK} OK`,
            message: 'Account deleted successfully',
        });
    } catch (error) {
        console.log('Error from deleting user account >>>> \n ', error);
        return next(error);
    }
};

exports.searchUsersByName = async (req, res, next) => {
    try {
        const { name } = req.params;
        const users = await User.find(
            {
                $or: [
                    { lastName: { $regex: name, $options: 'i' } },
                    { firstName: { $regex: name, $options: 'i' } },
                ],
            }
        );
        if (users.length === 0) {
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: `${name} does not exist.`
            });
        }
        return res.status(statusCode.OK).json({
            message: `${users.length} Users found`, 
            data: users,
        });
    } catch (error) {
        console.log('Error from searching users >>>> \n ', error);
        return next(error);
    }
};
