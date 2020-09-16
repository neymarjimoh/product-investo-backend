const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        googleId: {
            type: String,
        },
        facebookId: {
            type: String,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER', // all users either entrepreneurs or investors have role of user
        },
        userType: {
            type: String,
            enum: ['entrepreneur', 'investor'],
            required: true,
        },
        isVerified : {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'reported'],
            default: 'active',
        },
        numOfReports: {
            type: Number,
            default: 0,
        },
        investorType: {
            type: String,
            enum: ['small-scale', 'medium-scale', 'large-scale'],
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
        },
        investors: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        entrepreneurs: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        investments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Investment',
            },
        ],
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        reports: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Report',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
