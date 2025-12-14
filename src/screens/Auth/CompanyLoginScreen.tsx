// src/screens/Auth/CompanyLoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar } from 'react-native';
import CustomButton from '../../components/CustomButton';

// 💡 KURUMSAL TEMA (Primary: Koyu Mavi)
const COMPANY_THEME = {
    background: '#FFFFFF',
    text: '#1F2937',      // Koyu Antrasit
    textSecondary: '#6B7280', // Gri
    primary: '#007AFF',   // Kurumsal Mavi
    surface: '#F3F4F6',   // Çok açık gri zemin
};

const CompanyLoginScreen: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Öğrenci girişine dönmek için
    const goToStudentLogin = () => {
        navigation.goBack(); 
    };

    const handleCompanyLogin = () => {
        setLoading(true);
        console.log('Firma Girişi:', email);
        // İleride buraya Firebase fonksiyonu gelecek
        setTimeout(() => setLoading(false), 2000); 
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COMPANY_THEME.background }]}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <Text style={styles.headerIcon}>🏢</Text>
                <Text style={[styles.title, { color: COMPANY_THEME.text }]}>Kurumsal Portal</Text>
                <Text style={[styles.subtitle, { color: COMPANY_THEME.textSecondary }]}>
                    İlan vermek ve yetenekleri keşfetmek için giriş yapın.
                </Text>
            </View>

            <View style={styles.formContainer}>
                
                {/* E-POSTA */}
                <TextInput
                    style={[styles.input, { backgroundColor: COMPANY_THEME.surface, color: COMPANY_THEME.text }]}
                    placeholder="Şirket E-postası"
                    placeholderTextColor={COMPANY_THEME.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* ŞİFRE */}
                <TextInput
                    style={[styles.input, { backgroundColor: COMPANY_THEME.surface, color: COMPANY_THEME.text }]}
                    placeholder="Şifre"
                    placeholderTextColor={COMPANY_THEME.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* GİRİŞ BUTONU (Mavi) */}
                <CustomButton
                    title="Firma Girişi Yap"
                    onPress={handleCompanyLogin}
                    isLoading={loading}
                    buttonStyle={{ backgroundColor: COMPANY_THEME.primary, marginTop: 10 }}
                    textStyle={{ color: '#FFF', fontWeight: 'bold' }}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={{ color: COMPANY_THEME.primary, fontWeight: '600' }}>Şifremi Unuttum</Text>
                </TouchableOpacity>
            </View>

            {/* ALT KISIM */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={goToStudentLogin} style={styles.switchButton}>
                    <Text style={{ fontSize: 16 }}>🎓</Text>
                    <Text style={[styles.footerText, { color: COMPANY_THEME.textSecondary, marginLeft: 8 }]}>
                        Öğrenci Girişine Dön
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 25, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40, marginTop: -30 },
    headerIcon: { fontSize: 60, marginBottom: 15 },
    title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
    subtitle: { fontSize: 15, marginTop: 8, textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 },
    formContainer: { width: '100%', marginBottom: 30 },
    input: { height: 55, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    forgotPassword: { alignItems: 'center', marginTop: 20 },
    footer: { alignItems: 'center', paddingBottom: 20 },
    switchButton: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 20, backgroundColor: '#F3F4F6' },
    footerText: { fontSize: 14, fontWeight: '500' },
});

export default CompanyLoginScreen;