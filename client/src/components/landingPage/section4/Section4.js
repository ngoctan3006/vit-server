import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './section4.scss';

const Section4 = (props) => {
    return (
        <div className="section section4">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false
                }}
                pagination={{
                    clickable: true
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
            >
                <SwiperSlide>
                    <div className="slide-bg slide1"></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-bg slide2"></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-bg slide3"></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-bg slide4"></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-bg slide5"></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-bg slide6"></div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Section4;
