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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Validation schema ( giữ nguyên hoặc điều chỉnh nếu cần cho các trường khác)
const storySchema = yup.object().shape({
    chapterNumber: yup.string().required('Chapter number is required'),
    // Các trường validation khác nếu có
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
    // State để lưu danh sách hình ảnh. Mỗi item có thể là ảnh cũ (có imageUrl) hoặc file mới (có file)
    const [images, setImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]); // State để lưu danh sách chapterImageId bị xóa

    const [imagesBackup, setImagesBackup] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    // State để quản lý dialog xem ảnh
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action'); // "add" hoặc "edit"
    const Id = queryParams.get('id'); // ID của chapter (nếu có) hoặc storyId (nếu action là add)

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
                    // Lưu danh sách hình ảnh cũ vào state images
                    setImages(chapterData.images || []);
                    setImagesBackup(chapterData.images || []);
                })
                .catch((error) => {
                    console.error('Error fetching chapter data:', error);
                    // Xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
                });
        }
        if (action === 'add' && Id) {
            // Khi thêm mới, Id từ query params là storyId
            setInitialValues({
                ...initialValues,
                storyId: Id,
            });
        }
    }, [action, Id]);

    // Handle file input change
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const currentMax =
            images.length > 0
                ? Math.max(
                      0,
                      ...images.map((img) => img.imageNumber).filter((num) => typeof num === 'number' && !isNaN(num)),
                  )
                : 0;

        const newImages = selectedFiles.map((file, idx) => ({
            file: file, // Lưu trữ đối tượng File
            imageNumber: currentMax + idx + 1, // Gán số thứ tự ảnh mới
        }));
        // Thêm các file mới vào danh sách images
        setImages([...images, ...newImages]);
        // Reset input file để có thể chọn lại cùng file nếu cần
        event.target.value = null;
    };

    // Handle updating an image property (like imageNumber)
    const handleImageChange = (index, field, value) => {
        const updatedImages = [...images];
        updatedImages[index][field] = value;
        setImages(updatedImages);
    };

    // Handle removing an image (either existing or new file)
    const handleRemoveImage = (index) => {
        const imageToRemove = images[index];
        if (imageToRemove.chapterImageId) {
            setRemovedImages([...removedImages, imageToRemove.chapterImageId]);
        }
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            // Tách danh sách ảnh thành ảnh cũ (có chapterImageId) và file mới (có file)
            const existingImages = images.filter((img) => img.chapterImageId);
            const newImagesToUpload = images.filter((img) => img.file); // Danh sách các object chứa { file: File, imageNumber: number }

            let uploadedImagesData = []; // Danh sách dữ liệu ảnh mới đã upload (chứa imageUrl và imageNumber)

            // Tải lên các file mới nếu có
            if (newImagesToUpload.length > 0) {
                const formData = new FormData();
                newImagesToUpload.forEach((img) => {
                    formData.append('files', img.file); // 'files' là tên trường mà backend API /api/files/upload-multiple mong đợi
                });

                // Gửi request POST đến API upload nhiều file của backend để lấy URL
                const uploadResponse = await axios.post('http://localhost:8080/api/files/upload-multiple', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const uploadedUrls = uploadResponse.data; // List<String>
                console.log('Uploaded URLs:', uploadedUrls);
                // Chuẩn bị dữ liệu cho các ảnh mới (kết hợp URL với số thứ tự ảnh)
                uploadedImagesData = uploadedUrls.map((url, index) => ({
                    imageUrl: url,
                    imageNumber: newImagesToUpload[index].imageNumber,
                    // chapterImageId sẽ được gán bởi backend (hoặc API batch)
                }));
            }

            // Xử lý form submission dựa trên action (edit/add)
            if (action === 'edit') {
                // --- Logic cho EDIT ---

                let imagesToIncludeInPut = []; // Danh sách ảnh cuối cùng cho request PUT

                // If there are newly uploaded images, call the batch API to create them
                if (uploadedImagesData.length > 0) {
                    // Prepare request DTOs for API batch
                    const batchRequestDTOs = uploadedImagesData.map((img) => ({
                        imageUrl: img.imageUrl,
                        imageNumber: img.imageNumber,
                        chapterId: values.chapterId, // Include chapterId for API batch
                    }));

                    // Call API batch to create new ChapterImage records
                    const batchResponse = await axios.post(
                        'http://localhost:8080/chapterimages/batch',
                        batchRequestDTOs,
                    );

                    // API batch will return the created ChapterImage entities with IDs
                    const createdImagesFromBatch = batchResponse.data; // List<ChapterImageResponseDTO>

                    // Add the newly created images (with IDs) to the list for the PUT request
                    imagesToIncludeInPut.push(...createdImagesFromBatch);
                }

                // Add existing images (not removed)
                const imagesNotRemoved = existingImages.filter((img) => !removedImages.includes(img.chapterImageId));
                imagesToIncludeInPut.push(...imagesNotRemoved);

                console.log('Images to include in PUT:', existingImages);

                // Sort the final list of images (optional but recommended)
                imagesToIncludeInPut.sort((a, b) => (a.imageNumber || 0) - (b.imageNumber || 0));

                // Prepare data for the main chapter API (PUT)
                const chapterDataForEdit = {
                    ...values,
                    images: imagesToIncludeInPut, // Send the final list of images
                };
                console.log('Chapter data for PUT:', chapterDataForEdit);

                // Update chapter
                await axios.put(`http://localhost:8080/chapters/${Id}`, chapterDataForEdit);

                await axios.put(`http://localhost:8080/chapterimages/batch-update`, existingImages);

                // Xóa file ảnh cloud nếu có
                if (removedImages.length > 0 && imagesBackup.length > 0) {
                    const imagesToDelete = imagesBackup.filter(
                        (img) =>
                            removedImages.includes(img.chapterImageId) &&
                            img.imageUrl &&
                            img.imageUrl.startsWith('https://doanvietanh.s3.ap-southeast-1.amazonaws.com/'),
                    );
                    const keysToDelete = imagesToDelete.map((img) => img.imageUrl.split('/').pop());
                    if (keysToDelete.length > 0) {
                        await axios.delete('http://localhost:8080/api/files/delete-multiple', {
                            data: keysToDelete,
                        });
                    }
                    // Xóa bản ghi DB như cũ
                    await Promise.all(
                        removedImages.map((imageId) => axios.delete(`http://localhost:8080/chapterimages/${imageId}`)),
                    );
                }

                alert('Chapter updated successfully!');
                setSuccessOpen(true);
                navigate(`/storydetail?id=${values.storyId}`);
            } else {
                // action === 'add'
                // Prepare chapter data *without* images initially
                const chapterDataWithoutImages = {
                    chapterNumber: values.chapterNumber,
                    title: values.title,
                    storyId: values.storyId,
                    // Add other chapter fields if necessary, but exclude the 'images' list for the initial POST
                };

                // Create the new chapter
                const createChapterResponse = await axios.post(
                    'http://localhost:8080/chapters',
                    chapterDataWithoutImages,
                );

                const newChapter = createChapterResponse.data;
                const newChapterId = newChapter.chapterId; // Lấy ID của chapter vừa tạo

                //Nếu có ảnh mới được upload và chapter đã tạo thành công, gọi API batch để thêm ảnh
                if (uploadedImagesData.length > 0 && newChapterId) {
                    // Chuẩn bị request DTOs cho API batch sử dụng ID chapter mới
                    const batchRequestDTOs = uploadedImagesData.map((img) => ({
                        imageUrl: img.imageUrl,
                        imageNumber: img.imageNumber,
                        chapterId: newChapterId, // Sử dụng ID của chapter vừa tạo
                    }));

                    // Gọi API batch để tạo các bản ghi ChapterImage mới
                    await axios.post('http://localhost:8080/chapterimages/batch', batchRequestDTOs);
                    // Không cần xử lý response từ API batch ở đây, chỉ cần đảm bảo nó thành công.
                }

                alert('Chapter created successfully!');
                setSuccessOpen(true);
                navigate(`/storydetail?id=${values.storyId}`);
            }
        } catch (error) {
            console.error('Error submitting chapter:', error);
            // Hiển thị thông báo lỗi cho người dùng
            alert('Đã xảy ra lỗi khi lưu chapter.');
        }
    };

    return (
        <Box margin="20px">
            <Header
                title={action === 'edit' ? 'EDIT CHAPTER' : 'CREATE CHAPTER'}
                subtitle={action === 'edit' ? 'Edit an Existing Chapter' : 'Create a New Chapter'}
            />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={storySchema}
                enableReinitialize
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={isSubmitting}
                        >
                            <CircularProgress color="inherit" />
                            <Typography sx={{ ml: 2 }}>Đang lưu dữ liệu, vui lòng chờ...</Typography>
                        </Backdrop>

                        <Box display="flex" justifyContent="flex-end" mb={2}>
                            {' '}
                            {/* Thêm margin-bottom */}
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
                            {/* Grid view cho danh sách ảnh */}
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
                                gap={2}
                                mb={2}
                            >
                                {images.map((image, index) => (
                                    <Box
                                        key={index}
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        p={2}
                                        sx={{
                                            border: '1px solid #eee',
                                            borderRadius: 2,
                                            background: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? theme.palette.primary[400] || '#232323'
                                                    : theme.palette.grey[100] || '#f0f0f0',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        {/* Hiển thị hình ảnh */}
                                        {image.imageUrl ? (
                                            <img
                                                src={image.imageUrl}
                                                alt={`Chapter Image ${index + 1}`}
                                                style={{
                                                    width: 120,
                                                    height: 160,
                                                    objectFit: 'cover',
                                                    borderRadius: 6,
                                                    marginBottom: 8,
                                                    border: '1px solid #e0e0e0',
                                                }}
                                                onClick={() => {
                                                    setCurrentImageUrl(
                                                        image.imageUrl || URL.createObjectURL(image.file),
                                                    );
                                                    setOpenImageDialog(true);
                                                }}
                                            />
                                        ) : (
                                            image.file && (
                                                <img
                                                    src={URL.createObjectURL(image.file)}
                                                    alt={image.file.name}
                                                    style={{
                                                        width: 120,
                                                        height: 160,
                                                        objectFit: 'cover',
                                                        borderRadius: 6,
                                                        marginBottom: 8,
                                                        border: '1px solid #e0e0e0',
                                                    }}
                                                    onClick={() => {
                                                        setCurrentImageUrl(
                                                            image.imageUrl || URL.createObjectURL(image.file),
                                                        );
                                                        setOpenImageDialog(true);
                                                    }}
                                                />
                                            )
                                        )}

                                        {/* Trường nhập số thứ tự ảnh */}
                                        <TextField
                                            variant="filled"
                                            type="number"
                                            label="Image Number"
                                            value={image.imageNumber === null ? '' : image.imageNumber}
                                            onChange={(e) =>
                                                handleImageChange(
                                                    index,
                                                    'imageNumber',
                                                    parseInt(e.target.value) || null,
                                                )
                                            }
                                            size="small"
                                        />
                                        {/* Nút xóa ảnh */}
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{ minWidth: 0, width: 32, height: 32 }}
                                        >
                                            <RemoveCircleOutlinedIcon />
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                            {/* Nút tải lên file ảnh */}
                            <Button
                                component="label"
                                variant="contained"
                                color="primary"
                                startIcon={<CloudUploadOutlinedIcon />}
                                sx={{ mr: 2 }}
                            >
                                Upload Images
                                <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} />
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
            {/* Dialog xem chi tiết ảnh */}
            <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="md">
                <Box position="relative">
                    <IconButton
                        onClick={() => setOpenImageDialog(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            color: '#fff',
                            background: 'rgba(0,0,0,0.3)',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={currentImageUrl}
                        alt="Preview"
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '80vh',
                            display: 'block',
                            margin: 'auto',
                            borderRadius: 8,
                        }}
                    />
                </Box>
            </Dialog>
            {/* <Snackbar
                open={successOpen}
                autoHideDuration={2000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Lưu chapter thành công!
                </Alert>
            </Snackbar> */}
        </Box>
    );
}

export default EditChapter;
