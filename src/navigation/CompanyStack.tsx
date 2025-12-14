import React from 'react';
// Correct import for native stack navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { Text, View, StyleSheet, Button } from 'react-native';

import { useAuth } from '../context/AuthContext'; 
import { ThemeProps } from '../theme/types';

// Stack variable initialized with the correct native stack creator
const Stack = createNativeStackNavigator();

// 🚨 Yer Tutucu Firma Ana Sayfası (Firma Yönetim Paneli)
const CompanyHomeScreen: React.FC<ThemeProps> = ({ activeTheme }) => {
    const { logout } = useAuth();
    return (
        <View style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <Text style={[styles.header, { color: activeTheme.primary }]}>FİRMA YÖNETİM PANELİ</Text>
            <Text style={{ color: activeTheme.textSecondary, textAlign: 'center' }}>
                Burada ilan yayınlama, başvuruları yönetme vb. yer alacak.
            </Text>
            <View style={{ marginTop: 20 }}>
                <Button 
                    title="Çıkış Yap" 
                    onPress={logout} 
                    color={activeTheme.primary} 
                />
            </View>
        </View>
    );
};

// Firma Navigasyon Yığını (Stack)
const CompanyStack: React.FC<ThemeProps> = ({ activeTheme }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CompanyHome">
                {/* Home screen is wrapped to pass activeTheme prop */}
                {() => <CompanyHomeScreen activeTheme={activeTheme} />}
            </Stack.Screen>
            {/* Diğer Firma ekranları buraya eklenecek (Örn: CreateJob, ViewApplications) */}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});

export default CompanyStack;