import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../utils/novu.js";
import passport from "../config/passport.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        let cloudResponse;
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse?.secure_url || "",
            }
        });

        // Send welcome email
        try {
            await sendWelcomeEmail({
                fullname,
                email,
                phoneNumber,
                role
            });
        } catch (emailError) {
            console.log('Email sending failed:', emailError);
            // Don't fail registration if email fails
        }

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to register. Please try again.",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userProfile = user.getPublicProfile();

        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: true,
            sameSite: 'none'
        }).json({
            message: `Welcome back ${user.fullname}`,
            user: userProfile,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to login. Please try again.",
            success: false
        });
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { 
            maxAge: 0,
            httpOnly: true, 
            secure: true,
            sameSite: 'none'
        }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to logout. Please try again.",
            success: false
        });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { 
            fullname, 
            email, 
            phoneNumber, 
            bio, 
            skills, 
            location, 
            experience,
            degree,
            institution,
            graduationYear,
            linkedin,
            github,
            portfolio,
            jobType,
            preferredLocations,
            salaryMin,
            salaryMax,
            currency,
            remoteWork
        } = req.body;
        
        const file = req.file;
        let cloudResponse;
        
        // Handle file upload (resume or profile photo)
        if (file) {
            const fileUri = getDataUri(file);
            
            // Set upload options based on file type
            const uploadOptions = {
                folder: file.mimetype.startsWith('image/') ? 'profile_photos' : 'resumes',
                resource_type: 'auto'
            };
            
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, uploadOptions);
        }

        // Process skills array
        let skillsArray;
        if (skills) {
            skillsArray = typeof skills === 'string' 
                ? skills.split(",").map(skill => skill.trim()).filter(skill => skill)
                : skills;
        }

        // Process preferred locations
        let preferredLocationsArray;
        if (preferredLocations) {
            preferredLocationsArray = typeof preferredLocations === 'string'
                ? preferredLocations.split(",").map(loc => loc.trim()).filter(loc => loc)
                : preferredLocations;
        }

        // Process job types
        let jobTypeArray;
        if (jobType) {
            jobTypeArray = typeof jobType === 'string'
                ? jobType.split(",").map(type => type.trim()).filter(type => type)
                : jobType;
        }

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Validate email uniqueness if changed
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email is already in use by another account.",
                    success: false
                });
            }
        }

        // Update basic user info
        if (fullname) user.fullname = fullname.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (phoneNumber) user.phoneNumber = phoneNumber.trim();

        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }

        // Update profile information
        if (bio !== undefined) user.profile.bio = bio.trim();
        if (skillsArray) user.profile.skills = skillsArray;
        if (location !== undefined) user.profile.location = location.trim();
        if (experience) user.profile.experience = experience;

        // Update education
        if (degree !== undefined || institution !== undefined || graduationYear !== undefined) {
            if (!user.profile.education) user.profile.education = {};
            if (degree !== undefined) user.profile.education.degree = degree.trim();
            if (institution !== undefined) user.profile.education.institution = institution.trim();
            if (graduationYear !== undefined) user.profile.education.graduationYear = parseInt(graduationYear);
        }

        // Update social links
        if (linkedin !== undefined || github !== undefined || portfolio !== undefined) {
            if (!user.profile.socialLinks) user.profile.socialLinks = {};
            if (linkedin !== undefined) user.profile.socialLinks.linkedin = linkedin.trim();
            if (github !== undefined) user.profile.socialLinks.github = github.trim();
            if (portfolio !== undefined) user.profile.socialLinks.portfolio = portfolio.trim();
        }

        // Update preferences
        if (jobTypeArray || preferredLocationsArray || salaryMin !== undefined || salaryMax !== undefined || currency || remoteWork !== undefined) {
            if (!user.profile.preferences) user.profile.preferences = {};
            if (jobTypeArray) user.profile.preferences.jobType = jobTypeArray;
            if (preferredLocationsArray) user.profile.preferences.preferredLocations = preferredLocationsArray;
            if (salaryMin !== undefined || salaryMax !== undefined || currency) {
                if (!user.profile.preferences.salaryExpectation) user.profile.preferences.salaryExpectation = {};
                if (salaryMin !== undefined) user.profile.preferences.salaryExpectation.min = parseInt(salaryMin);
                if (salaryMax !== undefined) user.profile.preferences.salaryExpectation.max = parseInt(salaryMax);
                if (currency) user.profile.preferences.salaryExpectation.currency = currency;
            }
            if (remoteWork !== undefined) user.profile.preferences.remoteWork = remoteWork === 'true' || remoteWork === true;
        }

        // Handle file upload (resume or profile photo)
        if (cloudResponse) {
            if (file.mimetype.startsWith('image/')) {
                user.profile.profilePhoto = cloudResponse.secure_url;
            } else {
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
                user.profile.resumeUploadedAt = new Date();
            }
        }

        await user.save();

        // Return updated user profile
        const updatedUser = user.getPublicProfile();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.log('Profile update error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: "Validation failed.",
                errors: validationErrors,
                success: false
            });
        }

        return res.status(500).json({
            message: "Failed to update profile. Please try again.",
            success: false
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User with this email does not exist",
                success: false
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Send password reset email
        try {
            await sendPasswordResetEmail(email, resetToken);
        } catch (emailError) {
            console.log('Email sending failed:', emailError);
            return res.status(500).json({
                message: "Failed to send reset email. Please try again.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Password reset link sent to your email",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to process request. Please try again.",
            success: false
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({
                message: "Token and password are required",
                success: false
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (jwtError) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
                success: false
            });
        }

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to reset password. Please try again.",
            success: false
        });
    }
};

