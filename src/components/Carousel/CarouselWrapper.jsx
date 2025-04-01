import './CarouselWrapper.scss';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import ProductCard from '../ProductCard/ProductCard';
import LectureCard from '../LectureCard/LectureCard';

const CarouselWrapper = ({ items = [], type = 'product', onItemClick }) => {
    const handleClick = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        if (type === 'product') return; // No preview for products
        if (onItemClick) {
            onItemClick(item);
        }
    };

    return (
        <div className="gx-4 gy-4">
            {items?.map((item, index) => (
                <div key={index}>
                    <div
                        className="cursor-pointer d-flex justify-content-center align-items-center"
                        onClick={(e) => handleClick(e, item)}
                    >
                        {type === 'product' ? (
                            <ProductCard item={item} />
                        ) : type === 'lecture' ? (
                            <LectureCard item={item} />
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarouselWrapper;
