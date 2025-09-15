import mongoose from "mongoose";
import { type } from "os";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [
        {
        type: mongoose.Schema.Types.ObjectId, // 16 character string
        ref: "User",
        default: []
        }
    ],
    following: [
        {
        type: mongoose.Schema.Types.ObjectId, // 16 character string
        ref: "User",
        default: []
        }
    ],

    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    
}, {timestamps: true});

export default mongoose.model("User", UserSchema);
