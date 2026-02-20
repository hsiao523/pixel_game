import React from 'react';

const PixelCard = ({ children, title, style }) => {
    const cardStyle = {
        backgroundColor: 'var(--color-card-bg)',
        border: '4px solid #000',
        boxShadow: '8px 8px 0px rgba(0,0,0,0.5)',
        padding: '2rem',
        position: 'relative',
        textAlign: 'left',
        marginBottom: '2rem',
        ...style
    };

    return (
        <div style={cardStyle}>
            {title && (
                <div style={{
                    backgroundColor: '#000',
                    color: 'var(--color-secondary)',
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.8rem',
                    position: 'absolute',
                    top: '-15px',
                    left: '20px',
                    border: '2px solid var(--color-secondary)'
                }}>
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};

export default PixelCard;
