import React from 'react';

const PixelButton = ({ onClick, children, disabled, variant = 'primary', style }) => {
  const baseColor = variant === 'primary' ? 'var(--color-primary)' : 
                    variant === 'secondary' ? 'var(--color-secondary)' : 
                    variant === 'accent' ? 'var(--color-accent)' : '#888';
  
  const buttonStyle = {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    padding: '15px 20px',
    backgroundColor: baseColor,
    color: '#fff',
    border: '4px solid #000',
    boxShadow: '4px 4px 0px #000',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    position: 'relative',
    transition: 'transform 0.1s, box-shadow 0.1s',
    textTransform: 'uppercase',
    outline: 'none',
    ...style
  };

  const handleMouseDown = (e) => {
    if (!disabled) {
      e.target.style.transform = 'translate(4px, 4px)';
      e.target.style.boxShadow = '0px 0px 0px #000';
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled) {
      e.target.style.transform = 'translate(0px, 0px)';
      e.target.style.boxShadow = '4px 4px 0px #000';
    }
  };

  return (
    <button 
      onClick={!disabled ? onClick : undefined}
      style={buttonStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </button>
  );
};

export default PixelButton;
