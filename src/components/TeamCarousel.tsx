"use client";

import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/a11y";

import Bar from "@/components/ui/bar";

import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import TeamCard from "./TeamCard";
import { teamData } from "@/data/teamData";

const TeamCarousel: React.FC = () => {
  return (
    /* Carousel Container with Dark and Light Theming */
    <div className="container mx-auto px-4 py-5">
      <div className="py-4">
        <h1 className="bg-gradient-to-b from-purple-800 to-blue-800 bg-clip-text py-2 text-center text-3xl font-bold text-transparent md:text-5xl">
          Team
        </h1>
        <Bar classname="mx-auto" />
      </div>
      <style jsx global>{`
        .my-team-swiper {
          --swiper-navigation-color: #1f2937;
          --swiper-pagination-color: #1f2937;
        }

        .dark .my-team-swiper {
          --swiper-navigation-color: #d1d5db;
          --swiper-pagination-color: #d1d5db;
        }

        .my-team-swiper .swiper-button-next,
        .my-team-swiper .swiper-button-prev {
          transition: color 0.3s ease-in-out;
        }

        .my-team-swiper .swiper-pagination-bullet {
          transition: background-color 0.3s ease-in-out;
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="my-team-swiper"
      >
        {teamData.map((member) => (
          <SwiperSlide key={member.id} className="h-auto pb-10">
            <TeamCard
              name={member.name}
              designation={member.designation}
              image={member.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TeamCarousel;
