'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { IconCheck } from '@tabler/icons-react';

export function AuthDialog() {
  const {
    isAuthModalOpen,
    authTab,
    authFormData,
    isAuthLoading,
    authSuccess,
    setIsAuthModalOpen,
    setAuthTab,
    setAuthFormData,
    handleAuthSubmit,
  } = useStore();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => setIsAuthModalOpen(open)}>
      <DialogContent className="max-w-md rounded-2xl border-none bg-white p-6 shadow-2xl md:p-8">
        <div className="sr-only">
          <DialogTitle>Giriş / Kayıt Modalı</DialogTitle>
          <DialogDescription>Hesabınıza erişin veya yeni bir üyelik başlatın.</DialogDescription>
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
            T
          </div>
          <span className="text-[18px] font-bold text-text-dark">Tek Nokta</span>
        </div>

        <div className="mb-6 flex gap-4 border-b border-border-custom pb-2">
          <button
            onClick={() => setAuthTab('login')}
            className={`flex-1 border-b-2 pb-2 text-center text-[15px] font-bold transition-all ${
              authTab === 'login'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-dark'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setAuthTab('register')}
            className={`flex-1 border-b-2 pb-2 text-center text-[15px] font-bold transition-all ${
              authTab === 'register'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-dark'
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {authSuccess ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              <IconCheck size={32} stroke={3} />
            </div>
            <h4 className="text-[18px] font-bold text-text-dark">
              {authTab === 'login' ? 'Başarıyla Giriş Yapıldı!' : 'Kayıt İşlemi Tamamlandı!'}
            </h4>
            <p className="text-[13px] text-text-muted">
              Tek Nokta portföyüne yönlendiriliyorsunuz...
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAuthSubmit();
            }}
            className="space-y-4"
          >
            {authTab === 'register' && (
              <div>
                <label className="mb-1 block text-[12px] font-medium text-text-body">Ad Soyad</label>
                <Input
                  type="text"
                  required
                  placeholder="Adınızı ve soyadınızı yazın"
                  value={authFormData.name}
                  onChange={(e) =>
                    setAuthFormData({ ...authFormData, name: e.target.value })
                  }
                  className="h-11 w-full border border-border-custom text-[14px] focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-[12px] font-medium text-text-body">
                E-posta Adresi
              </label>
              <Input
                type="email"
                required
                placeholder="Örn. ahmet@example.com"
                value={authFormData.email}
                onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                className="h-11 w-full border border-border-custom text-[14px] focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-text-body">Şifre</label>
              <Input
                type="password"
                required
                placeholder="Şifrenizi girin"
                value={authFormData.password}
                onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                className="h-11 w-full border border-border-custom text-[14px] focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
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
                  className="mt-1 rounded border-border-custom text-primary focus:ring-primary"
                />
                <label
                  htmlFor="terms-check"
                  className="cursor-pointer text-[12px] leading-snug text-text-body"
                >
                  Gizlilik sözleşmesini ve kullanıcı şartlarını okudum, kabul ediyorum.
                </label>
              </div>
            )}
            <Button
              type="submit"
              disabled={isAuthLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border-none bg-primary text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"
            >
              {isAuthLoading
                ? 'Yükleniyor...'
                : authTab === 'login'
                  ? 'Giriş Yap'
                  : 'Hesap Oluştur'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
