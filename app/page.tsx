'use client';

import React from 'react';
import { Header } from '@/components/home/header';
import { HeroSection } from '@/components/home/hero-section';
import { CategoryFilter } from '@/components/home/category-filter';
import { FeaturedListings } from '@/components/home/featured-listings';
import { CitiesSection } from '@/components/home/cities-section';
import { HowItWorks } from '@/components/home/how-it-works';
import { SupportSection } from '@/components/home/support-section';
import { AgentsSection } from '@/components/home/agents-section';
import { BannerCta } from '@/components/home/banner-cta';
import { Footer } from '@/components/home/footer';
import { AuthDialog } from '@/components/home/auth-dialog';
import { OnboardingDialog } from '@/components/home/onboarding-dialog';
import { PricingDialog } from '@/components/home/pricing-dialog';
import { AlertDialogs } from '@/components/home/alert-dialogs';

export default function Page() {
  return (
    <div className="min-h-screen bg-bg-white font-sans text-text-body antialiased">
      <Header />

      <main>
        <HeroSection />
        <CategoryFilter />
        <FeaturedListings />
        <CitiesSection />
        <HowItWorks />
        <SupportSection />
        <AgentsSection />
        <BannerCta />
      </main>

      <Footer />

      {/* Modals & Dialogs */}
      <AuthDialog />
      <OnboardingDialog />
      <PricingDialog />
      <AlertDialogs />
    </div>
  );
}
