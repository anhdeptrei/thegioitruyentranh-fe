import { Box, Icon, IconButton, styled, useTheme, Button, Menu, MenuItem, Typography } from '@mui/material'; // Import Button, Menu, MenuItem, Typography
import { useContext, useState, useRef, useEffect } from 'react'; // Import useState, useRef, useEffect
import { ColorModeContext, token } from '~/theme';
import InputBase from '@mui/material/InputBase';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle'; // Import user icon
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'; // Import logout icon
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'; // Import settings icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Badge from '@mui/material/Badge';
import LoupeOutlinedIcon from '@mui/icons-material/LoupeOutlined';
import axios from 'axios';

// Accept new props for login state and actions
function Topbar({ loggedInUser, onLogout }) {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate(); // Add useNavigate hook

    // State and ref for the user menu
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        onLogout(); // Call the logout function passed from parent
        handleMenuClose(); // Close the menu
    };

    const handleMenuSetting = () => {
        navigate('/adminsetting'); // Use React Router navigation
        handleMenuClose();
    };

    // Menu ID for accessibility
    const menuId = 'primary-account-menu';

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>
                <ExitToAppOutlinedIcon sx={{ mr: 1 }} /> Đăng xuất
            </MenuItem>
        </Menu>
    );

    // Notification states
    const [reports, setReports] = useState([]);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const notifOpen = Boolean(notifAnchorEl);

    useEffect(() => {
        // Fetch all reports for notification
        axios
            .get('http://localhost:8080/reports/all')
            .then((res) => setReports(res.data || []))
            .catch(() => setReports([]));
    }, []);

    const handleNotifClick = (event) => {
        setNotifAnchorEl(event.currentTarget);
    };
    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };
    const handleNotifDetail = (reportId) => {
        navigate(`/supportdetail?id=${reportId}`);
        handleNotifClose();
    };
    useEffect(() => {
        const fetchReports = () => {
            axios
                .get('http://localhost:8080/reports/all')
                .then((res) => setReports(res.data || []))
                .catch(() => setReports([]));
        };
        fetchReports();

        const handleStorage = (e) => {
            if (e.key === 'refreshReports') {
                fetchReports();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box display="flex" backgroundColor={colors?.primary[400] || '#f0f0f0'} borderRadius="3px">
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search"></InputBase>
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS / AUTH BUTTONS */}
            <Box display="flex" alignItems="center">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode == 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </IconButton>
                <Badge badgeContent={reports.length} color="error">
                    <IconButton onClick={handleNotifClick}>
                        <NotificationsOutlinedIcon />
                    </IconButton>
                </Badge>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    sx={{ ml: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    Đăng xuất
                </Button>
            </Box>
            {/* Render the user menu */}
            {renderMenu}

            {/* Notification popover menu */}
            <Menu
                anchorEl={notifAnchorEl}
                open={notifOpen}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {reports.length === 0 ? (
                    <MenuItem disabled>Không có báo cáo mới</MenuItem>
                ) : (
                    reports.map((report) => (
                        <MenuItem key={report.reportId} onClick={() => handleNotifDetail(report.reportId)}>
                            <LoupeOutlinedIcon sx={{ mr: 1 }} />#{report.reportId} - {report.storyTitle || ''} -{' '}
                            {report.detail || ''}
                        </MenuItem>
                    ))
                )}
            </Menu>
        </Box>
    );
}

export default Topbar;
