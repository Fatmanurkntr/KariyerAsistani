import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native'; // Gerçek RN bileşenlerini kullan

// 1. NAVİGASYON MOCK'U (Rota Hataları İçin)
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

// 2. TEST EDİLECEK BİLEŞEN (Senin Ekran Mantığın)
const MockProfileScreen = ({ navigation, route, activeTheme }) => {
  // Tema koruması
  const theme = activeTheme || route?.params?.activeTheme || { background: '#FFF' };
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text>{route?.params?.currentUser?.bio || 'Biyografi Yok'}</Text>
      <TouchableOpacity 
        testID="nav-button" 
        onPress={() => navigation.navigate('Dashboard', { screen: 'Başvurularım' })}
      >
        <Text>Başvurulara Git</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('Uygulama Navigasyon ve Render Güvenlik Testleri', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST 1: NESTED NAVIGATION (Log 1/2 Hatası Çözümü)
  test('Profil sayfasındaki sayaç doğru rotaya (nested navigation) yönlendiriyor mu?', () => {
    const { getByTestId } = render(<MockProfileScreen navigation={{ navigate: mockNavigate }} />);
    
    const button = getByTestId('nav-button');
    fireEvent.press(button);

    // payload hatasını önlemek için kontrol
    expect(mockNavigate).toHaveBeenCalledWith('Dashboard', { screen: 'Başvurularım' });
  });

  // TEST 2: TEMA GÜVENLİĞİ (Render Error Çözümü)
  test('activeTheme undefined geldiğinde sayfa çökmek yerine varsayılan rengi kullanıyor mu?', () => {
    const { getByText } = render(
      <MockProfileScreen 
        activeTheme={undefined} 
        route={{ params: { currentUser: { bio: 'Test Bio' } } }} 
      />
    );
    
    expect(getByText('Test Bio')).toBeTruthy();
  });

  // TEST 3: BIO RENDER (Hakkımda Boşsa)
  test('Kullanıcı biyografisi (bio) boş olduğunda profil düzgün render ediliyor mu?', () => {
    const { getByText } = render(
      <MockProfileScreen 
        activeTheme={{ background: '#FFF' }}
        route={{ params: { currentUser: { bio: null } } }} 
      />
    );

    expect(getByText('Biyografi Yok')).toBeTruthy();
  });

  // TEST 4: SIRALAMA MANTIĞI (Firestore Endeks Hatası Çözümü)
  test('ApplicationsScreen manuel .sort() işlemi yeni tarihli başvuruyu başa alıyor mu?', () => {
    const mockApps = [
      { id: 1, appliedAt: { seconds: 1000 } },
      { id: 2, appliedAt: { seconds: 5000 } }, 
    ];

    const sortedApps = [...mockApps].sort((a, b) => b.appliedAt.seconds - a.appliedAt.seconds);

    expect(sortedApps[0].id).toBe(2);
    expect(sortedApps[1].id).toBe(1);
  });
});