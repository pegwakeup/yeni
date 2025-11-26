# Team Section Komponenti

Bu klasörde iki farklı Team section komponenti bulunmaktadır.

## 📦 Mevcut Komponentler

### 1. `team-section.tsx` - Premium Team Layout
**Özellikler:**
- Grid layout (3 kolon)
- Grayscale hover efekti
- Animasyonlu profil kartları
- Sosyal medya linkleri
- Responsive tasarım

**Kullanım:**
```tsx
import TeamSection from '@/components/ui/sections/team-section';

function MyPage() {
  return <TeamSection />;
}
```

### 2. `team-simple.tsx` - Simple Team Layout
**Özellikler:**
- Departmanlara göre gruplama (Liderlik, Mühendislik, Pazarlama)
- Yuvarlak avatar'lar
- Minimal tasarım
- Hızlı loading

**Kullanım:**
```tsx
import TeamSimple from '@/components/ui/sections/team-simple';

function MyPage() {
  return <TeamSimple />;
}
```

## 🎨 Özelleştirme

### Ekip Üyelerini Değiştirme

Her iki komponent de `members` arrayini düzenleyerek özelleştirilebilir:

```tsx
const members = [
  {
    name: 'İsim Soyisim',
    role: 'Pozisyon',
    avatar: 'https://images.unsplash.com/...', // Unsplash URL
    link: '#', // Opsiyonel (team-section için)
  },
  // ... daha fazla üye
];
```

### Unsplash Görselleri

Profesyonel portre fotoğrafları için Unsplash URL formatı:
```
https://images.unsplash.com/photo-{id}?w=460&h=460&fit=crop
```

**Örnek ID'ler:**
- `1507003211169-0a1dd7228f2d` - Erkek portre
- `1494790108377-be9c29b29330` - Kadın portre
- `1500648767791-00dcc994a43e` - Erkek portre 2
- `1438761681033-6461ffad8d80` - Kadın portre 2

### Renk Teması

Komponentler projenin mevcut Tailwind tema sistemini kullanır:
- `text-primary` - Ana renk
- `dark:bg-dark-light` - Dark mode arka planı
- `text-slate-900 dark:text-white` - Metin renkleri

## 🔌 Supabase Entegrasyonu (Opsiyonel)

Ekip verilerini dinamik hale getirmek için:

### 1. Database Tablosu Oluşturma

```sql
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  avatar_url text NOT NULL,
  bio text,
  department text, -- 'leadership', 'engineering', 'marketing'
  linkedin_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- RLS Politikaları
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone"
  ON team_members FOR SELECT
  USING (is_active = true);
```

### 2. Component'i Dinamik Hale Getirme

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/config/supabase';

export default function TeamSection() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchTeam() {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (data) setMembers(data);
    }
    fetchTeam();
  }, []);

  return (
    // ... component JSX
  );
}
```

## 📱 Responsive Davranış

### team-section.tsx
- **Mobile:** 2 kolon grid
- **Tablet:** 2 kolon grid
- **Desktop:** 3 kolon grid

### team-simple.tsx
- **Mobile:** 2 kolon grid
- **Desktop:** 4 kolon grid

## 🎭 Animasyonlar

### Hover Efektleri
- **team-section:** Grayscale → Renkli, yükseklik artışı
- **team-simple:** Avatar scale up, glow efekti

### Scroll Animasyonları
Her iki komponent de `viewport={{ once: true }}` kullanarak sayfa yüklenirken bir kez animate olur.

## 🚀 Kullanım Önerileri

### About Sayfası
Şu anda About sayfasında özel carousel tabanlı bir team section var. Yeni komponentleri kullanmak isterseniz:

```tsx
// src/pages/About.tsx içinde mevcut team section'ı değiştirin
import TeamSection from '@/components/ui/sections/team-section';

// Mevcut carousel kodunu kaldırıp şunu ekleyin:
<TeamSection />
```

### Yeni Bir "Team" Sayfası
Detaylı ekip tanıtımı için ayrı bir sayfa:

```tsx
// src/pages/Team.tsx
import TeamSection from '@/components/ui/sections/team-section';
import TeamSimple from '@/components/ui/sections/team-simple';

export default function Team() {
  return (
    <div>
      <TeamSection /> {/* Ana ekip */}
      <TeamSimple />  {/* Departmanlar */}
    </div>
  );
}
```

## ✅ Entegrasyon Checklist

- [x] Komponentler oluşturuldu
- [x] Tailwind CSS ile uyumlu
- [x] Dark mode desteği
- [x] Responsive tasarım
- [x] TypeScript desteği
- [x] Unsplash görselleri
- [x] React Router Link entegrasyonu
- [ ] Supabase entegrasyonu (opsiyonel)
- [ ] i18n çeviri desteği (opsiyonel)

## 🔧 Troubleshooting

### Görseller Yüklenmiyor
Unsplash URL'lerinin doğru formatda olduğundan emin olun. CORS sorunu yaşarsanız görselleri CDN'e yükleyin.

### Dark Mode Çalışmıyor
Projenizde ThemeContext'in doğru yapılandırıldığından emin olun.

### Build Hatası
Tüm import'ların doğru olduğundan emin olun:
- `react-router-dom` için `Link`
- `lucide-react` için iconlar (gerekirse)
