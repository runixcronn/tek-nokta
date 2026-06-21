'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks/use-store';
import { fetchProperties } from '@/lib/api';
import { automotivePropertyTypes, housingPropertyTypes, getListingTypeTurkish } from '@/lib/data';
import { contextContent } from '@/lib/constants';
import { IconBuilding, IconCar, IconHome } from '@tabler/icons-react';

export function CategoryFilter() {
  const { context, activeCategory, setActiveCategory } = useStore();

  const currentCopy = contextContent[context];
  const currentTypes = context === 'housing' ? housingPropertyTypes : automotivePropertyTypes;

  const { data: propertiesList = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  return (
    <section className="border-b border-border-custom bg-bg-white py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex items-stretch gap-3 overflow-x-auto pb-1 no-scrollbar">
          {/* "All" button */}
          <button
            onClick={() => setActiveCategory('All')}
            className={`flex min-w-[100px] flex-1 flex-col items-center justify-center rounded-xl border py-4 transition-all duration-300 ${
              activeCategory === 'All'
                ? 'border-primary bg-[#FEF0EE] font-semibold text-primary shadow-sm'
                : 'border-border-custom bg-white text-text-body hover:border-primary hover:text-primary'
            }`}
          >
            {context === 'housing' ? (
              <IconHome size={24} className="mb-1.5" />
            ) : (
              <IconCar size={24} className="mb-1.5" />
            )}
            <span className="text-[12px] font-medium">{currentCopy.categoryAllLabel}</span>
          </button>

          {currentTypes.map((type) => {
            const count = propertiesList.filter(
              (p) => p.context === context && p.type === type,
            ).length;
            return (
              <button
                key={type}
                onClick={() => setActiveCategory(type)}
                className={`flex min-w-[100px] flex-1 flex-col items-center justify-center rounded-xl border py-4 transition-all duration-300 ${
                  activeCategory === type
                    ? 'border-primary bg-[#FEF0EE] font-semibold text-primary shadow-sm'
                    : 'border-border-custom bg-white text-text-body hover:border-primary hover:text-primary'
                }`}
              >
                {context === 'housing' ? (
                  <IconBuilding size={24} className="mb-1.5" />
                ) : (
                  <IconCar size={24} className="mb-1.5" />
                )}
                <span className="text-[12px] font-medium">{getListingTypeTurkish(type)}</span>
                <span className="mt-0.5 text-[11px] text-text-muted">{count} ilan</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
