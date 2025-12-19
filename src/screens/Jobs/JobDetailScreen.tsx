import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, TouchableOpacity, 
    SafeAreaView, StatusBar, Alert, ActivityIndicator 
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const JobDetailScreen = ({ route, navigation, activeTheme: propsTheme }: any) => {
    // 🔥 HATA ÇÖZÜMÜ: activeTheme undefined gelirse uygulamanın çökmesini engeller
    const activeTheme = propsTheme || route.params?.activeTheme || {
        background: '#FFFFFF', text: '#111827', textSecondary: '#6B7280', primary: '#7C3AED', surface: '#F9FAFB'
    };

    const { item } = route.params;
    const job = item;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser) return;

        // 1. FAVORİ DURUMUNU ANLIK DİNLE
        const unsubFav = firestore()
            .collection('Favorites')
            .where('userId', '==', currentUser.uid)
            .where('jobId', '==', job.id)
            .onSnapshot(snap => {
                setIsFavorite(!snap?.empty);
            });

        // 2. BAŞVURU DURUMUNU ANLIK DİNLE
        const unsubApp = firestore()
            .collection('Applications')
            .where('userId', '==', currentUser.uid)
            .where('jobId', '==', job.id)
            .onSnapshot(snap => {
                setIsApplied(!snap?.empty);
                setLoading(false);
            });

        return () => {
            unsubFav();
            unsubApp();
        };
    }, [job.id]);

    const toggleFavorite = async () => {
        try {
            const favRef = firestore().collection('Favorites');
            const query = await favRef
                .where('userId', '==', currentUser?.uid)
                .where('jobId', '==', job.id)
                .get();

            if (query.empty) {
                await favRef.add({
                    userId: currentUser?.uid,
                    jobId: job.id,
                    jobData: job,
                    type: 'job',
                    addedAt: firestore.FieldValue.serverTimestamp()
                });
            } else {
                const batch = firestore().batch();
                query.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }
        } catch (error) {
            Alert.alert("Hata", "Favori işlemi sırasında bir sorun oluştu.");
        }
    };

    const handleApply = async () => {
        if (isApplied) return;

        Alert.alert(
            "Başvuru Onayı", 
            "Bu ilana başvurmak istediğinizden emin misiniz? Başvurunuz şirket paneline anında eklenecektir.", 
            [
                { text: "Vazgeç", style: "cancel" },
                { text: "Evet, Başvur", onPress: async () => {
                    try {
                        const batch = firestore().batch();
                        const appRef = firestore().collection('Applications').doc();
                        const jobRef = firestore().collection('JobPostings').doc(job.id);

                        batch.set(appRef, {
                            userId: currentUser?.uid,
                            jobId: job.id,
                            jobTitle: job.title,
                            companyName: job.companyName || job.company || 'Kurumsal Firma',
                            appliedAt: firestore.FieldValue.serverTimestamp(),
                            status: 'Beklemede',
                            type: 'job',
                            jobData: job
                        });

                        batch.update(jobRef, {
                            applicationCount: firestore.FieldValue.increment(1)
                        });

                        await batch.commit();
                        Alert.alert("Başarılı", "Başvurunuz profilinize kaydedildi!");
                    } catch (error) {
                        Alert.alert("Hata", "İşlem başarısız oldu.");
                    }
                }}
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: activeTheme.background }]}>
                <ActivityIndicator color={activeTheme.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="chevron-left" size={28} color={activeTheme.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
                    <Feather 
                        name="heart" 
                        size={26} 
                        color={isFavorite ? "#EF4444" : activeTheme.text} 
                        fill={isFavorite ? "#EF4444" : "transparent"} 
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.headerCard, { backgroundColor: activeTheme.surface }]}>
                    <View style={[styles.iconBox, { backgroundColor: activeTheme.primary + '15' }]}>
                        <Feather name="briefcase" size={32} color={activeTheme.primary} />
                    </View>
                    <Text style={[styles.title, { color: activeTheme.text }]}>{job.title}</Text>
                    <Text style={[styles.company, { color: activeTheme.textSecondary }]}>{job.companyName || job.company}</Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>İş Hakkında</Text>
                    <Text style={[styles.description, { color: activeTheme.textSecondary }]}>
                        {job.description || "Bu ilan için detaylı açıklama bulunmuyor."}
                    </Text>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: activeTheme.background, borderTopColor: activeTheme.surface }]}>
                <TouchableOpacity 
                    disabled={isApplied}
                    style={[
                        styles.applyButton, 
                        { backgroundColor: isApplied ? "#10B981" : activeTheme.primary }
                    ]} 
                    onPress={handleApply}
                >
                    <Feather 
                        name={isApplied ? "check-circle" : "send"} 
                        size={20} 
                        color="#FFF" 
                        style={{ marginRight: 10 }} 
                    />
                    <Text style={styles.applyButtonText}>
                        {isApplied ? "Başvuruldu" : "Hemen Başvur"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
    backBtn: { padding: 8 },
    favBtn: { padding: 8 },
    scrollContent: { padding: 20 },
    headerCard: { padding: 30, borderRadius: 32, alignItems: 'center', marginBottom: 25 },
    iconBox: { width: 70, height: 70, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    company: { fontSize: 16, marginTop: 5, fontWeight: '500' },
    infoSection: { marginBottom: 120 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    description: { fontSize: 15, lineHeight: 24 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
    applyButton: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4 },
    applyButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default JobDetailScreen;