import React from 'react';
import Sidebar from '../AdminDefaultLayout/Sidebar';
const SettingLayout = ({ children }) => {
    return (
        <>
            <Sidebar />
            <div className="setting-layout">
                <main className="setting-layout-content">{children}</main>
            </div>
        </>
    );
};

export default SettingLayout;
