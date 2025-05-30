import React from 'react';

interface StampProps {
    width?: string | number;
    height?: string | number;
    color?: string;
    className?: string;
}

export const StampOff: React.FC<StampProps> = ({ width = 24, height = 24, color = "currentColor", className = "" }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M5 22H16.5205" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 16.5563V15.5C20 14.84 19.74 14.2 19.27 13.73C19.0374 13.498 18.7614 13.3141 18.4577 13.1888C18.1539 13.0636 17.8285 12.9994 17.5 13L16.6235 13M11.7394 13L6.5 13C5.83696 13 5.20107 13.2634 4.73223 13.7322C4.26339 14.2011 4 14.837 4 15.5V17C4 17.2652 4.10536 17.5196 4.29289 17.7071C4.48043 17.8946 4.73478 18 5 18H16.6235" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 5C9 3 10.34 2 12 2C12.7956 2 13.5587 2.31607 14.1213 2.87868C14.6839 3.44129 15 4.20435 15 5C15 7 14 7 14 8.5V9.85553M10 13V11.2761" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 5L20 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default StampOff;