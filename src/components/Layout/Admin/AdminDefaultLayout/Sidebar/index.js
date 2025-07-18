import { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import 'react-pro-sidebar/dist/css/styles.css';
import { token } from '~/theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, loggedInUser }) => {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const location = useLocation(); // Get current location
    const [selected, setSelected] = useState('');

    useEffect(() => {
        // Map the current path to the corresponding title
        const pathToTitleMap = {
            '/': 'Trang chủ',
            '/stories': 'Quản lí truyện tranh',
            '/users': 'Quản lí tài khoản',
            '/adminsupport': 'Hỗ trợ',
            '/adminsetting': 'Cài đặt',
            '/edit-users': 'Quản lí tài khoản',
            '/categories': 'Quản lí danh mục',
        };
        setSelected(pathToTitleMap[location.pathname] || ''); // Set selected based on path
    }, [location.pathname]);

    return (
        <Box
            sx={{
                '& .pro-sidebar-inner': {
                    background: `${colors.primary[400]} !important`,
                },
                '& .pro-icon-wrapper': {
                    backgroundColor: 'transparent !important',
                },
                '& .pro-inner-item': {
                    padding: '5px 35px 5px 20px !important',
                },
                '& .pro-inner-item:hover': {
                    color: '#868dfb !important',
                },
                '& .pro-menu-item.active': {
                    color: '#6870fa !important',
                },
            }}
        >
            {console.log('Sidebar collapsed:', isCollapsed)}
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    <MenuItem
                        onClick={() => {
                            setIsCollapsed(!isCollapsed);
                        }}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: '10px 0 20px 0',
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                                <Typography variant="h4" color={colors.grey[100]}>
                                    ADMIN
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        setIsCollapsed(!isCollapsed);
                                    }}
                                >
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={
                                        loggedInUser && loggedInUser.avatar
                                            ? loggedInUser.avatar
                                            : '../../assets/noimage.png'
                                    }
                                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: '10px 0 0 0' }}
                                >
                                    {console.log('Logged in user:', loggedInUser)}
                                    {loggedInUser && loggedInUser.username ? loggedInUser.username : 'Admin'}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    Quản trị viên
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : '10%'}>
                        <Item
                            title="Trang chủ"
                            to="/home"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        {/* <Item
                            title="Quản lí truyện tranh"
                            to="/stories"
                            icon={<MenuBookOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}
                        <SubMenu
                            title="Quản lí truyện tranh"
                            icon={<MenuBookOutlinedIcon />}
                            style={{
                                color: colors.grey[100],
                            }}
                        >
                            <Item
                                title="Thêm truyện mới"
                                to="/stories"
                                icon={<LocalLibraryOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title="Thêm chương mới"
                                to="/storychapter"
                                icon={<LibraryBooksOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </SubMenu>
                        <Item
                            title="Quản lí danh mục"
                            to="/categories"
                            icon={<CategoryOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Quản lí tài khoản"
                            to="/users"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Hỗ trợ"
                            to="/support"
                            icon={<SupportAgentOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
