import Topbar from './Topbar';
import Sidebar from './Sidebar';

function DefaultLayout({ children }) {
    return (
        <>
            <Sidebar />
            <main className="content">
                <Topbar />
                {children}
            </main>
        </>
    );
}

export default DefaultLayout;
