import React, { useState, useRef } from 'react';

const Tooltip = ({ children, childrenRef, text, className }) => {
    const [position, setPosition] = useState({ top: 0, left: 0, direction: 'up' });
    const tooltipRef = useRef(null);
    const childRef = useRef(null);

    const showTooltip = () => {
        if (childRef.current && tooltipRef.current) {
            const childRect = childRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            const newPosition = {
                top: childRect.top - tooltipRect.height,
                left: childRect.left,
                tooltip: tooltipRect,
                direction: 'up'
            };

            if (newPosition.top < 0) {
                newPosition.top = childRect.top - tooltipRect.height;
                newPosition.direction = 'down';
            }

            setPosition(newPosition);
        }
    };

    const hideTooltip = () => {
        setPosition({ top: 0, left: 0, direction: 'up' }); // Reset position when hiding tooltip
    };

    return (
        <div className={`c-tooltip ${className}`} onMouseOver={showTooltip} onMouseLeave={hideTooltip} ref={childRef}>
            {children}
            <span
                className={`c-tooltip__text ${position.direction === 'down' ? 'c-tooltip__text--down' : 'c-tooltip__text--up'}`}
                ref={tooltipRef}
                style={
                    position.direction === 'up'?
                        {
                            top: position.top,
                            left: position.left,
                            visibility: position.top !== 0 ? 'visible' : 'hidden'
                        }
                    :
                        {
                            top: position.top,
                            left: position.left,
                            transform: `translateY(calc(100% + 40px))`,
                            visibility: position.top !== 0 ? 'visible' : 'hidden'
                        }
                }
            >
                {text}
            </span>
        </div>
    );
};

export default Tooltip;