import { Novu } from '@novu/node';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Novu with your API key
const novu = new Novu(process.env.NOVU_API_KEY);

export const sendWelcomeEmail = async (userData) => {
    try {
        // Create a subscriber in Novu
        await novu.subscribers.identify(userData.email, {
            email: userData.email,
            firstName: userData.fullname.split(' ')[0],
            lastName: userData.fullname.split(' ').slice(1).join(' ') || '',
            phone: userData.phoneNumber,
            role: userData.role
        });

        // Send welcome email notification
        await novu.trigger('welcome-email', {
            to: {
                subscriberId: userData.email,
                email: userData.email
            },
            payload: {
                fullName: userData.fullname,
                email: userData.email,
                role: userData.role,
                welcomeMessage: `Welcome to Job Portal! We're excited to have you on board as a ${userData.role}.`
            }
        });

        console.log(`Welcome email sent successfully to ${userData.email}`);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        await novu.trigger('password-reset', {
            to: {
                subscriberId: email,
                email: email
            },
            payload: {
                resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
                email: email
            }
        });

        console.log(`Password reset email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

export default novu;
