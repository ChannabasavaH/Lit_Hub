import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0.5,
        max: 5
    },
    review: {
        type: String,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
