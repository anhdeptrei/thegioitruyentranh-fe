import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from './Header';
import Footer from './Footer';
import BookmarkContextProvider from '~/contexts/bookmarkContext';
import HistoryContextProvider from '~/contexts/historyContext';
import ScrollToTop from '~/components/ScrollToTop';
import ScrollButton from '~/components/ScrollButton';
// Import Modal and Form components
import Modal from '../PageComponents/Modal';
import LoginForm from '../PageComponents/Modal/LoginForm';
import RegisterForm from '../PageComponents/Modal/RegisterForm';

const DefaultLayout = ({ children }) => {
    const getDark = () => {
        return JSON.parse(localStorage.getItem('dark')) || false;
    };
    const [dark, setDark] = useState(getDark());

    // State for managing modal visibility and type
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'login' or 'register'

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

    // Get the navigate function
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('dark', JSON.stringify(dark));
    }, [dark]);

    // Effect to save user to localStorage whenever loggedInUser changes
    // This useEffect is still useful for cases where loggedInUser state changes
    // without a full page navigation (e.g., manual logout without redirect)
    // but the synchronous save in handleLoginSuccess is critical for redirects.
    useEffect(() => {
        if (loggedInUser) {
            localStorage.setItem('user', JSON.stringify(loggedInUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [loggedInUser]);

    const darkMode = () => {
        setDark(!dark);
    };

    // Functions to control the modal
    const openLoginModal = () => {
        // Only open if not already logged in
        if (!loggedInUser) {
            setModalType('login');
            setShowModal(true);
        }
    };

    const openRegisterModal = () => {
        // Only open if not already logged in
        if (!loggedInUser) {
            setModalType('register');
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
    };

    const switchToRegister = () => {
        setModalType('register');
    };

    const switchToLogin = () => {
        setModalType('login');
    };

    // Function to handle successful login
    const handleLoginSuccess = (userData) => {
        // *** Synchronously save user data to localStorage BEFORE navigating ***
        localStorage.setItem('user', JSON.stringify(userData));

        setLoggedInUser(userData); // Update state (asynchronous, but localStorage is already saved)
        closeModal(); // Close the modal
        console.log('User logged in:', userData);

        // Check user role and redirect if admin (role 2)
        if (userData && userData.role === 2) {
            console.log('Admin user logged in. Redirecting to admin home.');
            navigate('/home'); // Redirect to admin home route
        }
        // For other roles (0, 1), they will remain on the current page
    };

    // Function to handle logout
    const handleLogout = () => {
        setLoggedInUser(null); // Clear user state
        // localStorage.removeItem('user'); // This is handled by the useEffect above
        // Optional: Redirect to home page after logout if needed
        // navigate('/');
        console.log('User logged out');
    };

    return (
        <>
            <Helmet>
                <title>Thế giới truyện tranh - Đọc truyện Manga, Manhwa, Manhua trực tuyến</title>
                <meta
                    name="description"
                    content="Thế giới truyện tranh - Đọc truyện Manga, Manhwa, Manhua trực tuyến"
                />
                <meta name="keyword" content="Đọc truyện Manga, Manhwa, Manhua" />
            </Helmet>
            <ScrollToTop />
            {dark ? <style>{`body{background:#2f303e}`}</style> : ''}
            <div className={dark ? 'theme-dark' : ''}>
                <BookmarkContextProvider>
                    <HistoryContextProvider>
                        {/* Pass user state and logout function to Header */}
                        <Header
                            dark={dark}
                            darkMode={darkMode}
                            onOpenLogin={openLoginModal}
                            onOpenRegister={openRegisterModal}
                            loggedInUser={loggedInUser} // Pass logged-in user state
                            onLogout={handleLogout} // Pass logout function
                        />
                        <ScrollButton />
                        <div className="content">{children}</div>
                        <Footer />
                    </HistoryContextProvider>
                </BookmarkContextProvider>
            </div>

            {/* Render the Modal component */}
            <Modal isOpen={showModal} onClose={closeModal}>
                {modalType === 'login' && (
                    // Pass handleLoginSuccess to LoginForm
                    <LoginForm
                        onSwitchToRegister={switchToRegister}
                        onClose={closeModal}
                        onLoginSuccess={handleLoginSuccess}
                    />
                )}
                {modalType === 'register' && <RegisterForm onSwitchToLogin={switchToLogin} onClose={closeModal} />}
            </Modal>
        </>
    );
};

export default DefaultLayout;
