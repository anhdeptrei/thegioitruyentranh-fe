import { Box, Button, TextField, MenuItem, styled } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '~/components/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

// Validation schema
const userSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    email: yup.string().email('Email is not valid').required('Email is required'),
    detail: yup.string(),
    role: yup.number().required('Role is required'),
    status: yup.string().required('Status is required'),
    avatar: yup.mixed().required('Avatar is required'),
});
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function EditUsers() {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const location = useLocation();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        username: '',
        password: '',
        email: '',
        detail: '',
        role: 0,
        status: '',
        avatar: null, // Thay đổi avatar thành null để lưu file
    });
    const [selectedImage, setSelectedImage] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action'); // "add" hoặc "edit"
    const userId = queryParams.get('id'); // ID người dùng (nếu có)

    // Fetch user data if editing
    useEffect(() => {
        if (action === 'edit' && userId) {
            axios
                .get(`http://localhost:8080/users/${userId}`)
                .then((response) => {
                    setInitialValues(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [action, userId]);

    // Handle form submission
    const handleFormSubmit = (values) => {
        if (action === 'edit') {
            // Update user
            // axios
            //     .put(`http://localhost:8080/users/${userId}`, values)
            //     .then(() => {
            //         console.log('User updated successfully');
            //         navigate('/admin/users'); // Redirect to user list
            //     })
            //     .catch((error) => {
            //         console.error('Error updating user:', error);
            //     });
            console.log('User updated successfully', values);
        } else {
            // Add new user
            // axios
            //     .post('http://localhost:8080/users', values)
            //     .then(() => {
            //         console.log('User added successfully');
            //         navigate('/admin/users'); // Redirect to user list
            //     })
            //     .catch((error) => {
            //         console.error('Error adding user:', error);
            //     });
            console.log('User added successfully', values);
        }
    };

    return (
        <Box margin="20px">
            <Header
                title={action === 'edit' ? 'EDIT USER' : 'CREATE USER'}
                subtitle={action === 'edit' ? 'Edit an Existing User Profile' : 'Create a New User Profile'}
            />
            <Formik
                // onSubmit={handleFormSubmit}
                onSubmit={(values) => {
                    console.log('Form values:', values); // Hiển thị tất cả các giá trị đã nhập trong form
                }}
                initialValues={initialValues}
                validationSchema={userSchema}
                enableReinitialize // Reinitialize form values when initialValues change
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
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
                                label="Username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                name="username"
                                error={!!touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Detail"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.detail}
                                name="detail"
                                error={!!touched.detail && !!errors.detail}
                                helperText={touched.detail && errors.detail}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                select
                                variant="filled"
                                label="Role"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.role}
                                name="role"
                                error={!!touched.role && !!errors.role}
                                helperText={touched.role && errors.role}
                                sx={{ gridColumn: 'span 2' }}
                            >
                                <MenuItem value={0}>User</MenuItem>
                                <MenuItem value={1}>Manager</MenuItem>
                                <MenuItem value={2}>Admin</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                select
                                variant="filled"
                                label="Status"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.status}
                                name="status"
                                error={!!touched.status && !!errors.status}
                                helperText={touched.status && errors.status}
                                sx={{ gridColumn: 'span 2' }}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="locked">Locked</MenuItem>
                            </TextField>
                            <Box gridColumn="span 4" display="flex" justifyContent="space-between" alignItems="center">
                                Avatar
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadOutlinedIcon />}
                                    color="secondary"
                                >
                                    Upload files
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(event) => {
                                            console.log(event.target.files);
                                            setSelectedImage(event.target.files[0]);
                                        }}
                                        multiple
                                    />
                                </Button>
                                {touched.avatar && errors.avatar && (
                                    <div style={{ color: 'red', marginTop: '5px' }}>{errors.avatar}</div>
                                )}
                                {selectedImage && (
                                    <div>
                                        {/* Display the selected image */}
                                        <img
                                            alt="not found"
                                            width={'250px'}
                                            src="https://s135.hinhhinh.com//phe-kiem_1741433972.png?gt=hdfgdfg&mobile=2"
                                        />
                                        {console.log(URL.createObjectURL(selectedImage))}
                                        <br /> <br />
                                        {/* Button to remove the selected image */}
                                        <button onClick={() => setSelectedImage(null)}>Remove</button>
                                    </div>
                                )}
                            </Box>
                        </Box>

                        <Box display="flex" justifyContent="flex-end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                {action === 'edit' ? 'Update User' : 'Create New User'}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default EditUsers;
