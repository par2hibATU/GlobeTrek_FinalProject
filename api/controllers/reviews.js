import Reviews from "../models/Reviews.js";
import Hotel from "../models/Hotel.js";
import createError from "http-errors";




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

        //
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

        //

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
        
        //

        res.status(200).json("Review deleted successfully");
    } catch(err){
        next(err);
    }
};
