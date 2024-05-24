import PropTypes from 'prop-types';
import './ProductCard.scss';

const ProductCard = ({ item }) => {
    return (
        <div className="product-card">
            <img src={item.image} alt={item.title} className="product-image" />
            <div className="product-details">
                <h5>{item.title}</h5>
                <p>Created by: {item.creator}</p>
                <p>Run Date: {item.runDate}</p>
                <button type="button" className={`status-btn ${item.status === 'Running' ? 'running' : ''}`}>
                    Status: {item.status}
                </button>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    item: PropTypes.shape({
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        creator: PropTypes.string.isRequired,
        runDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
    }).isRequired
};

export default ProductCard;
