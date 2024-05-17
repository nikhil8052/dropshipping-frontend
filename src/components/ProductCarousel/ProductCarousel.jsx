import ProductCard from '../ProductCard/ProductCard';
import { Keyboard, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import './ProductCarousel.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Col, Row } from 'react-bootstrap';
import 'swiper/swiper-bundle.css';
import 'swiper/css';

const ProductCarousel = ({ products }) => {
    const swiperBreakpoints = {
        320: {
            slidesPerView: 1,
            spaceBetween: -30
        },
        576: {
            slidesPerView: 1
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
            slidesPerView: 3
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
                {products.map((product, index) => (
                    <Col key={index}>
                        <SwiperSlide className="slide-item" key={index}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    </Col>
                ))}
            </Row>
        </Swiper>
    );
};

export default ProductCarousel;
