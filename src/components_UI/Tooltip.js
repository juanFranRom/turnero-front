import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ children, childrenRef, text, className }) => {
    const [position, setPosition] = useState({ top: 0, left: 0, direction: 'up' });
    const tooltipRef = useRef(null);
    const childRef = useRef(null);

    const showTooltip = () => {
        if (childRef.current && tooltipRef.current) {
            const childRect = childRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            // Get the offset of the child relative to the window
            const childOffsetTop = childRef.current.offsetTop;
            const childOffsetLeft = childRef.current.offsetLeft;

            const newPosition = {
                top: childRect.top + 20,
                left: childRect.left,
                tooltip: tooltipRect,
                direction: 'up'
            };

            if (newPosition.top < 0) {
                newPosition.top = childRect.bottom;
                newPosition.direction = 'down';
            }

            if(childOffsetTop + 20 > newPosition.top)
                setPosition({
                    top: childOffsetTop + 20 ,
                    left: childOffsetLeft,
                    direction: newPosition.direction
                });
            else
                setPosition({
                    top: newPosition.top,
                    left: newPosition.left,
                    direction: newPosition.direction
                });
        }
    };

    const hideTooltip = () => {
        setPosition({ top: 0, left: 0, direction: 'up' }); // Reset position when hiding tooltip
    };

    useEffect(() => {
        window.addEventListener('scroll', hideTooltip);
        return () => {
            window.removeEventListener('scroll', hideTooltip);
        };
    }, []);

    return (
        <div className={`c-tooltip ${className}`} onMouseOver={showTooltip} onMouseLeave={null} ref={childRef}>
            {children}
            <span
                className={`c-tooltip__text ${position.direction === 'down' ? 'c-tooltip__text--down' : 'c-tooltip__text--up'}`}
                ref={tooltipRef}
                style={
                    position.direction === 'up'?
                        {
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            visibility: position.top !== 0 ? 'visible' : 'hidden'
                        }
                    :
                        {
                            top: `${position.top}px`,
                            left: `${position.left}px`,
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
