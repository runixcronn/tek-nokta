'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import { contextContent } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function BannerCta() {
  const { context, setIsAlertOpen } = useStore();

  const currentCopy = contextContent[context];

  return (
    <section className="relative overflow-hidden bg-primary py-16 text-white md:py-20">
      <div className="pointer-events-none absolute bottom-0 right-0 w-1/2 opacity-15">
        <svg viewBox="0 0 100 100" fill="none" className="h-full w-full stroke-white stroke-[0.5]">
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="20" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-4 md:flex-row md:gap-8">
        <div className="max-w-[650px] text-center md:text-left">
          <h2 className="mb-3 text-[22px] font-bold tracking-tight sm:text-[28px] md:text-[34px]">
            {currentCopy.bannerTitle}
          </h2>
          <p className="text-[13px] text-white/80 sm:text-[15px]">
            {currentCopy.bannerDescription}
          </p>
        </div>

        <div className="flex w-full gap-3 md:w-auto">
          <Button
            onClick={() => setIsAlertOpen(true)}
            className="h-12 flex-1 rounded-lg border-none bg-[#222222] px-6 py-3 text-[14px] font-semibold text-white shadow-md transition-all hover:bg-black md:flex-none"
          >
            {currentCopy.bannerPrimary}
          </Button>
          <a
            href="tel:+902125550199"
            className="flex h-12 flex-1 items-center justify-center rounded-lg bg-white px-6 py-3 text-center text-[14px] font-semibold text-primary shadow-md transition-all hover:bg-gray-100 md:flex-none"
          >
            {currentCopy.bannerSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
