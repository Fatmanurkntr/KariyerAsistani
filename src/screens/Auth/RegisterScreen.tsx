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

    // --- STATE TANIMLARI ---
    const [role, setRole] = useState<AuthMode>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Tek bir input state'i kullanıyoruz, role göre anlamı değişiyor
    // Öğrenciyken: name = Ad, surname = Soyad
    // Şirketken: name = Şirket Adı, surname = Yetkili Adı
    const [nameInput, setNameInput] = useState('');
    const [surnameInput, setSurnameInput] = useState('');

    // --- YARDIMCI DEĞİŞKENLER ---
    const isStudent = role === 'student';
    const nameLabel = isStudent ? 'AD' : 'ŞİRKET ADI';
    const surnameLabel = isStudent ? 'SOYAD' : 'YETKİLİ ADI/SOYADI';

    // --- KAYIT İŞLEMİ ---
    const handleRegister = async () => {
        // 1. Boş Alan Kontrolü
        if (!nameInput || !surnameInput || !email || !password) {
            Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
            return;
        }

        // 2. Format Kontrolleri
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
            // 3. Verileri Backend'in beklediği formata çeviriyoruz
            // auth.js dosyasındaki registerUser fonksiyonu bu yapıyı bekliyor.
            const profileData = isStudent
                ? {
                    // ÖĞRENCİ VERİ PAKETİ
                    name: nameInput,
                    surname: surnameInput,
                    school: '',         // Boş başlatıyoruz (Profilden eklenecek)
                    department: '',     // Boş başlatıyoruz (Profilden eklenecek)
                    role: 'student'
                }
                : {
                    // ŞİRKET VERİ PAKETİ
                    companyName: nameInput,    // Inputtaki değeri companyName olarak gönderiyoruz
                    contactName: surnameInput, // Yetkili adı
                    sector: '',         // Boş başlatıyoruz
                    website: '',        // Boş başlatıyoruz
                    role: 'company'
                };

            // 4. Servise Gönder
            await registerUser(email, password, role, profileData);

            setIsLoading(false);

            // 5. Başarılı Sonuç
            Alert.alert(
                'Kayıt Başarılı! 🎉',
                'Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.',
                [
                    {
                        text: 'Giriş Ekranına Git',
                        onPress: () => navigation.navigate('Login')
                    }
                ]
            );

        } catch (error: any) {
            setIsLoading(false);
            console.log("Kayıt hatası:", error);
            // Firebase hatasını kullanıcıya göster
            let errorMessage = 'Bir hata oluştu.';
            if (error.code === 'auth/email-already-in-use') errorMessage = 'Bu e-posta adresi zaten kullanımda.';
            if (error.code === 'auth/invalid-email') errorMessage = 'Geçersiz e-posta formatı.';

            Alert.alert('Kayıt Başarısız', errorMessage);
        }
    };

    // Stil Yardımcıları
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

                    {/* HEADER */}
                    <View style={styles.headerContainer}>
                        <Text style={[styles.title, { color: activeTheme.text }]}>Hesap Oluştur</Text>
                        <Text style={[styles.subText, { color: activeTheme.textSecondary }]}>
                            {isStudent ? 'Kariyer yolculuğuna başlamak için aramıza katıl.' : 'Şirket hesabı oluşturmak için bilgileri girin.'}
                        </Text>
                    </View>

                    {/* FORM */}
                    <View style={styles.formContainer}>

                        {/* ROL SEÇİMİ BUTONLARI */}
                        <Text style={[styles.roleLabel, { color: activeTheme.text }]}>Hesap Türünü Seç:</Text>
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    { backgroundColor: role === 'student' ? activeTheme.primary : activeTheme.surface },
                                    role === 'student' && styles.activeRoleButtonShadow
                                ]}
                                onPress={() => {
                                    setRole('student');
                                    // Rol değişince inputları temizleyebiliriz (isteğe bağlı)
                                    setNameInput('');
                                    setSurnameInput('');
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.roleText, { color: role === 'student' ? '#FFF' : activeTheme.textSecondary }]}>Öğrenci</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    { backgroundColor: role === 'company' ? activeTheme.primary : activeTheme.surface },
                                    role === 'company' && styles.activeRoleButtonShadow
                                ]}
                                onPress={() => {
                                    setRole('company');
                                    setNameInput('');
                                    setSurnameInput('');
                                }}
                                activeOpacity={0.8}
                            >

                                <Text style={[styles.roleText, { color: role === 'company' ? '#FFF' : activeTheme.textSecondary }]}>Firma</Text>
                            </TouchableOpacity>
                        </View>

                        {/* İSİM / ŞİRKET ADI INPUTLARI */}
                        <View style={styles.row}>
                            <View style={[inputStyle, styles.halfInput]}>
                                <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>{nameLabel}</Text>
                                <TextInput
                                    placeholder={isStudent ? "Adınız" : "Şirket Adı"}
                                    placeholderTextColor={placeholderColor}
                                    value={nameInput}
                                    onChangeText={setNameInput}
                                    style={inputText}
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={[inputStyle, styles.halfInput]}>
                                <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>{surnameLabel}</Text>
                                <TextInput
                                    placeholder={isStudent ? "Soyadınız" : "Yetkili Adı"}
                                    placeholderTextColor={placeholderColor}
                                    value={surnameInput}
                                    onChangeText={setSurnameInput}
                                    style={inputText}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* EMAIL INPUT */}
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

                        {/* PASSWORD INPUT */}
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

                        {/* KAYIT OL BUTONU */}
                        <CustomButton
                            onPress={handleRegister}
                            title="Kayıt Ol"
                            activeTheme={activeTheme}
                            isLoading={isLoading}
                            buttonStyle={styles.shadowButton}
                        />
                    </View>

                    {/* FOOTER */}
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

// --- STYLES ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    headerContainer: {
        marginBottom: 24,
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
        marginTop: 0,
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