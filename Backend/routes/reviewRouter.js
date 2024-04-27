import express from 'express';
import Review from '../models/reviewSchema.js';
import verifyToken from "../utils/middleware.js";

const router = express.Router();


//router for saving review
router.post('/:id/reviews', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, review, user } = req.body;
      const newReview = new Review({
        book: id,
        rating: rating,
        review: review,
        user: user,
      });
      await newReview.save();
      res.status(200).send(newReview);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server");
    }
});

//router for displaying review
router.get('/:id/reviews', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await Review.find({ book: id });
      res.status(200).json(reviews);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
});

export default router;