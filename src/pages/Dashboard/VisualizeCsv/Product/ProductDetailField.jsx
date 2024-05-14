import { Col, Row } from 'react-bootstrap';

const ProductDetailField = ({ label, value, isLink = false, icon, customClass = '' }) => {
    // This component handles the display of each field, checking if it's a link
    return (
        <Row className="mb-2">
            <Col md={4} className="d-flex align-items-center gap-1">
                <img src={icon} alt={label} /> {label}
            </Col>
            <Col md={8}>
                {isLink ? (
                    <a href={value} target="_blank" rel="noreferrer">
                        {value}
                    </a>
                ) : (
                    <span className={` value ${customClass}`}>{value}</span>
                )}
            </Col>
        </Row>
    );
};

export default ProductDetailField;
