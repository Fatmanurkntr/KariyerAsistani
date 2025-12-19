// src/screens/Auth/Profile/ProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';

const ProfileScreen = ({ route, navigation }: any) => {
    const activeTheme = route.params?.activeTheme || { 
        background: '#FFFFFF', 
        text: '#111827', 
        primary: '#7C3AED', 
        surface: '#F9FAFB', 
        textSecondary: '#6B7280' 
    };
    
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [counts, setCounts] = useState({ totalApps: 0, events: 0 });
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const unsubUser = firestore().collection('Users').doc(currentUser.uid).onSnapshot(doc => {
            if (doc.exists) setUserData(doc.data());
        });

        const unsubApps = firestore()
            .collection('Applications')
            .where('userId', '==', currentUser.uid)
            .onSnapshot(snap => {
                const apps = snap?.docs.map(doc => doc.data()) || [];
                
                setCounts({
                    // Başvuru kutusunda her şeyin toplamını gösteriyoruz
                    totalApps: apps.length,
                    // Etkinlik kutusunda sadece etkinlikleri sayıyoruz
                    events: apps.filter(a => a.type === 'event').length
                });
                setLoading(false);
            });

        return () => { unsubUser(); unsubApps(); };
    }, [currentUser]);

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={activeTheme.primary} /></View>;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: activeTheme.text }]}>Profilim</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings', { currentUser: userData, activeTheme })}>
                        <Feather name="settings" size={24} color={activeTheme.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileInfo}>
                    <View style={[styles.avatar, { borderColor: activeTheme.primary }]}>
                        <Text style={[styles.avatarTxt, { color: activeTheme.primary }]}>
                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={[styles.name, { color: activeTheme.text }]}>{userData?.name || 'Kullanıcı'}</Text>
                    <Text style={[styles.subText, { color: activeTheme.textSecondary }]}>
                        {userData?.school} - {userData?.department}
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    {/* BAŞVURU KUTUSU: Tıklayınca HER ŞEYİ (All) gösteren parametre ile gider */}
                    <TouchableOpacity 
                        style={[styles.statBox, { backgroundColor: activeTheme.surface }]}
                        onPress={() => navigation.navigate('Dashboard', { 
                            screen: 'Başvurularım',
                            params: { filterType: 'all' } 
                        })} 
                    >
                        <Text style={[styles.statNum, { color: activeTheme.primary }]}>{counts.totalApps}</Text>
                        <Text style={styles.statLabel}>Başvuru</Text>
                    </TouchableOpacity>

                    {/* ETKİNLİK KUTUSU: Tıklayınca SADECE ETKİNLİKLERİ gösteren parametre ile gider */}
                    <TouchableOpacity 
                        style={[styles.statBox, { backgroundColor: activeTheme.surface }]}
                        onPress={() => navigation.navigate('Dashboard', { 
                            screen: 'Başvurularım',
                            params: { filterType: 'event' } 
                        })} 
                    >
                        <Text style={[styles.statNum, { color: activeTheme.primary }]}>{counts.events}</Text>
                        <Text style={styles.statLabel}>Etkinlik</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Hakkımda</Text>
                    <View style={[styles.bioBox, { backgroundColor: activeTheme.surface }]}>
                        <Text style={[styles.bioText, { color: activeTheme.textSecondary }]}>
                            {userData?.bio || "Henüz bir biyografi eklenmemiş."}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity 
                        style={[styles.menuItem, { backgroundColor: activeTheme.surface, marginBottom: 12 }]}
                        onPress={() => navigation.navigate('Dashboard', { screen: 'Favorilerim' })} 
                    >
                        <Feather name="heart" size={20} color="#EF4444" />
                        <Text style={[styles.menuText, { color: activeTheme.text }]}>Favorilerim</Text>
                        <Feather name="chevron-right" size={18} color={activeTheme.textSecondary} />
                    </TouchableOpacity>

                    {currentUser?.email === "sevdegulsahin25@gmail.com" && (
                        <TouchableOpacity 
                            style={[styles.menuItem, { backgroundColor: activeTheme.primary + '15', borderWidth: 1, borderColor: activeTheme.primary }]}
                            onPress={() => navigation.navigate('AdminDashboard')} 
                        >
                            <Feather name="shield" size={20} color={activeTheme.primary} />
                            <Text style={[styles.menuText, { color: activeTheme.primary }]}>Yönetici Paneli</Text>
                            <Feather name="chevron-right" size={18} color={activeTheme.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold' },
    profileInfo: { alignItems: 'center', marginBottom: 20 },
    avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    avatarTxt: { fontSize: 32, fontWeight: 'bold' },
    name: { fontSize: 22, fontWeight: 'bold' },
    subText: { fontSize: 13, marginTop: 4, fontWeight: '500' },
    statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 15 },
    statBox: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'center' },
    statNum: { fontSize: 24, fontWeight: 'bold' },
    statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginTop: 4 },
    section: { marginTop: 30, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    bioBox: { padding: 18, borderRadius: 16 },
    bioText: { fontSize: 14, lineHeight: 22 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20 },
    menuText: { flex: 1, marginLeft: 15, fontWeight: '600' }
});

export default ProfileScreen;