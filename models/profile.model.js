const mongoose = require('mongoose');
const { Schema } = mongoose;
// const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');

const profileSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: {
            type: String,
        },
        lastName: {
            type: String,
        },
        firstName: {
            type: String,
        },
        address: {
            type: String,
        },
        bio: {
            type: String,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// profileSchema.plugin(mongooseIntlPhoneNumber, {
//     hook: 'validate',
//     phoneNumberField: 'phoneNumber',
//     nationalFormatField: 'nationalFormat',
//     internationalFormat: 'internationalFormat',
//     countryCodeField: 'countryCode',
// });

module.exports = mongoose.model('Profile', profileSchema);
