import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PURPLE_COLOR = '#7C3AED';

const EditEventScreen = ({ route, navigation }: any) => {
    const { event } = route.params;
    const [title, setTitle] = useState(event.title);
    const [date, setDate] = useState(event.date);
    const [location, setLocation] = useState(event.location);
    const [description, setDescription] = useState(event.description);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await firestore().collection('EventPostings').doc(event.id).update({
                title, date, location, description,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert("HATA", "Guncelleme basarisiz.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>Vazgec</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>ETKINLIGI DUZENLE</Text>
                <View style={{ width: 50 }} />
            </View>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>ETKINLIK ADI</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} />
                <Text style={styles.label}>TARIH</Text>
                <TextInput style={styles.input} value={date} onChangeText={setDate} />
                <Text style={styles.label}>KONUM</Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} />
                <Text style={styles.label}>ACIKLAMA</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline />
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Kaydet</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
    backText: { color: '#666', fontWeight: '600' },
    form: { padding: 25 },
    label: { fontSize: 10, fontWeight: '800', color: '#999', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#eee', marginBottom: 15 },
    textArea: { height: 120, textAlignVertical: 'top' },
    button: { backgroundColor: PURPLE_COLOR, padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default EditEventScreen;