const mongoose = require('mongoose');
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        phoneNumber: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        role: {
            type: String,
            default: 'user'
        },
        image: {
            type: String,
        },
        address:{
            type: String
        },
        isVerified : {
            type: Boolean,
            default: false
        },
        about: {
            type: String,
        },
        verificationToken: String,
        resetToken: String,
        expireToken: Date,
    },
    {
        timestamps: true
    }
);

userSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormat: 'internationalFormat',
    countryCodeField: 'countryCode',
});

module.exports = mongoose.model('User', userSchema);