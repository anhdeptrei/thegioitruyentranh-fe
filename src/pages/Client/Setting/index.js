import { useContext, useState, useRef } from 'react';
import { AuthContext } from '~/contexts/authContext';
import swal from 'sweetalert';
import axios from 'axios';

function Setting() {
    const { loggedInUser, handleLoginSuccess } = useContext(AuthContext);
    const [username, setUsername] = useState(loggedInUser?.username || '');
    const [email, setEmail] = useState(loggedInUser?.email || '');
    const [detail, setDetail] = useState(loggedInUser?.detail || '');
    const [avatar, setAvatar] = useState(loggedInUser?.avatar || '');
    const [status] = useState(loggedInUser?.status || '');
    const [role] = useState(loggedInUser?.role || 0);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef();

    // Upload avatar file
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        setAvatarUploading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data) {
                setAvatar(response.data); // response.data là URL chuỗi
                swal('Thành công', 'Đã tải ảnh đại diện!', 'success');
            }
        } catch (error) {
            swal('Lỗi', 'Tải ảnh thất bại!', 'error');
        }
        setAvatarUploading(false);
    };

    // Cập nhật thông tin tài khoản (trừ mật khẩu)
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/users/${loggedInUser.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: loggedInUser.user_id,
                    username,
                    password: loggedInUser.password, // giữ nguyên nếu không đổi
                    email,
                    detail,
                    role,
                    status,
                    avatar,
                }),
            });
            if (response.ok) {
                const updatedUser = await response.json();
                handleLoginSuccess(updatedUser);
                swal('Thành công', 'Đã cập nhật tài khoản!', 'success');
            } else {
                let errorText = await response.text();
                swal('Lỗi', errorText, 'error');
            }
        } catch (err) {
            swal('Lỗi', 'Không thể kết nối máy chủ', 'error');
        }
        setLoading(false);
    };

    // Đổi mật khẩu (giữ nguyên nếu backend có endpoint riêng)
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/users/${loggedInUser.user_id}/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            if (response.ok) {
                swal('Thành công', 'Đã đổi mật khẩu!', 'success');
                setOldPassword('');
                setNewPassword('');
            } else {
                let errorText = await response.text();
                swal('Lỗi', errorText, 'error');
            }
        } catch (err) {
            swal('Lỗi', 'Không thể kết nối máy chủ', 'error');
        }
        setLoading(false);
    };

    if (!loggedInUser) {
        return (
            <div className="container">
                <h2>Vui lòng đăng nhập để cài đặt tài khoản.</h2>
            </div>
        );
    }

    return (
        <div
            className="account-setting-form"
            style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}
        >
            {/* Quản lý tài khoản bên trái */}
            <div style={{ flex: 1, minWidth: 280, maxWidth: 350 }}>
                <h2 style={{ textAlign: 'center' }}>Quản lý tài khoản</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
                    <div style={{ position: 'relative', marginBottom: 10 }}>
                        <img
                            src={avatar || '/assets/user.png'}
                            alt="avatar"
                            style={{
                                width: 96,
                                height: 96,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #6e6dfb',
                            }}
                        />
                        <button
                            type="button"
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: '#6e6dfb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                cursor: 'pointer',
                                fontSize: 18,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                            }}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            disabled={avatarUploading || loading}
                            title="Đổi ảnh đại diện"
                        >
                            <span role="img" aria-label="upload">
                                📷
                            </span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    uploadFile(e.target.files[0]);
                                }
                            }}
                        />
                    </div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                        {avatarUploading ? 'Đang tải ảnh...' : 'Chọn ảnh đại diện mới'}
                    </div>
                </div>
                <form onSubmit={handleUpdateUser}>
                    <label>Tên tài khoản:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Thông tin mô tả:</label>
                    <textarea
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        rows={4}
                        style={{
                            resize: 'vertical',
                            padding: '10px 12px',
                            border: '1.5px solid #e0e0e0',
                            borderRadius: '6px',
                            fontSize: '15px',
                            background: '#f7fafc',
                            color: '#333',
                            transition: 'border-color 0.2s',
                            minHeight: '80px',
                            marginBottom: '8px',
                        }}
                        placeholder="Giới thiệu bản thân, sở thích, ..."
                    />
                    <button type="submit" disabled={loading || avatarUploading} style={{ marginTop: 12 }}>
                        Lưu thay đổi
                    </button>
                </form>
            </div>
            {/* Đổi mật khẩu bên phải */}
            <div style={{ flex: 1, minWidth: 280, maxWidth: 350 }}>
                <h2 style={{ textAlign: 'center' }}>Đổi mật khẩu</h2>
                <form onSubmit={handleChangePassword}>
                    <label>Mật khẩu cũ:</label>
                    <input
                        type="password"
                        placeholder="Mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <label>Mật khẩu mới:</label>
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
                        Đổi mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Setting;
