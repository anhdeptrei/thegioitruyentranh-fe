import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { token } from '~/theme';
import Header from '~/components/Header';
import { useNavigate } from 'react-router-dom';

import LoupeOutlinedIcon from '@mui/icons-material/LoupeOutlined';
function Storychapter() {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'story_id', headerName: 'ID', flex: 1 }, // ID của truyện
        { field: 'title', headerName: 'Title', flex: 2 }, // Tiêu đề truyện
        { field: 'author', headerName: 'Author', flex: 1 }, // Tác giả
        { field: 'favourite', headerName: 'Favourites', flex: 1 }, // Lượt yêu thích
        { field: 'follow', headerName: 'Follows', flex: 1 }, // Lượt theo dõi
        { field: 'view_count', headerName: 'Views', flex: 1 }, // Lượt xem
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            valueFormatter: (params) => {
                if (params === 'dang-cap-nhat') return 'Đang cập nhật';
                if (params === 'hoan-thanh') return 'Hoàn thành';
                return params.toString();
            },
        },
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
                            onClick={() => handleDetail(params.row)}
                        >
                            <LoupeOutlinedIcon />
                        </Button>
                    </Box>
                );
            },
        },
    ];

    const navigate = useNavigate();

    const handleDetail = (row) => {
        navigate(`/storydetail?id=${row.story_id}`);
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = () => {
        axios
            .get('http://localhost:8080/stories/all')
            .then((response) => {
                setData(response.data);
                setLoading(false);
                console.log('Fetched stories:', response.data);
            })
            .catch((error) => {
                console.error('There was an error fetching the stories!', error);
                setError(error);
                setLoading(false);
            });
    };

    return (
        <Box m="20px">
            <Header title="Quản lí truyện" subtitle="Managing stories" />

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
                    getRowId={(row) => row.story_id}
                    loading={loading}
                    error={error}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 8, page: 0 },
                        },
                    }}
                    pageSizeOptions={[8]}
                    pagination
                />
            </Box>
        </Box>
    );
}

export default Storychapter;
