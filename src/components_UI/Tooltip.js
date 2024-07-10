import React, { useState, useRef } from 'react';

const Tooltip = ({ children, text, className }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef(null);
    const childRef = useRef(null);

    const showTooltip = () => {
        if (childRef.current && tooltipRef.current) {
            const childRect = childRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            
            setPosition({
                top: childRect.top - tooltipRect.height - 10, // Adding some offset for better positioning
                left: childRect.left
            });
        }
    };

    const hideTooltip = () => {
        setPosition({ top: 0, left: 0 }); // Reset position when hiding tooltip
    };

    return (
        <div className={`c-tooltip ${className}`} onMouseOver={showTooltip} onMouseLeave={hideTooltip} ref={childRef}>
            {children}
            <span
                className="c-tooltip__text"
                ref={tooltipRef}
                style={{ top: position.top, left: position.left, visibility: position.top !== 0 ? 'visible' : 'hidden' }}
            >
                {text}
            </span>
        </div>
    );
};

export default Tooltip;
