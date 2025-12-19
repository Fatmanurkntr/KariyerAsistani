import React, { useState } from 'react';
import { 
    View, Text, TextInput, StyleSheet, ScrollView, 
    TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, StatusBar 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const COLORS = {
    background: '#F8F9FA',
    white: '#FFFFFF',
    primary: '#7C3AED', // Projenin ana mor teması
    text: '#111827',
    border: '#E5E7EB'
};

const AddEventScreen = ({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState(''); // 🔥 Artık kullanılıyor
    const [eventLink, setEventLink] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePostEvent = async () => {
        // Form doğrulaması
        if (!title || !date || !eventLink || !location) {
            Alert.alert("Eksik Bilgi", "Lütfen etkinlik adı, tarih, konum ve kayıt linkini doldurun.");
            return;
        }

        setLoading(true);
        const currentUser = auth().currentUser;

        try {
            // Şirket adını güncel çekmek için kullanıcı dokümanına erişim
            const userDoc = await firestore().collection('Users').doc(currentUser?.uid).get();
            const userData = userDoc.data();

            await firestore().collection('EventPostings').add({
                companyId: currentUser?.uid,
                companyName: userData?.companyName || 'Kurumsal Firma',
                title: title,
                date: date,
                location: location, // 🔥 Veritabanına ekleniyor
                eventLink: eventLink,
                description: description,
                status: 'pending', // Admin onayı bekleyen durum
                participantCount: 0,
                views: 0,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            setLoading(false);
            Alert.alert("Başarılı", "Etkinliğiniz onaylanmak üzere admine gönderildi.", [
                { text: "Tamam", onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            setLoading(false);
            Alert.alert("Hata", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>Vazgeç</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>ETKİNLİK OLUŞTUR</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>ETKİNLİK ADI</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Sektör Buluşmaları" />

                <Text style={styles.label}>TARİH</Text>
                <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="25.12.2025 - 19:00" />

                {/* 🔥 DÜZELTME: Konum alanı eklendi, setLocation artık kullanılıyor */}
                <Text style={styles.label}>KONUM / PLATFORM</Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Zoom veya Şişli Yerleşkesi" />

                <Text style={styles.label}>KATILIM LİNKİ</Text>
                <TextInput style={styles.input} value={eventLink} onChangeText={setEventLink} placeholder="Kayıt adresi" autoCapitalize="none" />

                <Text style={styles.label}>AÇIKLAMA</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline />

                <TouchableOpacity style={styles.submitButton} onPress={handlePostEvent} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Etkinliği Gönder</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: COLORS.border },
    backText: { color: '#6B7280', fontWeight: '600' },
    headerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
    form: { padding: 24 },
    label: { fontSize: 10, fontWeight: '800', color: '#6B7280', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderRadius: 10, padding: 14, fontSize: 15, borderWidth: 1, borderColor: COLORS.border, marginBottom: 15 },
    textArea: { height: 120, textAlignVertical: 'top' },
    submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    submitButtonText: { color: '#FFF', fontWeight: '800' }
});

export default AddEventScreen;