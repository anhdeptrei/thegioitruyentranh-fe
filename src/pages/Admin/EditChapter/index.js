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
    author: yup.string().required('Author is required'),
    description: yup.string().required('Description is required'),
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

function EditChapter() {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const location = useLocation();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState({
        chapterId: '',
        chapterNumber: '',
        title: '',
        createAt: '',
        updateAt: '',
        storyId: '',
    });
    const [images, setImages] = useState([]); // State để lưu danh sách hình ảnh
    const [removedImages, setRemovedImages] = useState([]); // State để lưu danh sách hình ảnh bị xóa

    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action'); // "add" hoặc "edit"
    const Id = queryParams.get('id'); // ID của chapter (nếu có)

    // Fetch chapter data if editing
    useEffect(() => {
        if (action === 'edit' && Id) {
            axios
                .get(`http://localhost:8080/chapters/${Id}`)
                .then((response) => {
                    const chapterData = response.data;
                    setInitialValues({
                        chapterId: chapterData.chapterId,
                        chapterNumber: chapterData.chapterNumber,
                        title: chapterData.title,
                        createAt: chapterData.createAt,
                        updateAt: chapterData.updateAt,
                        storyId: chapterData.storyId,
                    });
                    setImages(chapterData.images || []); // Lưu danh sách hình ảnh
                })
                .catch((error) => {
                    console.error('Error fetching chapter data:', error);
                });
        }
        if (action === 'add' && Id) {
            setInitialValues({
                ...initialValues,
                storyId: Id,
            });
        }
    }, [action, Id]);

    // Handle form submission
    const handleFormSubmit = async (values) => {
        if (action === 'edit') {
            try {
                // Cập nhật chapter
                await axios.put(`http://localhost:8080/chapters/${Id}`, { ...values });

                // Xử lý cập nhật và thêm mới hình ảnh
                await Promise.all(
                    images.map((image) => {
                        if (image.chapterImageId) {
                            // Nếu hình ảnh đã tồn tại, sử dụng PUT để cập nhật
                            return axios.put(`http://localhost:8080/chapterimages/${image.chapterImageId}`, {
                                chapterId: Id,
                                imageUrl: image.imageUrl,
                                imageNumber: image.imageNumber,
                            });
                        } else {
                            // Nếu hình ảnh mới, sử dụng POST để thêm mới
                            return axios.post('http://localhost:8080/chapterimages', {
                                chapterId: Id,
                                imageUrl: image.imageUrl,
                                imageNumber: image.imageNumber,
                            });
                        }
                    }),
                );

                // Xử lý xóa hình ảnh
                await Promise.all(
                    removedImages.map((imageId) => axios.delete(`http://localhost:8080/chapterimages/${imageId}`)),
                );

                alert('Chapter updated successfully!');
                navigate(`/storydetail?id=${values.storyId}`);
            } catch (error) {
                console.error('Error updating chapter:', error);
            }
        } else {
            try {
                // Thêm chapter mới
                const chapterResponse = await axios.post('http://localhost:8080/chapters', {
                    storyId: values.storyId,
                    chapterNumber: values.chapterNumber,
                    title: values.title,
                });

                const newChapterId = chapterResponse.data.chapterId;

                // Thêm danh sách hình ảnh
                await Promise.all(
                    images.map((image) =>
                        axios.post('http://localhost:8080/chapterimages', {
                            chapterId: newChapterId,
                            imageUrl: image.imageUrl,
                            imageNumber: image.imageNumber,
                        }),
                    ),
                );

                alert('Chapter created successfully!');
                navigate(`/storydetail?id=${values.storyId}`);
            } catch (error) {
                console.error('Error adding chapter:', error);
            }
        }
    };

    // Handle adding a new image
    const handleAddImage = () => {
        setImages([
            ...images,
            { chapterImageId: null, chapterId: initialValues.chapterId, imageUrl: '', imageNumber: images.length + 1 },
        ]);
    };

    // Handle updating an image
    const handleImageChange = (index, field, value) => {
        const updatedImages = [...images];
        updatedImages[index][field] = value;
        setImages(updatedImages);
    };

    // Handle removing an image
    const handleRemoveImage = (index) => {
        const imageToRemove = images[index];
        if (imageToRemove.chapterImageId) {
            // Nếu hình ảnh đã tồn tại trong cơ sở dữ liệu, thêm vào danh sách xóa
            setRemovedImages([...removedImages, imageToRemove.chapterImageId]);
        }
        // Loại bỏ hình ảnh khỏi danh sách hiển thị
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    return (
        <Box margin="20px">
            <Header
                title={action === 'edit' ? 'EDIT CHAPTER' : 'CREATE CHAPTER'}
                subtitle={action === 'edit' ? 'Edit an Existing Chapter' : 'Create a New Chapter'}
            />
            <Formik onSubmit={handleFormSubmit} initialValues={initialValues} enableReinitialize>
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button type="submit" color="secondary" variant="contained">
                                {action === 'edit' ? 'Update Chapter' : 'Create New Chapter'}
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
                                type="number"
                                label="Chapter Number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.chapterNumber}
                                name="chapterNumber"
                                error={!!touched.chapterNumber && !!errors.chapterNumber}
                                helperText={touched.chapterNumber && errors.chapterNumber}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Chapter Title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                name="title"
                                error={!!touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                                sx={{ gridColumn: 'span 4' }}
                            />
                        </Box>

                        {/* Image Management Section */}
                        <Box mt={4}>
                            <Typography variant="h6" mb={2}>
                                Chapter Images
                            </Typography>
                            {images.map((image, index) => (
                                <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Image URL"
                                        value={image.imageUrl}
                                        onChange={(e) => handleImageChange(index, 'imageUrl', e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Image Number"
                                        value={image.imageNumber}
                                        onChange={(e) => handleImageChange(index, 'imageNumber', e.target.value)}
                                    />
                                    <Button variant="contained" color="error" onClick={() => handleRemoveImage(index)}>
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                            <Button variant="contained" color="primary" onClick={handleAddImage}>
                                Add New Image
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default EditChapter;
