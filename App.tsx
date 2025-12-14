import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Not: Firebase kütüphanesini burada artık çağırmıyoruz, AuthContext içinde çağırılıyor

// 👇 YENİ CONTEXT PROVIDER'LARI İÇE AKTAR
import { AuthProvider } from './src/context/AuthContext'; 
import { ThemeProvider } from './src/context/ThemeContext'; 

// 👇 ANA NAVİGATÖRÜ İÇE AKTAR
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    return (
        <SafeAreaProvider>
            {/* 1. ThemeProvider dışta olmalı, çünkü AppNavigator useTheme() kullanır. */}
            <ThemeProvider> 
                {/* 2. AuthProvider hemen içinde olmalı, çünkü AppNavigator useAuth() kullanır. */}
                <AuthProvider>
                    {/* 3. NavigationContainer en içte olmalı, navigasyonu başlatır. */}
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
};

export default App;