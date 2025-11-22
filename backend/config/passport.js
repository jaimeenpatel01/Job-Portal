import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8000/api/v1/user/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });
        
        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if user exists with same email but different auth provider
        existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
            // Link Google account to existing user
            existingUser.googleId = profile.id;
            existingUser.authProvider = 'google';
            await existingUser.save();
            return done(null, existingUser);
        }

        // Create new user
        const newUser = await User.create({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            // phoneNumber is not required for Google users initially
            authProvider: 'google',
            role: 'student', // Default role, can be changed later
            profile: {
                profilePhoto: profile.photos[0]?.value || '',
            },
            isEmailVerified: true // Google emails are pre-verified
        });

        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
