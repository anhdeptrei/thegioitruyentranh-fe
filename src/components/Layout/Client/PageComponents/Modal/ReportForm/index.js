import React, { useState, useContext } from 'react';
import { AuthContext } from '~/contexts/authContext';
import swal from 'sweetalert';

// Assuming this component receives chapterId and onClose props from the parent (ChapterViewer)
const ReportForm = ({ chapterId, onClose }) => {
    const { loggedInUser } = useContext(AuthContext);

    // Initialize reportDetail with the first option or an empty string
    const [reportDetail, setReportDetail] = useState(''); // Changed initial state if you want a default selected option
    const [reportDescription, setReportDescription] = useState('');
    const [loadingReport, setLoadingReport] = useState(false);
    const [reportError, setReportError] = useState('');

    // Define the options for the detail dropdown
    const detailOptions = [
        { value: '', label: '-- Chọn loại lỗi --' }, // Optional: default disabled option
        { value: 'Ảnh lỗi, không thấy ảnh', label: 'Ảnh lỗi, không thấy ảnh' },
        { value: 'Chapter bị trùng', label: 'Chapter bị trùng' },
        { value: 'Chapter chưa dịch', label: 'Chapter chưa dịch' },
        { value: 'Up sai truyện', label: 'Up sai truyện' },
        // Add more options here if needed
    ];

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        setReportError('');
        setLoadingReport(true);

        if (!loggedInUser || !loggedInUser.userId) {
            console.error('Attempted to submit report without logged in user.');
            setReportError('Bạn cần đăng nhập để gửi báo cáo.');
            swal('Lỗi!', 'Bạn cần đăng nhập để gửi báo cáo.', 'error');
            setLoadingReport(false);
            return;
        }

        // Validate that a detail option has been selected (if using a default disabled option)
        if (!reportDetail) {
            // Check if reportDetail is empty (if default option has empty value)
            setReportError('Vui lòng chọn loại lỗi.');
            swal('Lỗi!', 'Vui lòng chọn loại lỗi.', 'error');
            setLoadingReport(false);
            return;
        }

        if (!reportDescription) {
            setReportError('Vui lòng điền đầy đủ mô tả báo cáo.'); // Adjusted error message
            swal('Lỗi!', 'Vui lòng điền đầy đủ mô tả báo cáo.', 'error');
            setLoadingReport(false);
            return;
        }

        const reportData = {
            userId: loggedInUser.userId,
            chapterId: chapterId,
            detail: reportDetail, // This will be the selected value from the dropdown
            description: reportDescription,
        };

        console.log('Submitting report:', reportData);

        try {
            const response = await fetch('http://localhost:8080/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any necessary auth headers
                },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                console.log('Report submitted successfully.');
                swal('Thành công!', 'Báo cáo của bạn đã được gửi đi.', 'success');
                if (onClose) {
                    onClose();
                }
            } else {
                let errorText = 'Không thể gửi báo cáo. Vui lòng thử lại.';
                try {
                    errorText = await response.text();
                } catch (e) {
                    console.error('Failed to read error response body:', e);
                }
                console.error('Report submission failed:', response.status, errorText);
                setReportError(errorText);
                swal('Lỗi!', errorText, 'error');
            }
        } catch (err) {
            console.error('Network error during report submission:', err);
            setReportError('Đã xảy ra lỗi khi kết nối đến máy chủ.');
            swal('Lỗi!', 'Đã xảy ra lỗi khi kết nối đến máy chủ.', 'error');
        } finally {
            setLoadingReport(false);
        }
    };

    return (
        <div className="report-form-container">
            <h2>Báo cáo Chapter</h2>
            <form onSubmit={handleSubmitReport}>
                <div>
                    <label htmlFor="report-detail">Chi tiết:</label>
                    {/* Replaced input with select */}
                    <select
                        id="report-detail"
                        value={reportDetail}
                        onChange={(e) => setReportDetail(e.target.value)}
                        required // HTML5 validation
                        disabled={loadingReport}
                    >
                        {detailOptions.map((option) => (
                            <option
                                key={option.value} // Use value as key
                                value={option.value}
                                disabled={option.value === ''} // Disable the default option
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="report-description">Mô tả:</label>
                    <textarea
                        id="report-description"
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        required
                        disabled={loadingReport}
                        rows="4"
                    ></textarea>
                </div>
                {reportError && <p style={{ color: 'red', textAlign: 'center' }}>{reportError}</p>}
                <button type="submit" disabled={loadingReport}>
                    {loadingReport ? 'Đang gửi...' : 'Gửi báo cáo'}
                </button>
            </form>
        </div>
    );
};

export default ReportForm;
