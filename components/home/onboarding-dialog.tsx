'use client';

import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks/use-store';
import { fetchCities } from '@/lib/api';
import { City } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { IconCheck } from '@tabler/icons-react';
import type { OnboardingQuestion } from '@/hooks/use-store';

export function OnboardingDialog() {
  const {
    context,
    isOnboardingOpen,
    onboardingStep,
    onboardingLoading,
    onboardingAnswers,
    setIsOnboardingOpen,
    setOnboardingAnswers,
    goNextOnboarding,
  } = useStore();

  const { data: citiesList = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  const filteredCities = useMemo(
    () => citiesList.filter((city: City) => city.context === context),
    [citiesList, context],
  );

  const onboardingQuestions = useMemo<OnboardingQuestion[]>(() => {
    if (context === 'automotive') {
      return [
        {
          id: 'location',
          emoji: '🚗',
          title: 'Hangi şehirde araç arıyorsunuz?',
          subtitle: 'Bulunduğunuz şehre yakın ilanları öne çıkaralım.',
          type: 'location',
          options: [],
        },
        {
          id: 'usage',
          emoji: '🛣️',
          title: 'Aracı en çok nerede kullanacaksınız?',
          subtitle: 'Size uygun segmenti daha iyi anlayalım.',
          type: 'cards',
          options: [
            { value: 'city', label: 'Şehir İçi', icon: '🏙️', desc: 'Ekonomik ve kompakt seçenekler' },
            { value: 'family', label: 'Aile', icon: '👨‍👩‍👧', desc: 'Geniş bagaj ve konfor odaklı' },
            { value: 'business', label: 'İş', icon: '💼', desc: 'Prestij veya ticari kullanım' },
            { value: 'weekend', label: 'Uzun Yol', icon: '🌄', desc: 'Menzil ve sürüş keyfi öncelikli' },
          ],
        },
        {
          id: 'vehicle',
          emoji: '⚙️',
          title: 'Hangi araç tipine bakıyorsunuz?',
          subtitle: 'Portföyü tercih ettiğiniz segment ile daraltabiliriz.',
          type: 'cards',
          options: [
            { value: 'suv', label: 'SUV', icon: '🚙', desc: 'Yüksek oturuş ve geniş hacim' },
            { value: 'sedan', label: 'Sedan', icon: '🚘', desc: 'Konforlu ve dengeli sürüş' },
            { value: 'hatchback', label: 'Hatchback', icon: '🚗', desc: 'Şehir içi pratik kullanım' },
            { value: 'commercial', label: 'Ticari', icon: '🚐', desc: 'İş odaklı yük kapasitesi' },
          ],
        },
      ];
    }

    return [
      {
        id: 'location',
        emoji: '📍',
        title: 'Nerede yaşıyorsunuz?',
        subtitle: 'Size en yakın ilanları gösterebilmemiz için şehrinizi seçin.',
        type: 'location',
        options: [],
      },
      {
        id: 'family',
        emoji: '🏠',
        title: 'Ev için kaç kişisiniz?',
        subtitle: 'Yaşam alanı önerilerimizi buna göre şekillendirelim.',
        type: 'cards',
        options: [
          { value: 'single', label: 'Yalnız', icon: '🧍', desc: 'Stüdyo veya 1+1' },
          { value: 'couple', label: 'Çift', icon: '👫', desc: '1+1 veya 2+1' },
          { value: 'family', label: 'Küçük Aile', icon: '👨‍👩‍👦', desc: '2+1 veya 3+1' },
          { value: 'bigfamily', label: 'Kalabalık Aile', icon: '👨‍👩‍👧‍👦', desc: '3+1 ve üzeri' },
        ],
      },
      {
        id: 'housing',
        emoji: '🏡',
        title: 'Ne tür bir ev arıyorsunuz?',
        subtitle: 'Hayalinizdeki yaşam alanının tipini seçin.',
        type: 'cards',
        options: [
          { value: 'site', label: 'Site / Rezidans', icon: '🏙️', desc: 'Güvenlikli ve sosyal alanlı' },
          { value: 'standalone', label: 'Müstakil Ev', icon: '🏡', desc: 'Bahçeli ve özel alanlı' },
          { value: 'apartment', label: 'Düz Daire', icon: '🏢', desc: 'Merkezi ve pratik kullanım' },
          { value: 'villa', label: 'Villa', icon: '🏖️', desc: 'Geniş ve premium yaşam' },
        ],
      },
    ];
  }, [context]);

  useEffect(() => {
    document.body.style.overflow = isOnboardingOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOnboardingOpen]);

  if (!isOnboardingOpen) return null;

  const question = onboardingQuestions[onboardingStep];
  const canProceed =
    question.type === 'location' ? !!onboardingAnswers.city : !!onboardingAnswers[question.id];
  const isLast = onboardingStep === onboardingQuestions.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border-custom px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-bold text-white">
            T
          </div>
          <span className="text-[16px] font-bold text-text-dark">Tek Nokta</span>
        </div>
        <span className="text-[12px] font-medium text-text-muted">Birkaç saniyenizi alacak</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-bg-light">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((onboardingStep + 1) / onboardingQuestions.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex min-h-[500px] flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[520px]">
          <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Adım {onboardingStep + 1} / {onboardingQuestions.length}
          </p>

          {onboardingLoading ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <Skeleton className="h-8 w-64 rounded-lg" />
                <Skeleton className="h-4 w-80 rounded-md" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 text-center">
                <div className="mb-4 select-none text-5xl">{question.emoji}</div>
                <h2 className="mb-2 text-[22px] font-bold leading-tight text-text-dark sm:text-[28px]">
                  {question.title}
                </h2>
                <p className="mx-auto max-w-[380px] text-[14px] leading-relaxed text-text-muted">
                  {question.subtitle}
                </p>
              </div>

              {question.type === 'location' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-text-muted">
                      Şehir <span className="text-primary">*</span>
                    </label>
                    <select
                      value={onboardingAnswers.city ?? ''}
                      onChange={(e) =>
                        setOnboardingAnswers({ ...onboardingAnswers, city: e.target.value })
                      }
                      className="h-12 w-full cursor-pointer rounded-xl border-2 border-border-custom bg-white px-4 text-[15px] text-text-dark transition-colors focus:border-primary focus:outline-none"
                    >
                      <option value="">Şehir seçin...</option>
                      {filteredCities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-text-muted">
                      İlçe / Mahalle{' '}
                      <span className="normal-case font-normal">(opsiyonel)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Örn. Beşiktaş, Çankaya..."
                      value={onboardingAnswers.district ?? ''}
                      onChange={(e) =>
                        setOnboardingAnswers({ ...onboardingAnswers, district: e.target.value })
                      }
                      className="h-12 w-full rounded-xl border border-border-custom text-[15px] focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {question.type === 'cards' && (
                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((option) => {
                    const selected = onboardingAnswers[question.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          setOnboardingAnswers({ ...onboardingAnswers, [question.id]: option.value })
                        }
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 py-5 text-left transition-all duration-200 ${
                          selected
                            ? 'scale-[1.02] border-primary bg-primary/5 shadow-md'
                            : 'border-border-custom bg-white hover:border-primary/40 hover:bg-bg-light'
                        }`}
                      >
                        <span className="select-none text-3xl">{option.icon}</span>
                        <span
                          className={`text-[13px] font-bold ${selected ? 'text-primary' : 'text-text-dark'}`}
                        >
                          {option.label}
                        </span>
                        <span className="text-center text-[11px] leading-tight text-text-muted">
                          {option.desc}
                        </span>
                        {selected && (
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <IconCheck size={11} stroke={3} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => goNextOnboarding(onboardingQuestions, true)}
                  className="text-[13px] font-semibold text-text-muted transition-colors hover:text-text-dark"
                >
                  Geç
                </button>
                <Button
                  onClick={() => goNextOnboarding(onboardingQuestions, false)}
                  disabled={!canProceed}
                  className="h-11 rounded-xl border-none bg-primary px-6 text-[14px] font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLast ? 'Tamamla' : 'Devam Et'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
