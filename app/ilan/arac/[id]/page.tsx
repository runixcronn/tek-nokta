"use client";

import React, { use, useState } from 'react';
import Link from 'next/link';
import { mockProperties, getListingTypeTurkish, isAutomotiveListing, AutomotiveListing } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
  IconCheck,
  IconShare,
  IconHeart,
  IconCalendar,
  IconCar,
  IconChevronRight,
  IconCoins,
  IconAlertCircle,
} from '@tabler/icons-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AutomotiveDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const property = mockProperties.find((p) => p.id === id) as AutomotiveListing | undefined;

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property || !isAutomotiveListing(property)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-light px-4 text-center">
        <h2 className="mb-2 text-2xl font-bold text-text-dark">Araç Bulunamadı</h2>
        <p className="mb-6 text-text-muted">Aradığınız araç ilanı mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/">
          <Button className="bg-primary text-white hover:bg-primary-dark">Ana Sayfaya Dön</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Car expert report status checklist mock (Very standard in TR automotive listings)
  const expertStatus = [
    { part: 'Motor ve Mekanik Durum', status: 'Kusursuz', class: 'text-green-600 bg-green-50' },
    { part: 'Şasi ve Podyeler', status: 'Orijinal', class: 'text-green-600 bg-green-50' },
    { part: 'Ön Kaput', status: 'Orijinal', class: 'text-green-600 bg-green-50' },
    { part: 'Tavan', status: 'Orijinal', class: 'text-green-600 bg-green-50' },
    { part: 'Bagaj Kapağı', status: 'Orijinal', class: 'text-green-600 bg-green-50' },
    { part: 'Sağ Yan Boyalı Parça', status: 'Yok', class: 'text-green-600 bg-green-50' },
    { part: 'Sol Yan Boyalı Parça', status: '1 Çamurluk lokal boyalı', class: 'text-amber-600 bg-amber-50' },
    { part: 'Değişen Parça', status: 'Yok', class: 'text-green-600 bg-green-50' },
    { part: 'Tramer Hasar Kaydı', status: '2.500 TL (Far değişimi)', class: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-bg-light font-sans text-text-body antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border-custom bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white shadow-md md:h-10 md:w-10 md:text-xl">
              T
            </div>
            <div>
              <div className="text-[18px] font-bold tracking-tight text-text-dark md:text-[20px]">Tek Nokta</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">Otomotiv Portföyü</div>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-1 text-[14px] font-semibold text-text-body">
              <IconArrowLeft size={16} /> Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b border-border-custom shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-[1200px] px-4 flex items-center gap-1.5 text-[13px] text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <IconChevronRight size={12} />
          <span>Araç İlanları</span>
          <IconChevronRight size={12} />
          <span className="text-text-dark font-medium truncate max-w-[200px] md:max-w-xs">{property.title}</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-4 py-8">
        {/* Title & Action Row */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <span className="mb-1 inline-block text-[12px] font-bold uppercase tracking-wider text-primary">
              {getListingTypeTurkish(property.type)} • {property.year} Model
            </span>
            <h1 className="mb-2 text-[24px] font-bold leading-tight text-text-dark sm:text-[28px] md:text-[32px]">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-[14px] text-text-muted">
              <IconMapPin size={16} className="text-primary" />
              <span>{property.location}, Türkiye</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-10 rounded-lg border-border-custom bg-white px-4 text-[14px] font-semibold text-text-body hover:bg-bg-light hover:text-text-dark transition-all"
            >
              {copiedLink ? <IconCheck size={16} className="text-green-600 animate-pulse" /> : <IconShare size={16} />}
              <span>{copiedLink ? 'Link Kopyalandı' : 'Paylaş'}</span>
            </Button>
            <Button
              onClick={() => setIsLiked(!isLiked)}
              variant="outline"
              className={`h-10 rounded-lg border-border-custom px-4 text-[14px] font-semibold transition-all ${
                isLiked ? 'bg-primary/5 border-primary text-primary' : 'bg-white text-text-body hover:bg-bg-light'
              }`}
            >
              <IconHeart size={16} className={isLiked ? 'fill-current' : ''} />
              <span>{isLiked ? 'Kaydedildi' : 'Kaydet'}</span>
            </Button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left / Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Image */}
            <div className="overflow-hidden rounded-2xl border border-border-custom bg-white p-2 shadow-md">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100">
                <img src={property.image} alt={property.title} className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4">
                  <span className="rounded bg-primary px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-md">
                    {property.badge === 'Featured' ? 'Öne Çıkan' : 'Satılık'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="rounded-2xl border border-border-custom bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-[18px] font-bold text-text-dark border-b border-border-custom pb-2">Hızlı Özet</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-bg-light p-4 text-center">
                  <span className="text-[12px] text-text-muted block uppercase font-medium">Model Yılı</span>
                  <span className="mt-1 block text-[18px] font-bold text-text-dark">{property.year}</span>
                </div>
                <div className="rounded-xl bg-bg-light p-4 text-center">
                  <span className="text-[12px] text-text-muted block uppercase font-medium">Kilometre</span>
                  <span className="mt-1 block text-[18px] font-bold text-text-dark">{property.mileage.toLocaleString('tr-TR')} km</span>
                </div>
                <div className="rounded-xl bg-bg-light p-4 text-center">
                  <span className="text-[12px] text-text-muted block uppercase font-medium">Yakıt Tipi</span>
                  <span className="mt-1 block text-[18px] font-bold text-text-dark">{property.fuel}</span>
                </div>
                <div className="rounded-xl bg-bg-light p-4 text-center">
                  <span className="text-[12px] text-text-muted block uppercase font-medium">Şanzıman</span>
                  <span className="mt-1 block text-[18px] font-bold text-text-dark">{property.transmission}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-border-custom bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-[18px] font-bold text-text-dark border-b border-border-custom pb-2">Açıklama</h3>
              <p className="text-[15px] leading-relaxed text-text-body whitespace-pre-line">
                {property.description}
                {"\n\n"}
                Aracımız temiz kullanılmış olup, düzenli periyodik bakımları zamanında yetkili servisinde yapılmıştır. 
                İç döşemelerinde yanık, yırtık veya deformasyon bulunmamaktadır. Ekstra opsiyonel donanımlar ve aksesuarlar mevcuttur. 
                Detaylı ekspertiz raporu aşağıda paylaşılmış olup, aracı dilediğiniz ekspertiz merkezine veya yetkili servise gösterebilirsiniz.
                Detaylar için lütfen araç danışmanımız ile iletişime geçin.
              </p>
            </div>

            {/* Technical Specs Details Table */}
            <div className="rounded-2xl border border-border-custom bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-[18px] font-bold text-text-dark border-b border-border-custom pb-2">Teknik Özellikler</h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 text-[14px]">
                <div className="flex justify-between border-b border-bg-light py-2">
                  <span className="text-text-muted">İlan No</span>
                  <span className="font-semibold text-text-dark">{property.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-bg-light py-2">
                  <span className="text-text-muted">Kasa Tipi</span>
                  <span className="font-semibold text-text-dark">{property.bodyStyle || getListingTypeTurkish(property.type)}</span>
                </div>
                <div className="flex justify-between border-b border-bg-light py-2">
                  <span className="text-text-muted">Motor Hacmi</span>
                  <span className="font-semibold text-text-dark">1598 cc</span>
                </div>
                <div className="flex justify-between border-b border-bg-light py-2">
                  <span className="text-text-muted">Motor Gücü</span>
                  <span className="font-semibold text-text-dark">150 Hp</span>
                </div>
                <div className="flex justify-between border-b border-bg-light py-2">
                  <span className="text-text-muted">Çekiş</span>
                  <span className="font-semibold text-text-dark">Önden Çekiş</span>
                </div>
                <div className="flex justify-between border-b border-bg-light py-2">
                  <span className="text-text-muted">Garanti Durumu</span>
                  <span className="font-semibold text-text-dark">Mevcut (1 Yıl Yol Yardım)</span>
                </div>
              </div>
            </div>

            {/* Expert Report Section (Ekspertiz Durumu) */}
            <div className="rounded-2xl border border-border-custom bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-custom pb-2">
                <h3 className="text-[18px] font-bold text-text-dark">Ekspertiz ve Boya Durumu</h3>
                <span className="inline-flex items-center gap-1 rounded bg-[#E8F5E9] px-2 py-1 text-[11px] font-bold text-[#2E7D32]">
                  <IconCheck size={12} stroke={3} /> Tek Nokta Onaylı Rapor
                </span>
              </div>
              <p className="mb-4 text-[13px] text-text-muted leading-relaxed">
                Tüm araçlarımız satışa sunulmadan önce bağımsız ekspertiz firmalarınca test edilip doğrulanmaktadır. 
                Aşağıdaki rapor beyanına uygun olmayan bir durum çıkarsa ekspertiz ücreti firmamızca karşılanır.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {expertStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-border-custom p-3 text-[13px]">
                    <span className="font-medium text-text-dark">{item.part}</span>
                    <span className={`rounded-md px-2 py-0.5 font-bold ${item.class}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column / Sticky Info Box */}
          <div className="space-y-6">
            {/* Price Box */}
            <div className="rounded-2xl border border-border-custom bg-white p-6 shadow-md text-center md:text-left">
              <span className="text-[12px] text-text-muted uppercase font-bold tracking-wider">İnternet Satış Fiyatı</span>
              <div className="mt-1 text-[30px] font-extrabold text-text-dark">{property.price}</div>
              <p className="mt-1 text-[12px] text-text-muted">Noter masrafları ve tescil bedeli fiyatlara dahil değildir.</p>
            </div>

            {/* Agent Info & Contact Form */}
            <div className="rounded-2xl border border-border-custom bg-white p-6 shadow-md sticky top-24">
              <h3 className="mb-4 text-[17px] font-bold text-[#222222] leading-tight">Araç Danışmanı</h3>
              
              <div className="mb-5 flex items-center gap-4 rounded-xl border border-border-custom bg-bg-light p-4">
                <Avatar className="h-14 w-14 shrink-0 border-2 border-white shadow-sm">
                  <AvatarImage src={property.agent.avatar} alt={property.agent.name} className="object-cover" />
                  <AvatarFallback>{property.agent.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-bold text-text-dark text-[14px]">{property.agent.name}</h4>
                  <p className="truncate text-[12px] text-text-muted">{property.agent.role}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <a
                  href={`tel:${property.agent.phone.replace(/\s+/g, '')}`}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border-custom bg-white text-[13px] font-bold text-text-dark hover:bg-bg-light transition-all text-center"
                >
                  <IconPhone size={15} /> Arayın
                </a>
                <a
                  href={`https://wa.me/${property.agent.phone.replace(/[^0-9]/g, '')}?text=Merhaba%20${property.agent.name},%20${property.title}%20arac%C4%B1%20hakk%C4%B1nda%20ekspertiz%20bilgisi%20alabilir%20miyim?`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg border-none bg-[#25D366] text-[13px] font-bold text-white hover:bg-[#20ba56] transition-all text-center"
                >
                  <IconBrandWhatsapp size={16} /> WhatsApp
                </a>
              </div>

              <div className="border-t border-border-custom pt-4">
                <h4 className="mb-3 text-[13px] font-bold uppercase text-text-dark">Teklif ve İletişim Formu</h4>
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-center animate-fade-in">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]"><IconCheck size={20} stroke={3} /></div>
                    <span className="text-[13px] font-bold text-text-dark text-[#2E7D32]">Talebiniz İletildi!</span>
                    <p className="text-[11px] text-text-muted">Danışmanımız 15 dakika içerisinde telefonla dönüş sağlayacaktır.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="text"
                      required
                      placeholder="Adınız Soyadınız"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-10 text-[13px] border-border-custom focus-visible:border-primary focus-visible:ring-primary"
                    />
                    <Input
                      type="email"
                      required
                      placeholder="E-posta Adresiniz"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-10 text-[13px] border-border-custom focus-visible:border-primary focus-visible:ring-primary"
                    />
                    <Textarea
                      required
                      rows={3}
                      placeholder={`Merhaba, "${property.title}" aracı hakkında detaylı ekspertiz ve takas koşulları hakkında bilgi rica ederim.`}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="text-[13px] border-border-custom focus-visible:border-primary focus-visible:ring-primary resize-none"
                    />
                    <Button type="submit" className="h-10 w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg text-[13px] border-none">
                      Teklif Al / Görüşme Planla
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-bg-footer pb-8 pt-12 text-white/50 mt-16 text-[13px]">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-bold text-white">T</div>
            <span className="text-[16px] font-bold text-white tracking-tight">Tek Nokta</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Tek Nokta A.Ş. Tüm Hakları Saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
