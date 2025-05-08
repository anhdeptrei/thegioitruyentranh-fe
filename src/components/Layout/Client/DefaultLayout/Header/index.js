import { Link, NavLink, Navigate } from 'react-router-dom'; // Thay Redirect bằng Navigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Header = ({ dark, darkMode }) => {
    const [search, setSearch] = useState('');

    return (
        <div className="header">
            <div className="container">
                <div className="navigation-wrapper">
                    <input id="showmenu" type="checkbox" role="button" />
                    <label className="showmenu" htmlFor="showmenu">
                        <FontAwesomeIcon icon={faBarsStaggered} />
                    </label>
                    <div className="logo">
                        <Link to="/">
                            <span>Read</span>Comic
                        </Link>
                    </div>
                    <ul className="navigation">
                        <li className="menu-item">
                            <NavLink to="/" exact={true}>
                                Home
                            </NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/series-list/0">Releasing Series</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/completed/0">Completed Series</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/bookmark/">Bookmark</NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink to="/history/">History</NavLink>
                        </li>
                    </ul>
                    <input id="showsearch" type="checkbox" role="button" />
                    <label className="showsearch" htmlFor="showsearch">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </label>
                    <div className="darkmode-toggle">
                        <input
                            type="checkbox"
                            name="darkmode"
                            id="darkmode"
                            onChange={darkMode}
                            checked={dark ? 'true' : ''}
                        />
                        <label htmlFor="darkmode" className="mode">
                            <FontAwesomeIcon icon={faMoon} />
                            <FontAwesomeIcon icon={faSun} />
                            <div className="toggle"></div>
                        </label>
                    </div>
                    <div className="search">
                        <div className="search-box">
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && <Navigate to={`/search/${search.replace(' ', '+')}/0/`} replace />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
