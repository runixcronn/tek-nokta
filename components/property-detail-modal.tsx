"use client";

import React, { useState } from 'react';
import { Property, getPropertyTypeTurkish, getBadgeTurkish } from '@/lib/data';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { IconBed, IconBath, IconRulerMeasure, IconMapPin, IconPhone, IconMail, IconCheck } from '@tabler/icons-react';

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

  return (
    <Dialog open={!!property} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl sm:max-w-4xl gap-0 p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
        {/* Hidden Dialog Title & Description for Accessibility */}
        <div className="sr-only">
          <DialogTitle>{property.title}</DialogTitle>
          <DialogDescription>
            {property.location} konumundaki {getPropertyTypeTurkish(property.type)} detayları.
          </DialogDescription>
        </div>

        {/* Left Side: Images & Info */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-50 border-b md:border-b-0 md:border-r border-[#E8E8E8] overflow-y-auto">
          <div className="relative aspect-[4/3] w-full">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-[4px] uppercase tracking-wider ${getBadgeClass(property.badge)}`}>
                {getBadgeTurkish(property.badge)}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <span className="text-[12px] font-medium text-[#EB6753] uppercase tracking-wider block mb-1">
              {getPropertyTypeTurkish(property.type)}
            </span>
            <h2 className="text-[22px] font-bold text-[#222222] leading-tight mb-2">
              {property.title}
            </h2>
            <div className="flex items-center gap-1.5 text-[14px] text-[#666666] mb-4">
              <IconMapPin size={16} className="text-[#999999]" />
              <span>{property.location}, Türkiye</span>
            </div>

            {/* Price display */}
            <div className="text-[26px] font-bold text-[#222222] mb-6">
              {property.price}
            </div>

            {/* Specs row */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-[#E8E8E8] py-4 mb-6">
              <div className="flex flex-col items-center justify-center p-2 bg-[#F7F7F7] rounded-lg">
                <IconBed size={20} className="text-[#EB6753] mb-1" />
                <span className="text-[12px] text-[#999999]">{property.type === 'Office' ? 'Çalışma Alanı' : 'Oda'}</span>
                <span className="text-[14px] font-semibold text-[#222222]">{property.beds === 0 ? '-' : property.beds}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-[#F7F7F7] rounded-lg">
                <IconBath size={20} className="text-[#EB6753] mb-1" />
                <span className="text-[12px] text-[#999999]">Banyo / WC</span>
                <span className="text-[14px] font-semibold text-[#222222]">{property.baths}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-[#F7F7F7] rounded-lg">
                <IconRulerMeasure size={20} className="text-[#EB6753] mb-1" />
                <span className="text-[12px] text-[#999999]">Alan</span>
                <span className="text-[14px] font-semibold text-[#222222]">{property.sqft} m²</span>
              </div>
            </div>

            <p className="text-[14px] text-[#666666] leading-relaxed">
              Bu benzersiz {getPropertyTypeTurkish(property.type).toLowerCase()}, modern detayları, birinci sınıf malzemeleri ve ayrıcalıklı konumu ile öne çıkmaktadır. Hem konforlu bir yaşam hem de yüksek yatırım değeri sunan bu gayrimenkulü kaçırmayın.
            </p>
          </div>
        </div>

        {/* Right Side: Inquiry Form & Agent */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            <h3 className="text-[18px] font-bold text-[#222222] mb-4">Danışman ile İletişime Geç</h3>
            
            {/* Agent profile card using shadcn Avatar */}
            <div className="flex items-center gap-4 p-4 bg-[#F7F7F7] rounded-xl border border-[#E8E8E8] mb-6">
              <Avatar className="w-16 h-16 border-2 border-white shadow-sm shrink-0">
                <AvatarImage src={property.agent.avatar} alt={property.agent.name} className="object-cover" />
                <AvatarFallback>{property.agent.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-[#222222]">{property.agent.name}</h4>
                <p className="text-[13px] text-[#999999]">Gayrimenkul Temsilcisi</p>
                <div className="flex flex-col gap-1 mt-2 text-[13px] text-[#666666]">
                  <span className="flex items-center gap-1.5"><IconPhone size={13} /> {property.agent.name === 'Canan Yılmaz' ? '+90 532 123 4567' : property.agent.name === 'Murat Kaya' ? '+90 533 987 6543' : '+90 544 321 0987'}</span>
                  <span className="flex items-center gap-1.5"><IconMail size={13} /> bilgi@teknokta.com</span>
                </div>
              </div>
            </div>

            {/* Message form using shadcn Input and Textarea */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#666666] mb-1">Adınız Soyadınız</label>
                <Input 
                  type="text" 
                  required
                  placeholder="Örn. Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-[#E8E8E8] h-11 text-[14px] text-[#222222] focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#666666] mb-1">E-posta Adresiniz</label>
                <Input 
                  type="email" 
                  required
                  placeholder="Örn. ahmet@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-[#E8E8E8] h-11 text-[14px] text-[#222222] focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#666666] mb-1">Mesajınız</label>
                <Textarea 
                  rows={4}
                  required
                  placeholder={`Merhaba, "${property.title}" ilanı hakkında detaylı bilgi almak istiyorum...`}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border-[#E8E8E8] text-[14px] text-[#222222] focus-visible:ring-primary focus-visible:border-primary resize-none"
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmitted}
                className="w-full bg-[#EB6753] hover:bg-[#C84E3C] text-white font-semibold rounded-lg h-11 text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm"
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
            Bu formu göndererek Gizlilik ve Kullanım Koşullarını kabul etmiş olursunuz.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
