// src/navigation/AuthStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Sayfaları içe aktarıyoruz
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen'; 
import CompanyLoginScreen from '../screens/Auth/CompanyLoginScreen'; // 👈 YENİ IMPORT

// Tipleri içe aktarıyoruz
import { ThemeProps } from '../theme/types'; 


const Stack = createNativeStackNavigator();

const AuthStack: React.FC<ThemeProps> = ({ activeTheme }) => {
  return (
    <Stack.Navigator>
      
      {/* 1. GİRİŞ EKRANI */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        initialParams={{ activeTheme }} 
        options={{ 
          headerShown: false, 
          navigationBarColor: activeTheme.background 
        }} 
      />

      {/* 2. KAYIT EKRANI */}
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        initialParams={{ activeTheme }} 
        options={{ 
          headerShown: false, 
          navigationBarColor: activeTheme.background 
        }} 
      />

      {/* 👇 3. YENİ EKLENEN FİRMA GİRİŞ EKRANI (Hata buradan kaynaklanıyordu) */}
      <Stack.Screen 
        name="CompanyLogin" 
        component={CompanyLoginScreen} 
        initialParams={{ activeTheme }} // Temayı bu ekrana da geçirmek faydalı olabilir
        options={{ 
          headerShown: false, 
          navigationBarColor: activeTheme.background 
        }} 
      />

    </Stack.Navigator>
  );
};

export default AuthStack;