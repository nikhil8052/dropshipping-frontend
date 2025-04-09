import { useState } from 'react';
import './CarouselWrapper.scss';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import ProductCard from '../ProductCard/ProductCard';
import LectureCard from '../LectureCard/LectureCard';

const CarouselWrapper = ({ items = [], type = 'product', onItemClick, courseId=null }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (e, item, index ) => {
        e.currentTarget.classList.add('active_lec');
        e.stopPropagation();
        setActiveIndex(index); 
        e.preventDefault();
        if (type === 'product') return;
        if (onItemClick) {
            onItemClick(item);
        }
    };

    return (
        <div className="gx-4 gy-4">
            {items?.map((item, index) => (
                <div key={index} >
                    <div
                        className={`cursor-pointer d-flex justify-content-center align-items-center ${
                            activeIndex === index ? 'active_lec' : ''
                        }`}
                        onClick={(e) => handleClick(e, item, index )}
                    >
                        {type === 'product' ? (
                            <ProductCard item={item} />
                        ) : type === 'lecture' ? (
                            <LectureCard item={item} courseId={courseId} />
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarouselWrapper;
