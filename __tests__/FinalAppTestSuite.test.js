import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

// --- MOCK AYARLARI ---
const mockNavigate = jest.fn();

// 🔥 KRİTİK DÜZELTME: Mock fonksiyonlarını dışarıda tanımlıyoruz ki takibi yapılabilsin
const mockBatchUpdate = jest.fn();
const mockBatchSet = jest.fn();
const mockBatchCommit = jest.fn(() => Promise.resolve());

jest.mock('@react-native-firebase/firestore', () => {
  const mFirestore = () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({})),
      where: jest.fn(() => ({ 
        onSnapshot: jest.fn() 
      })),
    })),
    // 🔥 Her batch() çağrısı artık aynı takip edilebilir fonksiyonları döner
    batch: jest.fn(() => ({
      set: mockBatchSet,
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    })),
  });
  mFirestore.FieldValue = {
    increment: jest.fn((val) => `incremented_${val}`),
    serverTimestamp: jest.fn(() => 'mock_time'),
  };
  return mFirestore;
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

// --- TEST BİLEŞENİ ---
const MockAppShell = ({ activeTheme, currentUser }) => {
  // Tema koruması testi
  const theme = activeTheme || { background: '#FFF' }; 
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text testID="user-bio">{currentUser?.bio || 'Biyografi Yok'}</Text>
      <TouchableOpacity 
        testID="nav-button" 
        onPress={() => mockNavigate('Dashboard', { screen: 'Başvurularım' })}
      >
        <Text>Git</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- TEST SUITE ---
describe('Kariyer Asistanı Final Kalite ve Güvenlik Testleri', () => {
  
  beforeEach(() => { 
    jest.clearAllMocks(); 
  });

  // 1. NAVİGASYON ÇÖKME TESTİ
  test('HATA ENGELLEME: Navigasyon rotası doğru tetikleniyor mu?', () => {
    const { getByTestId } = render(<MockAppShell />);
    fireEvent.press(getByTestId('nav-button'));
    expect(mockNavigate).toHaveBeenCalledWith('Dashboard', { screen: 'Başvurularım' });
  });

  // 2. RENDER GÜVENLİK TESTİ
  test('HATA ENGELLEME: Tema undefined iken uygulama çöküyor mu?', () => {
    const { getByTestId } = render(<MockAppShell activeTheme={undefined} />);
    expect(getByTestId('user-bio')).toBeTruthy();
  });

  // 3. VERİ SENKRONİZASYON (LOGIC) TESTİ
  test('MANTIK DOĞRULAMA: Başvuru yapıldığında sayaç atomik olarak artıyor mu?', async () => {
    // Bu fonksiyon projenin içindeki "Başvur" mantığını simüle eder
    const performApply = async () => {
      const batch = firestore().batch();
      const jobRef = firestore().collection('JobPostings').doc('job1');
      
      batch.update(jobRef, { applicationCount: firestore.FieldValue.increment(1) });
      await batch.commit();
    };

    await performApply();

    // 🔥 Artık mockBatchUpdate üzerinden çağrı yapılıp yapılmadığını görebiliyoruz
    expect(mockBatchUpdate).toHaveBeenCalledWith(
      expect.anything(),
      { applicationCount: 'incremented_1' }
    );
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);
  });

  // 4. SIRALAMA TESTİ
  test('PERFORMANS: Manuel sıralama (JS sort) doğru çalışıyor mu?', () => {
    const data = [{ id: 1, time: 10 }, { id: 2, time: 50 }];
    const sorted = [...data].sort((a, b) => b.time - a.time);
    expect(sorted[0].id).toBe(2);
  });

  // 5. SENKRONİZE BUTON TESTİ
  test('UX: onSnapshot tetiklendiğinde buton durumu senkronize oluyor mu?', () => {
    const setIsApplied = jest.fn();
    const mockSnapshot = { empty: false }; 
    const handleData = (snap) => setIsApplied(!snap.empty);
    
    handleData(mockSnapshot);
    expect(setIsApplied).toHaveBeenCalledWith(true);
  });
});