import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Button } from '@mui/material';
import { token } from '~/theme';
import Header from '~/components/Header';
import { useLocation } from 'react-router-dom';

function Supportdetail() {
    const theme = useTheme();
    const colors = token(theme.palette.mode);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reportId = queryParams.get('id');

    useEffect(() => {
        if (reportId) {
            setLoading(true);
            axios
                .get(`http://localhost:8080/reports/${reportId}`)
                .then((response) => {
                    setReport(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Không thể tải dữ liệu báo cáo.');
                    setLoading(false);
                });
        }
    }, [reportId]);

    if (loading) {
        return (
            <Box m="20px">
                <Typography>Đang tải dữ liệu...</Typography>
            </Box>
        );
    }
    if (error) {
        return (
            <Box m="20px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }
    if (!report) {
        return (
            <Box m="20px">
                <Typography>Không tìm thấy báo cáo.</Typography>
            </Box>
        );
    }

    // Hàm xóa report
    const handleDelete = () => {
        if (window.confirm('Bạn có chắc chắn muốn hoàn thành (xóa) báo cáo này?')) {
            axios
                .delete(`http://localhost:8080/reports/${report.reportId}`)
                .then(() => {
                    alert('Báo cáo đã được hoàn thành!');
                    window.history.back(); // Quay lại trang trước
                })
                .catch(() => {
                    alert('Xóa báo cáo thất bại.');
                });
        }
    };

    return (
        <Box m="20px">
            <Header
                title={`Chi tiết báo cáo #${report.reportId || ''}`}
                subtitle="Thông tin chi tiết báo cáo người dùng"
            />
            <Box mt={2} p={3} borderRadius={2} boxShadow={2} bgcolor={colors.primary[400]}>
                {/* Dòng 1: reportId */}
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={140}>
                        Report ID:
                    </Typography>
                    <Typography variant="body1" ml={2}>
                        {report.reportId}
                    </Typography>
                </Box>
                {/* Dòng 2: userId, userName */}
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={140}>
                        User ID:
                    </Typography>
                    <Typography variant="body1" ml={2} mr={4}>
                        {report.userId}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={100}>
                        User Name:
                    </Typography>
                    <Typography variant="body1" ml={2}>
                        {report.userName}
                    </Typography>
                </Box>
                {/* Dòng 3: storyId, storyTitle */}
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={140}>
                        Story ID:
                    </Typography>
                    <Typography variant="body1" ml={2} mr={4}>
                        {report.storyId}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={100}>
                        Story Title:
                    </Typography>
                    <Typography variant="body1" ml={2}>
                        {report.storyTitle}
                    </Typography>
                </Box>
                {/* Dòng 4: chapterId, chapterNumber */}
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={140}>
                        Chapter ID:
                    </Typography>
                    <Typography variant="body1" ml={2} mr={4}>
                        {report.chapterId}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={120}>
                        Chapter Number:
                    </Typography>
                    <Typography variant="body1" ml={2}>
                        chương {report.chapterNumber}
                    </Typography>
                </Box>
                {/* Dòng 5: detail */}
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={140}>
                        Detail:
                    </Typography>
                    <Typography variant="body1" ml={2}>
                        {report.detail}
                    </Typography>
                </Box>
                {/* Dòng 6: description */}
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={140}>
                        Description:
                    </Typography>
                    <Typography variant="body1" ml={2}>
                        {report.description}
                    </Typography>
                </Box>
                {/* Dòng 7: createAt */}
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" minWidth={140}>
                        Created At:
                    </Typography>
                    <Typography variant="body1" ml={2}>
                        {report.createAt ? new Date(report.createAt).toLocaleString() : ''}
                    </Typography>
                </Box>
                {/* Nút hoàn thành */}
                <Box mt={3}>
                    <Button variant="contained" color="success" onClick={handleDelete} sx={{ fontWeight: 600 }}>
                        Hoàn thành
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Supportdetail;
