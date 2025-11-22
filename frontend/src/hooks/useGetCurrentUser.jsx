import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                console.log('[useGetCurrentUser] Fetching user profile...');
                const res = await axios.get(`${USER_API_END_POINT}/profile`, {
                    withCredentials: true
                });
                console.log('[useGetCurrentUser] Profile fetch response:', res.data);
                if (res.data.success) {
                    console.log('[useGetCurrentUser] User profile set:', res.data.user.email);
                    dispatch(setUser(res.data.user));
                }
            } catch (error) {
                console.log('[useGetCurrentUser] Error fetching profile:', {
                    status: error.response?.status,
                    message: error.response?.data?.message,
                    error: error.message
                });
                // If there's an error (like 401), user is not authenticated
                // Clear any stale user data from Redux
                if (error.response?.status === 401 && user) {
                    console.log('[useGetCurrentUser] 401 error - clearing user');
                    dispatch(setUser(null));
                }
            } finally {
                console.log('[useGetCurrentUser] Profile fetch completed');
                setIsLoading(false);
            }
        };

        // Always fetch on mount to handle OAuth redirects and page refreshes
        // This is especially important for Google OAuth flow
        console.log('[useGetCurrentUser] Hook mounted');
        fetchCurrentUser();
    }, []); // Empty dependency array to run only on mount

    return { isLoading, user };
};

export default useGetCurrentUser;
