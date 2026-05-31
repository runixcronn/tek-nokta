# Tek Nokta

Bölgenin uzman danışmanları ile güvenilir gayrimenkul ilan rehberi. Satılık, kiralık ve ticari gayrimenkul ilanlarını keşfedin.

## Gereksinimler

- **Node.js** `>= 18`
- **npm** veya **pnpm** / **yarn** / **bun**

## 🚀 Kurulum

```bash
# 1. Proje dizinine gidin
cd tek-nokta

# 2. Bağımlılıkları yükleyin
npm install

# 3. Ortam değişkenlerini ayarlayın (.env.local dosyası)
#    Varsayılan olarak aşağıdaki değer yeterlidir:
#    NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 💻 Geliştirme

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🏗 Production Build

```bash
# 1. Production için derleyin
npm run build

# 2. Production sunucusunu başlatın
npm start
```

## Proje Yapısı

```
tek-nokta/
├── app/                    # Next.js App Router sayfaları ve layout
│   ├── layout.tsx          # Kök layout
│   ├── page.tsx            # Ana sayfa
│   └── globals.css         # Global stiller
├── components/             # Bileşenler
│   ├── ui/                 # shadcn/ui bileşenleri
│   ├── property-card.tsx   # İlan kartı bileşeni
│   ├── property-detail-modal.tsx  # İlan detay modalı
│   ├── query-provider.tsx  # React Query provider
│   └── theme-provider.tsx  # Tema provider
├── hooks/                  # Custom hook'lar
├── lib/                    # Yardımcı fonksiyonlar ve API
│   ├── api.ts              # Veri çekme fonksiyonları
│   ├── data.ts             # Tip tanımları ve sabitler
│   └── utils.ts            # Genel yardımcılar
├── public/                 # Statik dosyalar
├── next.config.ts          # Next.js yapılandırması
├── tsconfig.json           # TypeScript yapılandırması
└── package.json            # Bağımlılıklar ve scriptler
```
