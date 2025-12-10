// src/navigation/MainStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// MEVCUT SAYFALAR
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen';
import SettingsScreen from '../screens/Auth/Profile/SettingsScreen'; 

import { ThemeProps } from '../theme/types';

const Stack = createNativeStackNavigator();

const MainStack: React.FC<ThemeProps> = ({ activeTheme }) => {
  return (
    <Stack.Navigator>
      
      {/* ANA SAYFA */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ activeTheme }} 
        options={{ headerShown: false }} 
      />
      
      {/* PROFİL (VİTRİN) SAYFASI */}
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        initialParams={{ activeTheme }} 
        options={{ headerShown: false }} 
      />

      {/* AYARLAR SAYFASI (DÜZELTİLDİ ✅) */}
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        initialParams={{ activeTheme }} 
        options={{ 
            title: 'Profili Düzenle', 
            headerStyle: { backgroundColor: activeTheme.background },
            headerTintColor: activeTheme.text,
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitle: '', // DÜZELTME: Geri yazısını kaldırmak için boş tırnak koyduk
        }} 
      />

    </Stack.Navigator>
  );
};

export default MainStack;