import React from 'react';
import './../App.css';

const Button = ({ onClick, disabled, children, primary, fullWidth, className = '' }) => {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} ${fullWidth ? 'btn-full' : ''} ${disabled ? 'disabled' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;

// // Replace all Tailwind classes with:
//className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} ${fullWidth ? 'btn-full' : ''} ${disabled ? 'disabled' : ''} ${className}`}