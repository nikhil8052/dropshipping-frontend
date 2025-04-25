import { useRef, useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TextExpand = ({ value = '--', width = '150px', className = '' }) => {
    const textRef = useRef(null);
    const [isOverflowed, setIsOverflowed] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            const isOverflow = textRef.current.scrollWidth > textRef.current.clientWidth;
            setIsOverflowed(isOverflow);
        }
    }, [value, width]);

    return (
        <div className="d-flex align-items-center gap-2">
            {isOverflowed ? (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-top">{value}</Tooltip>}
                    trigger={['hover', 'focus']} // Show on hover or focus
                >
                    <div
                        ref={textRef}
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                           
                            cursor: 'pointer',
                            display: 'inline-block',
                            maxWidth: width
                        }}
                        className={className}
                    >
                       <p style={{
                        wordBreak: 'break-word',
                      
                    }}>{value}</p> 
                    </div>
                </OverlayTrigger>
            ) : (
                <div
                    ref={textRef}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      
                        display: 'inline-block',
                        maxWidth: width
                    }}
                    className={className}
                >
                      <p
                      style={{
                        wordBreak: 'break-word',
                      
                    }}
                    >{value}</p> 
                </div>
            )}
        </div>
    );
};

export default TextExpand;
