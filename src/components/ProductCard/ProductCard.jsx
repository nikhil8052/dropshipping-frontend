import PropTypes from 'prop-types';
import './ProductCard.scss';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-details">
                <h5>{product.title}</h5>
                <p>Created by: {product.creator}</p>
                <p>Run Date: {product.runDate}</p>
                <button type="button" className={`status-btn ${product.status === 'Running' ? 'running' : ''}`}>
                    Status: {product.status}
                </button>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        creator: PropTypes.string.isRequired,
        runDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
    }).isRequired
};

export default ProductCard;
