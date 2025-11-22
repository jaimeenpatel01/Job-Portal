import React, { createContext, useContext } from 'react';
import useGetCurrentUser from '../hooks/useGetCurrentUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { isLoading, user } = useGetCurrentUser();

    return (
        <AuthContext.Provider value={{ isLoading, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
