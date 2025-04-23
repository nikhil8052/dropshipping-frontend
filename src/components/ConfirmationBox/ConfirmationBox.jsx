import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import './ConfirmationBox.scss';
import Loading from '../Loading/Loading';

const ConfirmationBox = ({
    show,
    onClose,
    onConfirm,
    title,
    body,
    loading,
    customFooterClass,
    nonActiveBtn,
    disableBtn = false,
    activeBtn,
    cancelButtonTitle = 'No',
    activeBtnTitle = 'Yes',
    modalClassName
}) => {
    return (
        <Modal show={show} onHide={onClose} centered className={`confirmation-modal ${modalClassName || ''}` }>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer className={customFooterClass}>
                <Button
                    className={`custom-button ${nonActiveBtn}`}
                    disabled={loading}
                    variant="primary"
                    onClick={onClose}
                >
                    {cancelButtonTitle}
                </Button>
                <Button
                    className={`custom-button ${activeBtn}`}
                    disabled={disableBtn || loading}
                    variant="danger"
                    onClick={onConfirm}
                >
                    {loading ? <Loading size="sm" /> : activeBtnTitle}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ConfirmationBox.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    customFooterClass: PropTypes.string,
    nonActiveBtn: PropTypes.string,
    activeBtn: PropTypes.string,
    cancelButtonTitle: PropTypes.string,
    activeBtnTitle: PropTypes.string
};

export default ConfirmationBox;
