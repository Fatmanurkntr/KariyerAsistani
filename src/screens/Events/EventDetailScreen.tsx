import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, TouchableOpacity, 
    SafeAreaView, StatusBar, Alert, ActivityIndicator, Linking 
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EventDetailScreen = ({ route, navigation, activeTheme: propsTheme }: any) => {
    // Tema ve Veri güvenliği
    const activeTheme = propsTheme || route.params?.activeTheme || {
        background: '#FFFFFF', text: '#111827', textSecondary: '#6B7280', primary: '#7C3AED', surface: '#F9FAFB'
    };

    const item = route.params?.item || route.params?.job; 
    const [isFavorite, setIsFavorite] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser || !item?.id) {
            setLoading(false);
            return;
        }

        // Favori Durumu Dinleme
        const unsubFav = firestore()
            .collection('Favorites')
            .where('userId', '==', currentUser.uid)
            .where('jobId', '==', item.id)
            .onSnapshot(snap => setIsFavorite(!snap?.empty));

        // Katılım (Başvuru) Durumu Dinleme
        const unsubJoin = firestore()
            .collection('Applications')
            .where('userId', '==', currentUser.uid)
            .where('jobId', '==', item.id)
            .onSnapshot(snap => {
                setIsJoined(!snap?.empty);
                setLoading(false); 
            });

        return () => { unsubFav(); unsubJoin(); };
    }, [item?.id]);

    // 🔥 FAVORİLEME FONKSİYONU
    const toggleFavorite = async () => {
        try {
            const favRef = firestore().collection('Favorites');
            const query = await favRef
                .where('userId', '==', currentUser?.uid)
                .where('jobId', '==', item.id)
                .get();

            if (query.empty) {
                await favRef.add({
                    userId: currentUser?.uid,
                    jobId: item.id,
                    jobData: item,
                    type: 'event', // Profilde ayırt etmek için
                    addedAt: firestore.FieldValue.serverTimestamp()
                });
            } else {
                const batch = firestore().batch();
                query.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }
        } catch (error) {
            Alert.alert("Hata", "Favori işlemi başarısız.");
        }
    };

    // 🔥 KATILIM (BAŞVURU) FONKSİYONU
    const handleJoinEvent = async () => {
        if (isJoined) return;

        Alert.alert(
            "Etkinliğe Katıl", 
            "Bu etkinliğe katılmak istiyor musunuz?", 
            [
                { text: "Vazgeç", style: "cancel" },
                { text: "Evet, Katıl", onPress: async () => {
                    try {
                        await firestore().collection('Applications').add({
                            userId: currentUser?.uid,
                            jobId: item.id,
                            jobTitle: item.title,
                            companyName: item.companyName || 'Kurumsal',
                            appliedAt: firestore.FieldValue.serverTimestamp(),
                            status: 'Katıldı',
                            type: 'event', // Profildeki "events" sayacını artıracak anahtar
                            jobData: item
                        });
                        Alert.alert("Başarılı", "Etkinlik listenize eklendi!");
                    } catch (error) {
                        Alert.alert("Hata", "İşlem başarısız.");
                    }
                }}
            ]
        );
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color={activeTheme.primary} /></View>;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={28} color={activeTheme.text} />
                </TouchableOpacity>
                {/* 🔥 DÜZELTİLDİ: Favorileme Tıklanabilir Yapıldı */}
                <TouchableOpacity onPress={toggleFavorite}>
                    <Feather 
                        name="heart" 
                        size={26} 
                        color={isFavorite ? "#EF4444" : activeTheme.text} 
                        fill={isFavorite ? "#EF4444" : "transparent"}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.headerCard, { backgroundColor: activeTheme.surface }]}>
                    <View style={[styles.iconBox, { backgroundColor: activeTheme.primary + '15' }]}>
                        <Feather name="calendar" size={32} color={activeTheme.primary} />
                    </View>
                    <Text style={[styles.title, { color: activeTheme.text }]}>{item?.title}</Text>
                    <Text style={[styles.company, { color: activeTheme.textSecondary }]}>{item?.companyName}</Text>
                    <View style={styles.locationRow}>
                        <Feather name="map-pin" size={14} color={activeTheme.primary} />
                        <Text style={[styles.locationText, { color: activeTheme.textSecondary }]}>{item?.location}</Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Etkinlik Hakkında</Text>
                    <Text style={[styles.description, { color: activeTheme.textSecondary }]}>{item?.description}</Text>
                </View>
            </ScrollView>

            {/* 🔥 ALT BUTON: Katıl ve Linke Git */}
            <View style={[styles.footer, { backgroundColor: activeTheme.background }]}>
                <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: isJoined ? "#10B981" : activeTheme.primary }]} 
                    onPress={handleJoinEvent}
                    disabled={isJoined}
                >
                    <Feather name={isJoined ? "check" : "user-plus"} size={20} color="#FFF" style={{marginRight: 8}} />
                    <Text style={styles.btnTxt}>{isJoined ? "Katıldın" : "Etkinliğe Katıl"}</Text>
                </TouchableOpacity>
                
                {item?.eventLink && (
                    <TouchableOpacity 
                        style={[styles.linkBtn, { borderColor: activeTheme.primary }]} 
                        onPress={() => Linking.openURL(item.eventLink)}
                    >
                        <Feather name="external-link" size={18} color={activeTheme.primary} />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    scrollContent: { padding: 20 },
    headerCard: { padding: 30, borderRadius: 32, alignItems: 'center', marginBottom: 25 },
    iconBox: { width: 70, height: 70, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    company: { fontSize: 16, marginTop: 5, fontWeight: '500' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 5 },
    locationText: { fontWeight: '600' },
    infoSection: { marginBottom: 120 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    description: { fontSize: 15, lineHeight: 24 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    actionBtn: { flex: 1, height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    linkBtn: { width: 60, height: 60, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    btnTxt: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default EventDetailScreen;