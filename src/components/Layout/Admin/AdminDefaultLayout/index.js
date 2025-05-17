import { useState, useEffect } from 'react'; // Import useEffect
import Sidebar from './Sidebar';
import Topbar from './Topbar';
// Import Modal and Form components (assuming Admin Layout also uses these)
import Modal from '../../Client/PageComponents/Modal'; // Adjust path if necessary
import LoginForm from '../../Client/PageComponents/Modal/LoginForm'; // Adjust path if necessary
import RegisterForm from '../../Client/PageComponents/Modal/RegisterForm'; // Adjust path if necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AdminDefaultLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // State for managing logged-in user (Admin context)
    // Initialize from localStorage
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            // Check if user exists AND has admin role (role === 2)
            const user = savedUser ? JSON.parse(savedUser) : null;
            // Only consider the user logged in if they exist AND are an admin
            return user && user.role === 2 ? user : null;
        } catch (e) {
            console.error('Failed to parse user from localStorage in Admin Layout:', e);
            return null;
        }
    });

    // State for managing modal visibility and type (if admin layout uses them)
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'login' or 'register'

    // Get the navigate function
    const navigate = useNavigate();

    // Effect to save user to localStorage whenever loggedInUser changes
    // This effect is still useful for cases where loggedInUser state changes
    // without a full page navigation (e.g., manual logout without redirect)
    // but the synchronous save/remove in handleLoginSuccess/handleLogout is critical for redirects.
    useEffect(() => {
        if (loggedInUser) {
            // Ensure we only save if it's an admin user for this layout's context
            if (loggedInUser.role === 2) {
                localStorage.setItem('user', JSON.stringify(loggedInUser));
            } else {
                // If somehow a non-admin user state is set here, clear it
                localStorage.removeItem('user');
                setLoggedInUser(null); // Clear state if not admin
            }
        } else {
            localStorage.removeItem('user');
        }
    }, [loggedInUser]);

    // Optional: Effect to check if user is still admin on mount/loggedInUser change
    // and redirect if not. This adds a layer of protection.
    useEffect(() => {
        // If there's a logged-in user but they are NOT an admin, redirect them
        if (loggedInUser && loggedInUser.role !== 2) {
            console.log('Non-admin user detected in Admin Layout. Redirecting.');
            handleLogout(); // Log them out from admin context
            // Redirect to a non-admin page, e.g., home page or a forbidden page
            // navigate('/'); // This navigate is now handled by the handleLogout call above
        } else if (!loggedInUser) {
            // If no user is logged in, you might want to redirect to admin login
            // navigate('/admin/login'); // Example: Redirect to admin login page
            // Or just let the route protection handle it
        }
    }, [loggedInUser, navigate]); // Add navigate to dependency array

    // Function to handle successful login (called from LoginForm)
    const handleLoginSuccess = (userData) => {
        // *** Synchronously save user data to localStorage BEFORE potentially redirecting ***
        // This is crucial for persistence if a redirect happens immediately
        localStorage.setItem('user', JSON.stringify(userData));

        // Check user role immediately after successful login
        if (userData && userData.role === 2) {
            setLoggedInUser(userData); // Set user state only if admin
            closeModal(); // Close the modal
            console.log('Admin user logged in successfully.');
            // Redirect to admin home is already handled by the route setup
            // or the useEffect above if the user lands on an admin route.
            // If you need to force navigation here, uncomment:
            // navigate('/admin/dashboard'); // Example admin dashboard route
        } else {
            console.log('Non-admin user attempted login via Admin form.');
            // Handle case where a non-admin logs in via the admin login modal
            // Maybe show an error or log them out immediately
            localStorage.removeItem('user'); // Ensure it's not saved
            setLoggedInUser(null); // Clear state
            closeModal(); // Close the modal
            alert('Bạn không có quyền truy cập trang quản trị.'); // Inform the user
            // Optional: Redirect to a non-admin page
            // navigate('/');
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        setLoggedInUser(null); // Clear user state (asynchronous)
        // *** Synchronously remove user data from localStorage BEFORE navigating ***
        localStorage.removeItem('user'); // <-- Added this line
        console.log('User logged out from Admin Layout');
        // Redirect to the client home page after logout
        navigate('/'); // <-- This navigate happens after localStorage is cleared
    };

    // Functions to control the modal (if admin layout uses them)
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

    return (
        <div className="app">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                {/* Pass loggedInUser and onLogout to Topbar */}
                {/* Also pass modal handlers if Topbar should open modals */}
                <Topbar
                    loggedInUser={loggedInUser} // Pass logged-in user state
                    onLogout={handleLogout} // *** Pass the handleLogout function ***
                    onOpenLogin={openLoginModal} // Pass modal handlers
                    onOpenRegister={openRegisterModal} // Pass modal handlers
                />
                {children}
            </main>

            {/* Render the Modal component (if admin layout uses them) */}
            {/* Only render if showModal is true */}
            {showModal && (
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
            )}
        </div>
    );
}

export default AdminDefaultLayout;
