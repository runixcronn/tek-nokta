'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import { contextContent } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { IconCar, IconHome } from '@tabler/icons-react';

export function HowItWorks() {
  const { context, setIsAlertOpen } = useStore();

  const currentCopy = contextContent[context];

  return (
    <section id="how-it-works" className="bg-[#FEF8F6] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mx-auto mb-12 max-w-[600px] text-center">
          <h2 className="mb-2 text-[28px] font-bold tracking-tight text-text-dark md:text-[32px]">
            {currentCopy.helpTitle}
          </h2>
          <p className="text-[14px] text-text-muted">{currentCopy.helpDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {currentCopy.helpCards.map((card, index) => (
            <div
              key={card.title}
              className="flex flex-col items-center justify-between rounded-xl border border-border-custom bg-white p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg"
            >
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
                  index === 0
                    ? 'bg-[#FEF0EE] text-primary'
                    : index === 1
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'bg-[#E3F2FD] text-[#1565C0]'
                }`}
              >
                {context === 'housing' ? <IconHome size={30} /> : <IconCar size={30} />}
              </div>
              <h3 className="mb-2 text-[18px] font-bold text-text-dark">{card.title}</h3>
              <p className="mb-6 text-[14px] leading-relaxed text-text-body">{card.description}</p>
              <Button
                variant="outline"
                onClick={() => {
                  if (index === 1) {
                    setIsAlertOpen(true);
                    return;
                  }
                  document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-10 rounded-[6px] border-2 border-primary px-[22px] py-[8px] text-[14px] font-semibold text-primary transition-all hover:bg-[#FEF0EE] hover:text-primary"
              >
                {card.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
