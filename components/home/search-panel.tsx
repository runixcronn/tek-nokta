'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks/use-store';
import { fetchCities } from '@/lib/api';
import { fetchProperties } from '@/lib/api';
import { automotivePropertyTypes, housingPropertyTypes, City, getListingTypeTurkish } from '@/lib/data';
import {
  automotivePriceRanges,
  contextContent,
  housingPriceRanges,
} from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconBuilding,
  IconCar,
  IconChevronDown,
  IconCoin,
  IconCoins,
  IconLoader2,
  IconMapPin,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSparkles,
} from '@tabler/icons-react';
import type { PriceRangeValue } from '@/lib/constants';

export function SearchPanel() {
  const {
    context,
    housingPurpose,
    isAiMode,
    aiCredits,
    aiPromptInput,
    activeAiPrompt,
    isAiLoading,
    searchQuery,
    selectedCity,
    selectedType,
    selectedPriceRange,

    switchToHousing,
    switchToAutomotive,
    resetFilters,
    setIsAiMode,
    setAiPromptInput,
    handleAiSearch,
    handleResetAi,
    setIsPricingModalOpen,
    setSearchQuery,
    setSelectedCity,
    setSelectedType,
    setSelectedPriceRange,
  } = useStore();

  const currentCopy = contextContent[context];
  const currentTypes = context === 'housing' ? housingPropertyTypes : automotivePropertyTypes;
  const currentPriceRanges = context === 'housing' ? housingPriceRanges : automotivePriceRanges;

  const { data: citiesList = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  const { data: propertiesList = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

  const filteredCities = useMemo(
    () => citiesList.filter((city: City) => city.context === context),
    [citiesList, context],
  );

  // Calculate total matching count for the status row
  const parsedAiCriteria = useMemo(() => {
    if (!isAiMode || !activeAiPrompt.trim()) return null;
    const query = activeAiPrompt
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');

    let detectedCity: string | null = null;
    const cities = ['istanbul', 'ankara', 'izmir', 'antalya', 'bodrum', 'bursa', 'mugla', 'yalova', 'trabzon', 'eskisehir'];
    const cityMap: Record<string, string> = { istanbul: 'İstanbul', ankara: 'Ankara', izmir: 'İzmir', antalya: 'Antalya', bodrum: 'Bodrum', bursa: 'Bursa', mugla: 'Muğla', yalova: 'Yalova', trabzon: 'Trabzon', eskisehir: 'Eskişehir' };
    for (const c of cities) {
      if (query.includes(c)) { detectedCity = cityMap[c] || c; break; }
    }

    let detectedPurpose: 'buy' | 'rent' | null = null;
    if (query.includes('kiralik') || query.includes('kira')) detectedPurpose = 'rent';
    else if (query.includes('satilik') || query.includes('satin al')) detectedPurpose = 'buy';

    let detectedType: string | null = null;
    const types = [
      { key: 'villa', label: 'Villa' }, { key: 'daire', label: 'Apartment' }, { key: 'apartman', label: 'Apartment' },
      { key: 'ofis', label: 'Office' }, { key: 'buro', label: 'Office' }, { key: 'bungalov', label: 'Bungalow' },
      { key: 'mustakil', label: 'Townhouse' }, { key: 'suv', label: 'SUV' }, { key: 'sedan', label: 'Sedan' },
      { key: 'hatchback', label: 'Hatchback' }, { key: 'ticari', label: 'Commercial' }, { key: 'motosiklet', label: 'Motorcycle' },
    ];
    for (const t of types) { if (query.includes(t.key)) { detectedType = t.label; break; } }

    let pricePreference: 'cheap' | 'luxury' | null = null;
    if (query.includes('ucuz') || query.includes('ekonomik') || query.includes('uygun')) pricePreference = 'cheap';
    else if (query.includes('luks') || query.includes('premium') || query.includes('pahali')) pricePreference = 'luxury';

    let minYear: number | null = null;
    const yearMatch = query.match(/(20\d{2})/);
    if (yearMatch) minYear = parseInt(yearMatch[1]);

    let detectedFuel: string | null = null;
    if (query.includes('dizel') || query.includes('mazot')) detectedFuel = 'Dizel';
    else if (query.includes('benzin')) detectedFuel = 'Benzin';
    else if (query.includes('hibrit')) detectedFuel = 'Hibrit';
    else if (query.includes('elektrik')) detectedFuel = 'Elektrik';

    let detectedTransmission: string | null = null;
    if (query.includes('otomatik')) detectedTransmission = 'Otomatik';
    else if (query.includes('manuel')) detectedTransmission = 'Manuel';

    let bedsCount: number | null = null;
    const bedMatches = query.match(/(\d)\+(\d)/);
    if (bedMatches) bedsCount = parseInt(bedMatches[1]);
    else { const odaMatch = query.match(/(\d)\s*oda/); if (odaMatch) bedsCount = parseInt(odaMatch[1]); }

    return { city: detectedCity, purpose: detectedPurpose, type: detectedType, pricePreference, minYear, fuel: detectedFuel, transmission: detectedTransmission, beds: bedsCount };
  }, [isAiMode, activeAiPrompt]);

  const filteredCount = useMemo(() => {
    return propertiesList.filter((p) => {
      if (p.context !== context) return false;
      if (isAiMode && parsedAiCriteria) {
        if (parsedAiCriteria.city && p.location.toLowerCase() !== parsedAiCriteria.city.toLowerCase()) return false;
        if (parsedAiCriteria.type && p.type !== parsedAiCriteria.type) return false;
        return true;
      }
      const purposeMatch = context === 'housing'
        ? (p as any).purpose === (housingPurpose === 'buy' ? 'buy' : 'rent') || (housingPurpose === 'buy' && (p as any).purpose === 'sell')
        : true;
      const catMatch = true;
      const qMatch = searchQuery === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
      const cityMatch = selectedCity === 'All' || p.location.toLowerCase() === selectedCity.toLowerCase();
      const typeMatch = selectedType === 'All' || p.type === selectedType;
      let priceMatch = true;
      if (selectedPriceRange !== 'All') {
        const val = p.priceValue;
        if (selectedPriceRange === 'under-10m') priceMatch = val < 10000000;
        if (selectedPriceRange === '10m-25m') priceMatch = val >= 10000000 && val <= 25000000;
        if (selectedPriceRange === 'over-25m') priceMatch = val > 25000000;
        if (selectedPriceRange === 'under-1m') priceMatch = val < 1000000;
        if (selectedPriceRange === '1m-3m') priceMatch = val >= 1000000 && val <= 3000000;
        if (selectedPriceRange === 'over-3m') priceMatch = val > 3000000;
      }
      return purposeMatch && catMatch && qMatch && cityMatch && typeMatch && priceMatch;
    }).length;
  }, [propertiesList, context, isAiMode, parsedAiCriteria, housingPurpose, searchQuery, selectedCity, selectedType, selectedPriceRange]);

  return (
    <div className="mx-auto w-full max-w-[900px] rounded-2xl bg-white p-4 text-left shadow-[0_10px_40px_rgba(0,0,0,0.15)] sm:p-5">
      {/* Tabs Row */}
      <div className="mb-4 flex items-center justify-between gap-4 overflow-x-auto border-b border-border-custom pb-3 no-scrollbar">
        <div className="flex gap-2">
          <Button
            variant={context === 'housing' && housingPurpose === 'buy' ? 'default' : 'ghost'}
            onClick={() => switchToHousing('buy')}
            className={`whitespace-nowrap rounded-lg px-5 py-2 text-[13px] font-semibold sm:px-6 sm:text-[14px] ${
              context === 'housing' && housingPurpose === 'buy'
                ? 'border-none bg-primary text-white hover:bg-primary-dark'
                : 'text-text-body hover:bg-bg-light'
            }`}
          >
            Satılık
          </Button>
          <Button
            variant={context === 'housing' && housingPurpose === 'rent' ? 'default' : 'ghost'}
            onClick={() => switchToHousing('rent')}
            className={`whitespace-nowrap rounded-lg px-5 py-2 text-[13px] font-semibold sm:px-6 sm:text-[14px] ${
              context === 'housing' && housingPurpose === 'rent'
                ? 'border-none bg-primary text-white hover:bg-primary-dark'
                : 'text-text-body hover:bg-bg-light'
            }`}
          >
            Kiralık
          </Button>
          <Button
            variant={context === 'automotive' ? 'default' : 'ghost'}
            onClick={switchToAutomotive}
            className={`whitespace-nowrap rounded-lg px-5 py-2 text-[13px] font-semibold sm:px-6 sm:text-[14px] ${
              context === 'automotive'
                ? 'border-none bg-primary text-white hover:bg-primary-dark'
                : 'text-text-body hover:bg-bg-light'
            }`}
          >
            Otomotiv
          </Button>
        </div>

        {/* AI Mode Toggle */}
        <Button
          onClick={() => setIsAiMode(!isAiMode)}
          variant="outline"
          className={`flex select-none items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-bold transition-all duration-300 ${
            isAiMode
              ? 'border-primary bg-primary text-white shadow-[0_0_12px_rgba(235,103,83,0.3)] hover:bg-primary-dark'
              : 'border-primary/30 text-primary hover:bg-primary/5'
          }`}
        >
          <IconSparkles size={14} className={isAiMode ? 'animate-pulse' : ''} />
          <span>AI Kullan</span>
        </Button>
      </div>

      {/* AI Search */}
      {isAiMode ? (
        <div className="animate-fade-in space-y-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1 text-[12px] font-semibold uppercase text-primary">
                <IconSparkles size={13} />
                Yapay Zeka Doğal Dil Araması
              </label>
              <div className="flex items-center gap-2 text-[12px] text-text-muted">
                <span>
                  🪙 Arama başına <strong>5 kredi</strong> düşer.
                </span>
                <button
                  onClick={() => setIsPricingModalOpen(true)}
                  className="flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <IconPlus size={11} /> Kredi Ekle
                </button>
              </div>
            </div>

            <div className="relative">
              <IconSparkles className="absolute left-3.5 top-3.5 text-primary" size={18} />
              <Input
                type="text"
                placeholder={
                  context === 'housing'
                    ? "Nasıl bir ev arıyorsunuz? Örn: Antalya'da havuzlu ucuz satılık villa veya İstanbul'da kiralık 2+1 daire"
                    : "Nasıl bir araç arıyorsunuz? Örn: 2022 model dizel otomatik SUV veya Ankara'da ucuz elektrikli hatchback"
                }
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                disabled={isAiLoading}
                className="h-12 w-full rounded-lg border border-primary/20 bg-primary/5 pl-10 pr-24 text-[14px] text-text-dark placeholder-primary/40 transition-all focus-visible:border-primary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary/20"
              />
              <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                {activeAiPrompt && (
                  <Button
                    onClick={handleResetAi}
                    variant="ghost"
                    className="h-9 w-9 rounded-md p-0 hover:bg-primary/10"
                  >
                    <IconRefresh size={15} className="text-text-muted" />
                  </Button>
                )}
                <Button
                  onClick={handleAiSearch}
                  disabled={isAiLoading || !aiPromptInput.trim()}
                  className="h-9 rounded-md border-none bg-primary px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-primary-dark"
                >
                  {isAiLoading ? <IconLoader2 size={14} className="animate-spin" /> : 'Ara'}
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <span className="text-text-muted">Örnek Aramalar:</span>
            {(context === 'housing'
              ? ["Antalya'da havuzlu ucuz villa", "İstanbul Beşiktaş'ta kiralık daire", "Bodrum'da lüks satılık villa"]
              : ['2023 model elektrikli SUV', "Ankara'da otomatik dizel sedan", "İzmir'de ucuz hibrit araç"]
            ).map((sugg) => (
              <button
                key={sugg}
                onClick={() => setAiPromptInput(sugg)}
                className="rounded-full border border-border-custom bg-bg-light px-3 py-1 text-[12px] font-medium text-text-body transition-all hover:border-primary hover:bg-primary/5"
              >
                {sugg}
              </button>
            ))}
          </div>

          {/* Detected Badges */}
          {activeAiPrompt && parsedAiCriteria && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-border-custom pt-3 text-[12px]">
              <span className="font-medium text-text-muted">Algılanan Kriterler:</span>
              {parsedAiCriteria.city && (
                <span className="inline-flex items-center gap-1 rounded bg-[#FEF0EE] px-2.5 py-0.5 font-semibold text-primary">
                  📍 Şehir: {parsedAiCriteria.city}
                </span>
              )}
              {parsedAiCriteria.purpose && (
                <span className="inline-flex items-center gap-1 rounded bg-[#E3F2FD] px-2.5 py-0.5 font-semibold text-[#1565C0]">
                  🔑 Amaç: {parsedAiCriteria.purpose === 'rent' ? 'Kiralık' : 'Satılık'}
                </span>
              )}
              {parsedAiCriteria.type && (
                <span className="inline-flex items-center gap-1 rounded bg-[#E8F5E9] px-2.5 py-0.5 font-semibold text-[#2E7D32]">
                  🏠 Tip: {getListingTypeTurkish(parsedAiCriteria.type as any)}
                </span>
              )}
              {parsedAiCriteria.beds !== null && (
                <span className="inline-flex items-center gap-1 rounded bg-[#F3E5F5] px-2.5 py-0.5 font-semibold text-[#7B1FA2]">
                  🛏️ Oda: {parsedAiCriteria.beds}+1
                </span>
              )}
              {parsedAiCriteria.minYear && (
                <span className="inline-flex items-center gap-1 rounded bg-[#FFF3E0] px-2.5 py-0.5 font-semibold text-[#E65100]">
                  📅 Yıl: {parsedAiCriteria.minYear}+
                </span>
              )}
              {parsedAiCriteria.fuel && (
                <span className="inline-flex items-center gap-1 rounded bg-[#E0F7FA] px-2.5 py-0.5 font-semibold text-[#006064]">
                  ⛽ Yakıt: {parsedAiCriteria.fuel}
                </span>
              )}
              {parsedAiCriteria.transmission && (
                <span className="inline-flex items-center gap-1 rounded bg-[#ECEFF1] px-2.5 py-0.5 font-semibold text-[#37474F]">
                  ⚙️ Vites: {parsedAiCriteria.transmission}
                </span>
              )}
              {parsedAiCriteria.pricePreference && (
                <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700">
                  💰 Fiyat: {parsedAiCriteria.pricePreference === 'cheap' ? 'En Ucuzlar' : 'Lüks/Premium'}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Standard Filters */
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold uppercase text-text-muted">
              {currentCopy.searchLabel}
            </label>
            <div className="relative">
              <IconSearch className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              <Input
                type="text"
                placeholder={currentCopy.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-lg border border-border-custom bg-white pl-10 pr-4 text-[14px] text-text-dark focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold uppercase text-text-muted">
              {currentCopy.cityLabel}
            </label>
            <div className="relative">
              <IconMapPin className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-border-custom bg-white pl-10 pr-8 text-[14px] text-text-dark focus:border-primary focus:outline-none"
              >
                <option value="All">Tüm Şehirler</option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-4 text-text-muted"
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold uppercase text-text-muted">
              {currentCopy.typeLabel}
            </label>
            <div className="relative">
              {context === 'housing' ? (
                <IconBuilding className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              ) : (
                <IconCar className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              )}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-border-custom bg-white pl-10 pr-8 text-[14px] text-text-dark focus:border-primary focus:outline-none"
              >
                <option value="All">{currentCopy.typeAllLabel}</option>
                {currentTypes.map((type) => (
                  <option key={type} value={type}>
                    {getListingTypeTurkish(type)}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-4 text-text-muted"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold uppercase text-text-muted">
              {currentCopy.priceLabel}
            </label>
            <div className="relative">
              <IconCoin className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value as PriceRangeValue)}
                className="h-11 w-full appearance-none rounded-lg border border-border-custom bg-white pl-10 pr-8 text-[14px] text-text-dark focus:border-primary focus:outline-none"
              >
                {currentPriceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 top-4 text-text-muted"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between border-t border-border-custom pt-4 text-[13px] text-text-muted">
        <div>
          Toplam <strong className="text-text-dark">{filteredCount}</strong>{' '}
          {currentCopy.resultLabel}
        </div>
        <Button
          variant="link"
          onClick={resetFilters}
          className="h-auto p-0 font-semibold text-primary hover:underline"
        >
          Filtreleri Temizle
        </Button>
      </div>
    </div>
  );
}
