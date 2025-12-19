import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';

const AdminDetailScreen = ({ route, navigation, activeTheme: propsTheme }: any) => {
    // 🛡️ GÜVENLİK: Parametre yoksa sayfayı çökertme, geri gönder
    const item = route.params?.item;
    const activeTheme = propsTheme || { background: '#FFFFFF', text: '#111827', textSecondary: '#6B7280', primary: '#7C3AED', surface: '#F9FAFB' };

    if (!item) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Veri yüklenemedi.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{color: 'blue', marginTop: 10}}>Geri Dön</Text></TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleUpdateStatus = async (newStatus: 'approved' | 'rejected') => {
        const collectionName = item.dataType === 'job' || item.type === 'job' ? 'JobPostings' : 'EventPostings';
        try {
            await firestore().collection(collectionName).doc(item.id).update({
                status: newStatus,
                updatedAt: firestore.FieldValue.serverTimestamp()
            });
            Alert.alert("Başarılı", "Durum güncellendi.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Hata", "İşlem başarısız.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={28} color={activeTheme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: activeTheme.text }]}>İlan İnceleme</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.headerCard, { backgroundColor: activeTheme.surface }]}>
                    <View style={[styles.iconBox, { backgroundColor: activeTheme.primary + '15' }]}>
                        <Feather name={item.dataType === 'job' ? "briefcase" : "calendar"} size={32} color={activeTheme.primary} />
                    </View>
                    <Text style={[styles.title, { color: activeTheme.text }]}>{item.title}</Text>
                    <Text style={[styles.company, { color: activeTheme.textSecondary }]}>{item.companyName || 'Kurumsal Firma'}</Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Açıklama</Text>
                    <Text style={[styles.description, { color: activeTheme.textSecondary }]}>{item.description}</Text>
                    
                    {item.dataType === 'event' && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Etkinlik Bilgileri</Text>
                            <View style={styles.detailRow}>
                                <Feather name="link" size={14} color={activeTheme.primary} />
                                <Text style={[styles.description, { color: '#3B82F6', marginLeft: 8 }]}>{item.eventLink || 'Link yok'}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Feather name="map-pin" size={14} color={activeTheme.primary} />
                                <Text style={[styles.description, { marginLeft: 8 }]}>{item.location || 'Konum yok'}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* BUTONLAR: Sadece beklemedeyse göster */}
            {(!item.status || item.status === 'pending') && (
                <View style={[styles.footer, { backgroundColor: activeTheme.background }]}>
                    <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={() => handleUpdateStatus('rejected')}>
                        <Text style={[styles.btnText, { color: '#EF4444' }]}>Reddet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: activeTheme.primary }]} onPress={() => handleUpdateStatus('approved')}>
                        <Text style={[styles.btnText, { color: '#FFF' }]}>Onayla</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: 'bold' },
    scrollContent: { padding: 20 },
    headerCard: { padding: 30, borderRadius: 32, alignItems: 'center', marginBottom: 25 },
    iconBox: { width: 70, height: 70, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    company: { fontSize: 16, marginTop: 5, fontWeight: '500' },
    infoSection: { paddingBottom: 100 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 15 },
    description: { fontSize: 15, lineHeight: 22 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    footer: { position: 'absolute', bottom: 0, flexDirection: 'row', padding: 20, gap: 15, width: '100%', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    btn: { flex: 1, height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    rejectBtn: { backgroundColor: '#FEE2E2' },
    btnText: { fontWeight: 'bold', fontSize: 16 }
});

export default AdminDetailScreen;