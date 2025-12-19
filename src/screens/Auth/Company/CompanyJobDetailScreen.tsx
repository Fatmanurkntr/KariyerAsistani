import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, StatusBar } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PURPLE_COLOR = '#7C3AED';

const CompanyJobDetailScreen = ({ route, navigation }: any) => {
    const { job } = route.params;

    const handleDelete = () => {
        Alert.alert("ILANI KALDIR", "Bu ilani kalici olarak silmek istediginize emin misiniz?", [
            { text: "VAZGEÇ", style: "cancel" },
            { 
                text: "SIL", 
                style: 'destructive', 
                onPress: async () => {
                    await firestore().collection('JobPostings').doc(job.id).delete();
                    navigation.goBack();
                } 
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Geri</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ILAN YONETIMI</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditJob', { job })}>
                    <Text style={styles.editText}>Duzenle</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.mainCard}>
                    <Text style={styles.title}>{job.title}</Text>
                    <View style={styles.row}>
                        <View style={styles.badge}><Text style={styles.badgeText}>{job.location}</Text></View>
                        <View style={styles.badge}><Text style={styles.badgeText}>{job.type}</Text></View>
                    </View>
                    <Text style={styles.date}>Olusturulma: {job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString('tr-TR') : ''}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>{job.views || 0}</Text>
                        <Text style={styles.statLab}>Goruntulenme</Text>
                    </View>
                    <View style={[styles.statBox, {backgroundColor: '#ECFDF5'}]}>
                        <Text style={[styles.statVal, {color: '#059669'}]}>{job.applicationCount || 0}</Text>
                        <Text style={styles.statLab}>Basvuru Tiklamasi</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>IS TANIMI</Text>
                <Text style={styles.bodyText}>{job.description}</Text>

                <Text style={styles.sectionTitle}>ARANAN NITELIKLER</Text>
                <Text style={styles.bodyText}>{job.requirements || 'Belirtilmedi'}</Text>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>Ilani Yayindan Kaldir</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    backText: { color: '#666', fontWeight: '600' },
    editText: { color: PURPLE_COLOR, fontWeight: 'bold' },
    headerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
    content: { padding: 25 },
    mainCard: { padding: 20, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    row: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 12, color: '#666', fontWeight: '600' },
    date: { fontSize: 12, color: '#999' },
    statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 25 },
    statBox: { flex: 1, backgroundColor: '#F3E8FF', padding: 15, borderRadius: 12, alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: 'bold', color: PURPLE_COLOR },
    statLab: { fontSize: 11, color: '#666', marginTop: 4 },
    sectionTitle: { fontSize: 12, fontWeight: '800', color: '#999', marginTop: 20, marginBottom: 8, letterSpacing: 0.5 },
    bodyText: { fontSize: 15, lineHeight: 22, color: '#444' },
    deleteButton: { marginTop: 40, backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
    deleteButtonText: { color: '#DC2626', fontWeight: 'bold' }
});

export default CompanyJobDetailScreen;