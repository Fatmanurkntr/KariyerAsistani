import React from 'react';
import { Text, Platform } from 'react-native'; 
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { RouteProp, ParamListBase } from '@react-navigation/native'; 

// SAYFALAR
import FeedScreen from '../screens/Home/FeedScreen';
import SearchScreen from '../screens/search/SearchScreen'; 
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen'; 
import SettingsScreen from '../screens/Auth/Profile/SettingsScreen'; 
import FavoritesScreen from '../screens/Favorites/FavoritesScreen'; 
import ApplicationsScreen from '../screens/Applications/ApplicationsScreen';

import { ThemeProps, ThemeColors } from '../theme/types';
const Stack = createNativeStackNavigator<StudentStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// --- 1. TÜM ROTALARIN TİP TANIMLARI ---
type StudentStackParamList = {
    Dashboard: undefined; 
    Settings: { activeTheme: ThemeColors; currentUser: any; onUpdate?: (newData: any) => void };
    ProfileDetail: { activeTheme: ThemeColors }; 
};

type TabParamList = {
    'Ana Sayfa': undefined;
    'Keşfet': undefined;
    'Başvurularım': undefined;
    'Favorilerim': undefined;
    'Profil': undefined; 
};


// --- BÖLÜM 1: ALT MENÜ (TABS) ---
const BottomTabs: React.FC<ThemeProps> = ({ activeTheme }) => {
    
    const insets = useSafeAreaInsets(); 

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }: { 
                route: RouteProp<TabParamList, keyof TabParamList>;
                navigation: BottomTabNavigationProp<ParamListBase>;
            }) => ({
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
                
                tabBarIcon: ({ focused, color }: { focused: boolean, color: string }) => {
                    let iconName = '';
                    
                    if (route.name === 'Ana Sayfa') iconName = '🏠';
                    else if (route.name === 'Keşfet') iconName = '🧭'; 
                    else if (route.name === 'Başvurularım') iconName = '💼'; 
                    else if (route.name === 'Favorilerim') iconName = '❤️'; 
                    else if (route.name === 'Profil') iconName = '👤'; 

                    return <Text style={{ fontSize: focused ? 26 : 22, color: color }}>{iconName}</Text>;
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

            <Tab.Screen name="Başvurularım">
                {() => <ApplicationsScreen activeTheme={activeTheme} />} 
            </Tab.Screen>
            
            <Tab.Screen name="Favorilerim">
                {() => <FavoritesScreen activeTheme={activeTheme} />}
            </Tab.Screen>

            {/* Profil ekranını props ile doğru iletiyoruz */}
            <Tab.Screen name="Profil">
                {({ route, navigation }) => (
                    <ProfileScreen 
                        activeTheme={activeTheme} 
                        route={route} 
                        navigation={navigation}
                    />
                )}
            </Tab.Screen>

        </Tab.Navigator>
    );
};

// --- BÖLÜM 2: ÖĞRENCİ YIĞINI (STACK) ---
const StudentStack: React.FC<ThemeProps> = ({ activeTheme }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}> 
            
            <Stack.Screen name="Dashboard">
                {() => <BottomTabs activeTheme={activeTheme} />}
            </Stack.Screen>
            
            {/* 👇 KRİTİK DÜZELTME 1: Settings ekranını anonim fonksiyon ile sarmala */}
            <Stack.Screen 
                name="Settings" 
                // component yerine render fonksiyonu kullanıldı
                options={{ 
                    headerShown: true, 
                    title: 'Profili Düzenle',
                    headerStyle: { backgroundColor: activeTheme.background },
                    headerTintColor: activeTheme.text,
                    headerBackTitle: '', 
                }}
            >
                {({ route, navigation }) => (
                    <SettingsScreen 
                        activeTheme={activeTheme}
                        route={route} 
                        navigation={navigation}
                    />
                )}
            </Stack.Screen>
            
            {/* 👇 KRİTİK DÜZELTME 2: ProfileDetail ekranını anonim fonksiyon ile sarmala */}
            <Stack.Screen 
                name="ProfileDetail" 
                // component yerine render fonksiyonu kullanıldı
                options={{ 
                    headerShown: false,
                }} 
            >
                {({ route, navigation }) => (
                    <ProfileScreen 
                        activeTheme={activeTheme}
                        route={route} 
                        navigation={navigation}
                    />
                )}
            </Stack.Screen>
            
        </Stack.Navigator>
    );
};

export default StudentStack;