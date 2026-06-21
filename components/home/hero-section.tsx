'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { useStore } from '@/hooks/use-store';
import { housingImages, automotiveImages, contextContent } from '@/lib/constants';
import { SearchPanel } from './search-panel';

export function HeroSection() {
  const { context } = useStore();

  const heroImages = context === 'housing' ? housingImages : automotiveImages;
  const currentCopy = contextContent[context];

  return (
    <section className="relative min-h-[720px] overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          speed={900}
          loop
          className="h-full w-full"
        >
          {heroImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="pointer-events-none absolute inset-0 bg-bg-footer/60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-footer via-bg-footer/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-16 pt-24 text-center md:pt-28">
        <h1 className="mb-3 text-[30px] font-bold leading-tight tracking-tight text-white sm:text-[40px] md:text-[54px]">
          {currentCopy.heroTitle}
        </h1>
        <p className="mx-auto mb-8 max-w-[680px] px-2 text-[14px] text-gray-200 sm:text-[15px] md:mb-10 md:text-[17px]">
          {currentCopy.heroDescription}
        </p>

        <SearchPanel />
      </div>
    </section>
  );
}
