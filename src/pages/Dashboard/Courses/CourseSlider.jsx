import { Keyboard, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import cardtitle from '../../../assets/icons/card-title.svg';
import '../../../styles/Courses.scss';
import Card from '@components/Card/Card';
import CourseCard from '../../../components/CourseCard/CourseCard';
import eventImg from '../../../assets/images/Event-Image.svg';

const swiperBreakpoints = {
    320: {
        slidesPerView: 1
    },
    576: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 2
    },
    992: {
        slidesPerView: 2
    },
    1200: {
        slidesPerView: 3
    },
    1440: {
        slidesPerView: 3
    },
    1680: {
        slidesPerView: 3
    },
    1920: {
        slidesPerView: 3
    },
    2560: {
        slidesPerView: 3
    }
};
const courseCards = [
    {
        id: 1,
        title: 'Design Conference',
        detail: 'Coach: David Everson',
        // lectureNo: 'Lectures: 28',
        img: eventImg
    },
    {
        id: 2,
        title: 'Design Conference',
        detail: 'Coach: David Everson',
        // lectureNo: 'Lectures: 28',
        img: eventImg
    },
    {
        id: 3,
        title: 'Structured Query',
        detail: 'Dropship Academy X',
        // lectureNo: 'Lectures: 28',
        img: eventImg
    },
    {
        id: 4,
        title: 'Advance programing',
        detail: 'Dropship Academy X',
        // lectureNo: 'Lectures: 28',

        img: eventImg
    },
    {
        id: 5,
        title: 'Blogs creation',
        detail: 'Dropship Academy X',
        // lectureNo: 'Lectures: 28',
        img: eventImg
    },
    {
        id: 6,
        title: 'Web Design',
        detail: 'Dropship Academy X',
        // lectureNo: 'Lectures: 28',
        img: eventImg
    },
    {
        id: 7,
        title: 'Web Design',
        detail: 'Dropship Academy X',
        // lectureNo: 'Lectures: 28',
        img: eventImg
    },
    {
        id: 8,
        title: 'Web Design',
        detail: 'Dropship Academy X',
        // lectureNo: 'Lectures: 28',

        img: eventImg
    }
];
const CourseSlider = () => {
    return (
        <div className="slider-section">
            <Swiper
                loop={true}
                breakpoints={swiperBreakpoints}
                navigation={true}
                modules={[Keyboard, Scrollbar, Navigation, Pagination]}
            >
                {courseCards.map((cousre) => (
                    <SwiperSlide key={cousre.id}>
                        <Card cardType="small">
                            <CourseCard {...cousre} />
                        </Card>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
export default CourseSlider;
