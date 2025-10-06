// models
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// utils
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        return res.status(200).json({success: true, user});
    } catch (error) {
        console.log('Error in getUserProfile controller', error.message);
        return res.status(500).json({success: false, message: error.message});
    }
};

export const followUnfollowUser = async (req, res) => {
    
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        
        if (id === req.user._id.toString()) {
            return res.status(400).json({success: false, message: "You cannot follow yourself"});
        }
        
        if (!userToModify || !currentUser) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        const isFollowing = currentUser.following.includes(userToModify._id);
        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            

            // Send notification
            res.status(200).json({success: true, message: "Unfollowed successfully"});
        } else {
            // Follow user functionality
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // Send notification
            const notification = new Notification({
                from: req.user._id,
                to: id,
                type: "follow",
                read: false
            });
            await notification.save();

            // TODO return the id of the user as a response
            res.status(200).json({success: true, message: "Followed successfully"});
        }
    } catch (error) {
        console.log('Error in followUnfollowUser controller', error.message);
        return res.status(500).json({success: false, message: error.message});
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: { _id: { $ne: userId } }
            },
            {
                $sample: { size: 10 }
            }
        ])

        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 5);

        suggestedUsers.forEach(user => (user.password = null));
        res.status(200).json({success: true, suggestedUsers});
    } catch (error) {
        console.log('Error in getSuggestedUsers controller', error.message);
        return res.status(500).json({success: false, message: error.message});
    }
};

export const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    const userId = req.user._id;
    const profileImgFile = req.files?.profileImg?.[0];
    const coverImgFile = req.files?.coverImg?.[0];

    let profileImg;
    let coverImg;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({success: false, message: "User not found"});
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({success: false, message: "Please provide both current password and new password"});
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({success: false, message: "Current password is incorrect"});

            if (newPassword.length < 6) {
                return res.status(400).json({success: false, message: "New password must be at least 6 characters long"});
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            await user.save();
        }

        const uploadToCloudinary = async (fileBuffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) reject(error);
                else resolve(result);
              });
              stream.end(fileBuffer);
            });
        };

        if (profileImgFile) {
            if (user.profileImg) {
                const publicId = user.profileImg.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadedResponse = await uploadToCloudinary(profileImgFile.buffer);
            profileImg = uploadedResponse.secure_url;
        }
        if (coverImgFile) {
            if (user.coverImg) {
                const publicId = user.coverImg.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadedResponse = await uploadToCloudinary(coverImgFile.buffer);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        await user.save();

        // password should be null while displaying but should be added to the database
        
        user.password = null;
        res.status(200).json({success: true, user});
        
    } catch (error) {
        console.log('Error in updateUser controller', error.message);
        return res.status(500).json({success: false, message: error.message});
    }
};