import './CarouselWrapper.scss';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import ProductCard from '../ProductCard/ProductCard';
import LectureCard from '../LectureCard/LectureCard';
import Modal from '../Modal/Modal';
import { useState } from 'react';
import PdfModal from '../PdfRenderer/PdfViewer';
import { stripHtmlTags } from '../../utils/utils';
import { Col, Row } from 'react-bootstrap';

const CarouselWrapper = ({ items = [], type = 'product' }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClick = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        const isProductType = type === 'product';

        if (isProductType) return;
        // Preview of lectures
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedItem(null);
    };
    return (
        <>
            <Row className="gx-4 gy-4">
                {items?.map((item, index = 1) => {
                    return (
                        <Col key={index} xxl={3} xl={4} lg={4} md={6} sm={12} xs={12}>
                            <div
                                className="cursor-pointer d-flex justify-content-center align-items-center"
                                onClick={(e) => handleClick(e, item, index)}
                            >
                                {type === 'product' ? (
                                    <ProductCard item={item} />
                                ) : type === 'lecture' ? (
                                    <LectureCard item={item} />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </Col>
                    );
                })}
            </Row>

            <Modal
                size="large" // You can change the size as needed
                show={showModal}
                onClose={handleClose}
                title={selectedItem?.name || 'Preview'}
            >
                {selectedItem?.dataType === 'file' ? (
                    <>
                        <div>
                            <h5>{selectedItem?.title}</h5>
                        </div>
                        <PdfModal file={selectedItem?.file} />
                        <hr />
                        <p>{stripHtmlTags(selectedItem?.description)}</p>
                    </>
                ) : (
                    <>
                        <div>
                            <h5>{selectedItem?.title}</h5>
                        </div>
                        <iframe
                            src={
                                selectedItem?.vimeoLink
                                    ? selectedItem?.vimeoLink
                                    : selectedItem?.vimeoVideoData?.player_embed_url
                            }
                            width="100%"
                            height="400"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title="Lecture"
                        />
                        <hr />
                        <div className="modal-description">
                            <div
                                className="content"
                                dangerouslySetInnerHTML={{ __html: selectedItem?.description }} // Render HTML content safely
                            />
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default CarouselWrapper;
