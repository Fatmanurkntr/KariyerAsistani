// src/screens/HomeScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { logoutUser } from '../services/auth'; 

const HomeScreen = ({ navigation }: any) => {
    // Mor Renk Kodu (Temadan da alabiliriz ama sabit olsun dersen):
    const PURPLE_COLOR = '#7C3AED';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* --- SAĞ ÜST KÖŞEDEKİ PROFİL İKONU --- */}
            <TouchableOpacity 
                style={styles.profileButton} 
                onPress={() => navigation.navigate('Profile')}
            >
                {/* Çerçevesini ve içini mor yaptık */}
                <View style={[styles.avatarContainer, { borderColor: PURPLE_COLOR }]}>
                    {/* Emoji rengi her cihazda değişmez ama stil verelim */}
                    <Text style={styles.avatarText}>👤</Text> 
                </View>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>🏠 Ana Sayfa</Text>
                <Text style={styles.text}>Tebrikler! Başarıyla giriş yaptın.</Text>
                <Text style={styles.text}>Buraya iş ilanları gelecek.</Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: PURPLE_COLOR }]} // Butonu da mor yaptım uyumlu olsun
                    onPress={() => logoutUser()}
                >
                    <Text style={styles.buttonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff', 
    },
    // --- PROFİL BUTONU STİLLERİ ---
    profileButton: {
        position: 'absolute', 
        top: 20, // Çentikli ekranlarda biraz daha aşağıda durması için
        right: 20, 
        zIndex: 10, 
    },
    avatarContainer: {
        width: 45,
        height: 45,
        backgroundColor: '#F3E8FF', // İkonun arkasına çok açık bir mor ekledim (şık durur)
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, // Çerçeve kalınlığı
        // borderColor: '#7C3AED' (Yukarıda inline verdik)
        elevation: 5, 
        shadowColor: '#7C3AED', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    avatarText: {
        fontSize: 22, 
        // color: '#7C3AED' // Emojilerde renk her zaman işlemez ama dener.
    },
    
    // --- İÇERİK STİLLERİ ---
    content: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    text: { fontSize: 16, color: '#666', marginBottom: 20 },
    button: { 
        // backgroundColor: '#FF3B30', // Eski kırmızı yerine yukarıda mor verdik
        padding: 15, 
        borderRadius: 12, 
        minWidth: 150,
        alignItems: 'center'
    },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default HomeScreen;