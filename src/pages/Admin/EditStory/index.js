import {
    Box,
    Button,
    TextField,
    styled,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    FormControl,
    Autocomplete,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '~/components/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';

// Validation schema
const storySchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    favourite: yup.number().required('Favourites count is required'),
    follow: yup.number().required('Follows count is required'),
    view_count: yup.number().required('View count is required'),
    cover_image: yup.string().nullable(),
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

function EditStory() {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const location = useLocation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]); // Danh sách danh mục từ backend

    const [initialValues, setInitialValues] = useState({
        title: '',
        author: 'đang cập nhật',
        description: 'đang cập nhật',
        favourite: 0,
        follow: 0,
        view_count: 0,
        status: 'dang-cap-nhat',
        cover_image: null,
        categoryIds: [], // Lưu danh sách ID danh mục
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [oldCoverImage, setOldCoverImage] = useState(initialValues.cover_image || '');

    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action'); // "add" hoặc "edit"
    const storyId = queryParams.get('id'); // ID của truyện (nếu có)

    // Fetch story data if editing
    useEffect(() => {
        if (action === 'edit' && storyId) {
            axios
                .get(`http://localhost:8080/stories/${storyId}`)
                .then((response) => {
                    const storyData = response.data;
                    setInitialValues({
                        ...storyData,
                        categoryIds: storyData.categories.map((category) => category.category_id), // Lấy danh sách ID danh mục
                    });
                    console.log('Fetched story data:', storyData);
                    setOldCoverImage(storyData.cover_image || '');
                    console.log(
                        'Initial values:',
                        storyData.categories.map((category) => category.category_id),
                    );
                })
                .catch((error) => {
                    console.error('Error fetching story data:', error);
                });
        }
    }, [action, storyId]);
    console.log('Initial values:', initialValues); // Log initial values
    // Fetch categories from backend
    useEffect(() => {
        axios
            .get('http://localhost:8080/categories/all')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setCategories(response.data); // Lưu danh sách danh mục
                } else {
                    console.error('Categories API did not return an array:', response.data);
                    setCategories([]); // Đặt giá trị mặc định nếu không phải mảng
                }
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    // Handle form submission
    const handleFormSubmit = (values) => {
        if (action === 'edit') {
            axios
                .put(`http://localhost:8080/stories/${storyId}`, values)
                .then(() => {
                    alert('Story updated successfully!');
                    navigate('/stories'); // Redirect to story list
                })
                .catch((error) => {
                    console.error('Error updating story:', error);
                });
        } else {
            axios
                .post('http://localhost:8080/stories', values)
                .then(() => {
                    alert('Story created successfully!');
                    navigate('/stories'); // Redirect to story list
                })
                .catch((error) => {
                    console.error('Error adding story:', error);
                });
        }
    };

    return (
        <Box margin="20px">
            <Header
                title={action === 'edit' ? 'EDIT STORY' : 'CREATE STORY'}
                subtitle={action === 'edit' ? 'Edit an Existing Story' : 'Create a New Story'}
            />
            <Formik
                onSubmit={async (values, { setSubmitting }) => {
                    let coverImageUrl = values.cover_image;
                    console.log('Submitting values:', coverImageUrl);
                    // Nếu có file mới và có ảnh cũ là cloud thì xóa ảnh cũ
                    if (
                        selectedFile &&
                        oldCoverImage &&
                        oldCoverImage.startsWith('https://doanvietanh.s3.ap-southeast-1.amazonaws.com/')
                    ) {
                        const key = oldCoverImage.split('/').pop();
                        try {
                            await axios.delete('http://localhost:8080/api/files/delete', {
                                params: { key },
                            });
                            console.log('Xóa thành công');
                        } catch (err) {
                            // Có thể bỏ qua lỗi xóa ảnh cũ
                        }
                    }
                    // Nếu có file mới, upload lên cloud trước
                    if (selectedFile) {
                        try {
                            const formData = new FormData();
                            formData.append('file', selectedFile);
                            const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });
                            if (response.data) {
                                coverImageUrl = response.data;
                            }
                        } catch (error) {
                            alert('Failed to upload file. Please try again.');
                            setSubmitting(false);
                            return;
                        }
                    }

                    // Gửi dữ liệu lên backend
                    handleFormSubmit({ ...values, cover_image: coverImageUrl });
                    setOldCoverImage(coverImageUrl); // Cập nhật lại oldCoverImage
                    setSubmitting(false);
                }}
                initialValues={initialValues}
                validationSchema={storySchema}
                enableReinitialize
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                                {action === 'edit' ? 'Update Story' : 'Create New Story'}
                            </Button>
                        </Box>
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
                                label="Title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                name="title"
                                error={!!touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Author"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.author}
                                name="author"
                                error={!!touched.author && !!errors.author}
                                helperText={touched.author && errors.author}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                error={!!touched.description && !!errors.description}
                                helperText={touched.description && errors.description}
                                sx={{ gridColumn: 'span 4' }}
                                multiline
                                minRows={4}
                                maxRows={10}
                            />
                            <FormControl fullWidth sx={{ gridColumn: 'span 4' }}>
                                <Autocomplete
                                    multiple
                                    options={categories} // Danh sách danh mục từ backend
                                    getOptionLabel={(option) => option.category_name || ''} // Sử dụng đúng thuộc tính category_name
                                    value={categories.filter(
                                        (category) =>
                                            Array.isArray(values.categoryIds) &&
                                            values.categoryIds.includes(category.category_id),
                                    )} // Lọc danh mục đã chọn
                                    onChange={(event, newValue) => {
                                        const selectedIds = newValue.map((option) => option.category_id); // Lấy danh sách ID danh mục đã chọn
                                        setFieldValue('categoryIds', selectedIds); // Cập nhật giá trị categoryIds
                                    }}
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => {
                                            const { key, onDelete, ...rest } = getTagProps({ index }); // Loại bỏ onDelete
                                            return (
                                                <Typography
                                                    key={option.category_id} // Truyền key trực tiếp
                                                    {...rest} // Spread các props còn lại
                                                    sx={{
                                                        backgroundColor: '#e0e0e0',
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        margin: '4px',
                                                        display: 'inline-block',
                                                        color: '#000',
                                                    }}
                                                >
                                                    {option.category_name} {/* Hiển thị tên danh mục */}
                                                </Typography>
                                            );
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="filled"
                                            label="Categories"
                                            placeholder="Select categories"
                                            error={!!touched.categoryIds && !!errors.categoryIds}
                                            helperText={touched.categoryIds && errors.categoryIds}
                                        />
                                    )}
                                />
                            </FormControl>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Favourites"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.favourite}
                                name="favourite"
                                error={!!touched.favourite && !!errors.favourite}
                                helperText={touched.favourite && errors.favourite}
                                sx={{ gridColumn: 'span 1' }}
                                disabled // Thêm thuộc tính này để không cho phép nhập
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Follows"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.follow}
                                name="follow"
                                error={!!touched.follow && !!errors.follow}
                                helperText={touched.follow && errors.follow}
                                sx={{ gridColumn: 'span 1' }}
                                disabled // Thêm thuộc tính này để không cho phép nhập
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="number"
                                label="Views"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.view_count}
                                name="view_count"
                                error={!!touched.view_count && !!errors.view_count}
                                helperText={touched.view_count && errors.view_count}
                                sx={{ gridColumn: 'span 1' }}
                                disabled // Thêm thuộc tính này để không cho phép nhập
                            />
                            <FormControl fullWidth sx={{ gridColumn: 'span 1' }}>
                                <InputLabel id="status-label">Trạng thái</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status"
                                    name="status"
                                    value={values.status}
                                    label="status"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!touched.status && !!errors.status}
                                >
                                    <MenuItem value="dang-cap-nhat">Đang cập nhật</MenuItem>
                                    <MenuItem value="hoan-thanh">Hoàn thành</MenuItem>
                                </Select>
                            </FormControl>
                            <Box gridColumn="span 4" display="flex" flexDirection="column" alignItems="flex-start">
                                Cover Image
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadOutlinedIcon />}
                                    color="secondary"
                                >
                                    Upload Image
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                setPreview(URL.createObjectURL(file));
                                                // setFieldValue('cover_image', ''); // Xóa cover_image cũ nếu có
                                            }
                                        }}
                                    />
                                </Button>
                            </Box>

                            {(preview || values.cover_image) && (
                                <Box gridColumn="span 4" display="flex" position="relative">
                                    <img
                                        alt="Cover"
                                        width="250px"
                                        src={preview || values.cover_image}
                                        style={{ borderRadius: '8px' }}
                                    />
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setPreview('');
                                            setSelectedFile(null);
                                            setFieldValue('cover_image', '');
                                        }}
                                        style={{
                                            backgroundColor: '#f44336',
                                            height: '26px',
                                        }}
                                        sx={{
                                            minWidth: '40px',
                                        }}
                                    >
                                        <RemoveCircleOutlinedIcon />
                                    </Button>
                                </Box>
                            )}
                            {console.log('value:', values)}
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default EditStory;
