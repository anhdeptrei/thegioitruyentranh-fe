// import { Link, NavLink, Navigate } from 'react-router-dom'; // Thay Redirect bằng Navigate
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import { faSun } from '@fortawesome/free-solid-svg-icons';
// import { faMoon } from '@fortawesome/free-solid-svg-icons';
// import { useState } from 'react';

// const Header = ({ dark, darkMode }) => {
//     const [search, setSearch] = useState('');

//     return (
//         <>
//             <div className="header-top">
//                 <div className="container">
//                     <div className="navigation-wrapper">
//                         <div className="logo">
//                             <Link to="/">
//                                 <span>Read</span>Comic
//                             </Link>
//                         </div>

//                         {/* Thêm nút Đăng nhập và Đăng kí */}
//                         <div className="auth-buttons">
//                             <Link to="/login" className="auth-button login-button">
//                                 Đăng nhập
//                             </Link>
//                             <Link to="/register" className="auth-button register-button">
//                                 Đăng kí
//                             </Link>
//                         </div>
//                         {/* Kết thúc thêm nút */}

//                         <input id="showsearch" type="checkbox" role="button" />
//                         <label className="showsearch" htmlFor="showsearch">
//                             <FontAwesomeIcon icon={faMagnifyingGlass} />
//                         </label>

//                         <div className="search">
//                             <div className="search-box">
//                                 <input
//                                     className="search-input"
//                                     type="text"
//                                     placeholder="Search..."
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                 />
//                                 {search && <Navigate to={`/search/${search.replace(' ', '+')}/0/`} replace />}
//                             </div>
//                         </div>
//                         <div className="darkmode-toggle">
//                             <input
//                                 type="checkbox"
//                                 name="darkmode"
//                                 id="darkmode"
//                                 onChange={darkMode}
//                                 checked={dark ? 'true' : ''}
//                             />
//                             <label htmlFor="darkmode" className="mode">
//                                 <FontAwesomeIcon icon={faMoon} />
//                                 <FontAwesomeIcon icon={faSun} />
//                                 <div className="toggle"></div>
//                             </label>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="header-bottom">
//                 <div className="container">
//                     <div className="navigation-wrapper">
//                         <input id="showmenu" type="checkbox" role="button" />
//                         <label className="showmenu" htmlFor="showmenu">
//                             <FontAwesomeIcon icon={faBarsStaggered} />
//                         </label>

//                         {/* <div className="logo">
//                             <Link to="/">
//                                 <span>Read</span>Comic
//                             </Link>
//                         </div> */}

//                         <ul className="navigation">
//                             <li className="menu-item">
//                                 <NavLink to="/" exact={true}>
//                                     Home
//                                 </NavLink>
//                             </li>
//                             <li className="menu-item">
//                                 <NavLink to="/series-list/0">Releasing Series</NavLink>
//                             </li>
//                             <li className="menu-item">
//                                 <NavLink to="/completed/0">Completed Series</NavLink>
//                             </li>
//                             <li className="menu-item">
//                                 <NavLink to="/bookmark/">Bookmark</NavLink>
//                             </li>
//                             <li className="menu-item">
//                                 <NavLink to="/history/">History</NavLink>
//                             </li>
//                         </ul>

//                         {/* <input id="showsearch" type="checkbox" role="button" />
//                         <label className="showsearch" htmlFor="showsearch">
//                             <FontAwesomeIcon icon={faMagnifyingGlass} />
//                         </label>

//                         <div className="darkmode-toggle">
//                             <input
//                                 type="checkbox"
//                                 name="darkmode"
//                                 id="darkmode"
//                                 onChange={darkMode}
//                                 checked={dark ? 'true' : ''}
//                             />
//                             <label htmlFor="darkmode" className="mode">
//                                 <FontAwesomeIcon icon={faMoon} />
//                                 <FontAwesomeIcon icon={faSun} />
//                                 <div className="toggle"></div>
//                             </label>
//                         </div>

