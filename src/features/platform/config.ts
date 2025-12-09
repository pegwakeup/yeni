// =============================================
// PLATFORM CONFIGURATION
// =============================================
// Bu dosya platform'un merkezi yapılandırmasını içerir.
// Subdomain'e geçişte sadece bu dosyayı güncellemeniz yeterli olacaktır.

// Platform URL Yapılandırması
// Subdomain'e geçiş için:
// 1. PLATFORM_BASE_URL'i 'https://app.unilancerlabs.com' olarak değiştirin
// 2. IS_SUBDOMAIN'i true yapın
// 3. Vercel'de app.unilancerlabs.com için yeni bir deployment oluşturun

export const PLATFORM_CONFIG = {
  // Ana site URL'i
  MAIN_SITE_URL: import.meta.env.VITE_MAIN_SITE_URL || 'https://unilancerlabs.com',
  
  // Platform URL'i (şu an aynı domain, /platform altında)
  // Subdomain'e geçince: 'https://app.unilancerlabs.com'
  PLATFORM_BASE_URL: import.meta.env.VITE_PLATFORM_URL || '',
  
  // Subdomain modu aktif mi?
  IS_SUBDOMAIN: import.meta.env.VITE_PLATFORM_SUBDOMAIN === 'true' || false,
  
  // Platform rotaları prefix'i (subdomain modunda boş string)
  PLATFORM_PREFIX: import.meta.env.VITE_PLATFORM_SUBDOMAIN === 'true' ? '' : '/platform',
} as const;

// Platform yollarını oluşturan yardımcı fonksiyon
export const getPlatformUrl = (path: string = ''): string => {
  const { PLATFORM_BASE_URL, PLATFORM_PREFIX, IS_SUBDOMAIN } = PLATFORM_CONFIG;
  
  if (IS_SUBDOMAIN && PLATFORM_BASE_URL) {
    // Subdomain modunda tam URL döndür
    return `${PLATFORM_BASE_URL}${path}`;
  }
  
  // Aynı domain modunda prefix ile path döndür
  return `${PLATFORM_PREFIX}${path}`;
};

// Platform auth yolları
export const PLATFORM_ROUTES = {
  LOGIN: getPlatformUrl('/login'),
  REGISTER: getPlatformUrl('/register'),
  DASHBOARD: getPlatformUrl(''),
  FREELANCER_DASHBOARD: getPlatformUrl('/freelancer'),
  EMPLOYER_DASHBOARD: getPlatformUrl('/employer'),
  PROFILE: getPlatformUrl('/profile'),
  SETTINGS: getPlatformUrl('/settings'),
} as const;

// API endpoint'leri (subdomain modunda ayrı API kullanılabilir)
export const PLATFORM_API = {
  BASE_URL: import.meta.env.VITE_PLATFORM_API_URL || import.meta.env.VITE_SUPABASE_URL,
} as const;

// Subdomain'e geçiş kontrol listesi:
// =============================================
// 1. [ ] Vercel'de yeni proje oluştur (app.unilancerlabs.com)
// 2. [ ] DNS'de app.unilancerlabs.com CNAME kaydı ekle
// 3. [ ] .env.production dosyasında:
//        VITE_PLATFORM_SUBDOMAIN=true
//        VITE_PLATFORM_URL=https://app.unilancerlabs.com
// 4. [ ] Ana siteden platform kodlarını ayır (ayrı repo veya monorepo)
// 5. [ ] Supabase RLS politikalarını güncelle
// 6. [ ] CORS ayarlarını güncelle (her iki domain için)

export default PLATFORM_CONFIG;
