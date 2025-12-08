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
  StatusBar
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { ThemeColors } from '../../theme/types';
import { registerUser } from '../../services/auth'; // Backend servisi
import { validateEmail, validatePassword } from '../../utils/validation';

const RegisterScreen = ({ route, navigation }: any) => {
  const activeTheme: ThemeColors = route.params?.activeTheme;

  // Form State'leri
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'company'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // 1. BOŞ ALAN KONTROLÜ
    if (!name || !surname || !email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    // 2. MANTIK KONTROLLERİ (Senin yazdığın validation.js)
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
      // 3. FIREBASE'E KAYIT İSTEĞİ (auth.js servisi)
      // registerUser fonksiyonu auth.js içinde tanımlı ve bizden (email, password, userData) bekliyor
      await registerUser(email, password, {
        name: name,
        surname: surname,
        role: role // 'student' veya 'company'
      });

      setIsLoading(false);

      // Başarılı olursa kullanıcıyı bilgilendir ve Login'e yönlendir
      Alert.alert('Aramıza Hoş Geldin! 🎉', 'Hesabın oluşturuldu ve otomatik giriş yapıldı.', [
        { text: 'Keşfetmeye Başla', onPress: () => console.log('Zaten içerideyiz') }
      ]);

    } catch (error) {
      setIsLoading(false);
      // Hata mesajı zaten auth.js içinde Alert ile gösteriliyor, buraya ekstra bir şey yazmaya gerek yok.
      console.log("Kayıt hatası:", error);
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
              Kariyer yolculuğuna başlamak için bilgilerinizi girin.
            </Text>
          </View>

          {/* 2. FORM ALANI */}
          <View style={styles.formContainer}>

            {/* Ad ve Soyad (Yan Yana) */}
            <View style={styles.row}>
              <View style={[inputStyle, styles.halfInput]}>
                <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>AD</Text>
                <TextInput
                  placeholder="Adınız"
                  placeholderTextColor={placeholderColor}
                  value={name}
                  onChangeText={setName}
                  style={inputText}
                />
              </View>
              <View style={[inputStyle, styles.halfInput]}>
                <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>SOYAD</Text>
                <TextInput
                  placeholder="Soyadınız"
                  placeholderTextColor={placeholderColor}
                  value={surname}
                  onChangeText={setSurname}
                  style={inputText}
                />
              </View>
            </View>

            {/* E-posta */}
            <View style={inputStyle}>
              <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>E-POSTA</Text>
              <TextInput
                placeholder="ornek@mail.com"
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
                  role === 'student' && styles.activeRoleButtonShadow // Seçiliyse gölge ekle
                ]}
                onPress={() => setRole('student')}
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
                onPress={() => setRole('company')}
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
              style={styles.shadowButton}
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
    width: '48%', // Yan yana durmaları için
  },
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
    height: 24, // Input yüksekliğini sabitle
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
  },
  roleButton: {
    width: '48%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  activeRoleButtonShadow: {
    shadowColor: "#7C3AED", // Tema rengi gölge
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderColor: 'transparent',
  },
  roleText: {
    fontWeight: '700',
    fontSize: 15,
  },
  shadowButton: {
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  linkText: {
    fontWeight: 'bold',
  },
});

export default RegisterScreen;