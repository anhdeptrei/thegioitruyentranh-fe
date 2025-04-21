import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function DefaultLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="app">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                <Topbar />
                {children}
            </main>
        </div>
    );
}

export default DefaultLayout;
