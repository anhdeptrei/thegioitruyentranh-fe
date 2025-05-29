import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import AuthContextProvider from './contexts/authContext';
// import './index.css';

import { BrowserRouter } from 'react-router-dom';
// Polyfill for Array.prototype.at()
if (!Array.prototype.at) {
    Array.prototype.at = function (index) {
        index = Math.trunc(index) || 0;
        if (index < 0) index += this.length;
        if (index < 0 || index >= this.length) return undefined;
        return this[index];
    };
}
// const express = require('express');
// const cors = require('cors');

// const app = express();

// // Kích hoạt CORS
// app.use(cors());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    //     <BrowserRouter>
    //         <AuthContextProvider>
    //             <App />
    //         </AuthContextProvider>
    //     </BrowserRouter>
    // </React.StrictMode>,
    <BrowserRouter>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </BrowserRouter>,
);
