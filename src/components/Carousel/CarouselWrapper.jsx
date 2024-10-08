import { Keyboard, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import './CarouselWrapper.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import ProductCard from '../ProductCard/ProductCard';
import LectureCard from '../LectureCard/LectureCard';
import Modal from '../Modal/Modal';
import { useState } from 'react';
import PdfModal from '../PdfRenderer/PdfViewer';
import { stripHtmlTags } from '../../utils/utils';

const CarouselWrapper = ({ items = [], type = 'product' }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const swiperBreakpoints = {
        320: {
            slidesPerView: 1,
            spaceBetween: -30
        },
        576: {
            slidesPerView: 2,
            spaceBetween: -30
        },
        768: {
            slidesPerView: 2,
            spaceBetween: -30
        },
        992: {
            slidesPerView: 2,
            spaceBetween: -30
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: -30
        },
        1440: {
            slidesPerView: 3,
            spaceBetween: -30
        },
        1680: {
            slidesPerView: 4,
            spaceBetween: -30
        },
        1920: {
            slidesPerView: 5,
            spaceBetween: -30
        },
        2560: {
            slidesPerView: 5,
            spaceBetween: -30
        },
        3600: {
            slidesPerView: 5,
            spaceBetween: -30
        }
    };

    const handleSlideClick = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        if (type === 'product') return;
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
            <Swiper
                loop={true}
                breakpoints={swiperBreakpoints}
                navigation={true}
                modules={[Keyboard, Scrollbar, Navigation, Pagination]}
            >
                {items.map((item, index) => (
                    <SwiperSlide
                        className="slide-item cursor-pointer"
                        key={index}
                        onClick={(e) => handleSlideClick(e, item)}
                    >
                        {type === 'product' ? (
                            <ProductCard item={item} />
                        ) : type === 'lecture' ? (
                            <LectureCard item={item} />
                        ) : (
                            <></>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
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
