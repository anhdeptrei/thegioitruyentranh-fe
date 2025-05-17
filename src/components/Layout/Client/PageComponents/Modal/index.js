import React from 'react';
// Import CSS module if you plan to use it
// import styles from './Modal.module.scss';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    // Prevent clicks inside the modal content from closing the modal
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {' '}
            {/* This will be the dark overlay */}
            <div className="modal-content" onClick={handleContentClick}>
                {' '}
                {/* This will contain the form */}
                {children}
                {/* Optional close button */}
                <button className="modal-close-button" onClick={onClose}>
                    &times; {/* HTML entity for multiplication sign (a common close icon) */}
                </button>
            </div>
        </div>
    );
};

export default Modal;
