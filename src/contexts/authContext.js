import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();
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
        // *** Synchronously save user data to localStorage BEFORE navigating ***
        localStorage.setItem('user', JSON.stringify(userData));

        setLoggedInUser(userData); // Update state (asynchronous, but localStorage is already saved)

        // Check user role and redirect if admin (role 2)
        if (userData && userData.role === 2) {
            console.log('Admin user logged in. Redirecting to admin home.');
            navigate('/home'); // Redirect to admin home route
        }
        // For other roles (0, 1), they will remain on the current page
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
