const mongoose = require('mongoose');
const { Schema } = mongoose;

const blackListedTokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('BlackListedToken', blackListedTokenSchema);
