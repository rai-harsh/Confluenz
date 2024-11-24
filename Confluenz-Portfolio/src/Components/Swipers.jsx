import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../assets/styles/Swiper.css'
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import { useEffect } from "react";
import axios from 'axios'
import { Link } from "react-router-dom"; 



export default function Swipers() {
  const [covers,setCovers]= React.useState([]);

  useEffect(() => {
      axios
      .get("/api/get/categoryCovers")
      .then((response) => {
          
          setCovers(response.data);  // Set cp_imagesZZZZ after logging the response
      })
      .catch((error) => {
          console.log(error);
      });
  }, []);

  
  var tiles = covers.map((item) => {
      return (
        {
          name: item.category,
          link : item.cover_img,
          id : item.id,
        }
      )
  });
  

  const slide= tiles.map((item)=>{
    return (
      <SwiperSlide key={item.id} >
          <Link to={`/category/${item.id}`} className='group rounded-3xl overflow-clip'>
            <div className='wrapper z-10 '>
              <h4 className='effect group-hover:tracking-[0.3rem]'>{item.name}</h4>
            </div>
            <img src={`http://localhost:4000${item.link}`} className="group-hover:scale-105 duration-700" alt="" />
          </Link>
        </SwiperSlide>
    )
  })
  return ( 
    
    <div id="portfolio"  className="portfolio text-center bg-gradient-to-b from-white via-gray-400 to-gray-200">
      <h1 className='heading text-black mb-16'>PORTFOLIO</h1>
      
      <Swiper
        effect={'coverflow'}
        grabCursor={false}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        {/* All the slides are stored here */}
        {slide}   
        {slide} 
        <div className="slider-controler ">
          <div className="swiper-button-prev slider-arrow    sm:mt-1 ">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow sm:mt-1">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          {/* <div className="swiper-pagination"></div> */}
        </div>
      </Swiper>
    </div>
  
  );
}

