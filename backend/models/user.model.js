import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters long'],
        maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phoneNumber: {
        type: String,
        default: '',
        trim: true,
        validate: {
            validator: function(v) {
                // For Google users without a phone number yet, allow empty string
                if (this.googleId && (!v || v === '')) {
                    return true;
                }
                // For non-Google users or when phone number is provided, validate length
                if (!v || v === '') {
                    // Non-Google users must have a phone number
                    return !!this.googleId;
                }
                // If phone number is provided, it must be 10-15 digits
                return v.length >= 10 && v.length <= 15;
            },
            message: 'Phone number must be between 10-15 digits'
        }
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password not required if user signs up with Google
        },
        minlength: [6, 'Password must be at least 6 characters long']
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    profile: {
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            trim: true
        },
        skills: [{
            type: String,
            trim: true,
            maxlength: [30, 'Each skill cannot exceed 30 characters']
        }],
        resume: {
            type: String, // URL to resume file
            validate: {
                validator: function(v) {
                    return !v || /^https?:\/\/.+/.test(v);
                },
                message: 'Resume must be a valid URL'
            }
        },
        resumeOriginalName: {
            type: String,
            trim: true,
            maxlength: [100, 'Resume filename cannot exceed 100 characters']
        },
        resumeUploadedAt: {
            type: Date,
            default: null
        },
        company: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Company'
        }, 
        profilePhoto: {
            type: String,
            default: "",
            validate: {
                validator: function(v) {
                    return !v || /^https?:\/\/.+/.test(v);
                },
                message: 'Profile photo must be a valid URL'
            }
        },
        location: {
            type: String,
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters']
        },
        experience: {
            type: String,
            enum: ['fresher', '0-1', '1-3', '3-5', '5-10', '10+'],
            default: 'fresher'
        },
        education: {
            degree: {
                type: String,
                trim: true,
                maxlength: [100, 'Degree cannot exceed 100 characters']
            },
            institution: {
                type: String,
                trim: true,
                maxlength: [100, 'Institution cannot exceed 100 characters']
            },
            graduationYear: {
                type: Number,
                min: [1950, 'Graduation year cannot be before 1950'],
                max: [new Date().getFullYear() + 10, 'Graduation year cannot be more than 10 years in the future']
            }
        },
        socialLinks: {
            linkedin: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        return !v || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(v);
                    },
                    message: 'LinkedIn URL must be a valid LinkedIn profile URL'
                }
            },
            github: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        return !v || /^https?:\/\/(www\.)?github\.com\/.+/.test(v);
                    },
                    message: 'GitHub URL must be a valid GitHub profile URL'
                }
            },
            portfolio: {
                type: String,
                trim: true,
                validate: {
                    validator: function(v) {
                        return !v || /^https?:\/\/.+/.test(v);
                    },
                    message: 'Portfolio must be a valid URL'
                }
            }
        },
        preferences: {
            jobType: [{
                type: String,
                enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
            }],
            preferredLocations: [{
                type: String,
                trim: true,
                maxlength: [50, 'Location cannot exceed 50 characters']
            }],
            salaryExpectation: {
                min: {
                    type: Number,
                    min: [0, 'Minimum salary cannot be negative']
                },
                max: {
                    type: Number,
                    min: [0, 'Maximum salary cannot be negative']
                },
                currency: {
                    type: String,
                    enum: ['USD', 'INR', 'EUR', 'GBP'],
                    default: 'USD'
                }
            },
            remoteWork: {
                type: Boolean,
                default: false
            }
        }
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },

}, {timestamps: true});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'profile.skills': 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });



// Method to get public profile (excluding sensitive data)
userSchema.methods.getPublicProfile = function() {
    return {
        _id: this._id,
        fullname: this.fullname,
        email: this.email,
        phoneNumber: this.phoneNumber,
        role: this.role,
        profile: this.profile,

        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        lastLogin: this.lastLogin
    };
};

export const User = mongoose.model('User', userSchema);