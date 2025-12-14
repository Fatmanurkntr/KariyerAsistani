import React from 'react';
// createStackNavigator import'u artık yok, bu sayede hatalar çözüldü
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// 👇 Gerekli Context Import'ları
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 

// 👇 Rol Tabanlı Stack Import'ları
import AuthStack from './AuthStack'; // Login/Register
import StudentStack from './StudentStack'; // Öğrenci ana akışı
import CompanyStack from './CompanyStack'; // Firma ana akışı

const AppNavigator = () => {
    // Auth Context'ten global durumu çekiyoruz
    const { isAuthenticated, userRole, isLoading } = useAuth();
    // Tema Context'ten aktif temayı çekiyoruz
    const { activeTheme } = useTheme(); 

    // ----------------------------------------------------------------------
    // 1. YÜKLEME EKRANI (Splash Screen) Kontrolü
    // ----------------------------------------------------------------------
    if (isLoading) {
        // Uygulama başlangıcında AsyncStorage'den veri çekilirken gösterilir.
        return (
            <View style={[styles.loadingContainer, { backgroundColor: activeTheme.background }]}>
                <ActivityIndicator size="large" color={activeTheme.primary} />
            </View>
        );
    }

    // ----------------------------------------------------------------------
    // 2. OTURUM AÇMA Kontrolü (Role göre yönlendirme mantığı)
    // ----------------------------------------------------------------------
    
    // Oturum açılmamışsa, kullanıcıyı AuthStack'e yönlendir.
    if (!isAuthenticated) {
        return <AuthStack activeTheme={activeTheme} />;
    }

    // Oturum açılmışsa, role göre doğru Stack'i belirle.
    let ComponentToRender: React.ComponentType<any>;
    
    if (userRole === 'student') {
        ComponentToRender = StudentStack;
    } else if (userRole === 'company') {
        ComponentToRender = CompanyStack;
    } else {
        // Güvenlik: Role sahip değilse veya rol bilinmiyorsa tekrar Login'e gönder.
        return <AuthStack activeTheme={activeTheme} />;
    }

    // ----------------------------------------------------------------------
    // 3. ROL TABANLI EKRANIN GÖSTERİLMESİ
    // ----------------------------------------------------------------------
    // Belirlenen Stack'i (Student veya Company) aktif temayı geçirerek render et.
    return <ComponentToRender activeTheme={activeTheme} />;
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppNavigator;