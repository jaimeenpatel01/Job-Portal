# Password Reset Functionality Setup

## Overview
This implementation provides a complete password reset flow using Novu email service:
1. User requests password reset via "Forgot Password?" link
2. System sends reset email with secure token
3. User clicks link and sets new password
4. Token is validated and password is updated

## Frontend Components

### 1. ForgotPassword Component (`/forgot-password`)
- Email input form
- Sends reset request to backend
- Shows success message after email sent
- Option to try another email

### 2. ResetPassword Component (`/reset-password`)
- New password and confirm password inputs
- Token validation from URL
- Password strength validation (min 6 characters)
- Redirects to login after successful reset

### 3. Login Component Updates
- Added "Forgot Password?" link below password field
- Links to `/forgot-password` route

## Backend Implementation

### 1. New Routes
```javascript
POST /api/v1/user/forgot-password - Request password reset
POST /api/v1/user/reset-password - Reset password with token
```

### 2. New Controller Functions

#### `forgotPassword`
- Validates email exists
- Generates JWT reset token (1 hour expiry)
- Sends reset email via Novu
- Returns success message

#### `resetPassword`
- Validates reset token
- Updates user password with new hashed password
- Returns success message

### 3. Novu Integration
- Uses existing `sendPasswordResetEmail` function
- Sends email with reset link containing JWT token
- Link format: `/reset-password?token=<jwt_token>`

## Environment Variables Required

```env
# JWT Secret (for token generation/validation)
SECRET_KEY=your_jwt_secret_key

# Novu API Key
NOVU_API_KEY=your_novu_api_key

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

## Novu Dashboard Setup

### 1. Create Password Reset Workflow
1. Go to Novu Dashboard → Workflows
2. Create new workflow named "password-reset"
3. Add Email channel
4. Configure email template:

**Subject:** Password Reset Request
**Content:**
```html
<h2>Password Reset Request</h2>
<p>Hello,</p>
<p>You requested a password reset for your Job Portal account.</p>
<p>Click the link below to reset your password:</p>
<a href="{{resetLink}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
<br>
<p>Best regards,<br>Job Portal Team</p>
```

### 2. Template Variables
- `{{resetLink}}` - The complete reset URL with token

## Security Features

### 1. Token Security
- JWT tokens with 1-hour expiration
- Signed with your SECRET_KEY
- Single-use tokens (can be enhanced for additional security)

### 2. Password Validation
- Minimum 6 characters required
- Password confirmation matching
- Secure password hashing with bcrypt

### 3. Error Handling
- Invalid/expired token handling
- User existence validation
- Graceful error messages

## User Flow

1. **Request Reset**
   - User clicks "Forgot Password?" on login page
   - Enters email address
   - System validates email exists
   - Reset email sent via Novu

2. **Reset Password**
   - User clicks link in email
   - Redirected to reset password page
   - Enters new password and confirmation
   - System validates and updates password
   - User redirected to login page

## Testing

### 1. Test Forgot Password
1. Go to `/login`
2. Click "Forgot Password?"
3. Enter valid email
4. Check email received
5. Verify reset link works

### 2. Test Password Reset
1. Click reset link from email
2. Enter new password
3. Confirm password
4. Submit and verify redirect to login
5. Try logging in with new password

## Troubleshooting

### Common Issues
1. **Email not received**: Check Novu dashboard, spam folder
2. **Invalid token**: Ensure SECRET_KEY is consistent
3. **Reset link expired**: Tokens expire after 1 hour
4. **Frontend routing**: Ensure routes are properly configured

### Debug Steps
1. Check backend console logs
2. Verify Novu API key and workflow configuration
3. Test JWT token generation/validation
4. Check frontend route configuration

## Future Enhancements

1. **Rate Limiting**: Prevent abuse of forgot password
2. **Token Blacklisting**: Track used tokens
3. **Audit Logging**: Log password reset attempts
4. **Email Templates**: Customize email styling
5. **SMS Integration**: Add SMS as alternative reset method
