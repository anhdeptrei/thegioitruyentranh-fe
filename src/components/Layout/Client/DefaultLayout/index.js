import { useEffect, useState, useContext } from 'react'; // Import useContext
import { Helmet } from 'react-helmet';
import { Switch, useNavigate } from 'react-router-dom';
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
// Import AuthContext and AuthContextProvider
import { AuthContext } from '~/contexts/authContext'; // Import AuthContext
import AuthContextProvider from '~/contexts/authContext'; // Import AuthContextProvider

const DefaultLayout = ({ children }) => {
    const getDark = () => {
        return JSON.parse(localStorage.getItem('dark')) || false;
    };
    const [dark, setDark] = useState(getDark());

    // State for managing modal visibility and type (remains in DefaultLayout)
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'login' or 'register'

    // Get loggedInUser and auth functions from AuthContext
    // Note: We are now CONSUMING AuthContext here, not providing it.
    // The AuthContextProvider will wrap this component.
    const { loggedInUser, handleLoginSuccess, handleLogout } = useContext(AuthContext);

    useEffect(() => {
        localStorage.setItem('dark', JSON.stringify(dark));
    }, [dark]);

    const darkMode = () => {
        setDark(!dark);
    };

    // Functions to control the modal (remain in DefaultLayout)
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
        <>
            <Helmet>
                <title>ReadComic - Read Comic, Manga, Manhwa, Manhua, Online</title>
                <meta name="description" content="ReadComic - Free Read English Comic, Manga, Manhwa, Manhua Online" />
                <meta name="keyword" content="Read Comic, Read Manga, Read Manhwa, Manhua" />
            </Helmet>
            <ScrollToTop />
            {dark ? <style>{`body{background:#2f303e}`}</style> : ''}
            <div className={dark ? 'theme-dark' : ''}>
                <BookmarkContextProvider>
                    <HistoryContextProvider>
                        {/* Pass modal control functions to Header */}
                        {/* loggedInUser and onLogout are now accessed by Header via AuthContext */}
                        <Header
                            dark={dark}
                            darkMode={darkMode}
                            onOpenLogin={openLoginModal} // Still pass modal handlers from here
                            onOpenRegister={openRegisterModal} // Still pass modal handlers from here
                            // loggedInUser and onLogout props are removed
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
                    // LoginForm will get onLoginSuccess from AuthContext
                    <LoginForm onSwitchToRegister={switchToRegister} onClose={closeModal} /> // onLoginSuccess prop is removed
                )}
                {modalType === 'register' && <RegisterForm onSwitchToLogin={switchToLogin} onClose={closeModal} />}
            </Modal>
        </>
    );
};

export default DefaultLayout;
