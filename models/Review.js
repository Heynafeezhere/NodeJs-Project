const Mongoose = require("mongoose")

const ReviewSchema = Mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please Provide value for rating']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please Provide value for rating'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, 'Please Provide value for rating'],
    },
    user: {
        type: Mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

ReviewSchema.index({ user: 1, product: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: productId,
                averageRating: { $avg: '$rating' }, //rating will be fetched from the review model
                numOfReviews: { $sum: 1 }
            }
        }
    ])
    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews : result[0]?.numOfReviews || 0,
            }

        );
    } catch (error) {
        console.log(error);
    }
}

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product)
})

module.exports = Mongoose.model('Review', ReviewSchema);