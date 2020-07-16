const { User } = require('../models');
const statusCode = require('http-status');
const mongoose = require('mongoose');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).json({
                status: "404 Error",
                message: "No users available"
            });
        }
        return res.status(200).json({
            status: "200 Success",
            message: `${users.length} ${users.length > 1 ? `Users`: `User`} found`,
            data: users
        });

    } catch (error) {
        console.log('Error from getting all users >>>> \n ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Try again'
        });
    }
};

exports.getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(422).json({
                status: `422 Error`,
                message: 'Ensure you enter a valid USER ID'
            });
        }
        if (!user) {
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: `User with the ID: ${userId} doesn't exist or has been deleted`
            });
        }
        return res.status(statusCode.OK).json({
            status: `${statusCode.OK} Success`,
            message: 'User found ',
            data: user
        });
    } catch (error) {
        console.log('Error from getting user >>>> \n ', error);
        if (error.name === 'CastError') {
            return res.status(422).json({
                status: `422 Error`,
                message: 'Ensure you enter a valid USER ID'
            });
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Try again'
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const id = req.params.userId;
        const { address, phoneNumber, fullName, about } = req.body;
        const image = req.file.path;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).json({
                status: '422 Error',
                message: 'Ensure your ID is a valid ID'
            });
        }
        if (userId !== id) {
            return res.status(403).json({ 
                status: '403 Error',
                message: "Unathorised, you can only update your account" 
            });
        }
        const user = await User.findOneAndUpdate(
            { 
                _id: id 
            }, 
            { 
                ...req.body,
                image
            },
            {
                new: true // google this
            }
        );
        if (!user) {
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: 'Make sure you\'re logged in'
            });
        }
        return res.status(200).json({
            status: `${statusCode.OK} Success`,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.log('Error from updating user profile >>>> \n ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Try again'
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.user;
    const id = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(422).json({
            status: '422 Error',
            message: 'Ensure your ID is a valid ID'
        });
    }
    if (userId !== id) {
        return res.status(403).json({ 
            status: '403 Error',
            message: "Unathorised, you can only delete your account" 
        });
    }
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: 'User does not exist or has been deleted'
            });
        }
        return res.status(statusCode.OK).json({
            status: `${statusCode.OK} OK`,
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.log('Error from deleting user account >>>> \n ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Try again'
        });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { name } = req.params;
        const users = await User.find({ fullName: { '$regex': name } });
        if (users.length === 0) {
            return res.status(statusCode.NOT_FOUND).json({
                status: `${statusCode.NOT_FOUND} Error`,
                message: `${name} does not exist.`
            });
        }
        return res.status(statusCode.OK).json({
            message: `${users.length} Users found`, 
            data: users
        });
    } catch (error) {
        console.log('Error from searching users >>>> \n ', error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: `${statusCode.INTERNAL_SERVER_ERROR} Error`,
            message: 'Something went wrong. Try again'
        });
    }
};