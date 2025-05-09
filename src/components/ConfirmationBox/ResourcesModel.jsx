import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import './ConfirmationBox.scss';
import Loading from '../Loading/Loading';
import closeImg from '@icons/close-img.svg';
import downloadImg from '@icons/downlaod-img.svg';

const ResourcesModel = ({
    show,
    onClose,
    onConfirm,
    title,
    file_link,
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
        <Modal show={show} onHide={onClose} centered className={`res-modal confirmation-modal ${modalClassName || 'res-modal'}`}>
            <Modal.Header >
                <Modal.Title>{title}</Modal.Title>
                <div className='resources-wrap-btn'>
                    <div className="d-flex align-items-center gap-2 img-res-download">
                        <img onClick={onConfirm} src={downloadImg} alt="Download" style={{ width: 24, height: 24, cursor: 'pointer' }} />
                    </div>
                    <div className="d-flex align-items-center gap-2 img-res-download">
                        <img onClick={onClose} src={closeImg} alt="Download" style={{ width: 24, height: 24, cursor: 'pointer' }} />
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
        </Modal>
    );
};

ResourcesModel.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    file_link: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    customFooterClass: PropTypes.string,
    nonActiveBtn: PropTypes.string,
    activeBtn: PropTypes.string,
    cancelButtonTitle: PropTypes.string,
    activeBtnTitle: PropTypes.string
};

export default ResourcesModel;
