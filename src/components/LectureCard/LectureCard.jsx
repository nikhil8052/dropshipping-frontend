import PropTypes from 'prop-types';
import './LectureCard.scss';
import { trimLongText } from '../../utils/common';

const LectureCard = ({ item }) => {
    return (
        <div className="product-card">
            <img src={item.image} alt={item.title} className="product-image" />
            <div className="product-details">
                <h5>{item.title}</h5>
                <p>{trimLongText(item.description, 20)}</p>
            </div>
        </div>
    );
};

LectureCard.propTypes = {
    item: PropTypes.shape({
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired
};

export default LectureCard;
