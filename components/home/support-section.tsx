'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import { contextContent, housingImages, automotiveImages } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { IconArrowUpRight } from '@tabler/icons-react';

export function SupportSection() {
  const { context } = useStore();

  const currentCopy = contextContent[context];
  const images = context === 'housing' ? housingImages : automotiveImages;

  return (
    <section className="bg-bg-white py-16 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 lg:flex-row lg:gap-12">
        {/* Images collage */}
        <div className="hidden w-full items-center gap-4 sm:flex lg:w-1/2">
          <div className="aspect-[3/4] w-3/5 overflow-hidden rounded-2xl shadow-lg">
            <img src={images[1]} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex w-2/5 flex-col gap-4">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-lg">
              <img src={images[2]} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl border border-primary/20 bg-[#FEF0EE] p-4">
              <span className="text-[28px] font-bold text-primary">15+</span>
              <p className="mt-1 text-[13px] font-semibold text-text-dark">Yıllık Güven</p>
              <p className="text-[11px] text-text-muted">2011'den beri binlerce mutlu müşteri.</p>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="w-full lg:w-1/2">
          <h2 className="mb-4 text-[22px] font-bold leading-tight tracking-tight text-text-dark sm:text-[28px] md:text-[32px]">
            {currentCopy.supportTitle}
          </h2>
          <p className="mb-8 text-[14px] leading-relaxed text-text-body">
            {currentCopy.supportDescription}
          </p>
          <div className="mb-8 grid grid-cols-3 gap-6">
            {currentCopy.supportStats.map((stat) => (
              <div key={stat.label}>
                <span className="block text-[24px] font-bold text-text-dark md:text-[28px]">
                  {stat.value}
                </span>
                <span className="text-[12px] font-semibold uppercase text-text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <Button
            onClick={() =>
              document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="flex h-12 items-center gap-1 rounded-[6px] border-none bg-primary px-[24px] py-[12px] text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"
          >
            <span>{currentCopy.supportCta}</span>
            <IconArrowUpRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
