import { Spinner } from 'react-bootstrap';

const Loading = ({ centered = false, size = 'md' }) => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={centered ? { height: '100vh' } : null}>
            <Spinner animation="grow" variant="info" role="status" size={size}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
};

export default Loading;
