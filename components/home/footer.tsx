'use client';

import React from 'react';
import { useStore } from '@/hooks/use-store';
import { contextContent } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  const { context, newsletterEmail, newsletterSubscribed, setNewsletterEmail, handleNewsletterSubmit } =
    useStore();

  const currentCopy = contextContent[context];

  return (
    <footer className="border-t border-white/5 bg-bg-footer pb-8 pt-16 text-white/70">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl font-bold text-white">
                T
              </div>
              <span className="text-[20px] font-bold tracking-tight text-white">Tek Nokta</span>
            </div>
            <p className="text-[13px] leading-relaxed text-gray-400">{currentCopy.footerAbout}</p>
            <div className="mt-2 flex flex-col gap-2 text-[13px] font-semibold text-white">
              <span>Telefon: 444 0 199</span>
              <span>E-posta: destek@teknokta.com</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold uppercase tracking-wider text-white">
              Bültene Katılın
            </h3>
            <p className="text-[13px] text-gray-400">
              Haftalık bültenimize abone olarak yeni ilanlar ve analizlerden haberdar olun.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNewsletterSubmit();
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                required
                placeholder="E-posta adresi yazın"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="h-10 min-w-0 flex-1 rounded-lg border-white/15 bg-white/10 px-4 text-[13px] text-white placeholder-gray-400 focus-visible:border-primary focus-visible:ring-primary"
              />
              <Button
                type="submit"
                className="h-10 shrink-0 rounded-lg border-none bg-primary px-4 text-[13px] font-semibold text-white transition-all hover:bg-primary-dark"
              >
                {newsletterSubscribed ? 'Kayıt Olundu!' : 'Abone Ol'}
              </Button>
            </form>
          </div>

          {/* Discover */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold uppercase tracking-wider text-white">
              Hızlı Keşfet
            </h3>
            <ul className="flex flex-col gap-2 text-[13px] text-gray-400">
              {currentCopy.footerDiscover.map((item) => (
                <li key={item}>
                  <a
                    href="#featured-listings"
                    className="transition-colors hover:text-primary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold uppercase tracking-wider text-white">
              Kurumsal
            </h3>
            <ul className="flex flex-col gap-2 text-[13px] text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-primary">
                  Hizmetlerimiz
                </a>
              </li>
              <li>
                <a href="#agents" className="transition-colors hover:text-primary">
                  Danışman Kadromuz
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Kullanım Koşulları
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[12px] text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Tek Nokta A.Ş. Tüm Hakları Saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Gizlilik Sözleşmesi
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Kullanım Şartları
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
