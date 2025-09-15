import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { username, fullName, password, email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }

        // Hash the password
        // 12345 -> lkcabkjshcbkjac_$%^%476@clsk
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        if(newUser) {
            generateTokenAndSetCookie(newUser, res);
            await newUser.save();
            return res.status(201).json({
                success: true,
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                followers: newUser.followers,
                following: newUser.following,
            });
        } else {
            return res.status(400).json({success: false, message: "User not created"});
        }
    } catch (error) {
        console.log('Error in sigup controller');
        return res.status(500).json({success: false, message: error.message});
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({message: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user, res);

        res.status(200).json({
            success: true,
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            followers: user.followers,
            following: user.following,
        });       

    } catch (error) {
        console.log('Error in login controller', error.message);
        return res.status(500).json({success: false, message: error.message});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({success: true, message: "User logged out successfully"});
    } catch (error) {
        console.log('Error in logout controller', error.message);
        return res.status(500).json({success: false, message: error.message});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({success: true, user});
    } catch (error) {
        console.log('Error in getMe controller', error.message);
        return res.status(500).json({success: false, message: error.message});
    }
}