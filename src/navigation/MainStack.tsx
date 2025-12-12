// src/navigation/MainStack.tsx

import React from 'react';
import { Text, Platform } from 'react-native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

// SAYFALAR
import FeedScreen from '../screens/Home/FeedScreen';
import SearchScreen from '../screens/search/SearchScreen'; 
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen'; 
import SettingsScreen from '../screens/Auth/Profile/SettingsScreen'; 
import FavoritesScreen from '../screens/Favorites/FavoritesScreen'; 
import ApplicationsScreen from '../screens/Applications/ApplicationsScreen'; // ✅ YENİ EKLENDİ

import { ThemeProps } from '../theme/types';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- BÖLÜM 1: ALT MENÜ (TABS) ---
const BottomTabs: React.FC<ThemeProps> = ({ activeTheme }) => {
  
  const insets = useSafeAreaInsets(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: activeTheme.surface,
          borderTopColor: 'rgba(0,0,0,0.1)',
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10), 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: activeTheme.primary,
        tabBarInactiveTintColor: activeTheme.textSecondary,
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          
          if (route.name === 'Ana Sayfa') iconName = '🏠';
          else if (route.name === 'Keşfet') iconName = '🧭'; 
          else if (route.name === 'Başvurularım') iconName = '💼'; 
          else if (route.name === 'Favorilerim') iconName = '❤️'; 

          return <Text style={{ fontSize: focused ? 26 : 22 }}>{iconName}</Text>;
        },
        tabBarLabelStyle: { 
            fontSize: 10, 
            fontWeight: '600',
            marginBottom: insets.bottom > 0 ? 0 : 5 
        }
      })}
    >
      <Tab.Screen name="Ana Sayfa">
        {() => <FeedScreen activeTheme={activeTheme} />}
      </Tab.Screen>
      
      <Tab.Screen name="Keşfet">
        {() => <SearchScreen activeTheme={activeTheme} />}
      </Tab.Screen>

      {/* ✅ ARTIK DOĞRU SAYFAYA GİDİYOR */}
      <Tab.Screen name="Başvurularım">
        {() => <ApplicationsScreen activeTheme={activeTheme} />} 
      </Tab.Screen>
      
      <Tab.Screen name="Favorilerim">
        {() => <FavoritesScreen activeTheme={activeTheme} />}
      </Tab.Screen>

    </Tab.Navigator>
  );
};

// --- BÖLÜM 2: ANA YIĞIN (STACK) ---
const MainStack: React.FC<ThemeProps> = ({ activeTheme }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
        {() => <BottomTabs activeTheme={activeTheme} />}
      </Stack.Screen>
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        initialParams={{ activeTheme }} 
        options={{ 
            title: 'Profili Düzenle',
            headerStyle: { backgroundColor: activeTheme.background },
            headerTintColor: activeTheme.text,
            headerBackTitle: '', 
        }} 
      />
      
      <Stack.Screen 
        name="ProfileDetail" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default MainStack;