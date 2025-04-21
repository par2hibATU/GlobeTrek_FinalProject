import Reviews from "../models/Reviews.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { createError } from "../utills/error.js";

// Bayesian Average method
const updateHotelRating = async (hotelId) => {
  const hotelReviews = await Reviews.find({ hotelId });
  const v = hotelReviews.length;

  if (v === 0) {
    await Hotel.findByIdAndUpdate(hotelId, { rating: 0 });
    return;
  }

  const R = hotelReviews.reduce((sum, review) => sum + review.rating, 0) / v;
  console.log(`Hotel ${hotelId} average rating (R): ${R}`);

  const allReviews = await Reviews.find();
  const C =
    allReviews.reduce((sum, review) => sum + review.rating, 0) /
    allReviews.length;

  console.log(`Global average rating (C): ${C}`);
  const m = 5; // minimum number of reviews
  console.log(`Minimum reviews required (m): ${m}`);

  const bayesianRating = (v / (v + m)) * R + (m / (v + m)) * C;
  console.log(`Bayesian rating for hotel ${hotelId}: ${bayesianRating}`);

  await Hotel.findByIdAndUpdate(hotelId, {
    rating: parseFloat(bayesianRating.toFixed(2)),
  });
};

export const createReview = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found"));

    const newReview = new Reviews({
      hotelId: req.params.hotelId,
      userId: req.user.id,
      username: user.username,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    const savedReview = await newReview.save();
    await updateHotelRating(req.params.hotelId);
    res.status(201).json(savedReview);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Reviews.findById(req.params.id);
    if (!review) return next(createError(404, "Review not found"));

    if (review.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(createError(403, "Admin and You can only update your own reviews"));
    }

    const updatedReview = await Reviews.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    await updateHotelRating(review.hotelId);
    res.status(200).json(updatedReview);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Reviews.findById(req.params.id);
    if (!review) return next(createError(404, "Review not found"));

    if (review.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(createError(403, "You can only delete your own reviews"));
    }

    await Reviews.findByIdAndDelete(req.params.id);
    await updateHotelRating(review.hotelId);
    res.status(200).json("Review has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getReviewsByHotel = async (req, res, next) => {
  try {
    const reviews = await Reviews.find({ hotelId: req.params.hotelId });
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};
