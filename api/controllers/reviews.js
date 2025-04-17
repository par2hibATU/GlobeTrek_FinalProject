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