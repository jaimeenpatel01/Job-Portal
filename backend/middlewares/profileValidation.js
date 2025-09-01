import { body, validationResult } from 'express-validator';

// Validation rules for profile update
export const validateProfileUpdate = [
    body('fullname')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),
    
    body('email')
        .optional()
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('phoneNumber')
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    
    body('skills')
        .optional()
        .custom((value) => {
            if (typeof value === 'string') {
                const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
                if (skills.length > 20) {
                    throw new Error('Cannot have more than 20 skills');
                }
                for (const skill of skills) {
                    if (skill.length > 30) {
                        throw new Error('Each skill cannot exceed 30 characters');
                    }
                }
            }
            return true;
        }),
    
    body('location')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Location cannot exceed 100 characters'),
    
    body('experience')
        .optional()
        .isIn(['fresher', '0-1', '1-3', '3-5', '5-10', '10+'])
        .withMessage('Invalid experience level'),
    
    body('degree')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Degree cannot exceed 100 characters'),
    
    body('institution')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Institution cannot exceed 100 characters'),
    
    body('graduationYear')
        .optional()
        .isInt({ min: 1950, max: new Date().getFullYear() + 10 })
        .withMessage('Invalid graduation year'),
    
    body('linkedin')
        .optional()
        .trim()
        .custom((value) => {
            if (value && !value.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/.+/)) {
                throw new Error('Invalid LinkedIn URL format');
            }
            return true;
        }),
    
    body('github')
        .optional()
        .trim()
        .custom((value) => {
            if (value && !value.match(/^https?:\/\/(www\.)?github\.com\/.+/)) {
                throw new Error('Invalid GitHub URL format');
            }
            return true;
        }),
    
    body('portfolio')
        .optional()
        .trim()
        .isURL()
        .withMessage('Portfolio must be a valid URL'),
    
    body('salaryMin')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Minimum salary must be a positive number'),
    
    body('salaryMax')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Maximum salary must be a positive number'),
    
    body('currency')
        .optional()
        .isIn(['USD', 'INR', 'EUR', 'GBP'])
        .withMessage('Invalid currency'),
    
    body('remoteWork')
        .optional()
        .isBoolean()
        .withMessage('Remote work preference must be true or false'),
];

// Validation rules for user registration
export const validateUserRegistration = [
    body('fullname')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('phoneNumber')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['student', 'recruiter'])
        .withMessage('Role must be either student or recruiter'),
];

// Validation rules for user login
export const validateUserLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['student', 'recruiter'])
        .withMessage('Role must be either student or recruiter'),
];

// Validation rules for password reset
export const validatePasswordReset = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Validation rules for forgot password
export const validateForgotPassword = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));
        
        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages,
            success: false
        });
    }
    
    next();
};

// Custom validation for salary range
export const validateSalaryRange = (req, res, next) => {
    const { salaryMin, salaryMax } = req.body;
    
    if (salaryMin && salaryMax) {
        const min = parseInt(salaryMin);
        const max = parseInt(salaryMax);
        
        if (min > max) {
            return res.status(400).json({
                message: 'Minimum salary cannot be greater than maximum salary',
                success: false
            });
        }
    }
    
    next();
};

// File upload validation
export const validateFileUpload = (allowedTypes, maxSize = 5 * 1024 * 1024) => {
    return (req, res, next) => {
        const file = req.file;
        
        if (!file) {
            return next();
        }
        
        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
                success: false
            });
        }
        
        // Check file size
        if (file.size > maxSize) {
            return res.status(400).json({
                message: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
                success: false
            });
        }
        
        next();
    };
};
