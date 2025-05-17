import React, { useState } from 'react';
// Import CSS module if you plan to use it
// import styles from './LoginForm.module.scss';

// Assuming this component receives onSwitchToRegister, onClose, and onLoginSuccess props
const LoginForm = ({ onSwitchToRegister, onClose, onLoginSuccess }) => {
    // Added onLoginSuccess prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const loginData = {
            username: username,
            password: password,
        };

        try {
            // Make the POST request to your backend login endpoint
            // IMPORTANT: Replace with your actual backend URL if different from frontend origin
            const response = await fetch('http://localhost:8080/users/login', {
                // Example: Use full backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const userResponse = await response.json();
                console.log('Login successful:', userResponse);
                // Call the success handler passed from parent
                if (onLoginSuccess) {
                    onLoginSuccess(userResponse);
                }
                // onClose() is now called within handleLoginSuccess in DefaultLayout
            } else {
                const errorData = await response.text();
                console.error('Login failed:', response.status, errorData);
                setError(errorData || 'Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('Network error or unexpected issue:', err);
            setError('Đã xảy ra lỗi khi kết nối đến máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div /* className={styles.loginForm} */>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Tên đăng nhập:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>
            <p>
                Chưa có tài khoản?{' '}
                <button type="button" onClick={onSwitchToRegister} disabled={loading}>
                    Đăng kí ngay
                </button>
            </p>
        </div>
    );
};

export default LoginForm;
