import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { token } from '~/theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Header from '~/components/Header';
import { useNavigate } from 'react-router-dom';

function Users() {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const columns = [
        { field: 'user_id', headerName: 'ID', flex: 1 }, // ID người dùng
        { field: 'username', headerName: 'Username', flex: 1, cellClassName: 'name-column--cell' }, // Tên người dùng
        { field: 'email', headerName: 'Email', flex: 1 }, // Email
        // Trạng thái (mở khóa, khóa,...)
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: ({ row: { status } }) => {
                return (
                    <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                        {status === 'locked' ? (
                            <LockOutlinedIcon color="error" /> // Icon khóa
                        ) : (
                            <LockOpenOutlinedIcon color="success" /> // Icon mở khóa
                        )}
                        <Typography sx={{ ml: 1 }}>{status === 'locked' ? 'Locked' : 'Active'}</Typography>
                    </Box>
                );
            },
        },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            renderCell: ({ row: { role } }) => {
                // Hiển thị vai trò với màu sắc
                return (
                    <Box display="flex" justifyContent="center" width="100%" height="100%" alignItems="center">
                        <Box
                            width="60%"
                            padding="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={
                                role === 0
                                    ? colors.greenAccent[600] // Vai trò 0 (user)
                                    : role === 1
                                    ? colors.greenAccent[700] // Vai trò 1 (manager)
                                    : colors.greenAccent[800] // Vai trò khác (admin)
                            }
                            borderRadius="4px"
                        >
                            {role === 0 && <LockOpenOutlinedIcon />}
                            {role === 1 && <SecurityOutlinedIcon />}
                            {role === 2 && <AdminPanelSettingsOutlinedIcon />}
                            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
                                {role === 0 ? 'User' : role === 1 ? 'Manager' : 'Admin'}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        { field: 'detail', headerName: 'Detail', flex: 1 }, // Thông tin chi tiết
        {
            field: 'create_at',
            headerName: 'Create At',
            flex: 1,
            valueFormatter: (params) => {
                const date = new Date(params); // Chuyển đổi chuỗi ngày thành đối tượng Date
                return date.toLocaleDateString(); // Định dạng thành ngày/tháng/năm
            },
        },
        {
            field: 'action',
            headerName: 'Action', // Đổi tên cột thành "Action"
            flex: 1,
            renderCell: (params) => {
                return (
                    <Box display="flex" gap="10px">
                        {/* Nút Edit */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: colors.greenAccent[600], // Màu nút Edit
                                color: colors.grey[100], // Màu chữ
                                '&:hover': {
                                    backgroundColor: colors.greenAccent[500], // Màu khi hover
                                },
                            }}
                            onClick={() => handleEdit(params.row)} // Gọi hàm xử lý khi nhấn nút Edit
                        >
                            Edit
                        </Button>
                        {/* Nút Delete */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: colors.redAccent[600], // Màu nút Delete
                                color: colors.grey[100], // Màu chữ
                                '&:hover': {
                                    backgroundColor: colors.redAccent[500], // Màu khi hover
                                },
                            }}
                            onClick={() => handleDelete(params.row)} // Gọi hàm xử lý khi nhấn nút Delete
                        >
                            Delete
                        </Button>
                    </Box>
                );
            },
        },
    ];
    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete user ${row.username}?`)) {
            axios
                .delete(`http://localhost:8080/users/${row.user_id}`) // Gửi yêu cầu xóa đến API
                .then(() => {
                    alert('User deleted successfully!');
                    fetchPackages(); // Tải lại danh sách người dùng sau khi xóa
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                    alert('Failed to delete user. Please try again.');
                });
        }
    };
    const navigate = useNavigate();
    const handleEdit = (row) => {
        // Xử lý sự kiện khi nhấn nút Edit
        console.log('Edit row:', row);
        // Có thể mở một modal hoặc chuyển hướng đến trang chỉnh sửa
        navigate(`/edit-users?action=edit&id=${row.user_id}`);
    };
    const handleAddUser = () => {
        // Chuyển hướng đến trang thêm/chỉnh sửa người dùng với trạng thái "add"
        navigate('/edit-users?action=add');
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = () => {
        axios
            .get('http://localhost:8080/users/all')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('There was an error fetching the packages!', error);
            });
    };
    console.log(data);

    return (
        <Box m="20px">
            <Header title="Quản lí tài khoản" subtitle="Managing the account" />
            {/* Nút thêm người dùng */}
            <Box display="flex" justifyContent="flex-end" mb="20px">
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        '&:hover': {
                            backgroundColor: colors.blueAccent[600],
                        },
                    }}
                    onClick={() => handleAddUser()}
                >
                    Thêm người dùng
                </Button>
            </Box>
            <Box
                height="75vh"
                sx={{
                    '& .MuiDataGrid-root': {
                        border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .name-column--cell': {
                        color: colors.greenAccent[300],
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: colors.primary[400],
                    },
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: colors.blueAccent[700],
                        borderTop: 'none',
                    },
                }}
            >
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row.user_id} // Xác định `user_id` làm `id`
                />
            </Box>
        </Box>
    );
}

export default Users;
