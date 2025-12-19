// src/navigation/AppNavigator.tsx

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'; 
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Context & Theme
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Stack Yapıları
import AuthStack from './AuthStack';
import StudentStack from './StudentStack';
import CompanyStack from './CompanyStack'; 

// Ekranlar
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminDetailScreen from '../screens/Admin/AdminDetailScreen'; // Yeni eklediğimiz sayfa
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen'; 

const Stack = createStackNavigator(); 

// 🔥 SİZİN ADMİN MAİLİNİZ
const ADMIN_EMAIL = "sevdegulsahin25@gmail.com";

const AppNavigator = () => {
    const { isAuthenticated, userRole, isLoading } = useAuth();
    const { activeTheme } = useTheme(); 
    const currentUser = auth().currentUser;

    // Yükleme Ekranı
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: activeTheme?.background || '#FFFFFF' }]}>
                <ActivityIndicator size="large" color={activeTheme?.primary || '#7C3AED'} />
            </View>
        );
    }

    // Giriş Yapılmamışsa Login Ekranlarına Gönder
    if (!isAuthenticated) {
        return <AuthStack activeTheme={activeTheme} />;
    }

    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
                cardStyle: { backgroundColor: activeTheme?.background || '#FFFFFF' }
            }}
        >
            {/* 1. ANA AKIŞ (Student veya Company Stack) */}
            <Stack.Screen name="Main">
                {(props) => {
                    // Eğer admin maili ise, admin hem öğrenci arayüzünü görebilir hem de admin paneline gidebilir
                    if (currentUser?.email === ADMIN_EMAIL) {
                        return <StudentStack {...props} activeTheme={activeTheme} />; 
                    }
                    // Normal kullanıcılar rollere göre yönlendirilir
                    return userRole === 'company' 
                        ? <CompanyStack {...props} activeTheme={activeTheme} /> 
                        : <StudentStack {...props} activeTheme={activeTheme} />;
                }}
            </Stack.Screen>

            {/* 2. ADMİN ÖZEL EKRANLARI (Sadece sevdegulsahin25@gmail.com görebilir) */}
            {currentUser?.email === ADMIN_EMAIL && (
                <>
                    <Stack.Screen name="AdminDashboard">
                        {(props) => <AdminDashboardScreen {...props} activeTheme={activeTheme} />}
                    </Stack.Screen>
                    
                    <Stack.Screen name="AdminDetail">
                        {(props) => <AdminDetailScreen {...props} activeTheme={activeTheme} />}
                    </Stack.Screen>
                </>
            )}

            {/* 3. ORTAK EKRANLAR */}
            <Stack.Screen name="ProfileDetail">
                {(props) => <ProfileScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
});

export default AppNavigator;