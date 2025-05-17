import { Box, Icon, IconButton, styled, useTheme, Button, Menu, MenuItem, Typography } from '@mui/material'; // Import Button, Menu, MenuItem, Typography
import { useContext, useState, useRef } from 'react'; // Import useState, useRef
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

// Accept new props for login state and actions
function Topbar({ loggedInUser, onLogout, onOpenLogin, onOpenRegister }) {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

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
            {/* Optional: Display username */}
            {/* {loggedInUser && (
                 <MenuItem onClick={handleMenuClose}>
                     <Typography>{loggedInUser.username}</Typography>
                 </MenuItem>
            )} */}
            <MenuItem onClick={handleMenuClose}>
                <SettingsOutlined sx={{ mr: 1 }} /> Cài đặt
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ExitToAppOutlinedIcon sx={{ mr: 1 }} /> Đăng xuất
            </MenuItem>
        </Menu>
    );

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
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode == 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                {/* Conditional rendering based on loggedInUser */}
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit" // Use theme color
                    sx={{ ml: 1 }} // Margin left
                >
                    <AccountCircle /> {/* User icon */}
                </IconButton>
            </Box>
            {/* Render the user menu */}
            {renderMenu}
        </Box>
    );
}

export default Topbar;
