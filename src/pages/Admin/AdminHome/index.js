import {
    Box,
    Typography,
    useTheme,
    Paper,
    Button,
    Popover,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { token } from '~/theme';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from '~/components/Header';

function AdminHome() {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const navigate = useNavigate();
    const safe = (obj, key, fallback) => (obj && typeof obj[key] !== 'undefined' ? obj[key] : fallback);
    const [anchorEl, setAnchorEl] = useState(null);
    const [storyCount, setStoryCount] = useState('...');
    const [userCount, setUserCount] = useState('...');
    const [categoryCount, setCategoryCount] = useState('...');
    const [supportCount, setSupportCount] = useState('...');

    useEffect(() => {
        fetch('http://localhost:8080/stories/all')
            .then((res) => res.json())
            .then((data) => setStoryCount(Array.isArray(data) ? data.length : 0))
            .catch(() => setStoryCount(0));
        fetch('http://localhost:8080/users/all')
            .then((res) => res.json())
            .then((data) => setUserCount(Array.isArray(data) ? data.length : 0))
            .catch(() => setUserCount(0));
        fetch('http://localhost:8080/categories/all')
            .then((res) => res.json())
            .then((data) => setCategoryCount(Array.isArray(data) ? data.length : 0))
            .catch(() => setCategoryCount(0));
        fetch('http://localhost:8080/reports/all')
            .then((res) => res.json())
            .then((data) => setSupportCount(Array.isArray(data) ? data.length : 0))
            .catch(() => setSupportCount(0));
    }, []);

    // Thống kê demo, có thể thay bằng dữ liệu thực tế
    // Chỉ giữ lại 4 card chính, bỏ card Cài đặt hệ thống
    const stats = [
        {
            title: 'Truyện tranh',
            value: storyCount, // Sử dụng số lượng thực tế
            icon: <MenuBookOutlinedIcon sx={{ fontSize: 40, color: safe(colors.blueAccent, 500, '#1976d2') }} />,
            color: safe(colors.primary, 400, '#f2f0f0'),
            action: (event) => setAnchorEl(event.currentTarget),
            actionLabel: 'Chọn chức năng',
            isStory: true,
        },
        {
            title: 'Tài khoản',
            value: userCount,
            icon: <PeopleOutlinedIcon sx={{ fontSize: 40, color: safe(colors.greenAccent, 500, '#43a047') }} />,
            color: safe(colors.primary, 400, '#f2f0f0'),
            action: () => navigate('/users'),
            actionLabel: 'Quản lý tài khoản',
        },
        {
            title: 'Danh mục',
            value: categoryCount,
            icon: <CategoryOutlinedIcon sx={{ fontSize: 40, color: safe(colors.redAccent, 400, '#e53935') }} />,
            color: safe(colors.primary, 400, '#f2f0f0'),
            action: () => navigate('/categories'),
            actionLabel: 'Quản lý danh mục',
        },
        {
            title: 'Hỗ trợ',
            value: supportCount,
            icon: <SupportAgentOutlinedIcon sx={{ fontSize: 40, color: safe(colors.blueAccent, 400, '#1976d2') }} />,
            color: safe(colors.primary, 400, '#f2f0f0'),
            action: () => navigate('/support'),
            actionLabel: 'Hỗ trợ người dùng',
        },
    ];

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (path) => {
        navigate(path);
        handleClosePopover();
    };

    return (
        <Box m="20px">
            <Typography variant="h5" color={colors.grey[200]}>
                Chào mừng bạn đến với trang quản trị!
                <br />
                Hãy chọn một mục để tiến hành quản lý các chức năng hệ thống.
            </Typography>
            <Box
                sx={{
                    p: 0,
                    m: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: 'calc(100vh - 120px)',
                        mx: 'auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'stretch',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        background: colors.primary[400],
                    }}
                >
                    {stats.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                width: '50%',
                                maxWidth: 600,
                                height: { xs: '50%', sm: '50%' },
                                minWidth: 300,
                                minHeight: 260,
                                p: 2,
                                boxSizing: 'border-box',
                                display: 'flex',
                            }}
                        >
                            <Paper
                                elevation={6}
                                sx={{
                                    flex: 1,
                                    m: 0,
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    background: item.color,
                                    borderRadius: 3,
                                    minHeight: 260,
                                    height: '100%',
                                    width: '100%',
                                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
                                    border: '2px solid #fff',
                                    position: 'relative',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.35)',
                                        transform: 'translateY(-6px) scale(1.04)',
                                        borderColor: colors.greenAccent[400],
                                    },
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: 24, left: 24 }}>{item.icon}</Box>
                                <Box
                                    sx={{
                                        flex: 1,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mt: 6,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color={colors.grey[100]}
                                        fontWeight="bold"
                                        sx={{ mb: 1, mt: 2, textAlign: 'center' }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="h3"
                                        color={colors.blueAccent[200]}
                                        fontWeight="bold"
                                        sx={{ mb: 2, textAlign: 'center' }}
                                    >
                                        {item.value}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mt: 'auto',
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        minWidth: 160,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                                        '&:hover': { backgroundColor: colors.blueAccent[600] },
                                    }}
                                    onClick={item.action}
                                >
                                    {item.actionLabel}
                                </Button>
                            </Paper>
                        </Box>
                    ))}
                </Box>
                {/* Popover cho card Quản lí truyện tranh */}
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick('/edit-stories?action=add')}>
                                <ListItemText primary="Thêm truyện mới" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick('/stories')}>
                                <ListItemText primary="Thêm chương mới" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Popover>
                {/* <Box mt={5} textAlign="center">
                <Typography variant="h5" color={colors.grey[200]}>
                    Chào mừng bạn đến với trang quản trị!
                    <br />
                    Hãy sử dụng sidebar bên trái để quản lý các chức năng hệ thống.
                </Typography>
            </Box> */}
            </Box>
        </Box>
    );
}

export default AdminHome;
