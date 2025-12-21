import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { updateUserProfile, logoutUser } from '../../../services/auth';
import CustomButton from '../../../components/CustomButton';

const SettingsScreen = ({ route, navigation }: any) => {
    const { currentUser, onUpdate, activeTheme } = route.params || {};

    const [name, setName] = useState(currentUser?.name || '');
    const [school, setSchool] = useState(currentUser?.school || '');
    const [department, setDepartment] = useState(currentUser?.department || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const user = auth().currentUser;
            if (user) {
                const newData = { name, school, department, bio };
                await updateUserProfile(user.uid, newData);
                if (onUpdate) onUpdate(newData);
                Alert.alert('Başarılı', 'Profil güncellendi.');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Hata', 'Güncelleme başarısız.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarSection}>
                    <View style={[styles.avatarContainer, { backgroundColor: activeTheme.surface, borderColor: activeTheme.primary }]}>
                        <Feather name="user" size={40} color={activeTheme.primary} />
                        <View style={[styles.editIconBadge, { backgroundColor: activeTheme.primary }]}>
                            <Feather name="camera" size={14} color="#FFF" />
                        </View>
                    </View>
                    <Text style={[styles.changePhotoText, { color: activeTheme.primary }]}>Fotoğrafı Değiştir</Text>
                </View>

                <View style={styles.formContainer}>
                    {[{ l: 'AD SOYAD', v: name, s: setName }, { l: 'OKUL', v: school, s: setSchool }, { l: 'BÖLÜM', v: department, s: setDepartment }].map((item, idx) => (
                        <View key={idx} style={[styles.inputContainer, { backgroundColor: activeTheme.surface }]}>
                            <Text style={styles.label}>{item.l}</Text>
                            <TextInput value={item.v} onChangeText={item.s} style={[styles.input, { color: activeTheme.text }]} />
                        </View>
                    ))}
                    <View style={[styles.inputContainer, styles.textAreaContainer, { backgroundColor: activeTheme.surface }]}>
                        <Text style={styles.label}>HAKKIMDA</Text>
                        <TextInput value={bio} onChangeText={setBio} multiline style={[styles.input, styles.textAreaInput, { color: activeTheme.text }]} />
                    </View>

                    <CustomButton onPress={handleSave} title="Değişiklikleri Kaydet" activeTheme={activeTheme} isLoading={isLoading} />

                    <TouchableOpacity style={styles.logoutButton} onPress={() => logoutUser()}>
                        <Feather name="log-out" size={18} color="#FF5252" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutText}>Hesaptan Çıkış Yap</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { padding: 24 },
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
    editIconBadge: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    changePhotoText: { fontWeight: '700', fontSize: 14, marginTop: 12 },
    formContainer: { marginBottom: 20 },
    inputContainer: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
    label: { fontSize: 11, fontWeight: '800', marginBottom: 4, opacity: 0.6 },
    input: { fontSize: 16, fontWeight: '600', padding: 0 },
    textAreaContainer: { height: 100 },
    textAreaInput: { height: 60, textAlignVertical: 'top' },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 16, backgroundColor: '#FFEBEE', marginTop: 15 },
    logoutText: { color: '#FF5252', fontWeight: '800', fontSize: 15 }
});

export default SettingsScreen;