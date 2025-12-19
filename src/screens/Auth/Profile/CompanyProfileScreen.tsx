import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PURPLE_COLOR = '#7C3AED';

const CompanyProfileScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Firma Bilgileri
    const [profileData, setProfileData] = useState({
        companyName: '',
        industry: '',
        website: '',
        about: '',
        location: ''
    });

    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser) return;
        
        // Verileri getir
        const unsubscribe = firestore()
            .collection('Users')
            .doc(currentUser.uid)
            .onSnapshot(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    setProfileData({
                        companyName: data?.companyName || '',
                        industry: data?.industry || '',
                        website: data?.website || '',
                        about: data?.about || '',
                        location: data?.location || ''
                    });
                }
                setLoading(false);
            });

        return () => unsubscribe();
    }, [currentUser]);

    const handleSave = async () => {
        if (!profileData.companyName) {
            Alert.alert("Hata", "Firma adi bos birakilamaz.");
            return;
        }

        setSaving(true);
        try {
            await firestore().collection('Users').doc(currentUser?.uid).update({
                ...profileData,
                updatedAt: firestore.FieldValue.serverTimestamp()
            });
            setIsEditing(false);
            Alert.alert("Basarili", "Profil bilgileriniz guncellendi.");
        } catch (error) {
            Alert.alert("Hata", "Guncelleme sirasinda bir sorun olustu.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert("Cikis Yap", "Hesabinizdan cikis yapmak istediginize emin misiniz?", [
            { text: "Vazgec", style: "cancel" },
            { text: "Cikis Yap", style: 'destructive', onPress: () => auth().signOut() }
        ]);
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color={PURPLE_COLOR} /></View>;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.headerBtnText}>Geri</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>KURUMSAL PROFIL</Text>
                <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                    {saving ? <ActivityIndicator size="small" color={PURPLE_COLOR} /> : 
                    <Text style={[styles.headerBtnText, { color: PURPLE_COLOR, fontWeight: 'bold' }]}>
                        {isEditing ? 'Kaydet' : 'Duzenle'}
                    </Text>}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Profil Logosu (Harf Icon) */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarInitial}>{profileData.companyName.charAt(0)}</Text>
                    </View>
                    <Text style={styles.displayEmail}>{currentUser?.email}</Text>
                </View>

                {/* Form Alanlari */}
                <View style={styles.form}>
                    <Text style={styles.label}>FIRMA ADI</Text>
                    <TextInput 
                        style={[styles.input, !isEditing && styles.disabledInput]} 
                        value={profileData.companyName} 
                        onChangeText={(t) => setProfileData({...profileData, companyName: t})}
                        editable={isEditing}
                        placeholder="Firma Adiniz"
                    />

                    <Text style={styles.label}>SEKTOR</Text>
                    <TextInput 
                        style={[styles.input, !isEditing && styles.disabledInput]} 
                        value={profileData.industry} 
                        onChangeText={(t) => setProfileData({...profileData, industry: t})}
                        editable={isEditing}
                        placeholder="Orn: Teknoloji, Hizmet..."
                    />

                    <Text style={styles.label}>KONUM</Text>
                    <TextInput 
                        style={[styles.input, !isEditing && styles.disabledInput]} 
                        value={profileData.location} 
                        onChangeText={(t) => setProfileData({...profileData, location: t})}
                        editable={isEditing}
                        placeholder="Orn: Istanbul, Turkiye"
                    />

                    <Text style={styles.label}>WEB SITESI</Text>
                    <TextInput 
                        style={[styles.input, !isEditing && styles.disabledInput]} 
                        value={profileData.website} 
                        onChangeText={(t) => setProfileData({...profileData, website: t})}
                        editable={isEditing}
                        placeholder="www.sirketiniz.com"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>HAKKIMIZDA</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea, !isEditing && styles.disabledInput]} 
                        value={profileData.about} 
                        onChangeText={(t) => setProfileData({...profileData, about: t})}
                        editable={isEditing}
                        multiline
                        placeholder="Firma vizyonu ve misyonu..."
                    />
                </View>

                {/* Cikis Butonu */}
                {!isEditing && (
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutBtnText}>Oturumu Kapat</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    headerTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
    headerBtnText: { fontSize: 14, color: '#6B7280' },
    content: { padding: 25 },
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3E8FF', borderWidth: 3, borderColor: PURPLE_COLOR, justifyContent: 'center', alignItems: 'center' },
    avatarInitial: { fontSize: 32, fontWeight: 'bold', color: PURPLE_COLOR },
    displayEmail: { marginTop: 12, color: '#9CA3AF', fontSize: 14, fontWeight: '500' },
    form: { marginBottom: 20 },
    label: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, letterSpacing: 0.5 },
    input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 18 },
    disabledInput: { backgroundColor: '#fff', borderColor: 'transparent', paddingLeft: 0, color: '#4B5563' },
    textArea: { height: 100, textAlignVertical: 'top' },
    logoutBtn: { marginTop: 20, padding: 16, borderRadius: 16, backgroundColor: '#FEF2F2', alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
    logoutBtnText: { color: '#DC2626', fontWeight: 'bold', fontSize: 15 }
});

export default CompanyProfileScreen;