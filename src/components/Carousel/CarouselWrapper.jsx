import { Keyboard, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import './CarouselWrapper.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Col, Row } from 'react-bootstrap';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import ProductCard from '../ProductCard/ProductCard';
import LectureCard from '../LectureCard/LectureCard';

const CarouselWrapper = ({ items, type = 'product' }) => {
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
    return (
        <Swiper
            loop={true}
            breakpoints={swiperBreakpoints}
            navigation={true}
            modules={[Keyboard, Scrollbar, Navigation, Pagination]}
        >
            <Row>
                {items.map((item, index) => (
                    <Col key={index}>
                        <SwiperSlide className="slide-item" key={index}>
                            {type === 'product' ? (
                                <ProductCard item={item} />
                            ) : type === 'lecture' ? (
                                <LectureCard item={item} />
                            ) : (
                                <></>
                            )}
                        </SwiperSlide>
                    </Col>
                ))}
            </Row>
        </Swiper>
    );
};

export default CarouselWrapper;
