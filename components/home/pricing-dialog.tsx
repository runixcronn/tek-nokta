'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconCheck, IconCoins, IconLoader2, IconSparkles } from '@tabler/icons-react';

const PACKAGES = [
  {
    name: 'Başlangıç',
    label: 'Başlangıç',
    credits: 15,
    price: '49 TL',
    queries: '3 AI Arama Sorgusu',
    features: ['Hızlı Arama Desteği', 'Doğal Dil Algılama'],
    highlighted: false,
  },
  {
    name: 'Popüler',
    label: 'Popüler',
    credits: 40,
    price: '99 TL',
    queries: '8 AI Arama Sorgusu',
    features: ['Hızlı Arama Desteği', 'Doğal Dil Algılama', 'Öncelikli AI Çözümleme'],
    highlighted: true,
  },
  {
    name: 'Profesyonel',
    label: 'Profesyonel',
    credits: 100,
    price: '199 TL',
    queries: '20 AI Arama Sorgusu',
    features: [
      'Hızlı Arama Desteği',
      'Doğal Dil Algılama',
      'Öncelikli AI Çözümleme',
      'Sınırsız Sonuç Listeleme',
    ],
    highlighted: false,
  },
];

export function PricingDialog() {
  const { isPricingModalOpen, isPurchasing, purchasedPackName, setIsPricingModalOpen, handlePurchasePlan } =
    useStore();

  return (
    <Dialog open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-2xl border-none bg-white p-6 shadow-2xl md:p-8">
        {isPurchasing ? (
          <div className="animate-fade-in flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconLoader2 size={32} className="animate-spin text-primary" />
            </div>
            <h4 className="text-[18px] font-bold text-text-dark">Ödeme Alınıyor...</h4>
            <p className="text-[13px] text-text-muted">
              Güvenli ödeme geçidi üzerinden {purchasedPackName} Paketi tanımlanıyor.
            </p>
          </div>
        ) : (
          <div>
            <DialogHeader className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconCoins size={24} />
              </div>
              <DialogTitle className="text-[22px] font-bold text-text-dark">
                Kredi Paketi Satın Al
              </DialogTitle>
              <DialogDescription className="mt-1 text-[14px] text-text-muted">
                Yapay zeka ilan aramalarında kullanmak üzere bütçenize en uygun bakiye paketini seçin.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`relative flex flex-col justify-between rounded-xl border p-5 text-center transition-all duration-300 ${
                    pkg.highlighted
                      ? 'scale-105 border-primary bg-white shadow-lg hover:shadow-xl'
                      : 'border-border-custom bg-white hover:shadow-md'
                  }`}
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                      <IconSparkles size={12} className="animate-pulse text-white" />
                      <span>Tavsiye Edilen</span>
                    </div>
                  )}

                  <div>
                    <span
                      className={`block text-[12px] font-semibold uppercase tracking-wider ${pkg.highlighted ? 'mt-1 font-bold text-primary' : 'text-text-muted'}`}
                    >
                      {pkg.label}
                    </span>
                    <span
                      className={`mt-4 block font-extrabold ${pkg.highlighted ? 'text-[36px] text-primary' : 'text-[30px] text-text-dark'}`}
                    >
                      +{pkg.credits}{' '}
                      <span
                        className={`text-[16px] font-normal ${pkg.highlighted ? 'text-primary/80' : 'text-text-muted'}`}
                      >
                        Kredi
                      </span>
                    </span>
                    <span
                      className={`mt-1 block text-[13px] ${pkg.highlighted ? 'text-primary/80' : 'text-text-muted'}`}
                    >
                      ({pkg.queries})
                    </span>
                    <div
                      className={`my-5 space-y-2 border-t pt-4 text-left text-[13px] ${pkg.highlighted ? 'border-primary/20' : 'border-border-custom'}`}
                    >
                      {pkg.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-1.5 text-text-dark">
                          <IconCheck size={14} className="shrink-0 text-green-600" stroke={3} />
                          <span className={pkg.highlighted && feature === pkg.features[pkg.features.length - 1] && pkg.features.length > 2 ? 'font-semibold' : ''}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      className={`mb-4 font-bold text-text-dark ${pkg.highlighted ? 'text-[24px]' : 'text-[20px]'}`}
                    >
                      {pkg.price}
                    </div>
                    <Button
                      onClick={() => handlePurchasePlan(pkg.name, pkg.credits)}
                      className={`w-full h-10 rounded-lg text-[13px] font-semibold ${
                        pkg.highlighted
                          ? 'border-none bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark font-bold'
                          : 'border border-border-custom bg-white text-text-dark hover:bg-bg-light hover:text-text-dark'
                      }`}
                    >
                      Satın Al
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
