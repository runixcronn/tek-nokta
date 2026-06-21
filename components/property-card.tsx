"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Property,
  getBadgeTurkish,
  getListingTypeTurkish,
  isAutomotiveListing,
  isHousingListing,
} from '@/lib/data';
import { IconHeart, IconMapPin } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case 'Featured':
        return 'bg-[#FEF0EE] text-[#EB6753]';
      case 'For Sale':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'For Rent':
        return 'bg-[#E3F2FD] text-[#1565C0]';
      default:
        return 'bg-[#F7F7F7] text-[#666666]';
    }
  };

  const detailUrl = property.context === 'housing'
    ? `/ilan/konut/${property.id}`
    : `/ilan/arac/${property.id}`;

  return (
    <Link
      href={detailUrl}
      className="group block cursor-pointer overflow-hidden rounded-xl border border-[#E8E8E8] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`rounded-[4px] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${getBadgeClass(property.badge)}`}
          >
            {getBadgeTurkish(property.badge)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-md transition-all duration-300 ${
            isLiked
              ? 'bg-[#EB6753] text-white shadow-md'
              : 'bg-white/80 text-[#222222] hover:scale-105 hover:bg-white'
          }`}
          aria-label="İlanı Kaydet"
        >
          <IconHeart size={16} stroke={2} className={isLiked ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium uppercase tracking-wider text-[#EB6753]">
            {getListingTypeTurkish(property.type)}
          </span>
          <div className="flex items-center gap-1 text-[13px] text-[#999999]">
            <IconMapPin size={13} className="text-[#999999]" />
            <span>{property.location}</span>
          </div>
        </div>

        <h3 className="mb-3 line-clamp-1 text-[17px] font-semibold text-[#222222] transition-colors duration-200 group-hover:text-[#EB6753]">
          {property.title}
        </h3>

        <div className="mb-3 grid grid-cols-3 gap-3 border-t border-[#E8E8E8] py-3 text-[13px] text-[#666666]">
          {isHousingListing(property) && (
            <>
              <div className="rounded-lg bg-[#F7F7F7] px-3 py-2 text-center">
                <div className="text-[11px] uppercase text-[#999999]">Oda</div>
                <div className="mt-1 font-semibold text-[#222222]">
                  {property.beds === 0 ? '-' : property.beds}
                </div>
              </div>
              <div className="rounded-lg bg-[#F7F7F7] px-3 py-2 text-center">
                <div className="text-[11px] uppercase text-[#999999]">Banyo</div>
                <div className="mt-1 font-semibold text-[#222222]">{property.baths}</div>
              </div>
              <div className="rounded-lg bg-[#F7F7F7] px-3 py-2 text-center">
                <div className="text-[11px] uppercase text-[#999999]">m²</div>
                <div className="mt-1 font-semibold text-[#222222]">{property.sqft}</div>
              </div>
            </>
          )}
          {isAutomotiveListing(property) && (
            <>
              <div className="rounded-lg bg-[#F7F7F7] px-3 py-2 text-center">
                <div className="text-[11px] uppercase text-[#999999]">Yıl</div>
                <div className="mt-1 font-semibold text-[#222222]">{property.year}</div>
              </div>
              <div className="rounded-lg bg-[#F7F7F7] px-3 py-2 text-center">
                <div className="text-[11px] uppercase text-[#999999]">KM</div>
                <div className="mt-1 font-semibold text-[#222222]">
                  {property.mileage.toLocaleString('tr-TR')}
                </div>
              </div>
              <div className="rounded-lg bg-[#F7F7F7] px-3 py-2 text-center">
                <div className="text-[11px] uppercase text-[#999999]">Yakıt</div>
                <div className="mt-1 font-semibold text-[#222222]">{property.fuel}</div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={property.agent.avatar} alt={property.agent.name} className="object-cover" />
              <AvatarFallback>{property.agent.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-[13px] font-medium text-[#666666]">{property.agent.name}</span>
          </div>
          <div className="text-[18px] font-bold text-[#222222]">{property.price}</div>
        </div>
      </div>
    </Link>
  );
}
