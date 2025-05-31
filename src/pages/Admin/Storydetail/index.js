import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { token } from '~/theme';
import Header from '~/components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import LoupeOutlinedIcon from '@mui/icons-material/LoupeOutlined';
function Storydetail() {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const [storyData, setStoryData] = useState();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const storyId = queryParams.get('id'); // ID của truyện (nếu có)
    // Fetch story data if editing

    useEffect(() => {
        fetchStories();
    }, [storyId]);

    const fetchStories = () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        axios
            .get(`http://localhost:8080/stories/${storyId}`)
            .then((response) => {
                const storyData = response.data;
                setStoryData(storyData);
                setData(storyData.chapters); // Giả sử storyData.chapters chứa danh sách các chương
                setLoading(false); // Dừng trạng thái loading khi dữ liệu được tải xong
                console.log('Story data:', storyData.story_id); // Kiểm tra dữ liệu truyện
            })
            .catch((error) => {
                console.error('Error fetching story data:', error);
                setLoading(false); // Dừng trạng thái loading khi xảy ra lỗi
            });
    };

    const columns = [
        { field: 'chapterId', headerName: 'ID', flex: 1 }, // ID của truyện
        { field: 'title', headerName: 'Title', flex: 2 }, // Tiêu đề truyện
        { field: 'chapterNumber', headerName: 'Chapter Number', flex: 1 }, // Lượt yêu thích
        {
            field: 'createAt',
            headerName: 'Created At',
            flex: 1,
            valueFormatter: (params) => {
                const date = new Date(params); // Chuyển đổi chuỗi ngày thành đối tượng Date
                return date.toLocaleDateString(); // Định dạng thành ngày/tháng/năm
            },
        },
        {
            field: 'updateAt',
            headerName: 'Updated At',
            flex: 1,
            valueFormatter: (params) => {
                const date = new Date(params); // Chuyển đổi chuỗi ngày thành đối tượng Date
                return date.toLocaleDateString(); // Định dạng thành ngày/tháng/năm
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => {
                return (
                    <Box display="flex" gap="10px">
                        {/* Nút Edit */}
                        <Button
                            size="small"
                            sx={{
                                minWidth: '40px', // Đảm bảo kích thước nhỏ gọn
                                backgroundColor: colors.greenAccent[600],
                                color: colors.grey[100],
                                '&:hover': {
                                    backgroundColor: colors.greenAccent[500],
                                },
                            }}
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditOutlinedIcon />
                        </Button>

                        {/* Nút Delete */}
                        <Button
                            size="small"
                            sx={{
                                minWidth: '40px', // Đảm bảo kích thước nhỏ gọn
                                backgroundColor: colors.redAccent[600],
                                color: colors.grey[100],
                                '&:hover': {
                                    backgroundColor: colors.redAccent[500],
                                },
                            }}
                            onClick={() => handleDelete(params.row)}
                        >
                            <DeleteOutlinedIcon />
                        </Button>
                    </Box>
                );
            },
        },
    ];
    console.log('Data:', data); // Kiểm tra dữ liệu chương
    const navigate = useNavigate();

    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete chapter "${row.title}"?`)) {
            axios
                .delete(`http://localhost:8080/chapters/${row.chapterId}`) // Thay đổi URL để xóa chương
                .then(() => {
                    alert('Story deleted successfully!');
                    fetchStories();
                })
                .catch((error) => {
                    console.error('Error deleting story:', error);
                    alert('Failed to delete story. Please try again.');
                });
        }
    };
    const handleEdit = (row) => {
        navigate(`/edit-chapter?action=edit&id=${row.chapterId}`);
    };
    const handleAddChapter = (row) => {
        navigate(`/edit-chapter?action=add&id=${storyData.story_id}`); // Chuyển đến trang thêm chương mới
    };

    return (
        <Box m="20px">
            {/* Header */}
            <Header title={storyData?.title || 'Story Detail'} subtitle="Detail of the story" />

            {/* Main Content */}
            <Box display="flex" gap="20px" mt="20px">
                {/* Left Section: Cover Image */}
                <Box flex="1">
                    <img
                        src={storyData?.cover_image}
                        alt={storyData?.title}
                        style={{
                            width: '400px',
                            height: '550px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                </Box>

                {/* Right Section: Story Information */}
                <Box flex="2">
                    <Typography variant="h4" fontWeight="bold" mb="10px">
                        {storyData?.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb="10px">
                        <strong>Author:</strong> {storyData?.author || 'Unknown'}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb="10px">
                        <strong>Status:</strong>{' '}
                        {storyData?.status === 'hoan-thanh'
                            ? 'Hoàn thành'
                            : storyData?.status === 'dang-cap-nhat'
                            ? 'Đang cập nhật'
                            : storyData?.status || 'Unknown'}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb="10px">
                        <strong>Categories:</strong>{' '}
                        {storyData?.categories?.map((category) => category.categori_name).join(', ') || 'None'}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb="10px">
                        <strong>Views:</strong> {storyData?.view_count || 0}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb="10px">
                        <strong>Favourites:</strong> {storyData?.favourite || 0}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb="10px">
                        <strong>Follows:</strong> {storyData?.follow || 0}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb="10px">
                        <strong>Description:</strong> {storyData?.description || 'No description available.'}
                    </Typography>
                    {/* Chapters Section */}
                    <Box mt="10px">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb="10px">
                            <Typography variant="h5" fontWeight="bold">
                                Chapters
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: colors.blueAccent[700],
                                    color: colors.grey[100],
                                    '&:hover': {
                                        backgroundColor: colors.blueAccent[600],
                                    },
                                }}
                                onClick={handleAddChapter} // Hàm xử lý thêm chương mới
                            >
                                Thêm chương mới
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        height="auto"
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none',
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
                            getRowId={(row) => row.chapterId}
                            loading={loading}
                            error={error}
                            pageSize={5} // Số hàng mặc định hiển thị trên mỗi trang
                            rowsPerPageOptions={[5, 10, 20]} // Các tùy chọn số hàng hiển thị
                            pagination // Kích hoạt phân trang
                            sortModel={[
                                { field: 'chapterNumber', sort: 'asc' }, // Sắp xếp theo chapterNumber tăng dần
                            ]}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Storydetail;
