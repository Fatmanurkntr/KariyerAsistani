// src/theme/types.ts

// 1. Renklerin yapısını tanımlıyoruz
export interface ThemeColors {
  primary: string; // Ana renk (Marka rengi, butonlar)
  background: string; // Sayfa arka plan rengi
  surface: string; // Kartlar, input alanları, menü arka planı
  text: string; // Birincil metin rengi
  textSecondary: string; // İkincil/Soluk metin rengi
  success: string; // Başarı durumu rengi
  error: string; // Hata durumu rengi
}

// 2. Hafif (Light) Tema Değerleri (Tema Context'in ihtiyacı olan)
export const lightTheme: ThemeColors = {
  primary: '#7C3AED', // Örn: Mor
  background: '#F9FAFB', // Açık gri/beyaz
  surface: '#FFFFFF', // Beyaz
  text: '#1F2937', // Koyu gri
  textSecondary: '#6B7280', // Orta gri
  success: '#10B981',
  error: '#EF4444',
};

// 3. Koyu (Dark) Tema Değerleri (İsteğe bağlı, ancak olması iyi)
export const darkTheme: ThemeColors = {
  primary: '#9D66F9', 
  background: '#1A1C22', // Koyu arka plan
  surface: '#252830', // Koyu kart
  text: '#F9FAFB', // Beyaz
  textSecondary: '#BCC1C9', // Açık gri
  success: '#34D399',
  error: '#F87171',
};

// 4. Bir sayfaya tema gönderilirken kullanılacak yapı
export interface ThemeProps {
  activeTheme: ThemeColors;
}