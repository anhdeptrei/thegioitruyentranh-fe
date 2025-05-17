import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    // State for managing logged-in user
    // Initialize from localStorage
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.error('Failed to parse user from localStorage:', e);
            return null;
        }
    });

    // Effect to save user to localStorage whenever loggedInUser changes
    useEffect(() => {
        if (loggedInUser) {
            localStorage.setItem('user', JSON.stringify(loggedInUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [loggedInUser]);

    // Function to handle successful login
    const handleLoginSuccess = (userData) => {
        // Synchronously save user data to localStorage BEFORE updating state
        localStorage.setItem('user', JSON.stringify(userData));
        setLoggedInUser(userData); // Update state
        console.log('User state updated:', userData);
    };

    // Function to handle logout
    const handleLogout = () => {
        setLoggedInUser(null); // Clear user state (asynchronous)
        // Synchronously remove user data from localStorage
        localStorage.removeItem('user');
        console.log('User logged out');
    };

    // Provide the state and functions through the context
    const contextValue = {
        loggedInUser,
        handleLoginSuccess,
        handleLogout,
        // You might add other auth-related state/functions here later
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
