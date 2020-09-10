const mongoose = require('mongoose');
const { Schema } = mongoose;

const investmentSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        productOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        investor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Investment', investmentSchema);