//                         <div className="search">
//                             <div className="search-box">
//                                 <input
//                                     className="search-input"
//                                     type="text"
//                                     placeholder="Search..."
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                 />
//                                 {search && <Navigate to={`/search/${search.replace(' ', '+')}/0/`} replace />}
//                             </div>
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Header;
import { Link, NavLink, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import user, settings, logout icons
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect

const Header = ({ dark, darkMode, onOpenLogin, onOpenRegister, loggedInUser, onLogout }) => {
    const [search, setSearch] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false); // State for user menu visibility
    const userMenuRef = useRef(null); // Ref for the user menu div

    // Effect to close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the user-profile div (which contains the icon and menu)
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuRef]); // Re-run effect if userMenuRef changes (though it won't)

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleLogoutClick = () => {
        onLogout(); // Call the logout function passed from parent
        setShowUserMenu(false); // Close the menu after logging out
    };

    return (
        <>
            <div className="header-top">
                <div className="container">
                    <div className="navigation-wrapper">
                        <div className="logo">
                            <Link to="/">
                                <span>Thế giới </span>Truyện tranh
                            </Link>
                        </div>

                        {/* Conditional rendering based on loggedInUser */}
                        {!loggedInUser ? (
                            // Auth buttons (show if not logged in)
                            <div className="auth-buttons">
                                <button className="auth-button login-button" onClick={onOpenLogin}>
                                    Đăng nhập
                                </button>
                                <button className="auth-button register-button" onClick={onOpenRegister}>
                                    Đăng kí
                                </button>
                            </div>
                        ) : (
                            // User Profile/Icon (show if logged in)
                            <div className="user-profile" ref={userMenuRef}>
                                {/* Attach ref here */}
                                <div className="user-icon" onClick={toggleUserMenu}>
                                    {/* Display username or a default icon */}
                                    {/* You might want to display loggedInUser.username or loggedInUser.avatar */}
                                    <FontAwesomeIcon icon={faUserCircle} />
                                    {/* Optional: Display username next to icon */}
                                    <span>{loggedInUser.username}</span>
                                </div>
                                {showUserMenu && (
                                    <ul className="user-menu">
                                        {/* Optional: Display username in menu */}
                                        {/* <li className="menu-item">Xin chào, {loggedInUser.username}</li> */}
                                        <li className="menu-item">
                                            <Link to="/settings" onClick={() => setShowUserMenu(false)}>
                                                {/* Close menu on click */}
                                                <FontAwesomeIcon icon={faCog} /> Cài đặt
                                            </Link>
                                        </li>
                                        <li className="menu-item">
                                            <button onClick={handleLogoutClick}>
                                                {/* Use button for action */}
                                                <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Desktop Search Input (remains in header-top) */}
                        <div className="search desktop-search">
                            <div className="search-box">
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && <Navigate to={`/search/${search.replace(' ', '+')}/0/`} replace />}
                            </div>
                        </div>

                        {/* Desktop Dark mode toggle (moved back to header-top) */}
                        <div className="darkmode-toggle desktop-darkmode-toggle">
                            {' '}
                            {/* Added desktop-darkmode-toggle class */}
                            <input
                                type="checkbox"
                                name="darkmode"
                                id="darkmode-desktop" // Changed ID to avoid conflict
                                onChange={darkMode}
                                checked={dark ? 'true' : ''}
                            />
                            <label htmlFor="darkmode-desktop" className="mode">
                                {' '}
                                {/* Updated htmlFor */}
                                <FontAwesomeIcon icon={faMoon} />
                                <FontAwesomeIcon icon={faSun} />
                                <div className="toggle"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header-bottom">
                <div className="container">
                    <div className="navigation-wrapper">
                        {/* Mobile Menu Toggle (remains in header-bottom) */}
                        <input id="showmenu" type="checkbox" role="button" />
                        <label className="showmenu" htmlFor="showmenu">
                            <FontAwesomeIcon icon={faBarsStaggered} />
                        </label>
                        <ul className="navigation">
                            <li className="menu-item">
                                <NavLink to="/" exact={true}>
                                    Trang chủ
                                </NavLink>
                            </li>
                            <li className="menu-item">
                                <NavLink to="/series-list/0">Đang phát hành</NavLink>
                            </li>
                            <li className="menu-item">
                                <NavLink to="/completed/0">Đã hoàn thành</NavLink>
                            </li>
                            <li className="menu-item">
                                <NavLink to="/bookmark/">Theo dõi</NavLink>
                            </li>
                            <li className="menu-item">
                                <NavLink to="/history/">Lịch sử đọc</NavLink>
                            </li>
                        </ul>

                        {/* Mobile Search Toggle (remains in header-bottom) */}
                        <input id="showsearch" type="checkbox" role="button" />
                        <label className="showsearch" htmlFor="showsearch">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </label>

                        {/* Mobile Search Input (remains in header-bottom) */}
                        <div className="search mobile-search">
                            <div className="search-box">
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && <Navigate to={`/search/${search.replace(' ', '+')}/0/`} replace />}
                            </div>
                        </div>

                        {/* Mobile Dark mode toggle (moved back to header-bottom) */}
                        <div className="darkmode-toggle mobile-darkmode-toggle">
                            {' '}
                            {/* Added mobile-darkmode-toggle class */}
                            <input
                                type="checkbox"
                                name="darkmode"
                                id="darkmode-mobile" // Changed ID to avoid conflict
                                onChange={darkMode}
                                checked={dark ? 'true' : ''}
                            />
                            <label htmlFor="darkmode-mobile" className="mode">
                                {' '}
                                {/* Updated htmlFor */}
                                <FontAwesomeIcon icon={faMoon} />
                                <FontAwesomeIcon icon={faSun} />
                                <div className="toggle"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
