import type { ListingContext } from './data';

// ─── Image Collections ─────────────────────────────────────────────────────

export const housingImages = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80',
];

export const automotiveImages = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80',
];

// ─── Price Ranges ──────────────────────────────────────────────────────────

export type PriceRangeValue =
  | 'All'
  | 'under-10m'
  | '10m-25m'
  | 'over-25m'
  | 'under-1m'
  | '1m-3m'
  | 'over-3m';

export const housingPriceRanges: { value: PriceRangeValue; label: string }[] = [
  { value: 'All', label: 'Tüm Fiyatlar' },
  { value: 'under-10m', label: '10.000.000 TL altı' },
  { value: '10m-25m', label: '10.000.000 TL - 25.000.000 TL' },
  { value: 'over-25m', label: '25.000.000 TL üstü' },
];

export const automotivePriceRanges: { value: PriceRangeValue; label: string }[] = [
  { value: 'All', label: 'Tüm Fiyatlar' },
  { value: 'under-1m', label: '1.000.000 TL altı' },
  { value: '1m-3m', label: '1.000.000 TL - 3.000.000 TL' },
  { value: 'over-3m', label: '3.000.000 TL üstü' },
];

// ─── Context Copy Content ──────────────────────────────────────────────────

export const contextContent = {
  housing: {
    heroTitle: 'Hayalinizdeki Evi Keşfedin',
    heroDescription:
      'Satılık ve kiralık gayrimenkullerde bölgenin uzman danışmanları ile güvenilir ilan rehberi.',
    searchLabel: 'Kelime Ara',
    searchPlaceholder: 'Adres, ilçe veya ilan başlığı yazın...',
    cityLabel: 'Şehir',
    typeLabel: 'Emlak Tipi',
    typeAllLabel: 'Tüm Tipler',
    priceLabel: 'Fiyat Aralığı',
    resultLabel: 'ilan eşleşti.',
    categoryAllLabel: 'Tüm İlanlar',
    categoryQuickLabel: 'Hızlı filtre:',
    listingsTitle: 'Öne Çıkan Konut Portföyü',
    listingsDescription: 'Uzman ekibimizin sizin için seçtiği dikkat çekici gayrimenkul fırsatları.',
    emptyTitle: 'Eşleşen Konut Bulunamadı',
    emptyDescription:
      'Seçtiğiniz kriterlere uygun konut bulunamadı. Filtreleri sıfırlayıp tekrar deneyebilirsiniz.',
    emptyButton: 'Tüm Filtreleri Temizle',
    citiesTitle: 'Popüler Yaşam Bölgelerini Keşfedin',
    citiesDescription: "Türkiye'nin öne çıkan bölgelerinde yayındaki konut portföylerini inceleyin.",
    cityCardSuffix: 'aktif konut ilanı listeleniyor',
    helpTitle: 'Tek Nokta konut sürecinde nasıl yardımcı olur?',
    helpDescription:
      'Satılık ya da kiralık arayışınızda portföy seçiminden görüşme planlamasına kadar süreci kolaylaştırıyoruz.',
    helpCards: [
      {
        title: 'Konut Satın Alın',
        description: 'Bütçenize ve yaşam tarzınıza uygun konutu hızlı şekilde daraltın.',
        action: 'Satılık Konutları Gör',
      },
      {
        title: 'Mülkünüzü Listeleyin',
        description: 'Portföyünüzü doğru alıcı kitlesiyle eşleştirecek tanıtım süreci kuralım.',
        action: 'Konut İlanı Ver',
      },
      {
        title: 'Doğru Kiralık Bulun',
        description: 'Lokasyon, sözleşme ve yaşam ihtiyacınıza uygun kiralık seçenekleri inceleyin.',
        action: 'Kiralık Konutları Gör',
      },
    ],
    supportTitle: 'Konut arayışınız boyunca her adımda yanınızdayız',
    supportDescription:
      'Ekspertiz, portföy doğrulaması ve danışman koordinasyonu ile süreci daha şeffaf ve hızlı hale getiriyoruz.',
    supportStats: [
      { value: '370+', label: 'Satılan Villa' },
      { value: '185+', label: 'Kiralanan Daire' },
      { value: '650+', label: 'Portföy Görüntüleme' },
    ],
    supportCta: 'Portföyü İncele',
    agentsTitle: 'Bölgenin Uzman Konut Danışmanları',
    agentsDescription: 'Size en uygun seçenekleri filtrelemek için hazır profesyonel ekip.',
    bannerTitle: 'Mülkünüzü Tek Nokta ile hızla değerlendirin',
    bannerDescription:
      'Hesabınızı oluşturun veya doğrudan uzman konut danışmanı ile görüşmeye başlayın.',
    bannerPrimary: 'Konut İlanı Ver',
    bannerSecondary: 'Danışmana Ulaş',
    footerAbout:
      'Ayrıcalıklı gayrimenkul hizmetleri, doğrulanmış portföyler ve yerel uzman danışmanlarla yanınızdayız.',
    footerDiscover: [
      'Antalya Lüks Villalar',
      'İstanbul Şehir Daireleri',
      'Bodrum Yazlık Konutlar',
      'Ankara Aile Evleri',
    ],
  },
  automotive: {
    heroTitle: "Hayalinizdeki Aracı Tek Nokta'da Bulun",
    heroDescription:
      'Premium ikinci el, ticari ve elektrikli araçlarda güvenilir ilanlar ve uzman otomotiv danışmanlığı.',
    searchLabel: 'Araç Ara',
    searchPlaceholder: 'Marka, model, paket veya ilan başlığı yazın...',
    cityLabel: 'Şehir',
    typeLabel: 'Araç Tipi',
    typeAllLabel: 'Tüm Tipler',
    priceLabel: 'Fiyat Aralığı',
    resultLabel: 'araç ilanı eşleşti.',
    categoryAllLabel: 'Tüm Araçlar',
    categoryQuickLabel: 'Hızlı filtre:',
    listingsTitle: 'Öne Çıkan Otomotiv Portföyü',
    listingsDescription: 'Ekspertiz odaklı seçili araç ilanları ve güvenli satın alma deneyimi.',
    emptyTitle: 'Eşleşen Araç Bulunamadı',
    emptyDescription:
      'Seçtiğiniz filtrelere uygun araç bulunamadı. Farklı kategori ya da fiyat aralığı deneyebilirsiniz.',
    emptyButton: 'Arama Filtrelerini Temizle',
    citiesTitle: 'En Hareketli Araç Pazarlarını Keşfedin',
    citiesDescription: 'Yüksek ilan hacmine sahip şehirlerdeki güncel araç portföylerine göz atın.',
    cityCardSuffix: 'aktif araç ilanı listeleniyor',
    helpTitle: 'Tek Nokta otomotiv sürecinde nasıl yardımcı olur?',
    helpDescription:
      'Ekspertiz, satın alma planlaması ve satıcı koordinasyonunu tek yerden yönetiyoruz.',
    helpCards: [
      {
        title: 'Premium Araç Seçin',
        description: 'Bütçenize ve kullanım senaryonuza uygun araçları net filtrelerle bulun.',
        action: 'Araçları İncele',
      },
      {
        title: 'Aracınızı Listeleyin',
        description: 'Doğrulanmış ilan sunumu ile aracınızı doğru alıcılarla buluşturun.',
        action: 'Araç İlanı Ver',
      },
      {
        title: 'Ekspertiz Desteği Alın',
        description: 'Yıl, kilometre ve hasar geçmişi doğrulamalarıyla daha güvenli karar verin.',
        action: 'Danışmana Sor',
      },
    ],
    supportTitle: 'Araç seçiminden teslimata kadar yanınızdayız',
    supportDescription:
      'Kilometre doğrulaması, ekspertiz koordinasyonu ve fiyat analizi ile süreci daha kontrollü yürüteceksiniz.',
    supportStats: [
      { value: '240+', label: 'Satılan Premium Araç' },
      { value: '90+', label: 'Ticari Araç Eşleşmesi' },
      { value: '1.2K+', label: 'Ekspertiz Desteği' },
    ],
    supportCta: 'Araç Portföyünü İncele',
    agentsTitle: 'Uzman Otomotiv Danışmanları',
    agentsDescription: 'İkinci el, premium ve ticari araç segmentlerinde size rehberlik eden ekip.',
    bannerTitle: 'Aracınızı Tek Nokta ile daha güvenli listeleyin',
    bannerDescription:
      'Ekspertiz odaklı ilan akışı ve doğru alıcı eşleşmesiyle araç satış sürecinizi hızlandırın.',
    bannerPrimary: 'Araç İlanı Ver',
    bannerSecondary: 'Otomotiv Uzmanına Ulaş',
    footerAbout:
      'Doğrulanmış araç ilanları, segment bazlı filtreler ve satın alma sürecini kolaylaştıran uzman destek.',
    footerDiscover: [
      'İstanbul Premium SUV',
      'Ankara Sedan Fırsatları',
      'İzmir Hibrit Hatchback',
      'Bursa Ticari Araçlar',
    ],
  },
} as const satisfies Record<ListingContext, {
  heroTitle: string;
  heroDescription: string;
  searchLabel: string;
  searchPlaceholder: string;
  cityLabel: string;
  typeLabel: string;
  typeAllLabel: string;
  priceLabel: string;
  resultLabel: string;
  categoryAllLabel: string;
  categoryQuickLabel: string;
  listingsTitle: string;
  listingsDescription: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyButton: string;
  citiesTitle: string;
  citiesDescription: string;
  cityCardSuffix: string;
  helpTitle: string;
  helpDescription: string;
  helpCards: { title: string; description: string; action: string }[];
  supportTitle: string;
  supportDescription: string;
  supportStats: { value: string; label: string }[];
  supportCta: string;
  agentsTitle: string;
  agentsDescription: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerPrimary: string;
  bannerSecondary: string;
  footerAbout: string;
  footerDiscover: string[];
}>;

export type ContextContent = typeof contextContent;
