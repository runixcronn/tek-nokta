'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks/use-store';
import { fetchCities } from '@/lib/api';
import { City } from '@/lib/data';
import { contextContent } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { IconArrowUpRight } from '@tabler/icons-react';

export function CitiesSection() {
  const { context, setSelectedCity } = useStore();

  const currentCopy = contextContent[context];

  const { data: citiesList = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  const filteredCities = useMemo(
    () => citiesList.filter((city: City) => city.context === context),
    [citiesList, context],
  );

  return (
    <section id="cities" className="bg-bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mx-auto mb-12 max-w-[600px] text-center">
          <h2 className="mb-2 text-[28px] font-bold tracking-tight text-text-dark md:text-[32px]">
            {currentCopy.citiesTitle}
          </h2>
          <p className="text-[14px] text-text-muted">{currentCopy.citiesDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {citiesLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-72 rounded-xl" />
              ))
            : filteredCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => setSelectedCity(city.name)}
                  className="group relative h-72 cursor-pointer overflow-hidden rounded-xl border border-border-custom shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <h3 className="mb-1 flex items-center gap-1 text-[18px] font-bold tracking-tight">
                      {city.name}
                      <IconArrowUpRight
                        size={16}
                        className="text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </h3>
                    <p className="text-[13px] text-gray-300">
                      {city.propertiesCount} {currentCopy.cityCardSuffix}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
