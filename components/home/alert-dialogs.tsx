'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IconCoins, IconPlus } from '@tabler/icons-react';

export function AlertDialogs() {
  const {
    context,
    isAlertOpen,
    showAiRechargeAlert,
    setIsAlertOpen,
    setShowAiRechargeAlert,
    setIsPricingModalOpen,
  } = useStore();

  return (
    <>
      {/* Listing info alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl border-none bg-white p-6 shadow-2xl">
          <AlertDialogHeader>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF0EE] text-primary">
              <IconPlus size={28} />
            </div>
            <AlertDialogTitle className="text-left text-[20px] font-bold text-text-dark">
              {context === 'housing' ? 'Konut ilanı verme akışı' : 'Araç ilanı verme akışı'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left text-[14px] leading-relaxed text-text-body">
              {context === 'housing'
                ? 'Bu demo ekranda ilan verme adımı bilgilendirme amaçlı tutuluyor. Gerçek akışta portföy detayları, fotoğraf yükleme ve fiyat doğrulama adımları yer alacak.'
                : 'Bu demo ekranda araç ilanı verme adımı bilgilendirme amaçlı tutuluyor. Gerçek akışta ekspertiz, hasar bilgisi, kilometre doğrulaması ve fotoğraf yükleme adımları eklenecek.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction className="rounded-lg border-none bg-primary text-white hover:bg-primary-dark">
              Anladım
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI credit recharge alert */}
      <AlertDialog open={showAiRechargeAlert} onOpenChange={setShowAiRechargeAlert}>
        <AlertDialogContent className="max-w-md rounded-2xl border-none bg-white p-6 shadow-2xl">
          <AlertDialogHeader>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <IconCoins size={28} />
            </div>
            <AlertDialogTitle className="text-left text-[20px] font-bold text-text-dark">
              Krediniz Yetersiz 🪙
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left text-[14px] leading-relaxed text-text-body">
              Arama yapabilmek veya yeni ilanları listeleyebilmek için yeterli krediniz
              bulunmamaktadır. Her arama veya sayfalama sorgusu 5 kredi tüketir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-lg border border-border-custom bg-white text-text-body hover:bg-bg-light">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAiRechargeAlert(false);
                setIsPricingModalOpen(true);
              }}
              className="rounded-lg border-none bg-primary text-white hover:bg-primary-dark"
            >
              Paketleri Gör 🪙
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