export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if job is already saved
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Job is already saved",
                success: false
            });
        }

        // Add job to saved jobs
        user.savedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            message: "Job saved successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to save job. Please try again.",
            success: false
        });
    }
};

export const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Remove job from saved jobs
        user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        await user.save();

        return res.status(200).json({
            message: "Job removed from saved jobs",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove job. Please try again.",
            success: false
        });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: {
                path: 'company',
                select: 'name logo location'
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Saved jobs retrieved successfully",
            savedJobs: user.savedJobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to retrieve saved jobs. Please try again.",
            success: false
        });
    }
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('profile.company', 'name logo location');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const userProfile = user.getPublicProfile();

        return res.status(200).json({
            message: "Profile retrieved successfully",
            user: userProfile,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to retrieve profile. Please try again.",
            success: false
        });
    }
};

// Get user profile by ID (public view)
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .select('-password -emailVerificationToken')
            .populate('profile.company', 'name logo location');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Return limited public profile for privacy
        const publicProfile = {
            _id: user._id,
            fullname: user.fullname,
            role: user.role,
            profile: {
                bio: user.profile.bio,
                skills: user.profile.skills,
                profilePhoto: user.profile.profilePhoto,
                location: user.profile.location,
                experience: user.profile.experience,
                education: user.profile.education,
                socialLinks: user.profile.socialLinks
            },
            profileCompleteness: user.profileCompleteness,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            message: "User profile retrieved successfully",
            user: publicProfile,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to retrieve user profile. Please try again.",
            success: false
        });
    }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded",
                success: false
            });
        }

        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
            return res.status(400).json({
                message: "Only image files are allowed for profile photo",
                success: false
            });
        }

        // Upload to cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: 'profile_photos',
            width: 400,
            height: 400,
            crop: 'fill'
        });

        // Update user profile
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.profile.profilePhoto = cloudResponse.secure_url;
        await user.save();

        // Return the full updated user profile
        const updatedUser = user.getPublicProfile();

        return res.status(200).json({
            message: "Profile photo updated successfully",
            user: updatedUser,
            profilePhoto: cloudResponse.secure_url,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to upload profile photo. Please try again.",
            success: false
        });
    }
};

// Delete profile photo
export const deleteProfilePhoto = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.profile.profilePhoto = "";
        await user.save();

        // Return the full updated user profile
        const updatedUser = user.getPublicProfile();

        return res.status(200).json({
            message: "Profile photo deleted successfully",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to delete profile photo. Please try again.",
            success: false
        });
    }
};

// Get profile analytics/stats
export const getProfileStats = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId)
            .populate('savedJobs')
            .populate({
                path: 'savedJobs',
                populate: {
                    path: 'company'
                }
            });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Calculate stats
        const stats = {
            profileCompleteness: user.profileCompleteness,
            totalSkills: user.profile.skills ? user.profile.skills.length : 0,
            savedJobsCount: user.savedJobs ? user.savedJobs.length : 0,
            hasResume: !!user.profile.resume,
            hasProfilePhoto: !!user.profile.profilePhoto,
            memberSince: user.createdAt,
            lastLogin: user.lastLogin,
            profileViews: 0, // This could be implemented with a separate collection
            socialLinksCount: user.profile.socialLinks ? 
                Object.values(user.profile.socialLinks).filter(link => link).length : 0
        };

        return res.status(200).json({
            message: "Profile stats retrieved successfully",
            stats,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to retrieve profile stats. Please try again.",
            success: false
        });
    }
};

// Search users by skills or location
export const searchUsers = async (req, res) => {
    try {
        const { skills, location, experience, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = { role: 'student' }; // Only search job seekers

        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            query['profile.skills'] = { $in: skillsArray };
        }

        if (location) {
            query['profile.location'] = { $regex: location, $options: 'i' };
        }

        if (experience) {
            query['profile.experience'] = experience;
        }

        const users = await User.find(query)
            .select('fullname profile.bio profile.skills profile.profilePhoto profile.location profile.experience profileCompleteness createdAt')
            .sort({ profileCompleteness: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        return res.status(200).json({
            message: "Users retrieved successfully",
            users,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: users.length,
                totalUsers: total
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to search users. Please try again.",
            success: false
        });
    }
};

// Google OAuth Controllers
export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

export const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
        }

        // Generate JWT token
        const tokenData = {
            userId: user._id
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Set cookie and redirect to frontend
        res.cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
        });

        // Check if user needs to complete profile (phone number missing for Google users)
        if (!user.phoneNumber) {
            return res.redirect(`${process.env.CLIENT_URL}/complete-profile`);
        }

        return res.redirect(`${process.env.CLIENT_URL}/`);
    } catch (error) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
};

export const completeGoogleProfile = async (req, res) => {
    try {
        const { phoneNumber, role } = req.body;
        const userId = req.id;

        if (!phoneNumber || !role) {
            return res.status(400).json({
                message: "Phone number and role are required",
                success: false
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Update user profile
        user.phoneNumber = phoneNumber;
        user.role = role;
        await user.save();

        // Send welcome email
        try {
            await sendWelcomeEmail({
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            });
        } catch (emailError) {
            // Email sending failed, but don't block the profile completion
        }

        const userProfile = user.getPublicProfile();

        return res.status(200).json({
            message: "Profile completed successfully",
            user: userProfile,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to complete profile. Please try again.",
            success: false
        });
    }
};