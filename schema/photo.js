const mongoose = require("mongoose");

// Define the Mongoose Schema for a Comment.
const commentSchema = new mongoose.Schema({
  comment: String,
  date_time: { type: Date, default: Date.now },
  user: mongoose.Schema.Types.ObjectId,
});

// Define the Mongoose Schema for a Photo.
const photoSchema = new mongoose.Schema({
  file_name: String,
  date_time: { type: Date, default: Date.now },
  user_id: mongoose.Schema.Types.ObjectId,
  comments: [commentSchema],

  // New fields for visibility control
  sharing_list: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // Permissions: "public", "private", "custom"
  permissions: { type: String, default: "public" },
});

// Create a Mongoose Model for a Photo using the photoSchema.
const Photo = mongoose.model("Photo", photoSchema);

// Make this available to our application.
module.exports = Photo;
