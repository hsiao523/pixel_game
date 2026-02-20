import React from 'react';

const PixelInput = ({ value, onChange, placeholder, type = "text", style }) => {
    const inputStyle = {
        fontFamily: 'var(--font-body)',
        fontSize: '1.5rem',
        padding: '10px',
        border: '4px solid #000',
        backgroundColor: '#fff',
        color: '#000',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none',
        boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.2)',
        ...style
    };

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={inputStyle}
        />
    );
};

export default PixelInput;
