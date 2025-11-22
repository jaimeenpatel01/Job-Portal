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
                const res = await axios.get(`${USER_API_END_POINT}/profile`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                }
            } catch (error) {
                // If there's an error (like 401), user is not authenticated
                // Clear any stale user data from Redux
                if (error.response?.status === 401 && user) {
                    dispatch(setUser(null));
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
