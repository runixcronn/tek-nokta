"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { useQuery } from '@tanstack/react-query';
import { 
  propertyTypes, 
  Property,
  getPropertyTypeTurkish,
  getBadgeTurkish
} from '@/lib/data';
import {
  fetchProperties,
  fetchAgents,
  fetchCities,
} from '@/lib/api';
import { PropertyCard } from '@/components/property-card';
import { PropertyDetailModal } from '@/components/property-detail-modal';

// shadcn UI component imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogAction 
} from '@/components/ui/alert-dialog';

import { 
  IconSearch, 
  IconMapPin, 
  IconBuilding, 
  IconCoin, 
  IconPhone, 
  IconUser, 
  IconHome, 
  IconArrowUpRight, 
  IconChevronDown, 
  IconCheck, 
  IconPlus,
  IconX,
  IconMenu
} from '@tabler/icons-react';

export default function Page() {
  // Search state
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'sell'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');

  // Active Category Bar
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Selected Property for detail modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Authentication modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authFormData, setAuthFormData] = useState({ email: '', password: '', name: '', terms: false });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // AlertDialog state for "Add Property" info
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Onboarding quiz state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({});

  const onboardingQuestions = [
    {
      id: 'location',
      emoji: '📍',
      title: 'Nerede yaşıyorsunuz?',
      subtitle: 'Size en yakın ilanları gösterebilmemiz için şehrinizi seçin.',
      type: 'location' as const,
      options: [] as { value: string; label: string; icon: string; desc: string }[],
    },
    {
      id: 'family',
      emoji: '🏠',
      title: 'Ev için kaç kişisiniz?',
      subtitle: 'Yaşam alanı önerilerimizi buna göre şekillendirelim.',
      type: 'cards' as const,
      options: [
        { value: 'single', label: 'Yalnız', icon: '🧍', desc: 'Stüdyo veya 1+1' },
        { value: 'couple', label: 'Çift', icon: '👫', desc: '1+1 veya 2+1' },
        { value: 'family', label: 'Küçük Aile', icon: '👨\u200d👩\u200d👦', desc: '2+1 veya 3+1' },
        { value: 'bigfamily', label: 'Kalabalık Aile', icon: '👨\u200d👩\u200d👧\u200d👦', desc: '3+1 veya üzeri' },
      ],
    },
    {
      id: 'housing',
      emoji: '🏡',
      title: 'Ne tür bir ev arıyorsunuz?',
      subtitle: 'Hayalinizdeki yaşam alanının tipini seçin.',
      type: 'cards' as const,
      options: [
        { value: 'site', label: 'Site / Rezidans', icon: '🏘️', desc: 'Güvenlikli, sosyal alan' },
        { value: 'standalone', label: 'Müstakil Ev', icon: '🏡', desc: 'Bahçeli, özel alan' },
        { value: 'apartment', label: 'Düz Daire', icon: '🏢', desc: 'Klasik apartman katı' },
        { value: 'villa', label: 'Villa', icon: '🛖', desc: 'Lüks, geniş yaşam' },
      ],
    },
  ];

  // Lock body scroll while onboarding is open
  useEffect(() => {
    if (isOnboardingOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOnboardingOpen]);

  const goNextOnboarding = (skip = false) => {
    if (!skip) {
      const q = onboardingQuestions[onboardingStep];
      const hasAnswer = q.type === 'location' ? !!onboardingAnswers['city'] : !!onboardingAnswers[q.id];
      if (!hasAnswer) return;
    }
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingLoading(true);
      setTimeout(() => {
        setOnboardingLoading(false);
        setOnboardingStep(s => s + 1);
      }, 900);
    } else {
      setIsOnboardingOpen(false);
    }
  };

  // Backend data queries
  const { data: propertiesList = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const { data: agentsList = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  const { data: citiesList = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  // Individual loading states used per section

  // Filter properties
  const filteredProperties = useMemo(() => {
    return propertiesList.filter((property) => {
      // 1. Purpose match
      const purposeMatch = 
        activeTab === 'buy' ? property.purpose === 'buy' || property.purpose === 'sell' :
        activeTab === 'rent' ? property.purpose === 'rent' :
        property.purpose === 'sell';

      // 2. Category match from Category bar
      const categoryMatch = activeCategory === 'All' || property.type === activeCategory;

      // 3. Search query match
      const queryMatch = 
        searchQuery === '' || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      // 4. City selector match
      const cityMatch = selectedCity === 'All' || property.location.toLowerCase() === selectedCity.toLowerCase();

      // 5. Type selector match
      const typeMatch = selectedType === 'All' || property.type === selectedType;

      // 6. Price range match
      let priceMatch = true;
      if (selectedPriceRange !== 'All') {
        const val = property.priceValue;
        if (selectedPriceRange === 'under-1m') {
          priceMatch = val < 10000000;
        } else if (selectedPriceRange === '1m-3m') {
          priceMatch = val >= 10000000 && val <= 25000000;
        } else if (selectedPriceRange === 'over-3m') {
          priceMatch = val > 25000000;
        }
      }

      return purposeMatch && categoryMatch && queryMatch && cityMatch && typeMatch && priceMatch;
    });
  }, [propertiesList, activeTab, activeCategory, searchQuery, selectedCity, selectedType, selectedPriceRange]);

  // Handle newsletter submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 3000);
    }
  };

  // Auth Submit handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        setIsAuthModalOpen(false);
        setAuthFormData({ email: '', password: '', name: '', terms: false });
        if (authTab === 'register') {
          setOnboardingStep(0);
          setOnboardingAnswers({});
          setOnboardingLoading(true);
          setIsOnboardingOpen(true);
          setTimeout(() => setOnboardingLoading(false), 1000);
        }
      }, 1200);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-white text-text-body font-sans antialiased">
      
      {/* 1. Navbar */}
      <header className="sticky top-0 z-40 w-full bg-bg-white border-b border-border-custom shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative">
        <div className="max-w-[1200px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-3">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md">
              T
            </div>
            <span className="text-[18px] md:text-[20px] font-bold text-text-dark tracking-tight whitespace-nowrap">Tek Nokta</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-text-dark">
            <a href="#" className="text-primary hover:text-primary transition-colors">Anasayfa</a>
            <a href="#featured-listings" className="hover:text-primary transition-colors">İlanlar</a>
            <a href="#cities" className="hover:text-primary transition-colors">Şehirler</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Hizmetlerimiz</a>
            <a href="#agents" className="hover:text-primary transition-colors">Danışmanlar</a>
          </nav>

          {/* Desktop Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+902125550199" className="hidden lg:flex items-center gap-2 text-[14px] font-semibold text-text-dark hover:text-primary transition-colors">
              <IconPhone size={18} stroke={1.5} className="text-primary" />
              <span>444 0 199</span>
            </a>
            <Button
              variant="ghost"
              onClick={() => { setAuthTab('login'); setIsAuthModalOpen(true); }}
              className="text-[14px] font-semibold text-text-dark hover:text-primary flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-bg-light"
            >
              <IconUser size={18} stroke={1.5} />
              <span>Giriş Yap / Kayıt Ol</span>
            </Button>
            <Button
              onClick={() => setIsAlertOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-semibold text-[14px] px-5 h-10 rounded-[6px] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 border-none"
            >
              <IconPlus size={16} stroke={2.5} />
              <span>İlan Ekle</span>
            </Button>
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              onClick={() => setIsAlertOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white font-semibold text-[13px] px-3 h-9 rounded-[6px] transition-all flex items-center gap-1 shadow-sm active:scale-95 border-none"
            >
              <IconPlus size={14} stroke={2.5} />
              <span>İlan Ekle</span>
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-lg border border-border-custom bg-white text-text-dark hover:bg-bg-light transition-all"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer — absolute so it overlays content, always mounted for smooth transition */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 z-50 bg-bg-white border-b border-border-custom shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <nav className="flex flex-col px-4 py-3 gap-1">
            {[
              { href: '#', label: 'Anasayfa' },
              { href: '#featured-listings', label: 'İlanlar' },
              { href: '#cities', label: 'Şehirler' },
              { href: '#how-it-works', label: 'Hizmetlerimiz' },
              { href: '#agents', label: 'Danışmanlar' },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-3 text-[15px] font-semibold text-text-dark hover:text-primary hover:bg-bg-light rounded-lg transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="border-t border-border-custom mt-2 pt-3 flex flex-col gap-1">
              <a
                href="tel:+902125550199"
                className="flex items-center gap-2 py-2.5 px-3 text-[14px] font-semibold text-text-dark hover:text-primary rounded-lg hover:bg-bg-light transition-colors"
              >
                <IconPhone size={16} className="text-primary" />
                444 0 199
              </a>
              <Button
                variant="ghost"
                onClick={() => { setAuthTab('login'); setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                className="justify-start text-[14px] font-semibold text-text-dark hover:text-primary flex items-center gap-2 py-2.5 px-3 rounded-lg hover:bg-bg-light h-auto"
              >
                <IconUser size={16} stroke={1.5} />
                Giriş Yap / Kayıt Ol
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section & Search Bar */}
      <section className="relative min-h-[580px] flex flex-col justify-center items-center py-16 bg-bg-footer overflow-hidden">
        {/* Background Swiper Slider */}
        <div className="absolute inset-0">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            allowTouchMove={false}
            speed={2500}
            className="w-full h-full"
          >
            {[
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
            ].map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt=""
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Static overlay — sits above swiper, avoids blend glitch during transitions */}
          <div className="absolute inset-0 bg-bg-footer/55 pointer-events-none" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-footer via-bg-footer/75 to-transparent pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 text-center">
          <h1 className="text-[26px] sm:text-[34px] md:text-[48px] font-bold text-white tracking-tight leading-tight mb-3">
            Hayalinizdeki Evi Keşfedin
          </h1>
          <p className="text-[13px] sm:text-[15px] md:text-[16px] text-gray-300 max-w-[600px] mx-auto mb-6 md:mb-10 px-2">
            Satılık, kiralık ve ticari gayrimenkullerde bölgenin uzman danışmanları ile güvenilir ilan rehberi.
          </p>

          {/* Search Tabs Container */}
          <div className="w-full max-w-[850px] mx-auto bg-white p-3 sm:p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] text-left">
            {/* Tabs */}
            <div className="flex gap-1 sm:gap-2 border-b border-border-custom pb-3 mb-4 overflow-x-auto no-scrollbar">
              <Button 
                variant={activeTab === 'buy' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('buy')}
                className={`px-4 sm:px-6 py-2 text-[13px] sm:text-[14px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'buy' ? 'bg-primary text-white shadow-sm hover:bg-primary-dark border-none' : 'text-text-body hover:bg-bg-light'
                }`}
              >
                Satılık
              </Button>
              <Button 
                variant={activeTab === 'rent' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('rent')}
                className={`px-4 sm:px-6 py-2 text-[13px] sm:text-[14px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'rent' ? 'bg-primary text-white shadow-sm hover:bg-primary-dark border-none' : 'text-text-body hover:bg-bg-light'
                }`}
              >
                Kiralık
              </Button>
              <Button 
                variant={activeTab === 'sell' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('sell')}
                className={`px-4 sm:px-6 py-2 text-[13px] sm:text-[14px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'sell' ? 'bg-primary text-white shadow-sm hover:bg-primary-dark border-none' : 'text-text-body hover:bg-bg-light'
                }`}
              >
                İlan Ver
              </Button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Text Search */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-text-muted uppercase">Kelime Ara</label>
                <div className="relative">
                  <IconSearch className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                  <Input 
                    type="text" 
                    placeholder="Adres, İlçe, Başlık yazın..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-border-custom rounded-lg pl-10 pr-4 h-11 text-[14px] text-text-dark bg-white focus-visible:ring-primary focus-visible:border-primary"
                  />
                </div>
              </div>

              {/* City Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-text-muted uppercase">Şehir</label>
                <div className="relative">
                  <IconMapPin className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full appearance-none border border-border-custom rounded-lg pl-10 pr-8 h-11 text-[14px] text-text-dark bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="All">Tüm Şehirler</option>
                    <option value="İstanbul">İstanbul</option>
                    <option value="Antalya">Antalya</option>
                    <option value="Bodrum">Bodrum</option>
                    <option value="Ankara">Ankara</option>
                  </select>
                  <IconChevronDown size={14} className="absolute right-3.5 top-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-text-muted uppercase">Emlak Tipi</label>
                <div className="relative">
                  <IconBuilding className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full appearance-none border border-border-custom rounded-lg pl-10 pr-8 h-11 text-[14px] text-text-dark bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="All">Tüm Tipler</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{getPropertyTypeTurkish(type)}</option>
                    ))}
                  </select>
                  <IconChevronDown size={14} className="absolute right-3.5 top-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-text-muted uppercase">Fiyat Aralığı</label>
                <div className="relative">
                  <IconCoin className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                  <select 
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full appearance-none border border-border-custom rounded-lg pl-10 pr-8 h-11 text-[14px] text-text-dark bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="All">Tüm Fiyatlar</option>
                    <option value="under-1m">10.000.000 ₺ Altı</option>
                    <option value="1m-3m">10.000.000 ₺ - 25.000.000 ₺</option>
                    <option value="over-3m">25.000.000 ₺ Üstü</option>
                  </select>
                  <IconChevronDown size={14} className="absolute right-3.5 top-4 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="mt-4 flex justify-between items-center text-[13px] text-text-muted border-t border-border-custom pt-4">
              <div>
                Toplam <strong className="text-text-dark">{filteredProperties.length}</strong> ilan eşleşti.
              </div>
              <Button 
                variant="link"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                  setSelectedType('All');
                  setSelectedPriceRange('All');
                  setActiveCategory('All');
                }}
                className="text-primary font-semibold hover:underline h-auto p-0"
              >
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Icon Categories Section */}
      <section className="bg-bg-white py-8 md:py-12 border-b border-border-custom">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`flex flex-col items-center justify-center min-w-[90px] flex-1 py-4 rounded-xl border transition-all duration-300 ${
                activeCategory === 'All'
                  ? 'border-primary bg-[#FEF0EE] text-primary font-semibold shadow-sm'
                  : 'border-border-custom bg-white hover:border-primary hover:text-primary text-text-body'
              }`}
            >
              <IconHome size={24} className="mb-1.5" />
              <span className="text-[12px] font-medium">Tüm İlanlar</span>
            </button>
            
            {propertyTypes.map((type) => {
              const count = propertiesList.filter(p => p.type === type).length;
              return (
                <button 
                  key={type}
                  onClick={() => setActiveCategory(type)}
                  className={`flex flex-col items-center justify-center min-w-[90px] flex-1 py-4 rounded-xl border transition-all duration-300 ${
                    activeCategory === type
                      ? 'border-primary bg-[#FEF0EE] text-primary font-semibold shadow-sm'
                      : 'border-border-custom bg-white hover:border-primary hover:text-primary text-text-body'
                  }`}
                >
                  <IconBuilding size={24} className="mb-1.5" />
                  <span className="text-[12px] font-medium">{getPropertyTypeTurkish(type)}</span>
                  <span className="text-[11px] text-text-muted mt-0.5">{count} İlan</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Discover Our Featured Listings */}
      <section id="featured-listings" className="bg-bg-light py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-[28px] md:text-[32px] font-bold text-text-dark tracking-tight leading-tight mb-2">
                Öne Çıkan Portföyümüzü İnceleyin
              </h2>
              <p className="text-[14px] text-text-muted">
                Uzman ekibimiz tarafından sizin için seçilen en prestijli gayrimenkul fırsatları.
              </p>
            </div>
            
            {/* Category Quick Badges */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <span className="text-[13px] text-text-muted self-center mr-2">Hızlı filtre:</span>
              <Button 
                variant={activeCategory === 'All' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('All')}
                className={`text-[12px] font-medium px-4 py-1 h-7 rounded-full transition-all border-none ${
                  activeCategory === 'All' ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-text-body border border-border-custom hover:border-primary hover:bg-transparent'
                }`}
              >
                Hepsi
              </Button>
              <Button 
                variant={activeCategory === 'Villa' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('Villa')}
                className={`text-[12px] font-medium px-4 py-1 h-7 rounded-full transition-all border-none ${
                  activeCategory === 'Villa' ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-text-body border border-border-custom hover:border-primary hover:bg-transparent'
                }`}
              >
                Villalar
              </Button>
              <Button 
                variant={activeCategory === 'Apartment' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('Apartment')}
                className={`text-[12px] font-medium px-4 py-1 h-7 rounded-full transition-all border-none ${
                  activeCategory === 'Apartment' ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-text-body border border-border-custom hover:border-primary hover:bg-transparent'
                }`}
              >
                Daireler
              </Button>
              <Button 
                variant={activeCategory === 'Office' ? 'default' : 'outline'}
                onClick={() => setActiveCategory('Office')}
                className={`text-[12px] font-medium px-4 py-1 h-7 rounded-full transition-all border-none ${
                  activeCategory === 'Office' ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-text-body border border-border-custom hover:border-primary hover:bg-transparent'
                }`}
              >
                Ofisler
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          {propertiesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#E8E8E8]">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <Skeleton className="h-12 rounded-lg" />
                      <Skeleton className="h-12 rounded-lg" />
                      <Skeleton className="h-12 rounded-lg" />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <Skeleton className="h-6 w-28" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onSelect={(p) => setSelectedProperty(p)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-border-custom p-8 max-w-[600px] mx-auto shadow-sm">
              <IconHome size={48} className="mx-auto text-text-muted mb-4 stroke-[1.5]" />
              <h3 className="text-[18px] font-bold text-text-dark mb-1">Eşleşen İlan Bulunamadı</h3>
              <p className="text-[14px] text-text-muted mb-6">
                Seçmiş olduğunuz arama kriterlerine uygun kayıt bulunamadı. Filtreleri temizleyerek tekrar deneyebilirsiniz.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                  setSelectedType('All');
                  setSelectedPriceRange('All');
                  setActiveCategory('All');
                }}
                className="bg-primary hover:bg-primary-dark text-white font-semibold text-[14px] px-[22px] py-[10px] rounded-[6px] h-10 transition-all border-none"
              >
                Tüm Filtreleri Temizle
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Explore Cities Section */}
      <section id="cities" className="bg-bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <h2 className="text-[28px] md:text-[32px] font-bold text-text-dark tracking-tight mb-2">
              Popüler Bölgeleri Keşfedin
            </h2>
            <p className="text-[14px] text-text-muted">
              Türkiye&apos;nin en gözde bölgelerindeki güncel portföylere göz atın.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {citiesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))
              : citiesList.map((city) => (
              <div 
                key={city.id}
                onClick={() => setSelectedCity(city.name)}
                className="group relative h-72 rounded-xl overflow-hidden cursor-pointer shadow-md border border-border-custom hover:shadow-xl transition-all duration-300"
              >
                {/* Background Image */}
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Black Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                {/* City Details */}
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-[18px] font-bold tracking-tight mb-1 flex items-center gap-1">
                    {city.name}
                    <IconArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
                  </h3>
                  <p className="text-[13px] text-gray-300">
                    {city.propertiesCount} aktif ilan listeleniyor
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. See How We Can Help */}
      <section id="how-it-works" className="bg-[#FEF8F6] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <h2 className="text-[28px] md:text-[32px] font-bold text-text-dark tracking-tight mb-2">
              Tek Nokta Size Nasıl Yardımcı Olabilir?
            </h2>
            <p className="text-[14px] text-text-muted">
              Satın alırken, kiralarken ya da mülkünüzü satarken tüm süreci kolaylaştırıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buy */}
            <div className="bg-white p-8 rounded-xl border border-border-custom text-center flex flex-col justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-[#FEF0EE] text-primary flex items-center justify-center mb-6">
                <IconHome size={32} />
              </div>
              <h3 className="text-[18px] font-bold text-text-dark mb-2">Gayrimenkul Alın</h3>
              <p className="text-[14px] text-text-body leading-relaxed mb-6">
                Yüzlerce güncel ilan arasından bütçenize ve tarzınıza en uygun evi bulun, hızlıca mülk sahibi olun.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTab('buy');
                  const el = document.getElementById('featured-listings');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-primary text-primary font-semibold text-[14px] px-[22px] py-[8px] rounded-[6px] hover:bg-[#FEF0EE] hover:text-primary transition-all h-10"
              >
                Ev Bul
              </Button>
            </div>

            {/* Sell */}
            <div className="bg-white p-8 rounded-xl border border-border-custom text-center flex flex-col justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-6">
                <IconBuilding size={32} />
              </div>
              <h3 className="text-[18px] font-bold text-text-dark mb-2">Gayrimenkul Satın</h3>
              <p className="text-[14px] text-text-body leading-relaxed mb-6">
                Evinizi değerinde ve en kısa sürede geniş alıcı ağımıza ulaştırarak güvenle satış işlemini gerçekleştirin.
              </p>
              <Button 
                variant="outline"
                onClick={() => setIsAlertOpen(true)}
                className="border-2 border-primary text-primary font-semibold text-[14px] px-[22px] py-[8px] rounded-[6px] hover:bg-[#FEF0EE] hover:text-primary transition-all h-10"
              >
                İlan Ver
              </Button>
            </div>

            {/* Rent */}
            <div className="bg-white p-8 rounded-xl border border-border-custom text-center flex flex-col justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center mb-6">
                <IconBuilding size={32} />
              </div>
              <h3 className="text-[18px] font-bold text-text-dark mb-2">Gayrimenkul Kiralayın</h3>
              <p className="text-[14px] text-text-body leading-relaxed mb-6">
                İhtiyacınıza uygun kiralık daireler, iş yerleri ve ofisleri en uygun sözleşme koşullarıyla listeleyin.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTab('rent');
                  const el = document.getElementById('featured-listings');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-primary text-primary font-semibold text-[14px] px-[22px] py-[8px] rounded-[6px] hover:bg-[#FEF0EE] hover:text-primary transition-all h-10"
              >
                Kiralık Bul
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. With Us Help You Find Your Dream Home Section */}
      <section className="bg-bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Side: Images — hidden on small mobile, visible sm+ */}
          <div className="w-full lg:w-1/2 hidden sm:flex items-center gap-4 relative">
            <div className="w-3/5 rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80" 
                alt="Ev Dış Görünümü"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-2/5 flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80" 
                  alt="Modern Mutfak"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#FEF0EE] p-4 rounded-2xl border border-primary/20">
                <span className="text-[28px] font-bold text-primary">15+</span>
                <p className="text-[13px] text-text-dark font-semibold mt-1">Yıllık Güven</p>
                <p className="text-[11px] text-text-muted">2011&apos;den beri mutlu müşteriler.</p>
              </div>
            </div>

            {/* Video Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center gap-3 border border-border-custom">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all">
                <div className="translate-x-0.5 border-y-8 border-y-transparent border-l-12 border-l-white"></div>
              </div>
              <div>
                <p className="text-[13px] font-bold text-text-dark leading-tight">Sanal Tur</p>
                <p className="text-[11px] text-text-muted">3D Video İncelemesi</p>
              </div>
            </div>
          </div>

          {/* Right Side: Text & Stats */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-bold text-text-dark tracking-tight leading-tight mb-4">
              Hayalinizdeki Evi Bulmanız İçin Her Adımda Yanınızdayız
            </h2>
            <p className="text-[14px] text-text-body leading-relaxed mb-8">
              Tek Nokta olarak gayrimenkul işlemlerinin karmaşık süreçlerini sizin için yönetiyoruz. İlan doğrulamadan yasal evrak desteğine kadar her aşamada şeffaf ve güvenilir danışmanlık hizmeti sunuyoruz.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <span className="text-[24px] md:text-[28px] font-bold text-text-dark block">370+</span>
                <span className="text-[12px] text-text-muted uppercase font-semibold">Satılan Villa</span>
              </div>
              <div>
                <span className="text-[24px] md:text-[28px] font-bold text-text-dark block">185+</span>
                <span className="text-[12px] text-text-muted uppercase font-semibold">Kiralanan Daire</span>
              </div>
              <div>
                <span className="text-[24px] md:text-[28px] font-bold text-text-dark block">650+</span>
                <span className="text-[12px] text-text-muted uppercase font-semibold">Kiralanan Ofis</span>
              </div>
            </div>

            <Button 
              onClick={() => {
                const el = document.getElementById('featured-listings');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary hover:bg-primary-dark text-white font-semibold text-[14px] px-[24px] py-[12px] rounded-[6px] h-12 transition-all shadow-sm flex items-center gap-1 border-none"
            >
              <span>Portföyü İncele</span>
              <IconArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Our Exclusive Agents */}
      <section id="agents" className="bg-bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4">
          
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <h2 className="text-[28px] md:text-[32px] font-bold text-text-dark tracking-tight mb-2">
              Bölgelerin Uzman Danışmanları
            </h2>
            <p className="text-[14px] text-text-muted">
              Size en iyi teklifi sunmak ve rehberlik etmek için hazır profesyonel danışman kadromuz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {agentsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-border-custom">
                    <Skeleton className="aspect-[3/4] w-full rounded-none" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                    </div>
                  </div>
                ))
              : agentsList.map((agent) => (
              <div 
                key={agent.id}
                className="group bg-white rounded-xl overflow-hidden border border-border-custom shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
              >
                {/* Agent Image */}
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                  <img 
                    src={agent.image} 
                    alt={agent.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white text-[12px] font-semibold bg-primary px-3 py-1 rounded">İletişime Geç</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-[15px] text-text-dark group-hover:text-primary transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-[12px] text-text-muted mt-0.5">
                    {agent.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. Start Listing or Buying a Property Banner */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-20 text-white">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-1/2">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-white stroke-[0.5]">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
          <div className="max-w-[650px] text-center md:text-left">
            <h2 className="text-[22px] sm:text-[28px] md:text-[34px] font-bold tracking-tight mb-3">
              Mülkünüzü Tek Nokta ile Hızla Değerlendirin
            </h2>
            <p className="text-[13px] sm:text-[15px] text-white/80">
              Hemen bir hesap oluşturun veya doğrudan bölgenizin uzman müşteri danışmanı ile görüşmeye başlayın.
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={() => setIsAlertOpen(true)}
              className="flex-1 md:flex-none bg-[#222222] hover:bg-black text-white font-semibold text-[14px] px-6 py-3 h-12 rounded-lg transition-all shadow-md active:scale-95 border-none"
            >
              Hemen İlan Ver
            </Button>
            <a 
              href="tel:+902125550199"
              className="flex-1 md:flex-none bg-white hover:bg-gray-100 text-primary font-semibold text-[14px] px-6 py-3 h-12 rounded-lg transition-all shadow-md text-center flex items-center justify-center"
            >
              Danışmana Ulaş
            </a>
          </div>
        </div>
      </section>

      {/* 11. Footer Section */}
      <footer className="bg-bg-footer text-white/70 pt-16 pb-8 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4">
          
          {/* Main Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Logo and About */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                  T
                </div>
                <span className="text-[20px] font-bold text-white tracking-tight">Tek Nokta</span>
              </div>
              <p className="text-[13px] leading-relaxed text-gray-400">
                Ayrıcalıklı gayrimenkul hizmetleri. İlan yönetim çözümleri, kiracı doğrulama süreçleri ve yetkili yerel danışman kadromuzla yanınızdayız.
              </p>
              <div className="flex flex-col gap-2 mt-2 text-[13px] text-white font-semibold">
                <span>Telefon: 444 0 199</span>
                <span>E-posta: destek@teknokta.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-semibold text-[15px] uppercase tracking-wider">Bültene Katılın</h3>
              <p className="text-[13px] text-gray-400">Haftalık bültenimize abone olarak en yeni sıcak fırsatlar ve analizlerden haberdar olun.</p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input 
                  type="email" 
                  required
                  placeholder="E-posta adresi yazın"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/10 border-white/15 rounded-lg px-4 h-10 text-[13px] text-white placeholder-gray-400 focus-visible:ring-primary focus-visible:border-primary flex-1 min-w-0"
                />
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-semibold text-[13px] px-4 h-10 rounded-lg transition-all shrink-0 border-none"
                >
                  {newsletterSubscribed ? 'Kayıt Olundu!' : 'Abone Ol'}
                </Button>
              </form>
            </div>

            {/* Discover Links */}
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-semibold text-[15px] uppercase tracking-wider">Hızlı Keşfet</h3>
              <ul className="text-[13px] flex flex-col gap-2 text-gray-400">
                <li><a href="#featured-listings" className="hover:text-primary transition-colors">Antalya Lüks Villalar</a></li>
                <li><a href="#featured-listings" className="hover:text-primary transition-colors">İstanbul Çatı Daireleri</a></li>
                <li><a href="#featured-listings" className="hover:text-primary transition-colors">Bodrum Ticari Ofisler</a></li>
                <li><a href="#featured-listings" className="hover:text-primary transition-colors">Ankara Müstakil Evler</a></li>
              </ul>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-semibold text-[15px] uppercase tracking-wider">Kurumsal</h3>
              <ul className="text-[13px] flex flex-col gap-2 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Hakkımızda</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">Hizmetlerimiz</a></li>
                <li><a href="#agents" className="hover:text-primary transition-colors">Danışman Kadromuz</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Kullanım Koşulları</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-gray-500">
            <p>&copy; {new Date().getFullYear()} Tek Nokta A.Ş. Tüm Hakları Saklıdır.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Sözleşmesi</a>
              <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Property Details Modal */}
      <PropertyDetailModal 
        property={selectedProperty} 
        onClose={() => setSelectedProperty(null)} 
      />

      {/* Giriş Yap / Kayıt Ol Modal (Social logins removed) */}
      <Dialog open={isAuthModalOpen} onOpenChange={(open) => setIsAuthModalOpen(open)}>
        <DialogContent className="max-w-md bg-white p-6 md:p-8 rounded-2xl border-none shadow-2xl">
          <div className="sr-only">
            <DialogTitle>Giriş / Kayıt Modalı</DialogTitle>
            <DialogDescription>Hesabınıza erişin veya yeni bir üyelik başlatın.</DialogDescription>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-[18px] font-bold text-text-dark">Tek Nokta</span>
          </div>

          {/* Modal Tabs */}
          <div className="flex gap-4 border-b border-border-custom pb-2 mb-6">
            <button 
              onClick={() => setAuthTab('login')}
              className={`flex-1 pb-2 text-[15px] font-bold transition-all text-center border-b-2 ${
                authTab === 'login' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Giriş Yap
            </button>
            <button 
              onClick={() => setAuthTab('register')}
              className={`flex-1 pb-2 text-[15px] font-bold transition-all text-center border-b-2 ${
                authTab === 'register' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {authSuccess ? (
            <div className="py-8 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                <IconCheck size={32} stroke={3} />
              </div>
              <h4 className="text-[18px] font-bold text-text-dark">
                {authTab === 'login' ? 'Başarıyla Giriş Yapıldı!' : 'Kayıt İşlemi Tamamlandı!'}
              </h4>
              <p className="text-[13px] text-text-muted">Tek Nokta portföyüne yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === 'register' && (
                <div>
                  <label className="block text-[12px] font-medium text-text-body mb-1">Ad Soyad</label>
                  <Input 
                    type="text" 
                    required
                    placeholder="Adınızı ve soyadınızı yazın"
                    value={authFormData.name}
                    onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                    className="w-full border-border-custom h-11 text-[14px] focus-visible:ring-primary focus-visible:border-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-medium text-text-body mb-1">E-posta Adresi</label>
                <Input 
                  type="email" 
                  required
                  placeholder="Örn. ahmet@example.com"
                  value={authFormData.email}
                  onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                  className="w-full border-border-custom h-11 text-[14px] focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-body mb-1">Şifre</label>
                <Input 
                  type="password" 
                  required
                  placeholder="Şifrenizi girin"
                  value={authFormData.password}
                  onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                  className="w-full border-border-custom h-11 text-[14px] focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>

              {authTab === 'register' && (
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="terms-check"
                    required
                    checked={authFormData.terms}
                    onChange={(e) => setAuthFormData({ ...authFormData, terms: e.target.checked })}
                    className="mt-1 border-border-custom rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms-check" className="text-[12px] text-text-body leading-snug cursor-pointer">
                    Gizlilik sözleşmesini ve kullanıcı şartlarını okudum, kabul ediyorum.
                    </label>
                </div>
              )}

              <Button 
                type="submit"
                disabled={isAuthLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg h-11 text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm border-none"
              >
                {isAuthLoading ? 'Yükleniyor...' : authTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Onboarding Quiz — Full Screen Overlay */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-custom shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base">T</div>
              <span className="text-[16px] font-bold text-text-dark">Tek Nokta</span>
            </div>
            <span className="text-[12px] text-text-muted font-medium">Birkaç saniyenizi alacak</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-bg-light shrink-0">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((onboardingStep + 1) / onboardingQuestions.length) * 100}%` }}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 min-h-[500px]">
            <div className="w-full max-w-[520px]">
              {/* Step counter */}
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-5 text-center">
                Adım {onboardingStep + 1} / {onboardingQuestions.length}
              </p>

              {onboardingLoading ? (
                /* Skeleton — simulates backend loading */
                <div className="space-y-5">
                  <div className="flex flex-col items-center gap-3">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <Skeleton className="h-8 w-64 rounded-lg" />
                    <Skeleton className="h-4 w-80 rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {[0, 1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <Skeleton className="h-5 w-12 rounded-md" />
                    <Skeleton className="h-11 w-36 rounded-xl" />
                  </div>
                </div>
              ) : (() => {
                const q = onboardingQuestions[onboardingStep];
                const canProceed = q.type === 'location'
                  ? !!onboardingAnswers['city']
                  : !!onboardingAnswers[q.id];
                const isLast = onboardingStep === onboardingQuestions.length - 1;

                return (
                  <div>
                    {/* Question header */}
                    <div className="text-center mb-8">
                      <div className="text-5xl mb-4 select-none">{q.emoji}</div>
                      <h2 className="text-[22px] sm:text-[28px] font-bold text-text-dark mb-2 leading-tight">{q.title}</h2>
                      <p className="text-[14px] text-text-muted max-w-[380px] mx-auto leading-relaxed">{q.subtitle}</p>
                    </div>

                    {/* Location step */}
                    {q.type === 'location' && (
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                            Şehir <span className="text-primary">*</span>
                          </label>
                          <select
                            value={onboardingAnswers['city'] ?? ''}
                            onChange={e => setOnboardingAnswers(a => ({ ...a, city: e.target.value }))}
                            className="w-full border-2 border-border-custom rounded-xl px-4 h-12 text-[15px] text-text-dark bg-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                          >
                            <option value="">Şehir seçin...</option>
                            {['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Bodrum', 'Muğla', 'Eskişehir', 'Adana', 'Trabzon'].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
                            İlçe / Mahalle <span className="font-normal normal-case">(opsiyonel)</span>
                          </label>
                          <Input
                            type="text"
                            placeholder="Örn. Kadıköy, Çankaya..."
                            value={onboardingAnswers['district'] ?? ''}
                            onChange={e => setOnboardingAnswers(a => ({ ...a, district: e.target.value }))}
                            className="w-full border-2 border-border-custom rounded-xl h-12 text-[15px] focus-visible:ring-primary focus-visible:border-primary"
                          />
                        </div>
                      </div>
                    )}

                    {/* Cards step */}
                    {q.type === 'cards' && (
                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map(opt => {
                          const selected = onboardingAnswers[q.id] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setOnboardingAnswers(a => ({ ...a, [q.id]: opt.value }))}
                              className={`flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                                selected
                                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                  : 'border-border-custom bg-white hover:border-primary/40 hover:bg-bg-light'
                              }`}
                            >
                              <span className="text-3xl select-none">{opt.icon}</span>
                              <span className={`text-[13px] font-bold ${selected ? 'text-primary' : 'text-text-dark'}`}>
                                {opt.label}
                              </span>
                              <span className="text-[11px] text-text-muted text-center leading-tight">{opt.desc}</span>
                              {selected && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
                                  <IconCheck size={11} stroke={3} className="text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 gap-3">
                      <button
                        onClick={() => goNextOnboarding(true)}
                        className="text-[14px] text-text-muted hover:text-text-dark transition-colors px-2 py-1 underline-offset-2 hover:underline"
                      >
                        Atla
                      </button>
                      <Button
                        onClick={() => goNextOnboarding(false)}
                        disabled={!canProceed}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold text-[14px] px-8 h-11 rounded-xl border-none shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                      >
                        {isLast ? 'Tamamla 🎉' : 'Devam Et →'}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Global Alert Dialog for "Add Property" info */}
      <AlertDialog open={isAlertOpen} onOpenChange={(open) => setIsAlertOpen(open)}>
        <AlertDialogContent className="bg-white rounded-2xl border-none p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-dark font-bold text-[18px]">Yakında Aktif Olacak!</AlertDialogTitle>
            <AlertDialogDescription className="text-text-body text-[14px] leading-relaxed pt-2">
              Bu özellik çok yakında aktif olacaktır! Tek Nokta üzerinden doğrudan gayrimenkul ilanı verebileceksiniz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction 
              onClick={() => setIsAlertOpen(false)}
              className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg px-6 h-10 border-none w-full sm:w-auto"
            >
              Tamam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
