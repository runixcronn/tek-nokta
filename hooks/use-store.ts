import { create } from 'zustand';
import type { ListingContext } from '@/lib/data';
import type { PriceRangeValue } from '@/lib/constants';

export type HousingPurpose = 'buy' | 'rent';

export interface OnboardingQuestion {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  type: 'location' | 'cards';
  options: { value: string; label: string; icon: string; desc: string }[];
}

interface StoreState {
  // ─── Context & Purpose ───────────────────────────────────────────────────
  context: ListingContext;
  housingPurpose: HousingPurpose;

  // ─── Standard Filters ────────────────────────────────────────────────────
  searchQuery: string;
  selectedCity: string;
  selectedType: string;
  selectedPriceRange: PriceRangeValue;
  activeCategory: string;

  // ─── Auth Modal ──────────────────────────────────────────────────────────
  isAuthModalOpen: boolean;
  authTab: 'login' | 'register';
  authFormData: { email: string; password: string; name: string; terms: boolean };
  isAuthLoading: boolean;
  authSuccess: boolean;

  // ─── Alert / Listing Dialog ──────────────────────────────────────────────
  isAlertOpen: boolean;

  // ─── Mobile Menu ─────────────────────────────────────────────────────────
  isMobileMenuOpen: boolean;

  // ─── Onboarding Wizard ──────────────────────────────────────────────────
  isOnboardingOpen: boolean;
  onboardingStep: number;
  onboardingLoading: boolean;
  onboardingAnswers: Record<string, string>;

  // ─── Newsletter ──────────────────────────────────────────────────────────
  newsletterEmail: string;
  newsletterSubscribed: boolean;

  // ─── AI Mode ─────────────────────────────────────────────────────────────
  isAiMode: boolean;
  aiCredits: number;
  aiPromptInput: string;
  activeAiPrompt: string;
  isAiLoading: boolean;
  aiLimit: number;
  showAiRechargeAlert: boolean;
  aiLoadingText: string;

  // ─── Pricing Modal ───────────────────────────────────────────────────────
  isPricingModalOpen: boolean;
  isPurchasing: boolean;
  purchasedPackName: string;

  // ─── Actions ─────────────────────────────────────────────────────────────
  resetFilters: () => void;
  switchToHousing: (purpose: HousingPurpose) => void;
  switchToAutomotive: () => void;

