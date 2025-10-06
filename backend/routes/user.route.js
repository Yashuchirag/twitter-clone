import express from "express";
import multer from "multer";
import { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, upload.fields([{ name: "coverImg" }, { name: "profileImg" }]), updateUser);

export default router;
