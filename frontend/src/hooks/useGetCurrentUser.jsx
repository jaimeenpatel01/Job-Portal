import { setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                console.log('Fetching current user profile...');
                const res = await axios.get(`${USER_API_END_POINT}/profile`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    console.log('User profile fetched successfully:', res.data.user.email);
                    dispatch(setUser(res.data.user));
                } else {
                    console.log('Failed to fetch user profile:', res.data.message);
                }
            } catch (error) {
                // If there's an error (like 401), user is not authenticated
                // Clear any stale user data from Redux
                if (error.response?.status === 401 && user) {
                    console.log('User not authenticated, clearing Redux state');
                    dispatch(setUser(null));
                } else if (error.response?.status !== 401) {
                    console.log('Error fetching user profile:', error.response?.data?.message || error.message);
                }
            }
        };

        // Always fetch on mount to handle OAuth redirects and page refreshes
        // This is especially important for Google OAuth flow
        fetchCurrentUser();
    }, []); // Empty dependency array to run only on mount

    return null; // This hook doesn't return anything, just manages state
};

export default useGetCurrentUser;
