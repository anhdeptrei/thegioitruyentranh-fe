import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { token } from '~/theme';
import Header from '~/components/Header';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LoupeOutlinedIcon from '@mui/icons-material/LoupeOutlined';

function Support() {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'reportId', headerName: 'Report ID', flex: 1 },
        { field: 'userName', headerName: 'User Name', flex: 1 },
        { field: 'storyTitle', headerName: 'Story Title', flex: 2 },
        { field: 'chapterNumber', headerName: 'Chapter Number', flex: 1 },
        { field: 'detail', headerName: 'Detail', flex: 2 },
        { field: 'createAt', headerName: 'Created At', flex: 1 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => {
                return (
                    <Box display="flex" gap="10px">
                        <Button
                            size="small"
                            sx={{
                                minWidth: '40px',
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
        // Ví dụ: mở trang chi tiết report hoặc hiển thị modal, ở đây sẽ chuyển hướng đến trang chi tiết report
        navigate(`/supportdetail?id=${row.reportId}`);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        setLoading(true);
        axios
            .get('http://localhost:8080/reports/all')
            .then((response) => {
                setReports(response.data);
                setLoading(false);
                console.log('Fetched reports:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching reports:', error);
                setError('Failed to fetch reports.');
                setLoading(false);
            });
    };

    return (
        <Box m="20px">
            <Header title="Hỗ trợ người dùng" subtitle="supporting users" />
            <Box
                height="75vh"
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
                    rows={reports}
                    columns={columns}
                    getRowId={(row) => row.reportId}
                    loading={loading}
                    error={error}
                />
            </Box>
        </Box>
    );
}

export default Support;
