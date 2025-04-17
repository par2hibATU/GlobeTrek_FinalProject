import Reviews from "../models/Reviews.js";
import Hotel from "../models/Hotel.js";
import createError from "http-errors";

// Bayesian Average method to rate hotels#
const updateHotelRating = async (hotelId) => {
    const hotelReviews = await Reviews.find({ hotelId });
    const v = hotelReviews.length;

    if (v === 0) {
        await Hotel.findByIdAndUpdate(hotelId, { rating: 0 });
        return;
    }

    const R = hotelReviews.reduce((sum, review) => sum + review.rating, 0) / v;

    const allReviews = await Reviews.find();
    const C = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;

    const m = 5; // minimum number of reviews

    const bayesianRating = (v / (v + m)) * R + (m / (v + m)) * C;

    await Hotel.findByIdAndUpdate(hotelId, {
        rating: parseFloat(bayesianRating.toFixed(2)),
    });
};


// To create reviews
export const createReview = async (req, resizeBy, next) => {
    const { hotelId, rating, comment } = req.body;

    try {
        const existingReview = await Reviews.findOne({
            hotelId,
            userId: req.user.id,
        });

        if (existingReviews) {
            return next(createError(400, "You have already reviewed this hotel"));
        }

        const newReview = new Reviews ({
            hotelId,
            userId: req.user.id,
            username: req.user.username,
            rating,
            comment,
        });

        const savedReview = await newReview.save();

        await updateHotelRating(hotelId);
        res.status(201).json(savedReview);
    } catch (err) {
        next(err);
    }
};

// Update a review

export const updateReview = async (req, res, next) => {
    try {
        const review = await Reviews.findById(req.params.id);

        if(!review){
            return next(createError(400, "Review not found"));
        }

        if (review.userId.toString() !== req.user.id) {
            return next(createError(403, "You can only update your own reviews"));
        }

        const updatedReview = await Reviews.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        await updateHotelRating(hotelId);

        res.status(200).json(updatedReview);
    } catch (err) {
        next(err);
    }
}

// delete a review
export const deleteReview = async (req, res, next) =>{
    try {
        const review = await Reviews.findById(req.params.id);

        if (!review) {
            return next(createError(404, "Review not found"));
        }

        if (review.userId.toString() !== req.user.id){
            return next(createError(403, "You can only delete your own reviews"));
        }
        
        await Reviews.findByIdAndDelete(req.params.id);
        
        await updateHotelRating(hotelId);

        res.status(200).json("Review deleted successfully");
    } catch(err){
        next(err);
    }
};

// To get all reviews
export const getReviewsByHotel = async (req, res, next) => {
    try {
        const reviews = await Reviews.find({ hotelId: req.params.hotelId}).sort({
            createdAt: -1,
        });
        res.status(200).json(reviews);
    }catch (err) {
        next(err);
    }
};

// Get all reviews (user)
export const getReviewsByUser = async (req, res, next) => {
    try {
        const reviews = await Reviews.find({ userId: req.params.userId }).sort({
            createdAt: -1,
        });
        res.status(200).json(reviews);
    } catch(err){
        next(err);
    }
};
