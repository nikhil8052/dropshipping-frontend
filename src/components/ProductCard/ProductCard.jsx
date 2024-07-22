import PropTypes from 'prop-types';
import './ProductCard.scss';
import { trimLongText, formatDate } from '../../utils/common';

const ProductCard = ({ item }) => {
    return (
        <div className="product-card">
            <img src={item.avatarUrl} alt={item.productName} className="product-image" />
            <div className="product-details">
                <h5>{item.productName}</h5>
                <p>Created by: {trimLongText(item.createdBy?.name, 10)}</p>
                <p>Run Date: {formatDate(item.runDate)}</p>
                <button type="button" className={`status-btn ${item.status === 'Running' ? 'running' : ''}`}>
                    Status: {item.status}
                </button>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    item: PropTypes.shape({
        avatarUrl: PropTypes.string.isRequired,
        productName: PropTypes.string.isRequired,
        createdBy: PropTypes.object,
        runDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
    }).isRequired
};

export default ProductCard;
