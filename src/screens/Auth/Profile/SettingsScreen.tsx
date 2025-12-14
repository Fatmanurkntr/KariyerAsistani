// src/screens/Auth/Profile/SettingsScreen.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Switch,
    Image,
    ViewStyle, // Tip kontrolü için eklendi
    TextStyle // Tip kontrolü için eklendi
} from 'react-native';

import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
// @ts-ignore
import { updateUserProfile } from '../../../services/auth';
import { logoutUser } from '../../../services/auth';
import CustomButton from '../../../components/CustomButton';
import { ThemeColors } from '../../../theme/types';

interface SettingsScreenProps {
    route: any;
    navigation: any;
    // activeTheme prop'u artık burada doğru tanımlanmıştır.
    activeTheme: ThemeColors; 
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ route, navigation }) => {
    // Navigasyondan gelen prop'lar sayesinde bu artık gereksiz olabilir ancak orijinal kodu koruyoruz.
    const activeTheme = route.params?.activeTheme || {
        background: '#FFFFFF', text: '#000000', textSecondary: '#666666', primary: '#7C3AED', surface: '#F5F5F5'
    };

    // Ayarlar ekranının beklediği prop'ları route.params'tan alıyoruz.
    const { currentUser, onUpdate } = route.params || {};

    const [profileImage, setProfileImage] = useState<string | null>(currentUser?.profileImage || null);
    const [name, setName] = useState(currentUser?.name || '');
    const [school, setSchool] = useState(currentUser?.school || '');
    const [department, setDepartment] = useState(currentUser?.department || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [ghostMode, setGhostMode] = useState(currentUser?.ghostMode || false);

    const [isLoading, setIsLoading] = useState(false);

    const handleSelectImage = async () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.7,
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.assets && response.assets.length > 0) {
                setProfileImage(response.assets[0].uri || null);
                Alert.alert("Fotoğraf Seçildi", "Kaydet butonuna basmayı unutma! 📸");
            }
        });
    };

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const user = auth().currentUser;

            if (user) {
                // 1. Yeni veriyi hazırla
                const newData = { name, school, department, bio, profileImage, ghostMode };

                // 2. FIRESTORE'A KAYDET
                await updateUserProfile(user.uid, newData);

                // 3. Önceki sayfayı güncelle
                if (onUpdate) {
                    onUpdate(newData);
                }

                Alert.alert('Başarılı', 'Profilin güncellendi! ✅');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Hata', 'Güncelleme yapılırken bir sorun oluştu.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Logout işlemi için useAuth'u kullanmamız gerekirdi, ancak orijinal kodunuz doğrudan import ediyor.
    const handleLogout = async () => {
        try {
            await logoutUser();
            // AuthContext.tsx'te dinleyici olduğu için navigasyon otomatik olarak Login/Auth stack'ine geçecektir.
        } catch (error) {
            console.error("Çıkış hatası:", error);
            Alert.alert("Hata", "Çıkış yapılamadı.");
        }
    };


    const inputStyle = [styles.inputContainer, { backgroundColor: activeTheme.surface }];
    const textStyle = [styles.input, { color: activeTheme.text }];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    {/* Fotoğraf */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={handleSelectImage}>
                            <View style={[styles.avatarContainer, { backgroundColor: activeTheme.surface, borderColor: activeTheme.primary }]}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                                ) : (
                                    <Text style={styles.avatarPlaceholder}>👨‍🎓</Text>
                                )}
                                <View style={[styles.editIconBadge, { backgroundColor: activeTheme.primary }]}>
                                    <Text style={styles.cameraIconText}>📷</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.changePhotoText, { color: activeTheme.primary }]}>Fotoğrafı Değiştir</Text>
                    </View>

                    {/* Formlar */}
                    <View style={styles.formContainer}>
                        <View style={inputStyle}>
                            <Text style={[styles.label, { color: activeTheme.textSecondary }]}>AD SOYAD</Text>
                            <TextInput value={name} onChangeText={setName} style={textStyle} />
                        </View>
                        <View style={inputStyle}>
                            <Text style={[styles.label, { color: activeTheme.textSecondary }]}>OKUL</Text>
                            <TextInput value={school} onChangeText={setSchool} style={textStyle} />
                        </View>
                        <View style={inputStyle}>
                            <Text style={[styles.label, { color: activeTheme.textSecondary }]}>BÖLÜM</Text>
                            <TextInput value={department} onChangeText={setDepartment} style={textStyle} />
                        </View>
                        <View style={[inputStyle, styles.textAreaContainer]}>
                            <Text style={[styles.label, { color: activeTheme.textSecondary }]}>HAKKIMDA</Text>
                            <TextInput value={bio} onChangeText={setBio} multiline style={[textStyle, styles.textAreaInput]} />
                        </View>

                        {/* Ghost Mode */}
                        <View style={[styles.ghostCard, { backgroundColor: activeTheme.surface }]}>
                            <View style={styles.ghostTextContainer}>
                                <Text style={[styles.ghostTitle, { color: activeTheme.text }]}>Ghost Mode 👻</Text>
                                <Text style={[styles.ghostDesc, { color: activeTheme.textSecondary }]}>Anonim takıl.</Text>
                            </View>
                            <Switch value={ghostMode} onValueChange={setGhostMode} trackColor={{ false: "#767577", true: activeTheme.primary }} />
                        </View>

                        {/* KRİTİK DÜZELTME: 'style' yerine 'buttonStyle' kullanıldı */}
                        <CustomButton 
                            onPress={handleSave} 
                            title="Değişiklikleri Kaydet" 
                            activeTheme={activeTheme} 
                            isLoading={isLoading} 
                            buttonStyle={styles.mainButton} 
                        />

                        {/* Çıkış Butonu */}
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Hesaptan Çıkış Yap</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContainer: { flexGrow: 1, padding: 24, paddingBottom: 50 },
    avatarSection: { alignItems: 'center', marginBottom: 25 },
    avatarContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 10 },
    avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
    avatarPlaceholder: { fontSize: 40 },
    editIconBadge: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    cameraIconText: { color: '#FFF', fontSize: 14 },
    changePhotoText: { fontWeight: '600', fontSize: 14 },
    formContainer: { marginBottom: 20 },
    inputContainer: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    label: { fontSize: 11, fontWeight: '700', marginBottom: 4, opacity: 0.7 },
    input: { fontSize: 16, fontWeight: '600', padding: 0 },
    textAreaContainer: { height: 100 },
    textAreaInput: { height: 60, textAlignVertical: 'top' },
    ghostCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    ghostTextContainer: { flex: 1, marginRight: 10 },
    ghostTitle: { fontWeight: '700', fontSize: 16 },
    ghostDesc: { fontSize: 12 },

    // Düzeltilen prop adı için stil tanımlaması
    mainButton: { marginBottom: 20 } as ViewStyle, 

    logoutButton: { alignItems: 'center', padding: 15, borderRadius: 12, backgroundColor: '#FFEBEE' },
    logoutText: { color: '#FF5252', fontWeight: '700', fontSize: 16 }
});

export default SettingsScreen;