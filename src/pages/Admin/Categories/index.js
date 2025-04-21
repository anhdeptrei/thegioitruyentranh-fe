import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { token } from '~/theme';
import Header from '~/components/Header';
import { useNavigate } from 'react-router-dom';

function Categories() {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'category_id', headerName: 'ID', flex: 1 }, // ID danh mục
        { field: 'category_name', headerName: 'Category Name', flex: 1 }, // Tên danh mục
        { field: 'category_description', headerName: 'Description', flex: 2 }, // Mô tả danh mục
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params) => {
                return (
                    <Box display="flex" gap="10px">
                        {/* Nút Edit */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: colors.greenAccent[600],
                                color: colors.grey[100],
                                '&:hover': {
                                    backgroundColor: colors.greenAccent[500],
                                },
                            }}
                            onClick={() => handleEdit(params.row)}
                        >
                            Edit
                        </Button>
                        {/* Nút Delete */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: colors.redAccent[600],
                                color: colors.grey[100],
                                '&:hover': {
                                    backgroundColor: colors.redAccent[500],
                                },
                            }}
                            onClick={() => handleDelete(params.row)}
                        >
                            Delete
                        </Button>
                    </Box>
                );
            },
        },
    ];

    const navigate = useNavigate();

    const handleEdit = (row) => {
        navigate(`/edit-category?action=edit&id=${row.category_id}`);
    };

    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete category "${row.category_name}"?`)) {
            axios
                .delete(`http://localhost:8080/categories/${row.category_id}`)
                .then(() => {
                    alert('Category deleted successfully!');
                    fetchCategories();
                })
                .catch((error) => {
                    console.error('Error deleting category:', error);
                    alert('Failed to delete category. Please try again.');
                });
        }
    };

    const handleAddCategory = () => {
        navigate('/edit-category?action=add');
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        axios
            .get('http://localhost:8080/categories/all')
            .then((response) => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
                setError('Failed to fetch categories.');
                setLoading(false);
            });
    };

    return (
        <Box m="20px">
            <Header title="Quản lí danh mục" subtitle="Managing categories" />
            {/* Nút thêm danh mục */}
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
                    onClick={handleAddCategory}
                >
                    Thêm danh mục
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
                    rows={categories}
                    columns={columns}
                    getRowId={(row) => row.category_id}
                    loading={loading}
                    error={error}
                />
            </Box>
        </Box>
    );
}

export default Categories;
