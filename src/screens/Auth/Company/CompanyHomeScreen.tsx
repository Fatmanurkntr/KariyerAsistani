import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PURPLE_COLOR = '#7C3AED';

const CompanyHomeScreen = ({ navigation }: any) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState('Yukleniyor...');
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser) return;

        // 1. Profil Bilgisini Getir
        const userUnsubscribe = firestore().collection('Users').doc(currentUser.uid).onSnapshot(doc => {
            setCompanyName(doc.data()?.companyName || 'Kurumsal Panel');
        });

        // 2. Is Ilanlari ve Etkinlikleri CANLI DINLE
        const jobUnsubscribe = firestore()
            .collection('JobPostings')
            .where('companyId', '==', currentUser.uid)
            .onSnapshot(jobSnap => {
                const jobs = jobSnap?.docs.map(doc => ({ id: doc.id, dataType: 'job', ...doc.data() })) || [];
                
                firestore().collection('EventPostings')
                    .where('companyId', '==', currentUser.uid)
                    .onSnapshot(eventSnap => {
                        const events = eventSnap?.docs.map(doc => ({ id: doc.id, dataType: 'event', ...doc.data() })) || [];
                        
                        const combined = [...jobs, ...events].sort((a: any, b: any) => 
                            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
                        );
                        setData(combined);
                        setLoading(false);
                    });
            });

        return () => { userUnsubscribe(); jobUnsubscribe(); };
    }, [currentUser]);

    const renderItem = ({ item }: any) => {
        const isJob = item.dataType === 'job';
        
        // Admin Onay Durumu Stilleri
        const getStatusStyle = (status: string) => {
            switch(status) {
                case 'approved': 
                    return { bg: '#DCFCE7', text: '#166534', label: 'ONAYLANDI' };
                case 'rejected': 
                    return { bg: '#FEE2E2', text: '#991B1B', label: 'REDDEDILDI' };
                default: 
                    return { bg: '#FEF3C7', text: '#92400E', label: 'BEKLEMEDE' };
            }
        };

        const statusInfo = getStatusStyle(item.status || 'pending');

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.card}
                onPress={() => navigation.navigate(isJob ? 'CompanyJobDetail' : 'CompanyEventDetail', isJob ? { job: item } : { event: item })}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.badge, { backgroundColor: isJob ? '#F3E8FF' : '#E0F2FE' }]}>
                        <Text style={[styles.badgeText, { color: isJob ? PURPLE_COLOR : '#0369A1' }]}>
                            {isJob ? 'IS ILANI' : 'ETKINLIK'}
                        </Text>
                    </View>
                    
                    {/* ADMIN DURUM ETİKETİ */}
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusInfo.text }]}>
                            {statusInfo.label}
                        </Text>
                    </View>
                </View>

                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.location} - {isJob ? item.type : item.date}</Text>
                
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Görüntülenme</Text>
                        <Text style={styles.statValue}>{item.views || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>{isJob ? 'Başvuru' : 'Katılım'}</Text>
                        <Text style={styles.statValue}>{isJob ? (item.applicationCount || 0) : (item.participantCount || 0)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>HOSGELDINIZ</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                </View>
                {/* PROFIL SAYFASINA YONLENDIRME */}
                <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate('ProfileDetail')}>
                    <Text style={styles.profileInitial}>{companyName.charAt(0)}</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator color={PURPLE_COLOR} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.empty}>Henüz bir paylaşım yok.</Text>}
                />
            )}

            <View style={styles.buttonGroup}>
                <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => navigation.navigate('AddEvent')}>
                    <Text style={styles.secondaryBtnText}>Etkinlik Ekle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={() => navigation.navigate('AddJob')}>
                    <Text style={styles.primaryBtnText}>İlan Ver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    greeting: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1 },
    companyName: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginTop: 2 },
    profileCircle: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#F3E8FF', borderWidth: 2, borderColor: PURPLE_COLOR, justifyContent: 'center', alignItems: 'center' },
    profileInitial: { color: PURPLE_COLOR, fontWeight: 'bold', fontSize: 18 },
    list: { padding: 20, paddingBottom: 100 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '800' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
    itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    itemSub: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    statsRow: { flexDirection: 'row', marginTop: 18, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F9FAFB', gap: 25 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
    statValue: { fontSize: 12, fontWeight: '800', color: '#4B5563' },
    buttonGroup: { position: 'absolute', bottom: 30, flexDirection: 'row', alignSelf: 'center', gap: 12, paddingHorizontal: 20 },
    actionBtn: { height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', minWidth: 150, elevation: 4 },
    primaryBtn: { backgroundColor: PURPLE_COLOR },
    primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    secondaryBtn: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: PURPLE_COLOR },
    secondaryBtnText: { color: PURPLE_COLOR, fontWeight: 'bold', fontSize: 15 },
    empty: { textAlign: 'center', marginTop: 60, color: '#9CA3AF', fontWeight: '500' }
});

export default CompanyHomeScreen;