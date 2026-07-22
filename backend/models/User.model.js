import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 20,
            match: [
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers and underscores",
            ],
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please provide a valid email",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },

        avatar: {
            type: String,
            default: "",
        },

        avatarPublicId: {
            type: String,
            default: "",
        },

        coverImage: {
            type: String,
            default: "",
        },

        coverImagePublicId: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: 200,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        refreshToken: {
            type: String,
            default: "",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
    
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);