import React, { useState } from 'react';

// Assuming this component receives onSwitchToLogin and onClose props from the Modal
const RegisterForm = ({ onSwitchToLogin, onClose }) => {
    // Added onClose prop
    const [username, setUsername] = useState(''); // State for username
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // State to hold error message
    const [loading, setLoading] = useState(false); // State to indicate loading

    const handleSubmit = async (e) => {
        // Made handleSubmit async
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic frontend validation: Check if passwords match
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return; // Stop the submission
        }

        setLoading(true); // Set loading state

        // Construct the user data object to send to the backend
        // Based on your Users model, we send username, password, and email.
        // Other fields like role, status, avatar, detail, create_at, update_at
        // are likely handled by the backend or have default values.
        const userData = {
            username: username,
            password: password,
            email: email,
            role: 0, // Default role for new users
            status: 'active',
            detail: '',
            avatar: '',
        };

        try {
            // Make the POST request to your backend registration endpoint
            // IMPORTANT: Replace with your actual backend URL if different from frontend origin
            // Based on your controller mapping, the endpoint is likely '/users'
            const response = await fetch('http://localhost:8080/users', {
                // Example: Use full backend URL and '/users' endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Check if the response status is in the 2xx range
                const newUser = await response.json(); // Backend returns the saved Users object
                console.log('Registration successful:', newUser);
                // Handle successful registration (e.g., show success message, close modal, maybe auto-login or redirect to login)
                alert('Đăng ký thành công! Vui lòng đăng nhập.'); // Show success message
                if (onClose) {
                    onClose(); // Close the modal
                }
                // Optional: Automatically switch to login form after successful registration
                // if (onSwitchToLogin) {
                //     onSwitchToLogin();
                // }
            } else {
                // Handle errors (e.g., username/email already exists, validation errors)
                const errorData = await response.text(); // Read error message as text
                console.error('Registration failed:', response.status, errorData);
                setError(errorData || 'Đăng ký thất bại. Vui lòng thử lại.'); // Display error message
            }
        } catch (err) {
            console.error('Network error or unexpected issue:', err);
            setError('Đã xảy ra lỗi khi kết nối đến máy chủ.'); // Display a generic error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div /* className={styles.registerForm} */>
            <h2>Đăng kí</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    {/* Updated label and state for username */}
                    <label htmlFor="reg-username">Tên đăng nhập:</label>
                    <input
                        type="text"
                        id="reg-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading} // Disable input while loading
                    />
                </div>
                <div>
                    {/* Added input for email */}
                    <label htmlFor="reg-email">Email:</label>
                    <input
                        type="email"
                        id="reg-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading} // Disable input while loading
                    />
                </div>
                <div>
                    <label htmlFor="reg-password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="reg-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading} // Disable input while loading
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password">Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading} // Disable input while loading
                    />
                </div>
                {/* Display error message if exists */}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng kí'}
                </button>
            </form>
            <p>
                Đã có tài khoản?{' '}
                <button type="button" onClick={onSwitchToLogin} disabled={loading}>
                    Đăng nhập ngay
                </button>
            </p>
        </div>
    );
};

export default RegisterForm;
