'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks/use-store';
import { fetchProperties } from '@/lib/api';
import {
  automotivePropertyTypes,
  housingPropertyTypes,
  isHousingListing,
  getListingTypeTurkish,
  HousingListing,
  AutomotiveListing,
} from '@/lib/data';
import { contextContent } from '@/lib/constants';
import { PropertyCard } from '@/components/property-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { IconCar, IconCoins, IconHome, IconSparkles } from '@tabler/icons-react';

export function FeaturedListings() {
  const {
    context,
    housingPurpose,
    isAiMode,
    activeAiPrompt,
    isAiLoading,
    aiLoadingText,
    aiCredits,
    aiLimit,
    activeCategory,
    searchQuery,
    selectedCity,
    selectedType,
    selectedPriceRange,

    setActiveCategory,
    resetFilters,
    handleLoadMore,
  } = useStore();

  const currentCopy = contextContent[context];
  const currentTypes = context === 'housing' ? housingPropertyTypes : automotivePropertyTypes;

  const { data: propertiesList = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
  });

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
    const cityMap: Record<string, string> = {
      istanbul: 'İstanbul', ankara: 'Ankara', izmir: 'İzmir', antalya: 'Antalya',
      bodrum: 'Bodrum', bursa: 'Bursa', mugla: 'Muğla', yalova: 'Yalova',
      trabzon: 'Trabzon', eskisehir: 'Eskişehir',
    };
    for (const c of cities) {
      if (query.includes(c)) { detectedCity = cityMap[c] || c; break; }
    }

    let detectedPurpose: 'buy' | 'rent' | null = null;
    if (query.includes('kiralik') || query.includes('kira') || query.includes('kiraliklar')) detectedPurpose = 'rent';
    else if (query.includes('satilik') || query.includes('satin al') || query.includes('satiliklar')) detectedPurpose = 'buy';

    let detectedType: string | null = null;
    const types = [
      { key: 'villa', label: 'Villa' }, { key: 'daire', label: 'Apartment' },
      { key: 'apartman', label: 'Apartment' }, { key: 'ofis', label: 'Office' },
      { key: 'buro', label: 'Office' }, { key: 'bungalov', label: 'Bungalow' },
      { key: 'bungalow', label: 'Bungalow' }, { key: 'mustakil', label: 'Townhouse' },
      { key: 'townhouse', label: 'Townhouse' }, { key: 'suv', label: 'SUV' },
      { key: 'sedan', label: 'Sedan' }, { key: 'hatchback', label: 'Hatchback' },
      { key: 'hb', label: 'Hatchback' }, { key: 'ticari', label: 'Commercial' },
      { key: 'kamyonet', label: 'Commercial' }, { key: 'van', label: 'Commercial' },
      { key: 'motosiklet', label: 'Motorcycle' }, { key: 'motor', label: 'Motorcycle' },
    ];
    for (const t of types) { if (query.includes(t.key)) { detectedType = t.label; break; } }

    let pricePreference: 'cheap' | 'luxury' | null = null;
    if (query.includes('ucuz') || query.includes('ekonomik') || query.includes('uygun') || query.includes('hesapli') || query.includes('butce dostu') || query.includes('fiyat performans')) pricePreference = 'cheap';
    else if (query.includes('luks') || query.includes('pahali') || query.includes('premium') || query.includes('manzarali') || query.includes('gosterisli')) pricePreference = 'luxury';

    let minYear: number | null = null;
    const yearMatches = query.match(/(20\d{2})/);
    if (yearMatches) minYear = parseInt(yearMatches[1]);

    let detectedFuel: string | null = null;
    if (query.includes('dizel') || query.includes('mazot')) detectedFuel = 'Dizel';
    else if (query.includes('benzin')) detectedFuel = 'Benzin';
    else if (query.includes('hibrit')) detectedFuel = 'Hibrit';
    else if (query.includes('elektrik')) detectedFuel = 'Elektrik';

    let detectedTransmission: string | null = null;
    if (query.includes('otomatik')) detectedTransmission = 'Otomatik';
    else if (query.includes('manuel') || query.includes('duz vites')) detectedTransmission = 'Manuel';

    let bedsCount: number | null = null;
    const bedMatches = query.match(/(\d)\+(\d)/);
    if (bedMatches) bedsCount = parseInt(bedMatches[1]);
    else { const odaMatch = query.match(/(\d)\s*oda/); if (odaMatch) bedsCount = parseInt(odaMatch[1]); }

    return {
      city: detectedCity, purpose: detectedPurpose, type: detectedType,
      pricePreference, minYear, fuel: detectedFuel, transmission: detectedTransmission,
      beds: bedsCount, rawQuery: query,
    };
  }, [isAiMode, activeAiPrompt]);

  const filteredProperties = useMemo(() => {
    let result = propertiesList.filter((property) => {
      if (property.context !== context) return false;

      if (isAiMode && parsedAiCriteria) {
        const criteria = parsedAiCriteria;
        if (criteria.city && property.location.toLowerCase() !== criteria.city.toLowerCase()) return false;
        if (property.context === 'housing' && criteria.purpose) {
          const prop = property as HousingListing;
          if (criteria.purpose === 'rent' && prop.purpose !== 'rent') return false;
          if (criteria.purpose === 'buy' && prop.purpose !== 'buy' && prop.purpose !== 'sell') return false;
        }
        if (criteria.type && property.type !== criteria.type) return false;
        if (property.context === 'housing' && criteria.beds !== null) {
          const prop = property as HousingListing;
          if (prop.beds !== criteria.beds) return false;
        }
        if (property.context === 'automotive') {
          const prop = property as AutomotiveListing;
          if (criteria.minYear && prop.year < criteria.minYear) return false;
          if (criteria.fuel && prop.fuel !== criteria.fuel) return false;
          if (criteria.transmission && prop.transmission !== criteria.transmission) return false;
        }

        const excludedWords = [
          'kiralik', 'satilik', 'konumunda', 'olan', 'arac', 'ev', 'konut', 'daire', 'villa',
          'model', 'otomatik', 'manuel', 'dizel', 'benzin', 'hibrit', 'elektrik',
          'ucuz', 'ekonomik', 'uygun', 'hesapli', 'butce', 'luks', 'pahali', 'premium', 'manzarali', 'gosterisli', 'fiyat', 'performans',
        ];
        if (criteria.city) excludedWords.push(criteria.city.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c'));
        if (criteria.type) excludedWords.push(criteria.type.toLowerCase(), 'villa', 'daire', 'ofis', 'bungalov', 'mustakil', 'apartman', 'suv', 'sedan', 'hatchback', 'ticari', 'motosiklet');

        const keywords = criteria.rawQuery
          .split(/\s+/)
          .map((w: string) => w.replace(/[''].*$/, ''))
          .filter((w: string) => w.length > 2)
          .filter((w: string) => {
            const cleanW = w.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
            return !cleanW || !excludedWords.some((ex: string) => ex.includes(cleanW) || cleanW.includes(ex));
          });

        for (const word of keywords) {
          const normalize = (s: string) => s.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
          const titleMatch = normalize(property.title).includes(word);
          const descMatch = normalize(property.description).includes(word);
          if (!titleMatch && !descMatch) return false;
        }
        return true;
      } else {
        const purposeMatch =
          context === 'housing'
            ? isHousingListing(property) &&
              (housingPurpose === 'buy'
                ? property.purpose === 'buy' || property.purpose === 'sell'
                : property.purpose === 'rent')
            : true;

        const categoryMatch = activeCategory === 'All' || property.type === activeCategory;
        const queryMatch =
          searchQuery === '' ||
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase());
        const cityMatch = selectedCity === 'All' || property.location.toLowerCase() === selectedCity.toLowerCase();
        const typeMatch = selectedType === 'All' || property.type === selectedType;

        let priceMatch = true;
        if (selectedPriceRange !== 'All') {
          const val = property.priceValue;
          if (selectedPriceRange === 'under-10m') priceMatch = val < 10000000;
          if (selectedPriceRange === '10m-25m') priceMatch = val >= 10000000 && val <= 25000000;
          if (selectedPriceRange === 'over-25m') priceMatch = val > 25000000;
          if (selectedPriceRange === 'under-1m') priceMatch = val < 1000000;
          if (selectedPriceRange === '1m-3m') priceMatch = val >= 1000000 && val <= 3000000;
          if (selectedPriceRange === 'over-3m') priceMatch = val > 3000000;
        }

        return purposeMatch && categoryMatch && queryMatch && cityMatch && typeMatch && priceMatch;
      }
    });

    if (isAiMode && parsedAiCriteria) {
      if (parsedAiCriteria.pricePreference === 'cheap') result = [...result].sort((a, b) => a.priceValue - b.priceValue);
      else if (parsedAiCriteria.pricePreference === 'luxury') result = [...result].sort((a, b) => b.priceValue - a.priceValue);
    }

    return result;
  }, [activeCategory, context, housingPurpose, propertiesList, searchQuery, selectedCity, selectedPriceRange, selectedType, isAiMode, parsedAiCriteria]);

  const visibleProperties = useMemo(() => {
    if (isAiMode) return filteredProperties.slice(0, aiLimit);
    return filteredProperties;
  }, [filteredProperties, isAiMode, aiLimit]);

  return (
    <section id="featured-listings" className="bg-bg-light py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-[28px] font-bold leading-tight tracking-tight text-text-dark md:text-[32px]">
              {currentCopy.listingsTitle}
            </h2>
            <p className="text-[14px] text-text-muted">{currentCopy.listingsDescription}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
            <span className="mr-2 self-center text-[13px] text-text-muted">
              {currentCopy.categoryQuickLabel}
            </span>
            <Button
              variant={activeCategory === 'All' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('All')}
              className={`h-7 rounded-full px-4 py-1 text-[12px] font-medium ${
                activeCategory === 'All'
                  ? 'border-none bg-primary text-white hover:bg-primary-dark'
                  : 'border border-border-custom bg-white text-text-body hover:border-primary hover:bg-transparent'
              }`}
            >
              Hepsi
            </Button>
            {currentTypes.slice(0, 3).map((type) => (
              <Button
                key={type}
                variant={activeCategory === type ? 'default' : 'outline'}
                onClick={() => setActiveCategory(type)}
                className={`h-7 rounded-full px-4 py-1 text-[12px] font-medium ${
                  activeCategory === type
                    ? 'border-none bg-primary text-white hover:bg-primary-dark'
                    : 'border border-border-custom bg-white text-text-body hover:border-primary hover:bg-transparent'
                }`}
              >
                {getListingTypeTurkish(type)}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isAiLoading ? (
          <div className="animate-fade-in flex flex-col items-center justify-center gap-4 rounded-2xl border border-border-custom bg-white p-8 py-20 text-center shadow-sm">
            <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconSparkles size={32} className="animate-spin" />
            </div>
            <p className="text-[15px] font-semibold text-text-dark">{aiLoadingText}</p>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-[13px] font-bold text-primary">
              <IconCoins size={14} />
              <span>Kalan Kredi: {aiCredits}</span>
            </div>
          </div>
        ) : propertiesLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : visibleProperties.length > 0 ? (
          <div className="animate-fade-in space-y-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {isAiMode && filteredProperties.length > visibleProperties.length && (
              <div className="flex flex-col items-center justify-center border-t border-border-custom pt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isAiLoading}
                  className="h-12 rounded-xl border-none bg-primary px-8 font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-dark"
                >
                  Devamını Getir (5 Kredi) ⬇️
                </Button>
                <p className="mt-2 text-[12px] text-text-muted">
                  Toplam {filteredProperties.length} ilandan {visibleProperties.length} tanesi gösteriliyor.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-[620px] rounded-2xl border border-border-custom bg-white p-8 text-center shadow-sm">
            {context === 'housing' ? (
              <IconHome size={48} className="mx-auto mb-4 stroke-[1.5] text-text-muted" />
            ) : (
              <IconCar size={48} className="mx-auto mb-4 stroke-[1.5] text-text-muted" />
            )}
            <h3 className="mb-1 text-[18px] font-bold text-text-dark">{currentCopy.emptyTitle}</h3>
            <p className="mb-6 text-[14px] text-text-muted">{currentCopy.emptyDescription}</p>
            <Button
              onClick={resetFilters}
              className="h-10 rounded-[6px] border-none bg-primary px-[22px] py-[10px] text-[14px] font-semibold text-white transition-all hover:bg-primary-dark"
            >
              {currentCopy.emptyButton}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
