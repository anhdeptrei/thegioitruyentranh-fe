import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '~/components/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Validation schema
const categorySchema = yup.object().shape({
    category_name: yup.string().required('Category name is required'),
    category_description: yup.string().required('Category description is required'),
});

function EditCategory() {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const location = useLocation();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        category_name: '',
        category_description: '',
    });

    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action'); // "add" hoặc "edit"
    const categoryId = queryParams.get('id'); // ID danh mục (nếu có)

    // Fetch category data if editing
    useEffect(() => {
        if (action === 'edit' && categoryId) {
            axios
                .get(`http://localhost:8080/categories/${categoryId}`)
                .then((response) => {
                    setInitialValues(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching category data:', error);
                });
        }
    }, [action, categoryId]);

    // Handle form submission
    const handleFormSubmit = (values) => {
        if (action === 'edit') {
            // Update category
            axios
                .put(`http://localhost:8080/categories/${categoryId}`, values)
                .then(() => {
                    alert('Category updated successfully!');
                    navigate('/categories'); // Redirect to category list
                })
                .catch((error) => {
                    console.error('Error updating category:', error);
                });
        } else {
            // Add new category
            axios
                .post('http://localhost:8080/categories', values)
                .then(() => {
                    alert('Category created successfully!');
                    navigate('/categories'); // Redirect to category list
                })
                .catch((error) => {
                    console.error('Error adding category:', error);
                });
        }
    };

    return (
        <Box margin="20px">
            <Header
                title={action === 'edit' ? 'EDIT CATEGORY' : 'CREATE CATEGORY'}
                subtitle={action === 'edit' ? 'Edit an Existing Category' : 'Create a New Category'}
            />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={categorySchema}
                enableReinitialize // Reinitialize form values when initialValues change
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{ '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' } }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Category Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.category_name}
                                name="category_name"
                                error={!!touched.category_name && !!errors.category_name}
                                helperText={touched.category_name && errors.category_name}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Category Description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.category_description}
                                name="category_description"
                                error={!!touched.category_description && !!errors.category_description}
                                helperText={touched.category_description && errors.category_description}
                                sx={{ gridColumn: 'span 4' }}
                            />
                        </Box>

                        <Box display="flex" justifyContent="flex-end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                {action === 'edit' ? 'Update Category' : 'Create New Category'}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default EditCategory;
