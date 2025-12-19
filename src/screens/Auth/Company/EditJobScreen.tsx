import React, { useState } from 'react';
import { 
    View, Text, TextInput, StyleSheet, ScrollView, 
    TouchableOpacity, SafeAreaView, Alert, ActivityIndicator 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PURPLE_COLOR = '#7C3AED';

const EditEventScreen = ({ route, navigation }: any) => {
    const { event } = route.params;
    
    // State tanımlamaları
    const [title, setTitle] = useState(event.title);
    const [date, setDate] = useState(event.date);
    const [location, setLocation] = useState(event.location);
    // 🔥 HAFIZADAKİ VERİ: Etkinlik linki düzenleme alanı eklendi
    const [eventLink, setEventLink] = useState(event.eventLink || '');
    const [description, setDescription] = useState(event.description);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!title || !date || !eventLink) {
            Alert.alert("Eksik Bilgi", "Lütfen gerekli alanları doldurun.");
            return;
        }

        setLoading(true);
        try {
            await firestore().collection('EventPostings').doc(event.id).update({
                title, 
                date, 
                location, 
                eventLink, // 🔥 Veritabanı güncellemesine eklendi
                description,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
            
            Alert.alert("Başarılı", "Etkinlik güncellendi.", [
                { text: "Tamam", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            // 🔥 DÜZELTİLDİ: 'error' değişkeni konsola yazılarak hata giderildi
            console.error("Güncelleme Hatası:", error);
            Alert.alert("HATA", "Güncelleme başarısız oldu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Vazgeç</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ETKİNLİĞİ DÜZENLE</Text>
                <View style={{ width: 50 }} />
            </View>
            
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>ETKİNLİK ADI</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} />
                
                <Text style={styles.label}>TARİH</Text>
                <TextInput style={styles.input} value={date} onChangeText={setDate} />
                
                <Text style={styles.label}>KONUM</Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} />

                {/* 🔥 HAFIZADAKİ VERİ: Yeni Link Girişi */}
                <Text style={styles.label}>KATILIM LİNKİ</Text>
                <TextInput 
                    style={styles.input} 
                    value={eventLink} 
                    onChangeText={setEventLink} 
                    autoCapitalize="none" 
                    keyboardType="url"
                />

                <Text style={styles.label}>AÇIKLAMA</Text>
                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    value={description} 
                    onChangeText={setDescription} 
                    multiline 
                />
                
                <TouchableOpacity 
                    style={[styles.button, loading && { opacity: 0.7 }]} 
                    onPress={handleUpdate} 
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Değişiklikleri Kaydet</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0f0f0' 
    },
    headerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
    backText: { color: '#666', fontWeight: '600' },
    form: { padding: 25 },
    label: { fontSize: 10, fontWeight: '800', color: '#999', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#eee', marginBottom: 15, color: '#111827' },
    textArea: { height: 120, textAlignVertical: 'top' },
    button: { backgroundColor: PURPLE_COLOR, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default EditEventScreen;