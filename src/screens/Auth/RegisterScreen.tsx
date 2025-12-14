// src/screens/Auth/RegisterScreen.tsx

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
    ViewStyle, 
    TextStyle 
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { ThemeColors } from '../../theme/types';
import { registerUser } from '../../services/auth';
import { validateEmail, validatePassword } from '../../utils/validation';
import { AuthMode } from '../../types/auth'; 


const RegisterScreen = ({ route, navigation }: any) => {
    const activeTheme: ThemeColors = route.params?.activeTheme;
    const initialMode: AuthMode = route.params?.initialMode || 'student';

    // Form State'leri
    // Öğrenci için
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    
    // 👇 Firma için eklenen state'ler
    const [companyName, setCompanyName] = useState('');
    const [contactName, setContactName] = useState(''); // Yetkili Kişi Adı/Soyadı
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<AuthMode>(initialMode); 
    const [isLoading, setIsLoading] = useState(false);

    // Yardımcı Değişkenler
    const isStudent = role === 'student';
    const nameLabel = isStudent ? 'AD' : 'ŞİRKET ADI';
    const surnameLabel = isStudent ? 'SOYAD' : 'YETKİLİ ADI/SOYADI';
    const nameValue = isStudent ? name : companyName;
    const surnameValue = isStudent ? surname : contactName;
    const setNameHandler = isStudent ? setName : setCompanyName;
    const setSurnameHandler = isStudent ? setSurname : setContactName;


    const handleRegister = async () => {
        // 1. BOŞ ALAN KONTROLÜ
        if (!nameValue || !surnameValue || !email || !password) {
            Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
            return;
        }

        // 2. MANTIK KONTROLLERİ
        if (!validateEmail(email)) {
            Alert.alert('Hatalı E-posta', 'Lütfen geçerli bir e-posta adresi giriniz.');
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert('Güvenlik Uyarısı', 'Şifreniz en az 6 karakter olmalıdır.');
            return;
        }

        setIsLoading(true);
        try {
            // Firestore'a kaydedilecek veriyi belirle
            const profileData = isStudent 
                ? { name: nameValue, surname: surnameValue, role } // Öğrenci verisi
                : { 
                    name: companyName, 
                    surname: contactName, // Yetkili kişinin adı, Firestore'da surname alanına kaydedilecek
                    role,
                    // Diğer firma bilgileri buraya eklenebilir (Vergi No, Adres vb.)
                  };

            await registerUser(email, password, profileData);

            setIsLoading(false);

            // ✅ YENİ MESAJ VE YÖNLENDİRME
            Alert.alert(
                'Kayıt Başarılı! 📧',
                `Lütfen ${email} adresine gönderdiğimiz doğrulama linkine tıklayın. Hesabınızı onayladıktan sonra giriş yapabilirsiniz.`,
                [
                    {
                        text: 'Giriş Ekranına Dön',
                        onPress: () => navigation.navigate('Login')
                    }
                ]
            );

        } catch (error) {
            setIsLoading(false);
            console.log("Kayıt hatası:", error);
            Alert.alert('Kayıt Başarısız', 'Bu e-posta adresi zaten kayıtlı veya bir hata oluştu.');
        }
    };

    // Input stili için yardımcı fonksiyon
    const inputStyle = [styles.inputContainer, { backgroundColor: activeTheme.surface }];
    const inputText = [styles.input, { color: activeTheme.text }];
    const placeholderColor = activeTheme.textSecondary + '80';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle={activeTheme.background === '#1A1C22' ? 'light-content' : 'dark-content'} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    {/* 1. HEADER ALANI */}
                    <View style={styles.headerContainer}>
                        <Text style={[styles.title, { color: activeTheme.text }]}>Hesap Oluştur</Text>
                        <Text style={[styles.subText, { color: activeTheme.textSecondary }]}>
                            {isStudent ? 'Kariyer yolculuğuna başlamak için bilgilerinizi girin.' : 'Kurumsal hesabınızı oluşturmak için bilgileri girin.'}
                        </Text>
                    </View>

                    {/* 2. FORM ALANI */}
                    <View style={styles.formContainer}>

                        {/* Ad / Şirket Adı (Yan Yana) */}
                        <View style={styles.row}>
                            <View style={[inputStyle, styles.halfInput]}>
                                <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>{nameLabel}</Text>
                                <TextInput
                                    placeholder={isStudent ? "Adınız" : "Şirket Adı"}
                                    placeholderTextColor={placeholderColor}
                                    value={nameValue}
                                    onChangeText={setNameHandler}
                                    style={inputText}
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={[inputStyle, styles.halfInput]}>
                                <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>{surnameLabel}</Text>
                                <TextInput
                                    placeholder={isStudent ? "Soyadınız" : "Yetkili Adı/Soyadı"}
                                    placeholderTextColor={placeholderColor}
                                    value={surnameValue}
                                    onChangeText={setSurnameHandler}
                                    style={inputText}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* E-posta */}
                        <View style={inputStyle}>
                            <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>E-POSTA</Text>
                            <TextInput
                                placeholder={isStudent ? "okul@mail.com" : "kurumsal@mail.com"}
                                placeholderTextColor={placeholderColor}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={inputText}
                            />
                        </View>

                        {/* Şifre */}
                        <View style={inputStyle}>
                            <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>ŞİFRE</Text>
                            <TextInput
                                placeholder="En az 6 karakter"
                                placeholderTextColor={placeholderColor}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={inputText}
                            />
                        </View>

                        {/* 3. ROL SEÇİMİ (MODERN) */}
                        <Text style={[styles.roleLabel, { color: activeTheme.text }]}>Hesap Türünü Seç:</Text>
                        <View style={styles.roleContainer}>
                            {/* Öğrenci Butonu */}
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    { backgroundColor: role === 'student' ? activeTheme.primary : activeTheme.surface },
                                    role === 'student' && styles.activeRoleButtonShadow 
                                ]}
                                onPress={() => {setRole('student'); setCompanyName(''); setContactName('');}} // Temizlik eklendi
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: 24, marginBottom: 5 }}>🎓</Text>
                                <Text style={[
                                    styles.roleText,
                                    { color: role === 'student' ? '#FFF' : activeTheme.textSecondary }
                                ]}>Öğrenci</Text>
                            </TouchableOpacity>

                            {/* Firma Butonu */}
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    { backgroundColor: role === 'company' ? activeTheme.primary : activeTheme.surface },
                                    role === 'company' && styles.activeRoleButtonShadow
                                ]}
                                onPress={() => {setRole('company'); setName(''); setSurname('');}} // Temizlik eklendi
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: 24, marginBottom: 5 }}>💼</Text>
                                <Text style={[
                                    styles.roleText,
                                    { color: role === 'company' ? '#FFF' : activeTheme.textSecondary }
                                ]}>Firma</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Kayıt Butonu */}
                        <CustomButton
                            onPress={handleRegister}
                            title="Kayıt Ol"
                            activeTheme={activeTheme}
                            isLoading={isLoading}
                            buttonStyle={styles.shadowButton}
                        />
                    </View>

                    {/* 4. FOOTER */}
                    <View style={styles.footerContainer}>
                        <Text style={{ color: activeTheme.textSecondary }}>Zaten hesabın var mı? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={[styles.linkText, { color: activeTheme.primary }]}>
                                Giriş Yap
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    headerContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    subText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    formContainer: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%', 
    } as ViewStyle,
    inputContainer: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 2,
        letterSpacing: 1,
        opacity: 0.8,
    },
    input: {
        fontSize: 16,
        fontWeight: '500',
        padding: 0,
        height: 24, 
    },
    roleLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        marginTop: 8,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    } as ViewStyle,
    roleButton: {
        width: '48%',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    } as ViewStyle,
    activeRoleButtonShadow: {
        shadowColor: "#7C3AED", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        borderColor: 'transparent',
    } as ViewStyle,
    roleText: {
        fontWeight: '700',
        fontSize: 15,
    } as TextStyle,
    shadowButton: {
        shadowColor: "#7C3AED",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    } as ViewStyle,
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    } as ViewStyle,
    linkText: {
        fontWeight: 'bold',
    } as TextStyle,
});

export default RegisterScreen;