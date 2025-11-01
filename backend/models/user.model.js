import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    // --- BASIC INFO ---
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [2, "Last name must be at least 2 characters"],
      trim: true,
    },

    // Combine both naming systems for consistency
    fullName: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // --- AUTH INFO ---
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Hide password from queries
    },

    // --- PROFILE INFO ---
    profileImagePath: {
      type: String,
      default: "",
    },
    avatar: {
      public_id: { type: String },
      secure_url: { type: String },
    },

    // --- ROLE & SUBSCRIPTION ---
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    subscription: {
      id: String,
      status: String,
    },

    // --- USER LISTINGS DATA ---
    tripList: {
      type: Array,
      default: [],
    },
    wishList: {
      type: Array,
      default: [],
    },
    propertyList: {
      type: Array,
      default: [],
    },
    reservationList: {
      type: Array,
      default: [],
    },

    // --- PASSWORD RESET TOKENS ---
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

//  Auto-generate fullName from first & last name if not provided
userSchema.pre("save", function (next) {
  if (!this.fullName && this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`.toLowerCase();
  }
  next();
});

//  Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//  Compare entered password with hashed password
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//  Generate JWT token
userSchema.methods.generateJWTToken = async function () {
  return await jwt.sign(
    { id: this._id, role: this.role, subscription: this.subscription },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || "7d" }
  );
};

//  This will generate a password reset token
userSchema.methods.generatePasswordResetToken = async function () {

  // creating a random token using node's and built in crypto module
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Again using crypto module to hash the generated resetToken with sha256 algorithm and storing it in database
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Adding forgot password expiry to 15 minutes
  this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min
  return resetToken;
};

const User = model("User", userSchema);
export default User;
