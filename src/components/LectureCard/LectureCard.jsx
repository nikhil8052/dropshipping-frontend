import PropTypes from 'prop-types';
import './LectureCard.scss';
import { trimLongText } from '../../utils/common';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LectureCard = ({ item }) => {
    return (
        <div className="product-card h-100" key={item.id}>
            {item.type === 'pdf' ? (
                <FontAwesomeIcon className="product-image" icon={faFilePdf} color="rgba(200, 202, 216, 1)" />
            ) : (
                <img
                    src={item?.thumbnail ?? 'https://i.vimeocdn.com/video/default'}
                    alt={item.title}
                    className="product-image"
                />
            )}
            <div className="product-details">
                <h5>{trimLongText(item.title, 15)}</h5>
                <p>{trimLongText(item.description, 20)}</p>
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
