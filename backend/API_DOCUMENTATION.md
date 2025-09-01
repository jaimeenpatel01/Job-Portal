# Job Portal API Documentation

## Enhanced Profile Management System

This document outlines the enhanced backend API endpoints for the beautiful profile page implementation.

## Base URL
```
http://localhost:8000/api/v1/user
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/register`

**Form Data:**
- `fullname` (required): User's full name (2-50 characters, letters and spaces only)
- `email` (required): Valid email address
- `phoneNumber` (required): Valid mobile phone number
- `password` (required): Password (min 6 chars, must contain uppercase, lowercase, and number)
- `role` (required): Either "student" or "recruiter"
- `file` (optional): Profile photo (JPEG, PNG, JPG, max 2MB)

**Response:**
```json
{
    "message": "Account created successfully.",
    "success": true
}
```

### 2. Login User
**POST** `/login`

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "role": "student"
}
```

**Response:**
```json
{
    "message": "Welcome back John Doe",
    "user": {
        "_id": "user_id",
        "fullname": "John Doe",
        "email": "user@example.com",
        "phoneNumber": "1234567890",
        "role": "student",
        "profile": {...},
        "profileCompleteness": 75,
        "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "success": true
}
```

### 3. Logout User
**GET** `/logout`

**Response:**
```json
{
    "message": "Logged out successfully.",
    "success": true
}
```

---

## Profile Management Endpoints

### 4. Get Current User Profile
**GET** `/profile`
*Requires Authentication*

**Response:**
```json
{
    "message": "Profile retrieved successfully",
    "user": {
        "_id": "user_id",
        "fullname": "John Doe",
        "email": "user@example.com",
        "phoneNumber": "1234567890",
        "role": "student",
        "profile": {
            "bio": "Software developer passionate about technology",
            "skills": ["JavaScript", "React", "Node.js"],
            "resume": "https://cloudinary.com/resume.pdf",
            "resumeOriginalName": "john_resume.pdf",
            "resumeUploadedAt": "2024-01-01T00:00:00.000Z",
            "profilePhoto": "https://cloudinary.com/photo.jpg",
            "location": "New York, USA",
            "experience": "1-3",
            "education": {
                "degree": "Bachelor of Computer Science",
                "institution": "University of Technology",
                "graduationYear": 2023
            },
            "socialLinks": {
                "linkedin": "https://linkedin.com/in/johndoe",
                "github": "https://github.com/johndoe",
                "portfolio": "https://johndoe.dev"
            },
            "preferences": {
                "jobType": ["full-time", "remote"],
                "preferredLocations": ["New York", "San Francisco"],
                "salaryExpectation": {
                    "min": 70000,
                    "max": 100000,
                    "currency": "USD"
                },
                "remoteWork": true
            }
        },
        "profileCompleteness": 85,
        "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "success": true
}
```

### 5. Update Profile
**POST** `/profile/update`
*Requires Authentication*

**Form Data:**
- `fullname` (optional): Updated full name
- `email` (optional): Updated email
- `phoneNumber` (optional): Updated phone number
- `bio` (optional): Profile bio (max 500 characters)
- `skills` (optional): Comma-separated skills (max 20 skills, 30 chars each)
- `location` (optional): User location
- `experience` (optional): Experience level (fresher, 0-1, 1-3, 3-5, 5-10, 10+)
- `degree` (optional): Educational degree
- `institution` (optional): Educational institution
- `graduationYear` (optional): Graduation year
- `linkedin` (optional): LinkedIn profile URL
- `github` (optional): GitHub profile URL
- `portfolio` (optional): Portfolio website URL
- `jobType` (optional): Preferred job types (comma-separated)
- `preferredLocations` (optional): Preferred work locations (comma-separated)
- `salaryMin` (optional): Minimum salary expectation
- `salaryMax` (optional): Maximum salary expectation
- `currency` (optional): Salary currency (USD, INR, EUR, GBP)
- `remoteWork` (optional): Remote work preference (true/false)
- `file` (optional): Resume (PDF) or Profile Photo (JPEG, PNG, JPG)

**Response:**
```json
{
    "message": "Profile updated successfully.",
    "user": { /* Updated user profile */ },
    "success": true
}
```

### 6. Upload Profile Photo
**POST** `/profile/photo`
*Requires Authentication*

**Form Data:**
- `file` (required): Image file (JPEG, PNG, JPG, max 2MB)

**Response:**
```json
{
    "message": "Profile photo updated successfully",
    "profilePhoto": "https://cloudinary.com/new_photo.jpg",
    "success": true
}
```

### 7. Delete Profile Photo
**DELETE** `/profile/photo`
*Requires Authentication*

**Response:**
```json
{
    "message": "Profile photo deleted successfully",
    "success": true
}
```

### 8. Get Profile Statistics
**GET** `/profile/stats`
*Requires Authentication*

**Response:**
```json
{
    "message": "Profile stats retrieved successfully",
    "stats": {
        "profileCompleteness": 85,
        "totalSkills": 5,
        "savedJobsCount": 12,
        "hasResume": true,
        "hasProfilePhoto": true,
        "memberSince": "2024-01-01T00:00:00.000Z",
        "lastLogin": "2024-01-15T10:30:00.000Z",
        "profileViews": 0,
        "socialLinksCount": 3
    },
    "success": true
}
```

---

## Public Profile Endpoints

### 9. Get User Profile by ID
**GET** `/profile/:userId`
*Public Endpoint*

**Response:**
```json
{
    "message": "User profile retrieved successfully",
    "user": {
        "_id": "user_id",
        "fullname": "John Doe",
        "role": "student",
        "profile": {
            "bio": "Software developer passionate about technology",
            "skills": ["JavaScript", "React", "Node.js"],
            "profilePhoto": "https://cloudinary.com/photo.jpg",
            "location": "New York, USA",
            "experience": "1-3",
            "education": {...},
            "socialLinks": {...}
        },
        "profileCompleteness": 85,
        "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "success": true
}
```

---

## User Search Endpoints

### 10. Search Users
**GET** `/search`
*Public Endpoint*

**Query Parameters:**
- `skills` (optional): Comma-separated skills to search for
- `location` (optional): Location to search in
- `experience` (optional): Experience level
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example:**
```
GET /search?skills=JavaScript,React&location=New York&experience=1-3&page=1&limit=10
```

**Response:**
```json
{
    "message": "Users retrieved successfully",
    "users": [
        {
            "_id": "user_id",
            "fullname": "John Doe",
            "profile": {
                "bio": "Software developer",
                "skills": ["JavaScript", "React", "Node.js"],
                "profilePhoto": "https://cloudinary.com/photo.jpg",
                "location": "New York, USA",
                "experience": "1-3"
            },
            "profileCompleteness": 85,
            "createdAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "pagination": {
        "current": 1,
        "total": 5,
        "count": 10,
        "totalUsers": 45
    },
    "success": true
}
```

---

## Job Management Endpoints

### 11. Save Job
**POST** `/save-job`
*Requires Authentication*

**Request Body:**
```json
{
    "jobId": "job_id_here"
}
```

### 12. Unsave Job
**POST** `/unsave-job`
*Requires Authentication*

**Request Body:**
```json
{
    "jobId": "job_id_here"
}
```

### 13. Get Saved Jobs
**GET** `/saved-jobs`
*Requires Authentication*

**Response:**
```json
{
    "message": "Saved jobs retrieved successfully",
    "savedJobs": [
        {
            "_id": "job_id",
            "title": "Software Developer",
            "company": {
                "name": "Tech Corp",
                "logo": "https://logo.png",
                "location": "New York"
            }
        }
    ],
    "success": true
}
```

---

## Password Management Endpoints

### 14. Forgot Password
**POST** `/forgot-password`

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

### 15. Reset Password
**POST** `/reset-password`

**Request Body:**
```json
{
    "token": "reset_token_here",
    "password": "new_password123"
}
```

---

## Data Models

### User Profile Schema
```javascript
{
    fullname: String (required, 2-50 chars),
    email: String (required, unique, valid email),
    phoneNumber: String (required, valid phone),
    password: String (required, hashed),
    role: String (required, 'student' or 'recruiter'),
    savedJobs: [ObjectId],
    profile: {
        bio: String (max 500 chars),
        skills: [String] (max 20 skills, 30 chars each),
        resume: String (URL),
        resumeOriginalName: String,
        resumeUploadedAt: Date,
        profilePhoto: String (URL),
        location: String (max 100 chars),
        experience: String (enum),
        education: {
            degree: String,
            institution: String,
            graduationYear: Number
        },
        socialLinks: {
            linkedin: String (URL),
            github: String (URL),
            portfolio: String (URL)
        },
        preferences: {
            jobType: [String],
            preferredLocations: [String],
            salaryExpectation: {
                min: Number,
                max: Number,
                currency: String
            },
            remoteWork: Boolean
        }
    },
    isEmailVerified: Boolean,
    lastLogin: Date,
    profileCompleteness: Number (0-100)
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
    "message": "Error description",
    "errors": ["Detailed error messages"],
    "success": false
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

---

## Authentication

Most endpoints require authentication via JWT token sent as an HTTP-only cookie. The token is set during login and cleared during logout.

---

## File Upload

File uploads support:
- **Profile Photos**: JPEG, PNG, JPG (max 2MB)
- **Resumes**: PDF (max 5MB)
- Files are uploaded to Cloudinary with automatic optimization

---

## Validation

All inputs are validated using express-validator with:
- Field type validation
- Length restrictions
- Format validation (emails, URLs, phone numbers)
- Custom business logic validation
- Sanitization and normalization
