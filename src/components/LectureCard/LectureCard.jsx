import { useState } from 'react';
import PropTypes from 'prop-types';
import './LectureCard.scss';
import { trimLongText } from '../../utils/common';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { stripHtmlTags } from '../../utils/utils';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const LectureCard = ({ item , courseId}) => {
   
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const baseUrl= import.meta.env.VITE__APP_URL;
        const link=`${baseUrl}/student/courses/enrolled-course/roadmap-4-product-research/tiktok-creative-center?m=direct&cid=${courseId}&lid=${item.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

    return (
        <div className="lecture-card h-100" key={item.id}>
            {item.type === 'pdf' ? (
                <FontAwesomeIcon className="product-image" icon={faFilePdf} color="rgba(200, 202, 216, 1)" />
            ) : (
                <img
                    src={item?.thumbnail || 'https://i.vimeocdn.com/video/default'}
                    alt={item.title}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop in case the default image fails too
                        e.target.src = 'https://i.vimeocdn.com/video/default'; // Set default image
                    }}
                />
            )}
            <div className="product-details d-flex flex-column justify-content-between">
                <h5>{item.title}</h5>
                <div>
                    <FontAwesomeIcon icon={faCopy} onClick={handleCopy}  />
                </div>
            </div>
        </div>
    );
};

LectureCard.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired
};

export default LectureCard;
