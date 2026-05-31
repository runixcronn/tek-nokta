"use client";

import React, { useState } from 'react';
import { Property, getPropertyTypeTurkish, getBadgeTurkish } from '@/lib/data';
import { IconBed, IconBath, IconRulerMeasure, IconHeart, IconShare, IconMapPin } from '@tabler/icons-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
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

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden border border-[#E8E8E8] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 cursor-pointer"
      onClick={() => onSelect(property)}
    >
      {/* Image and Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-[4px] uppercase tracking-wider ${getBadgeClass(property.badge)}`}>
            {getBadgeTurkish(property.badge)}
          </span>
        </div>

        {/* Favorite Icon */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isLiked 
              ? 'bg-[#EB6753] text-white shadow-md' 
              : 'bg-white/80 text-[#222222] hover:bg-white hover:scale-105'
          }`}
          aria-label="İlanı Kaydet"
        >
          <IconHeart size={16} stroke={2} className={isLiked ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Type & Location */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[12px] font-medium text-[#EB6753] uppercase tracking-wider">
            {getPropertyTypeTurkish(property.type)}
          </span>
          <div className="flex items-center gap-1 text-[13px] text-[#999999]">
            <IconMapPin size={13} className="text-[#999999]" />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-semibold text-[#222222] line-clamp-1 group-hover:text-[#EB6753] transition-colors duration-200 mb-3">
          {property.title}
        </h3>

        {/* Specs: Beds, Baths, Sqft */}
        <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3 pb-3 mb-3 text-[13px] text-[#666666]">
          <div className="flex items-center gap-1.5">
            <IconBed size={16} stroke={1.5} className="text-[#999999]" />
            <span>{property.beds === 0 ? '' : `${property.beds} `}{property.type === 'Office' ? 'Çalışma Alanı' : 'Oda'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconBath size={16} stroke={1.5} className="text-[#999999]" />
            <span>{property.baths} Banyo / WC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconRulerMeasure size={16} stroke={1.5} className="text-[#999999]" />
            <span>{property.sqft} m²</span>
          </div>
        </div>

        {/* Agent and Price */}
        <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={property.agent.avatar} alt={property.agent.name} className="object-cover" />
              <AvatarFallback>{property.agent.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-[13px] font-medium text-[#666666]">{property.agent.name}</span>
          </div>
          <div className="text-[18px] font-bold text-[#222222]">
            {property.price}
          </div>
        </div>
      </div>
    </div>
  );
}
