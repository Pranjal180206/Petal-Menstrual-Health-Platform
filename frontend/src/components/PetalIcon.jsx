import React from 'react';

const PetalIcon = ({ size = 24, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 22C6.477 22 2 17.523 2 12S12 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
    );
};

export default PetalIcon;