  // Filter setters
  setSearchQuery: (q: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedPriceRange: (range: PriceRangeValue) => void;
  setActiveCategory: (cat: string) => void;

  // Auth setters
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthTab: (tab: 'login' | 'register') => void;
  setAuthFormData: (data: { email: string; password: string; name: string; terms: boolean }) => void;
  handleAuthSubmit: () => void;

  // Alert setters
  setIsAlertOpen: (open: boolean) => void;

  // Mobile menu
  setIsMobileMenuOpen: (open: boolean) => void;

  // Onboarding
  setIsOnboardingOpen: (open: boolean) => void;
  setOnboardingStep: (step: number) => void;
  setOnboardingAnswers: (answers: Record<string, string>) => void;
  goNextOnboarding: (questions: OnboardingQuestion[], skip?: boolean) => void;

  // Newsletter
  setNewsletterEmail: (email: string) => void;
  handleNewsletterSubmit: () => void;

  // AI actions
  setIsAiMode: (active: boolean) => void;
  setAiPromptInput: (prompt: string) => void;
  handleAiSearch: () => void;
  handleResetAi: () => void;
  handleLoadMore: () => void;
  setShowAiRechargeAlert: (show: boolean) => void;
  setIsPricingModalOpen: (open: boolean) => void;
  handlePurchasePlan: (packName: string, creditsToAdd: number) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // ─── Initial State ────────────────────────────────────────────────────────
  context: 'housing',
  housingPurpose: 'buy',

  searchQuery: '',
  selectedCity: 'All',
  selectedType: 'All',
  selectedPriceRange: 'All',
  activeCategory: 'All',

  isAuthModalOpen: false,
  authTab: 'login',
  authFormData: { email: '', password: '', name: '', terms: false },
  isAuthLoading: false,
  authSuccess: false,

  isAlertOpen: false,
  isMobileMenuOpen: false,

  isOnboardingOpen: false,
  onboardingStep: 0,
  onboardingLoading: false,
  onboardingAnswers: {},

  newsletterEmail: '',
  newsletterSubscribed: false,

  isAiMode: false,
  aiCredits: 20,
  aiPromptInput: '',
  activeAiPrompt: '',
  isAiLoading: false,
  aiLimit: 20,
  showAiRechargeAlert: false,
  aiLoadingText: '',

  isPricingModalOpen: false,
  isPurchasing: false,
  purchasedPackName: '',

  // ─── Context Actions ──────────────────────────────────────────────────────
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCity: 'All',
      selectedType: 'All',
      selectedPriceRange: 'All',
      activeCategory: 'All',
      aiPromptInput: '',
      activeAiPrompt: '',
    }),

  switchToHousing: (purpose) => {
    get().resetFilters();
    set({ context: 'housing', housingPurpose: purpose });
  },

  switchToAutomotive: () => {
    get().resetFilters();
    set({ context: 'automotive' });
  },

  // ─── Filter Setters ───────────────────────────────────────────────────────
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedPriceRange: (range) => set({ selectedPriceRange: range }),
  setActiveCategory: (cat) => set({ activeCategory: cat }),

  // ─── Auth ─────────────────────────────────────────────────────────────────
  setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setAuthTab: (tab) => set({ authTab: tab }),
  setAuthFormData: (data) => set({ authFormData: data }),

  handleAuthSubmit: () => {
    const { authTab } = get();
    set({ isAuthLoading: true });
    setTimeout(() => {
      set({ isAuthLoading: false, authSuccess: true });
      setTimeout(() => {
        set({
          authSuccess: false,
          isAuthModalOpen: false,
          authFormData: { email: '', password: '', name: '', terms: false },
        });
        if (authTab === 'register') {
          set({ onboardingStep: 0, onboardingAnswers: {}, onboardingLoading: true, isOnboardingOpen: true });
          setTimeout(() => set({ onboardingLoading: false }), 900);
        }
      }, 1200);
    }, 1200);
  },

  // ─── Alert ────────────────────────────────────────────────────────────────
  setIsAlertOpen: (open) => set({ isAlertOpen: open }),

  // ─── Mobile Menu ──────────────────────────────────────────────────────────
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  // ─── Onboarding ───────────────────────────────────────────────────────────
  setIsOnboardingOpen: (open) => set({ isOnboardingOpen: open }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setOnboardingAnswers: (answers) => set({ onboardingAnswers: answers }),

  goNextOnboarding: (questions, skip = false) => {
    const { onboardingStep, onboardingAnswers } = get();

    if (!skip) {
      const q = questions[onboardingStep];
      const hasAnswer =
        q.type === 'location' ? !!onboardingAnswers.city : !!onboardingAnswers[q.id];
      if (!hasAnswer) return;
    }

    if (onboardingStep < questions.length - 1) {
      set({ onboardingLoading: true });
      setTimeout(() => {
        set((state) => ({ onboardingLoading: false, onboardingStep: state.onboardingStep + 1 }));
      }, 800);
      return;
    }

    set({ isOnboardingOpen: false });
  },

  // ─── Newsletter ───────────────────────────────────────────────────────────
  setNewsletterEmail: (email) => set({ newsletterEmail: email }),

  handleNewsletterSubmit: () => {
    const { newsletterEmail } = get();
    if (!newsletterEmail) return;
    set({ newsletterSubscribed: true });
    setTimeout(() => {
      set({ newsletterSubscribed: false, newsletterEmail: '' });
    }, 2500);
  },

  // ─── AI Mode ──────────────────────────────────────────────────────────────
  setIsAiMode: (active) => set({ isAiMode: active }),
  setAiPromptInput: (prompt) => set({ aiPromptInput: prompt }),

  handleAiSearch: () => {
    const { aiPromptInput, aiCredits } = get();
    if (!aiPromptInput.trim()) return;
    if (aiCredits < 5) {
      set({ showAiRechargeAlert: true });
      return;
    }
    set((state) => ({
      aiCredits: state.aiCredits - 5,
      isAiLoading: true,
      aiLimit: 20,
      aiLoadingText: 'Yapay zeka promptu çözümlüyor ve en uygun ilanları eşleştiriyor...',
    }));
    setTimeout(() => {
      set((state) => ({ isAiLoading: false, activeAiPrompt: state.aiPromptInput }));
    }, 1500);
  },

  handleResetAi: () =>
    set({ aiPromptInput: '', activeAiPrompt: '', aiLimit: 20 }),

  handleLoadMore: () => {
    const { aiCredits } = get();
    if (aiCredits < 5) {
      set({ showAiRechargeAlert: true });
      return;
    }
    set((state) => ({
      aiCredits: state.aiCredits - 5,
      isAiLoading: true,
      aiLoadingText: 'Yapay zeka sonraki ilanları analiz edip getiriyor...',
    }));
    setTimeout(() => {
      set((state) => ({ isAiLoading: false, aiLimit: state.aiLimit + 20 }));
    }, 1200);
  },

  setShowAiRechargeAlert: (show) => set({ showAiRechargeAlert: show }),

  // ─── Pricing ──────────────────────────────────────────────────────────────
  setIsPricingModalOpen: (open) => set({ isPricingModalOpen: open }),

  handlePurchasePlan: (packName, creditsToAdd) => {
    set({ isPurchasing: true, purchasedPackName: packName });
    setTimeout(() => {
      set((state) => ({
        isPurchasing: false,
        aiCredits: state.aiCredits + creditsToAdd,
        isPricingModalOpen: false,
        purchasedPackName: '',
      }));
    }, 1800);
  },
}));
