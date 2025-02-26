import React, { memo } from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ 
  size = 'md',
  variant = 'primary',
  text = 'Cargando...',
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  const spinnerSizes = {
    sm: { spinner: 'sm', text: 'small' },
    md: { spinner: '', text: 'medium' },
    lg: { spinner: 'lg', text: 'large' }
  };

  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1050,
    backgroundColor: overlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } : {};

  return (
    <div 
      className={`d-flex flex-column align-items-center justify-content-center gap-2 p-3 ${className}`}
      style={containerStyles}
    >
      <Spinner
        animation="border"
        role="status"
        variant={variant}
        size={spinnerSizes[size]?.spinner}
      >
        <span className="visually-hidden">{text}</span>
      </Spinner>
      {text && (
        <span className={`text-${variant} mt-2`}>
          {text}
        </span>
      )}
    </div>
  );
};

LoadingSpinner.defaultProps = {
  size: 'md',
  variant: 'primary',
  text: 'Cargando...',
  fullScreen: false,
  overlay: false,
  className: ''
};

export default memo(LoadingSpinner);