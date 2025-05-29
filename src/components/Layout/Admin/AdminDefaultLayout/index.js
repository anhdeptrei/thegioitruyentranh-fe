import { useState, useEffect, useContext } from 'react'; // Import useEffect and useContext
import { AuthContext } from '~/contexts/authContext'; // Import AuthContext
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AdminDefaultLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { loggedInUser, handleLogout } = useContext(AuthContext); // Get loggedInUser and handleLogout from AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInUser) {
            if (loggedInUser.role !== 2) {
                handleLogout();
                navigate('/');
            }
        } else {
            // Nếu không đăng nhập, có thể chuyển hướng về trang chủ hoặc trang login admin
            navigate('/');
        }
    }, [loggedInUser, navigate, handleLogout]);

    return (
        <div className="app">
            <Sidebar loggedInUser={loggedInUser} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                <Topbar loggedInUser={loggedInUser} onLogout={handleLogout} />
                {children}
            </main>
        </div>
    );
}

export default AdminDefaultLayout;
