const mongoose = require("mongoose");

const userauthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never return password by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    resetPasswordToken: {
      type: String,
      index: true, // fast lookup during reset
    },

    resetPasswordExpires: Date,
  },
  { timestamps: true }
);


// Cursor pagination (_id index already exists by default)

// Filter by role
userauthSchema.index({ role: 1 });

// Search by name/email
userauthSchema.index({ name: 1, email: 1 });

// Cursor pagination + role filter (compound index)
userauthSchema.index({ role: 1, _id: 1 });

module.exports = mongoose.model("Userauth", userauthSchema);
