'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import { Button } from '@/components/ui/button';
import {
  IconCoins,
  IconMenu,
  IconX,
} from '@tabler/icons-react';

export function Header() {
  const {
    context,
    aiCredits,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setAuthTab,
    setIsAuthModalOpen,
    setIsAlertOpen,
  } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-custom bg-bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 md:h-20">
        {/* Logo */}
        <div
          className="flex shrink-0 cursor-pointer items-center gap-2"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMobileMenuOpen(false);
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white shadow-md md:h-10 md:w-10 md:text-xl">
            T
          </div>
          <div>
            <div className="text-[18px] font-bold tracking-tight text-text-dark md:text-[20px]">
              Tek Nokta
            </div>
            <div className="hidden text-[11px] uppercase tracking-[0.18em] text-text-muted md:block">
              {context === 'housing' ? 'Konut Portföyü' : 'Otomotiv Portföyü'}
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-[14px] font-medium text-text-body md:flex">
          <a href="#featured-listings" className="transition-colors hover:text-primary">
            Portföy
          </a>
          <a href="#cities" className="transition-colors hover:text-primary">
            Şehirler
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-primary">
            Süreç
          </a>
          <a href="#agents" className="transition-colors hover:text-primary">
            Danışmanlar
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[13px] font-semibold text-primary">
            <IconCoins size={15} className="animate-pulse text-primary" />
            <span>{aiCredits} Kredi</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setAuthTab('login');
              setIsAuthModalOpen(true);
            }}
            className="h-10 rounded-lg px-4 text-[14px] font-semibold text-text-body hover:bg-bg-light"
          >
            Giriş Yap
          </Button>
          <Button
            onClick={() => setIsAlertOpen(true)}
            className="h-10 rounded-lg border-none bg-primary px-5 text-[14px] font-semibold text-white shadow-sm hover:bg-primary-dark"
          >
            {context === 'housing' ? 'Konut İlanı Ver' : 'Araç İlanı Ver'}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-custom text-text-body md:hidden"
          aria-label="Menü"
        >
          {isMobileMenuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border-custom bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-[14px] font-medium text-text-body">
            <a href="#featured-listings" onClick={() => setIsMobileMenuOpen(false)}>
              Portföy
            </a>
            <a href="#cities" onClick={() => setIsMobileMenuOpen(false)}>
              Şehirler
            </a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
              Süreç
            </a>
            <a href="#agents" onClick={() => setIsMobileMenuOpen(false)}>
              Danışmanlar
            </a>
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setAuthTab('login');
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex-1"
            >
              Giriş Yap
            </Button>
            <Button
              onClick={() => {
                setIsAlertOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 border-none bg-primary text-white hover:bg-primary-dark"
            >
              İlan Ver
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
