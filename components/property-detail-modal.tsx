"use client";

import React, { useState } from 'react';
import {
  Property,
  getBadgeTurkish,
  getListingTypeTurkish,
  isAutomotiveListing,
  isHousingListing,
} from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconCheck, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2000);
  };

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

  const messagePlaceholder = isHousingListing(property)
    ? `Merhaba, "${property.title}" ilanı hakkında detaylı bilgi almak istiyorum.`
    : `Merhaba, "${property.title}" aracı hakkında ekspertiz ve detay bilgisi rica ederim.`;

  return (
    <Dialog open={!!property} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl gap-0 overflow-hidden rounded-2xl border-none p-0 shadow-2xl flex flex-col max-h-[90vh] md:flex-row md:max-h-[85vh]">
        <div className="sr-only">
          <DialogTitle>{property.title}</DialogTitle>
          <DialogDescription>
            {property.location} konumundaki {getListingTypeTurkish(property.type)} detayları.
          </DialogDescription>
        </div>

        <div className="flex min-w-0 w-full flex-col overflow-y-auto border-b border-[#E8E8E8] bg-gray-50 md:w-1/2 md:border-b-0 md:border-r">
          <div className="relative aspect-[4/3] w-full">
            <img src={property.image} alt={property.title} className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4">
              <span
                className={`rounded-[4px] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${getBadgeClass(property.badge)}`}
              >
                {getBadgeTurkish(property.badge)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <span className="mb-1 block text-[12px] font-medium uppercase tracking-wider text-[#EB6753]">
              {getListingTypeTurkish(property.type)}
            </span>
            <h2 className="mb-2 text-[22px] font-bold leading-tight text-[#222222]">{property.title}</h2>
            <div className="mb-4 flex items-center gap-1.5 text-[14px] text-[#666666]">
              <IconMapPin size={16} className="text-[#999999]" />
              <span>{property.location}</span>
            </div>

            <div className="mb-6 text-[26px] font-bold text-[#222222]">{property.price}</div>

            <div className="mb-6 grid grid-cols-3 gap-4 border-y border-[#E8E8E8] py-4">
              {isHousingListing(property) && (
                <>
                  <div className="rounded-lg bg-[#F7F7F7] p-3 text-center">
                    <div className="text-[12px] text-[#999999]">Oda</div>
                    <div className="mt-1 text-[15px] font-semibold text-[#222222]">
                      {property.beds === 0 ? '-' : property.beds}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F7F7F7] p-3 text-center">
                    <div className="text-[12px] text-[#999999]">Banyo</div>
                    <div className="mt-1 text-[15px] font-semibold text-[#222222]">{property.baths}</div>
                  </div>
                  <div className="rounded-lg bg-[#F7F7F7] p-3 text-center">
                    <div className="text-[12px] text-[#999999]">m²</div>
                    <div className="mt-1 text-[15px] font-semibold text-[#222222]">{property.sqft}</div>
                  </div>
                </>
              )}
              {isAutomotiveListing(property) && (
                <>
                  <div className="rounded-lg bg-[#F7F7F7] p-3 text-center">
                    <div className="text-[12px] text-[#999999]">Model Yılı</div>
                    <div className="mt-1 text-[15px] font-semibold text-[#222222]">{property.year}</div>
                  </div>
                  <div className="rounded-lg bg-[#F7F7F7] p-3 text-center">
                    <div className="text-[12px] text-[#999999]">Kilometre</div>
                    <div className="mt-1 text-[15px] font-semibold text-[#222222]">
                      {property.mileage.toLocaleString('tr-TR')} km
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F7F7F7] p-3 text-center">
                    <div className="text-[12px] text-[#999999]">Vites</div>
                    <div className="mt-1 text-[15px] font-semibold text-[#222222]">
                      {property.transmission}
                    </div>
                  </div>
                </>
              )}
            </div>

            <p className="text-[14px] leading-relaxed text-[#666666]">{property.description}</p>
          </div>
        </div>

        <div className="flex min-w-0 w-full flex-col justify-between overflow-y-auto bg-white p-6 md:w-1/2 md:p-8">
          <div>
            <h3 className="mb-4 text-[18px] font-bold text-[#222222] leading-tight">
              {isHousingListing(property) ? 'Danışman ile İletişime Geç' : 'Araç Danışmanı ile Görüş'}
            </h3>

            <div className="mb-6 flex min-w-0 items-center gap-4 rounded-xl border border-[#E8E8E8] bg-[#F7F7F7] p-4">
              <Avatar className="h-16 w-16 shrink-0 border-2 border-white shadow-sm">
                <AvatarImage src={property.agent.avatar} alt={property.agent.name} className="object-cover" />
                <AvatarFallback>{property.agent.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-[#222222]">{property.agent.name}</h4>
                <p className="truncate text-[13px] text-[#999999]">{property.agent.role}</p>
                <div className="mt-2 flex min-w-0 flex-col gap-1 text-[13px] text-[#666666]">
                  <span className="flex items-center gap-1.5">
                    <IconPhone size={13} /> <span className="truncate">{property.agent.phone}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconMail size={13} /> <span className="truncate">{property.agent.email}</span>
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#666666]">Adınız Soyadınız</label>
                <Input
                  type="text"
                  required
                  placeholder="Örn. Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 w-full min-w-0 border-[#E8E8E8] text-[14px] text-[#222222] focus-visible:border-primary focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#666666]">E-posta Adresiniz</label>
                <Input
                  type="email"
                  required
                  placeholder="Örn. ahmet@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11 w-full min-w-0 border-[#E8E8E8] text-[14px] text-[#222222] focus-visible:border-primary focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#666666]">Mesajınız</label>
                <Textarea
                  rows={4}
                  required
                  placeholder={messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full min-w-0 resize-none border-[#E8E8E8] text-[14px] text-[#222222] focus-visible:border-primary focus-visible:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitted}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#EB6753] text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#C84E3C]"
              >
                {isSubmitted ? (
                  <>
                    <IconCheck size={16} stroke={3} />
                    Mesaj Gönderildi!
                  </>
                ) : (
                  'Talep Gönder'
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center text-[12px] text-[#999999]">
            Bu formu göndererek gizlilik ve kullanım koşullarını kabul etmiş olursunuz.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
