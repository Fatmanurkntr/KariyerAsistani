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
  Image
} from 'react-native';

// 1. DÜZELTME: Gerekli tipleri (ImageLibraryOptions) içe aktardık
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

import { logoutUser } from '../../../services/auth';
import CustomButton from '../../../components/CustomButton'; 

interface SettingsScreenProps {
  route: any;
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ route, navigation }) => {
  const activeTheme = route.params?.activeTheme || {
    background: '#FFFFFF', text: '#000000', textSecondary: '#666666', primary: '#7C3AED', surface: '#F5F5F5'
  };

  const { currentUser, onUpdate } = route.params || {};

  const [profileImage, setProfileImage] = useState<string | null>(currentUser?.profileImage || null);
  const [name, setName] = useState(currentUser?.name || '');
  const [school, setSchool] = useState(currentUser?.school || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [ghostMode, setGhostMode] = useState(currentUser?.ghostMode || false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectImage = async () => {
    // 2. DÜZELTME: options değişkenine tipini (ImageLibraryOptions) söyledik.
    // TypeScript artık bunun bir resim ayarı olduğunu biliyor.
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
    setTimeout(() => {
        setIsLoading(false);
        if (onUpdate) {
            onUpdate({ name, school, department, bio, profileImage, ghostMode });
        }
        Alert.alert('Başarılı', 'Profilin güncellendi! ✅');
        navigation.goBack(); 
    }, 1000);
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
                    <Text style={styles.label}>AD SOYAD</Text>
                    <TextInput value={name} onChangeText={setName} style={textStyle} />
                </View>
                <View style={inputStyle}>
                    <Text style={styles.label}>OKUL</Text>
                    <TextInput value={school} onChangeText={setSchool} style={textStyle} />
                </View>
                <View style={inputStyle}>
                    <Text style={styles.label}>BÖLÜM</Text>
                    <TextInput value={department} onChangeText={setDepartment} style={textStyle} />
                </View>
                <View style={[inputStyle, styles.textAreaContainer]}>
                    <Text style={styles.label}>HAKKIMDA</Text>
                    <TextInput value={bio} onChangeText={setBio} multiline style={[textStyle, styles.textAreaInput]} />
                </View>

                {/* Ghost Mode */}
                <View style={[styles.ghostCard, { backgroundColor: activeTheme.surface }]}>
                    <View style={styles.ghostTextContainer}>
                        <Text style={[styles.ghostTitle, { color: activeTheme.text }]}>Ghost Mode 👻</Text>
                        
                        {/* 3. DÜZELTME: Sarı hatayı veren inline style kaldırıldı, styles.ghostDesc kullanıldı */}
                        <Text style={[styles.ghostDesc, { color: activeTheme.textSecondary }]}>Anonim takıl.</Text>
                    
                    </View>
                    <Switch value={ghostMode} onValueChange={setGhostMode} trackColor={{false:"#767577", true: activeTheme.primary}}/>
                </View>

                <CustomButton onPress={handleSave} title="Değişiklikleri Kaydet" activeTheme={activeTheme} isLoading={isLoading} style={styles.mainButton} />

                <TouchableOpacity style={styles.logoutButton} onPress={() => logoutUser()}>
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
  
  // 4. DÜZELTME: Yeni eklenen stil
  ghostDesc: { fontSize: 12 }, 

  mainButton: { marginBottom: 20 },
  logoutButton: { alignItems: 'center', padding: 15, borderRadius: 12, backgroundColor: '#FFEBEE' },
  logoutText: { color: '#FF5252', fontWeight: '700', fontSize: 16 }
});

export default SettingsScreen;