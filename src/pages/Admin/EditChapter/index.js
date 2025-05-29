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

// Validation schema ( giữ nguyên hoặc điều chỉnh nếu cần cho các trường khác)
const storySchema = yup.object().shape({
    title: yup.string().required('Title is required'),
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
        const newImages = selectedFiles.map((file) => ({
            file: file, // Lưu trữ đối tượng File
            imageNumber: null, // Số thứ tự ảnh sẽ được gán sau hoặc do người dùng nhập
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
            // Nếu là ảnh cũ từ DB, thêm chapterImageId vào danh sách xóa
            setRemovedImages([...removedImages, imageToRemove.chapterImageId]);
        }
        // Loại bỏ ảnh (cũ hoặc mới) khỏi danh sách hiển thị
        const updatedImages = images.filter((_, i) => i !== index);
        // Cập nhật lại state images
        setImages(updatedImages);
    };

    // Handle form submission
    // Handle form submission
    const handleFormSubmit = async (values) => {
        try {
            // Tách danh sách ảnh thành ảnh cũ (có chapterImageId) và file mới (có file)
            const existingImages = images.filter((img) => img.chapterImageId);
            const newImagesToUpload = images.filter((img) => img.file); // Danh sách các object chứa { file: File, imageNumber: number }

            let uploadedImagesData = []; // Danh sách dữ liệu ảnh mới đã upload (chứa imageUrl và imageNumber)

            // 1. Tải lên các file mới nếu có
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

            // 2. Xử lý form submission dựa trên action (edit/add)
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

                // Handle deletion of old images marked for removal
                await Promise.all(
                    removedImages.map((imageId) => axios.delete(`http://localhost:8080/chapterimages/${imageId}`)),
                );

                alert('Chapter updated successfully!');
                navigate(`/storydetail?id=${values.storyId}`);
            } else {
                // action === 'add'
                // --- Logic for ADD (NEW) ---

                // Prepare chapter data *without* images initially
                const chapterDataWithoutImages = {
                    chapterNumber: values.chapterNumber,
                    title: values.title,
                    storyId: values.storyId,
                    // Add other chapter fields if necessary, but exclude the 'images' list for the initial POST
                };

                // 3. Create the new chapter
                // Giả định API POST /chapters trả về đối tượng chapter đã tạo bao gồm chapterId
                const createChapterResponse = await axios.post(
                    'http://localhost:8080/chapters',
                    chapterDataWithoutImages,
                );

                const newChapter = createChapterResponse.data;
                const newChapterId = newChapter.chapterId; // Lấy ID của chapter vừa tạo

                // 4. Nếu có ảnh mới được upload và chapter đã tạo thành công, gọi API batch để thêm ảnh
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
                // Chuyển hướng đến trang chi tiết của truyện mà chapter mới thuộc về
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
            <Formik onSubmit={handleFormSubmit} initialValues={initialValues} enableReinitialize>
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
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
                            {/* Thêm trường storyId nếu cần hiển thị hoặc chỉnh sửa */}
                            {/* <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Story ID"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.storyId}
                                name="storyId"
                                InputProps={{ readOnly: true }} // Thường storyId sẽ không cho chỉnh sửa
                                sx={{ gridColumn: 'span 4' }}
                            /> */}
                        </Box>

                        {/* Image Management Section */}
                        <Box mt={4}>
                            <Typography variant="h6" mb={2}>
                                Chapter Images
                            </Typography>
                            {/* Hiển thị danh sách ảnh (cũ hoặc mới) */}
                            {images.map((image, index) => (
                                <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
                                    {/* Hiển thị URL ảnh cũ hoặc tên file mới */}
                                    {image.imageUrl ? (
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="Image URL"
                                            value={image.imageUrl}
                                            InputProps={{
                                                readOnly: true, // URL ảnh cũ chỉ hiển thị, không cho sửa
                                            }}
                                        />
                                    ) : (
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            label="File Name"
                                            value={image.file ? image.file.name : ''} // Hiển thị tên file
                                            InputProps={{
                                                readOnly: true, // Tên file chỉ hiển thị
                                            }}
                                        />
                                    )}

                                    {/* Trường nhập số thứ tự ảnh */}
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Image Number"
                                        value={image.imageNumber === null ? '' : image.imageNumber} // Hiển thị rỗng nếu chưa có số
                                        onChange={(e) =>
                                            handleImageChange(index, 'imageNumber', parseInt(e.target.value) || null)
                                        } // Chuyển sang số nguyên
                                    />
                                    {/* Nút xóa ảnh */}
                                    <Button variant="contained" color="error" onClick={() => handleRemoveImage(index)}>
                                        <RemoveCircleOutlinedIcon /> {/* Sử dụng icon */}
                                    </Button>
                                </Box>
                            ))}

                            {/* Nút tải lên file ảnh */}
                            <Button
                                component="label" // Sử dụng label để liên kết với input file ẩn
                                variant="contained"
                                color="primary"
                                startIcon={<CloudUploadOutlinedIcon />}
                                sx={{ mr: 2 }} // Thêm khoảng cách
                            >
                                Upload Images
                                {/* Input file ẩn */}
                                <VisuallyHiddenInput type="file" multiple onChange={handleFileChange} />
                            </Button>

                            {/* Có thể giữ lại nút "Add New Image" nếu muốn tùy chọn nhập URL thủ công */}
                            {/* <Button variant="contained" color="primary" onClick={handleAddImage}>
                                Add New Image (Manual URL)
                            </Button> */}
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
}

export default EditChapter;
