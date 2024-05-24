import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';
import getCroppedImg from './cropImageHelper'; // Helper function to get the cropped image
import './imageCropper.scss';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropComplete = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
    };

    return (
        <Modal show={true} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="cropper-container">
                    <div className="cropper">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropCompleteCallback}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                    <Button variant="secondary" onClick={() => onZoomChange(zoom - 0.1)}>
                        <FontAwesomeIcon icon={faSearchMinus} />
                    </Button>
                    <Button variant="secondary" onClick={() => onZoomChange(zoom + 0.1)} className="mx-2">
                        <FontAwesomeIcon icon={faSearchPlus} />
                    </Button>
                </div>
                <div>
                    <Button variant="secondary" onClick={onCancel} className="cancel-btn">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCropComplete} className="ms-2 crop-btn">
                        Crop
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageCropper;
