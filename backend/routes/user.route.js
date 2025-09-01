import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile, 
    forgotPassword, 
    resetPassword, 
    saveJob, 
    unsaveJob, 
    getSavedJobs,
    getProfile,
    getUserProfile,
    uploadProfilePhoto,
    deleteProfilePhoto,
    getProfileStats,
    searchUsers
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
// Validation middleware removed to prevent issues
 
const router = express.Router();

// Authentication routes
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// Profile management routes
router.route("/profile").get(isAuthenticated, getProfile);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/profile/photo").post(isAuthenticated, singleUpload, uploadProfilePhoto);
router.route("/profile/photo").delete(isAuthenticated, deleteProfilePhoto);
router.route("/profile/stats").get(isAuthenticated, getProfileStats);

// Public profile routes
router.route("/profile/:userId").get(getUserProfile);

// Job management routes
router.route("/save-job").post(isAuthenticated, saveJob);
router.route("/unsave-job").post(isAuthenticated, unsaveJob);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);

// User search routes
router.route("/search").get(searchUsers);

export default router;