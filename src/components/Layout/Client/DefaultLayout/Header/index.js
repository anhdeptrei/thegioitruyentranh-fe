import { Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import user, settings, logout icons
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '~/contexts/authContext';

let debounceTimeout = null;

const Header = ({ dark, darkMode, onOpenLogin, onOpenRegister }) => {
    const [search, setSearch] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [suggestions, setSuggestions] = useState([]); // Danh sách gợi ý truyện
    const [showDropdown, setShowDropdown] = useState(false);
    const userMenuRef = useRef(null);
    const { loggedInUser, handleLogout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

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
        handleLogout(); // Call the logout function from AuthContext
        setShowUserMenu(false); // Close the menu after logging out
    };
    useEffect(() => {
        if (!location.pathname.startsWith('/search')) {
            setSearch('');
        }
    }, [location.pathname]);

    // Gợi ý truyện khi nhập search (debounce 300ms)
    useEffect(() => {
        if (!search.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        setShowDropdown(true);
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/stories/search?keyword=${encodeURIComponent(search)}&page=0`,
                );
                const data = await res.json();
                // Nếu backend trả về mảng truyện
                if (Array.isArray(data)) {
                    setSuggestions(data.slice(0, 7)); // Lấy tối đa 7 gợi ý
                } else if (Array.isArray(data.content)) {
                    setSuggestions(data.content.slice(0, 7));
                } else {
                    setSuggestions([]);
                }
            } catch (err) {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(debounceTimeout);
    }, [search]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-box')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            setShowDropdown(false);
            navigate(`/search/${search.replace(/\s+/g, '+')}/0/`);
            setSearch('');
        }
    };
    const handleSearchClick = () => {
        if (search.trim()) {
            setShowDropdown(false);
            navigate(`/search/${search.replace(/\s+/g, '+')}/0/`);
            setSearch('');
        }
    };
    // Khi chọn một truyện trong dropdown
    const handleSuggestionClick = (story) => {
        console.log('Selected story:', story);
        setShowDropdown(false);
        setSearch('');
        navigate(`/series/${story.story_id}`); // Điều hướng sang trang chi tiết truyện (tùy route của bạn)
    };

    console.log('Header component rendered', loggedInUser);
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
                                    {/* Hiển thị avatar nếu có, nếu không thì lấy noimage.png */}
                                    <img
                                        src={loggedInUser.avatar ? loggedInUser.avatar : '/assets/noimage.png'}
                                        alt="avatar"
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginRight: 8,
                                            border: '2px solid #6e6dfb',
                                            background: '#fff',
                                        }}
                                    />
                                    <span className="user-name">{loggedInUser.username}</span>
                                </div>
                                {showUserMenu && (
                                    <ul className="user-menu">
                                        {/* Optional: Display username in menu */}
                                        {/* <li className="menu-item">Xin chào, {loggedInUser.username}</li> */}
                                        <li className="menu-item">
                                            <Link to="/setting" onClick={() => setShowUserMenu(false)}>
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
                            <div className="search-box" style={{ position: 'relative' }}>
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    onFocus={() => search && setShowDropdown(true)}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    className="search-icon-btn"
                                    onClick={handleSearchClick}
                                    style={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        color: '#6e6dfb',
                                        fontSize: 18,
                                    }}
                                    tabIndex={-1}
                                >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                                {/* Bỏ nút tìm kiếm */}
                                {showDropdown && suggestions.length > 0 && (
                                    <div className="search-suggestions-container">
                                        <ul className="search-suggestions">
                                            {suggestions.map((story) => {
                                                const latestChapterNumber =
                                                    story.highestChapterNumber || story.highest_chapter_number;
                                                return (
                                                    <li
                                                        key={story.storyId || story.id || story.story_id}
                                                        className="search-suggestion-item"
                                                        onClick={() => handleSuggestionClick(story)}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        <img
                                                            src={
                                                                story.cover_image ||
                                                                story.coverImage ||
                                                                '/assets/noimage.png'
                                                            }
                                                            alt={story.title}
                                                            className="search-suggestion-thumb"
                                                        />
                                                        <div className="search-suggestion-info">
                                                            <div className="search-suggestion-title">
                                                                {story.title || story.storyTitle}
                                                            </div>
                                                            {latestChapterNumber && (
                                                                <div className="search-suggestion-chapter">
                                                                    Chapter {latestChapterNumber}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
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
                            {loggedInUser && (
                                <li className="menu-item">
                                    <a
                                        href="https://forms.gle/Nh9UYW3rz5tHZQHQ8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        📝 Yêu cầu dịch truyện
                                    </a>
                                </li>
                            )}
                        </ul>

                        {/* Mobile Search Toggle (remains in header-bottom) */}
                        {/* <input id="showsearch" type="checkbox" role="button" />
                        <label className="showsearch" htmlFor="showsearch">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </label> */}

                        {/* Mobile Search Input (remains in header-bottom) */}

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
                        <div className="search mobile-search">
                            <div className="search-box" style={{ position: 'relative' }}>
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    onFocus={() => search && setShowDropdown(true)}
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    className="search-icon-btn"
                                    onClick={handleSearchClick}
                                    style={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        color: '#6e6dfb',
                                        fontSize: 18,
                                    }}
                                    tabIndex={-1}
                                >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                                {/* Bỏ nút tìm kiếm */}
                                {showDropdown && suggestions.length > 0 && (
                                    <div className="search-suggestions-container">
                                        <ul className="search-suggestions">
                                            {suggestions.map((story) => {
                                                const latestChapterNumber =
                                                    story.highestChapterNumber || story.highest_chapter_number;
                                                return (
                                                    <li
                                                        key={story.storyId || story.id || story.story_id}
                                                        className="search-suggestion-item"
                                                        onClick={() => handleSuggestionClick(story)}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        <img
                                                            src={
                                                                story.cover_image ||
                                                                story.coverImage ||
                                                                '/assets/noimage.png'
                                                            }
                                                            alt={story.title}
                                                            className="search-suggestion-thumb"
                                                        />
                                                        <div className="search-suggestion-info">
                                                            <div className="search-suggestion-title">
                                                                {story.title || story.storyTitle}
                                                            </div>
                                                            {latestChapterNumber && (
                                                                <div className="search-suggestion-chapter">
                                                                    Chapter {latestChapterNumber}:{' '}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
