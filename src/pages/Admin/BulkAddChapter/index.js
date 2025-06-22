import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    ImageList,
    ImageListItem,
} from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function BulkAddChapter() {
    const [folders, setFolders] = useState([]); // [{chapterNumber, folderName, images: [File, ...], description: ''}]
    const [loading, setLoading] = useState(false);
    const [openFolderIdx, setOpenFolderIdx] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const storyId = queryParams.get('storyId');
    console.log('Story ID:', storyId);
    const navigate = useNavigate();

    // Xử lý khi chọn folder cha
    const handleFolderChange = (e) => {
        const files = Array.from(e.target.files);
        const folderMap = {};
        files.forEach((file) => {
            const pathParts = file.webkitRelativePath.split('/');
            // pathParts[0]: folder cha, pathParts[1]: folder con (chapter)
            if (pathParts.length >= 3) {
                const chapterFolder = pathParts[1];
                if (!folderMap[chapterFolder]) folderMap[chapterFolder] = [];
                folderMap[chapterFolder].push(file);
            }
        });
        const folderArr = Object.entries(folderMap).map(([folderName, images]) => {
            // Tìm số đầu tiên trong tên folder, nếu không có thì lấy nguyên tên
            const match = folderName.match(/\d+/);
            const chapterNumber = match ? Number(match[0]) : folderName;
            return {
                chapterNumber,
                folderName,
                images: images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
                description: '',
            };
        });
        folderArr.sort((a, b) => Number(a.chapterNumber) - Number(b.chapterNumber));
        setFolders(folderArr);
    };

    // Xử lý thay đổi trường nhập
    const handleFieldChange = (idx, field, value) => {
        const newFolders = [...folders];
        newFolders[idx][field] = value;
        setFolders(newFolders);
    };

    const handleBulkUpload = async () => {
        console.log('Uploading folders:', folders);
        setLoading(true);
        try {
            for (const folder of folders) {
                // 1. Upload ảnh mới (nếu có)
                let uploadedImagesData = [];
                if (folder.images && folder.images.length > 0) {
                    const formData = new FormData();
                    folder.images.forEach((file) => formData.append('files', file));
                    console.log('Uploading files for folder:', formData);
                    const uploadRes = await axios.post('http://localhost:8080/api/files/upload-multiple', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    const uploadedUrls = uploadRes.data; // List<String>
                    console.log('Uploaded URLs:', uploadedUrls);
                    // Gán imageNumber đúng thứ tự file
                    uploadedImagesData = uploadedUrls.map((url, idx) => ({
                        imageUrl: url,
                        imageNumber: idx + 1,
                    }));
                }

                // 2. Tạo chapter mới
                const chapterRes = await axios.post('http://localhost:8080/chapters', {
                    chapterNumber: folder.chapterNumber,
                    title: folder.description,
                    storyId: storyId,
                });
                const chapterId = chapterRes.data.chapterId;
                console.log('Created chapter:', chapterId);

                // 3. Tạo chapter images nếu có ảnh
                if (uploadedImagesData.length > 0) {
                    const batchRequestDTOs = uploadedImagesData.map((img) => ({
                        imageUrl: img.imageUrl,
                        imageNumber: img.imageNumber,
                        chapterId: chapterId,
                    }));
                    await axios.post('http://localhost:8080/chapterimages/batch', batchRequestDTOs);
                }
            }
            alert('Thêm nhiều chương thành công!');
        } catch (err) {
            alert('Có lỗi khi thêm chương: ' + err.message);
        }
        setLoading(false);
        navigate(`/storydetail?id=${storyId}`);
    };
    // Hàm mở dialog xem ảnh folder
    const handleOpenFolder = (idx) => setOpenFolderIdx(idx);
    const handleCloseFolder = () => setOpenFolderIdx(null);

    return (
        <Box m={2}>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
                <Typography sx={{ ml: 2 }}>Đang lưu dữ liệu, vui lòng chờ...</Typography>
            </Backdrop>
            <Typography variant="h4" mb={2}>
                Thêm nhiều chương từ folder
            </Typography>
            <Button variant="contained" component="label">
                Chọn folder chứa các chương
                <input
                    type="file"
                    webkitdirectory="true"
                    directory="true"
                    multiple
                    hidden
                    onChange={handleFolderChange}
                />
            </Button>
            <Box mt={3}>
                {console.log('Folders:', folders)}
                {folders.length > 0 && (
                    <>
                        <Typography variant="h6" mb={2}>
                            Danh sách chương sẽ thêm:
                        </Typography>
                        <Grid container spacing={2}>
                            {folders.map((folder, idx) => (
                                <Grid item xs={12} key={idx}>
                                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            label="Chapter Number"
                                            type="number"
                                            value={folder.chapterNumber}
                                            onChange={(e) => handleFieldChange(idx, 'chapterNumber', e.target.value)}
                                            sx={{ width: 120 }}
                                            inputProps={{ min: 1 }}
                                        />
                                        <TextField
                                            label="Chapter Description"
                                            value={folder.description || ''}
                                            onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                                            sx={{ flex: 1 }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={() => handleOpenFolder(idx)}
                                            sx={{
                                                width: 200,
                                                textTransform: 'none',
                                                color: '#fff', // màu chữ trắng
                                                backgroundColor: '#1976d2', // màu nền sáng hơn
                                                '&:hover': {
                                                    backgroundColor: '#1565c0',
                                                },
                                            }}
                                        >
                                            {folder.folderName}
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        <Box mt={3}>
                            <Button variant="contained" color="success" onClick={handleBulkUpload} disabled={loading}>
                                {loading ? 'Đang thêm...' : 'Thêm mới tất cả chương'}
                            </Button>
                        </Box>
                        {/* Dialog hiển thị ảnh trong folder */}
                        <Dialog open={openFolderIdx !== null} onClose={handleCloseFolder} maxWidth="md" fullWidth>
                            <DialogTitle>
                                Ảnh trong folder: {openFolderIdx !== null ? folders[openFolderIdx].folderName : ''}
                            </DialogTitle>
                            <DialogContent>
                                <ImageList cols={5} gap={8}>
                                    {openFolderIdx !== null &&
                                        folders[openFolderIdx].images.map((img, i) => (
                                            <ImageListItem key={i}>
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={img.name}
                                                    loading="lazy"
                                                    style={{ width: '100%', height: 'auto' }}
                                                />
                                            </ImageListItem>
                                        ))}
                                </ImageList>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default BulkAddChapter;
