import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './LectureCard.scss';
import { trimLongText } from '../../utils/common';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { stripHtmlTags } from '../../utils/utils';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import axiosWrapper from '../../utils/api';
import { API_URL } from '../../utils/apiUrl';
import { useSelector } from 'react-redux';

const LectureCard = ({ item , courseId, courseSlug }) => {
   
    const token = useSelector((state) => state?.auth?.userToken);

    const [copied, setCopied] = useState(false);
    const createSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    const handleCopy = async () => {
        const { data } = await axiosWrapper('GET', `${API_URL.GET_COURSE.replace(':id', courseId)}`, {}, token);
        const courseSlug= createSlug(data.title);
        const slug = createSlug(item.title);
        const baseUrl= import.meta.env.VITE__APP_URL;
        const link=`${baseUrl}/student/courses/enrolled-course/${courseSlug}/${slug}?m=direct&cid=${courseId}&lid=${item.id}`;
        console.log( link , " LINK ")
        navigator.clipboard.writeText(link);
        setCopied(true);
        alert("Link has been copued to clipboard");
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
            <div className="product-details d-flex  justify-content-between">
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
