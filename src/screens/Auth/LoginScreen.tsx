import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ViewStyle,
    TextStyle
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { ThemeColors } from '../../theme/types';
import { useAuth } from '../../context/AuthContext'; 
// @ts-ignore
import { loginUser, logoutUser } from '../../services/auth';
import { validateEmail } from '../../utils/validation';
import { AuthMode } from '../../types/auth'; 

const LoginScreen = ({ route, navigation }: any) => {
    const { login } = useAuth(); 
    
    const activeTheme: ThemeColors = route.params.activeTheme; 
    const [mode, setMode] = useState<AuthMode>('student');
    const currentTheme = activeTheme;
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi giriniz.');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz.');
            return;
        }

        setIsLoading(true);
        try {
            const user = await loginUser(email, password, mode); 

            if (user && !user.emailVerified) {
                await logoutUser();
                Alert.alert('E-posta Onaylanmadı ⚠️', 'Hesabınızı doğrulayın.');
                setIsLoading(false);
                return; 
            }

            // KRİTİK DÜZELTME: Sadece rolü gönderiyoruz. AuthContext Firebase Listener üzerinden
            // kullanıcı bilgilerini otomatik alacak ve yönlendirmeyi tetikleyecektir.
            await login(mode);

        } catch (e: any) {
            setIsLoading(false);
            Alert.alert('Giriş Başarısız', 'Geçersiz e-posta, şifre veya rol.');
        }
    };

    const navigateToRegister = () => {
        navigation.navigate('Register', { initialMode: mode, activeTheme: activeTheme }); 
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <StatusBar barStyle={currentTheme.background === '#1A1C22' ? 'light-content' : 'dark-content'} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                
                {/* 0. SEGMENTED CONTROL */}
                <View style={styles.segmentControlContainer}>
                    <TouchableOpacity 
                        style={[styles.segmentButton, mode === 'student' && { backgroundColor: currentTheme.primary }]}
                        onPress={() => setMode('student')}
                    >
                        <Text style={[styles.segmentText, { color: mode === 'student' ? currentTheme.background : currentTheme.textSecondary }]}>
                            ÖĞRENCİ
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.segmentButton, mode === 'company' && { backgroundColor: currentTheme.primary }]}
                        onPress={() => setMode('company')}
                    >
                        <Text style={[styles.segmentText, { color: mode === 'company' ? currentTheme.background : currentTheme.textSecondary }]}>
                            FİRMA
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* 1. HEADER & LOGO ALANI */}
                <View style={styles.headerContainer}>
                    <View style={[styles.logoPlaceholder, { backgroundColor: currentTheme.surface }]}>
                        <Text style={{ fontSize: 40 }}>{mode === 'student' ? '🎓' : '🏢'}</Text>
                    </View>
                    <Text style={[styles.welcomeText, { color: currentTheme.text }]}>
                        {mode === 'student' ? 'Tekrar Hoş Geldin!' : 'Kurumsal Portal'}
                    </Text>
                    <Text style={[styles.subText, { color: currentTheme.textSecondary }]}>
                        {mode === 'student' 
                            ? 'Kariyer yolculuğuna devam etmek için giriş yap.' 
                            : 'İlan vermek ve yetenekleri keşfetmek için giriş yapın.'}
                    </Text>
                </View>

                {/* 2. FORM ALANI */}
                <View style={styles.formContainer}>

                    {/* Email Input */}
                    <View style={[styles.inputContainer, { backgroundColor: currentTheme.surface }]}>
                        <TextInput
                            placeholder={mode === 'student' ? "Öğrenci E-postası" : "Şirket E-postası"}
                            placeholderTextColor={currentTheme.textSecondary + '80'} 
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={[styles.inputModern, { color: currentTheme.text }]}
                        />
                    </View>

                    {/* Şifre Input */}
                    <View style={[styles.inputContainer, { backgroundColor: currentTheme.surface }]}>
                        <TextInput
                            placeholder="Şifre"
                            placeholderTextColor={currentTheme.textSecondary + '80'}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={[styles.inputModern, { color: currentTheme.text }]}
                        />
                    </View>
                    
                    {/* KAYIT OL VE ŞİFREMİ UNUTTUM YANYANA BÖLÜMÜ */}
                    <View style={styles.forgotRegisterRow}>
                        
                        {/* 1. Kayıt Ol Linki */}
                        <TouchableOpacity onPress={navigateToRegister}>
                            <Text style={[styles.registerLinkText, { color: currentTheme.primary }]}>
                                Hesabın yok mu? Kayıt Ol
                            </Text>
                        </TouchableOpacity>

                        {/* 2. Şifremi Unuttum Linki */}
                        <TouchableOpacity style={styles.forgotPassContainer}>
                            <Text style={[styles.forgotPassText, { color: currentTheme.textSecondary }]}>
                                Şifreni mi unuttun?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Giriş Butonu */}
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            onPress={handleLogin}
                            title={mode === 'student' ? "GİRİŞ YAP" : "FİRMA GİRİŞ"}
                            activeTheme={currentTheme}
                            isLoading={isLoading}
                            buttonStyle={styles.shadowButton} 
                        />
                    </View>

                    {/* Sosyal Medya Ayırıcı */}
                    <View style={styles.socialSeparator}>
                        <View style={styles.separatorLine} />
                        <Text style={[styles.separatorText, { color: currentTheme.textSecondary }]}>Veya hızlı giriş yap</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* SOSYAL MEDYA BUTONLARI */}
                    <View style={styles.socialButtonsContainer}>
                        {/* Google Butonu */}
                        <TouchableOpacity style={[styles.socialIconModern, { borderColor: currentTheme.surface, backgroundColor: '#FFFFFF' }]}>
                             <Text style={{fontSize: 16, fontWeight: '700'}}>GOOGLE</Text> 
                        </TouchableOpacity>
                        {/* Apple Butonu */}
                        <TouchableOpacity style={[styles.socialIconModern, { borderColor: currentTheme.surface, backgroundColor: '#FFFFFF' }]}>
                             <Text style={{fontSize: 16, fontWeight: '700'}}>APPLE</Text> 
                        </TouchableOpacity>
                    </View>

                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center', 
        paddingHorizontal: 24,
        paddingTop: 10, 
    } as ViewStyle,
    forgotRegisterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20, 
    } as ViewStyle,
    registerLinkText: {
        fontSize: 14,
        fontWeight: 'bold',
    } as TextStyle,
    segmentControlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#E5E7EB',
        borderRadius: 15,
        padding: 3,
        marginBottom: 20, 
    } as ViewStyle,
    segmentButton: {
        flex: 1,
        paddingVertical: 10, 
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 2,
    } as ViewStyle,
    segmentText: {
        fontWeight: '700',
        fontSize: 13,
    } as TextStyle,
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30, 
    },
    logoPlaceholder: {
        width: 60, 
        height: 60,
        borderRadius: 30, 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    welcomeText: {
        fontSize: 24, 
        fontWeight: '800', 
        marginBottom: 4, 
        textAlign: 'center',
    },
    subText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 18,
    },
    formContainer: {
        marginBottom: 5,
    },
    inputContainer: {
        borderRadius: 12, 
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)', 
    },
    inputModern: { 
        fontSize: 16,
        fontWeight: '500',
        padding: 0, 
        height: 20, 
    } as TextStyle,
    forgotPassContainer: {
        alignItems: 'flex-end', 
    },
    forgotPassText: {
        fontSize: 14,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 0,
        marginBottom: 20, 
    },
    shadowButton: {
        shadowColor: "#7C3AED", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    } as ViewStyle,
    socialSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    } as ViewStyle,
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    } as ViewStyle,
    separatorText: {
        marginHorizontal: 10,
        fontSize: 13,
    } as TextStyle,
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    } as ViewStyle,
    socialIconModern: {
        borderWidth: 1,
        borderRadius: 12, 
        width: '48%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0,0,0,0.1)', 
        backgroundColor: '#FFFFFF',
    } as ViewStyle,
});

export default LoginScreen;