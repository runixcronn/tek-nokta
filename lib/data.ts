export interface Property {
  id: string;
  title: string;
  type: 'Apartment' | 'Bungalow' | 'Office' | 'Villa' | 'Townhouse';
  location: string;
  price: string;
  priceValue: number; // For filtering/sorting
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  badge: 'Featured' | 'For Sale' | 'For Rent';
  featured: boolean;
  purpose: 'buy' | 'rent' | 'sell';
  agent: {
    name: string;
    avatar: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
}

export interface City {
  id: string;
  name: string;
  image: string;
  propertiesCount: number;
}

export const propertyTypes = ['Apartment', 'Bungalow', 'Office', 'Villa', 'Townhouse'] as const;

// Property types Turkish translation mapper helper
export const getPropertyTypeTurkish = (type: string) => {
  switch (type) {
    case 'Apartment': return 'Daire';
    case 'Bungalow': return 'Bungalov';
    case 'Office': return 'Ofis';
    case 'Villa': return 'Villa';
    case 'Townhouse': return 'Müstakil Ev';
    default: return type;
  }
};

// Badges Turkish translation mapper helper
export const getBadgeTurkish = (badge: string) => {
  switch (badge) {
    case 'Featured': return 'Öne Çıkan';
    case 'For Sale': return 'Satılık';
    case 'For Rent': return 'Kiralık';
    default: return badge;
  }
};

// ---------------------------------------------------------------------------
// Mock data — ileride gerçek veritabanı/backend ile değiştirilecek.
// ---------------------------------------------------------------------------

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Elysian Lüks Villa',
    type: 'Villa',
    location: 'Antalya',
    price: '12.500.000 ₺',
    priceValue: 12500000,
    beds: 5,
    baths: 4,
    sqft: 418,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    badge: 'Featured',
    featured: true,
    purpose: 'buy',
    agent: {
      name: 'Canan Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
    },
  },
  {
    id: '2',
    title: 'Modern Beton & Cam Tasarım Villa',
    type: 'Villa',
    location: 'Bodrum',
    price: '28.000.000 ₺',
    priceValue: 28000000,
    beds: 4,
    baths: 5,
    sqft: 483,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    badge: 'For Sale',
    featured: true,
    purpose: 'buy',
    agent: {
      name: 'Burak Demir',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    },
  },
  {
    id: '3',
    title: 'Minimalist Manzaralı Çatı Penthouse',
    type: 'Apartment',
    location: 'İstanbul',
    price: '45.000 ₺/ay',
    priceValue: 45000,
    beds: 3,
    baths: 3,
    sqft: 204,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    badge: 'For Rent',
    featured: true,
    purpose: 'rent',
    agent: {
      name: 'Selin Aktaş',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    },
  },
  {
    id: '4',
    title: 'Sıcak Tuğla Tasarımlı Müstakil Ev',
    type: 'Townhouse',
    location: 'Ankara',
    price: '8.900.000 ₺',
    priceValue: 8900000,
    beds: 3,
    baths: 2,
    sqft: 167,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    badge: 'For Sale',
    featured: true,
    purpose: 'sell',
    agent: {
      name: 'Derya Şahin',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
    },
  },
  {
    id: '5',
    title: 'Plaza İçi Yüksek Kat Ticari Ofis',
    type: 'Office',
    location: 'İstanbul',
    price: '82.000 ₺/ay',
    priceValue: 82000,
    beds: 0,
    baths: 2,
    sqft: 325,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    badge: 'For Rent',
    featured: false,
    purpose: 'rent',
    agent: {
      name: 'Murat Kaya',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
    },
  },
  {
    id: '6',
    title: 'Geleneksel Mimari Havuzlu Bungalov',
    type: 'Bungalow',
    location: 'Antalya',
    price: '7.200.000 ₺',
    priceValue: 7200000,
    beds: 2,
    baths: 2,
    sqft: 148,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    badge: 'For Sale',
    featured: false,
    purpose: 'buy',
    agent: {
      name: 'Canan Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
    },
  },
  {
    id: '7',
    title: 'Modern Endüstriyel Tasarım Ofis',
    type: 'Office',
    location: 'Bodrum',
    price: '65.000 ₺/ay',
    priceValue: 65000,
    beds: 0,
    baths: 1,
    sqft: 195,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    badge: 'For Rent',
    featured: false,
    purpose: 'rent',
    agent: {
      name: 'Murat Kaya',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
    },
  },
  {
    id: '8',
    title: 'Geniş Bahçeli Denize Sıfır Villa',
    type: 'Villa',
    location: 'Antalya',
    price: '34.000.000 ₺',
    priceValue: 34000000,
    beds: 6,
    baths: 6,
    sqft: 566,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    badge: 'Featured',
    featured: true,
    purpose: 'buy',
    agent: {
      name: 'Burak Demir',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    },
  },
];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Canan Yılmaz',
    role: 'Lüks Villa Uzmanı',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    phone: '+90 532 123 4567',
    email: 'canan@teknokta.com',
  },
  {
    id: '2',
    name: 'Murat Kaya',
    role: 'Ticari Ofis Danışmanı',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    phone: '+90 533 987 6543',
    email: 'murat@teknokta.com',
  },
  {
    id: '3',
    name: 'Derya Şahin',
    role: 'Müstakil Konut Danışmanı',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    phone: '+90 544 321 0987',
    email: 'derya@teknokta.com',
  },
  {
    id: '4',
    name: 'Burak Demir',
    role: 'Rezidans & Malikane Danışmanı',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    phone: '+90 532 555 4433',
    email: 'burak@teknokta.com',
  },
  {
    id: '5',
    name: 'Selin Aktaş',
    role: 'Kiralık Daire Uzmanı',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+90 505 111 2233',
    email: 'selin@teknokta.com',
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    role: 'Ev Sahibi',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    quote:
      'Tek Nokta ile villamızı satın alma süreci son derece stressiz ve kolay geçti. Müşteri temsilcimizin ilgisi harikaydı, tüm isteklerimize uygun seçenekler sunuldu.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sibel Çelik',
    role: 'Ofis Sahibi',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    quote:
      "Bodrum'da start-up projemiz için geniş bir ticari ofis bulmak inanılmaz hızlı oldu. Gösterilen şeffaflık ve hıza gerçekten hayran kaldık.",
    rating: 5,
  },
  {
    id: '3',
    name: 'Cem Öztürk',
    role: 'Kiracı',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    quote:
      'Kiralama süreci harika yönetildi! Siteden Kiralık seçeneğini seçip Antalya araması yaptım ve bir hafta içinde yeni daireme taşınmıştım.',
    rating: 5,
  },
];

export const mockCities: City[] = [
  {
    id: '1',
    name: 'İstanbul',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    propertiesCount: 12,
  },
  {
    id: '2',
    name: 'Antalya',
    image: 'https://images.unsplash.com/photo-1506970113724-bc41e3a46d92?auto=format&fit=crop&w=600&q=80',
    propertiesCount: 8,
  },
  {
    id: '3',
    name: 'Bodrum',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    propertiesCount: 15,
  },
  {
    id: '4',
    name: 'Ankara',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80',
    propertiesCount: 9,
  },
];




