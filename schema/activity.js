"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for an Activity.
 */
const activitySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencing User model
    type: String, // Type of activity (e.g., 'posted_photo', 'added_comment', 'logged_in', etc.)
    date_time: { type: Date, default: Date.now }, // Time of the activity
    photo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', default: null }, // Optional, only for photo-related activities
});

/**
 * Create a Mongoose Model for an Activity using the activitySchema.
 */
const Activity = mongoose.model("Activity", activitySchema);

/**
 * Make this available to our application.
 */
module.exports = Activity;
