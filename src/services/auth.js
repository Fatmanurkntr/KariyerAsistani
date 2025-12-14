// src/services/auth.js

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
// TypeScript tipi olan 'AuthMode' importu kaldırıldı.

/**
 * Kullanıcıyı e-posta, şifre ve mod (student/company) ile giriş yaptırır.
 * Bu fonksiyon, LoginScreen.tsx'ten 3 argümanla çağrıldığı için 3. argümanı (mode) kabul eder.
 *
 * @param {string} email
 * @param {string} password
 * @param {string} mode - 'student' veya 'company'
 */
export const loginUser = async (email, password, mode) => { 
    console.log(`${mode} girişi yapılıyor...`);
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        if (error.code === 'auth/invalid-email') Alert.alert('Hata', 'Geçersiz e-posta adresi.');
        else if (error.code === 'auth/user-not-found') Alert.alert('Hata', 'Kullanıcı bulunamadı.');
        else if (error.code === 'auth/wrong-password') Alert.alert('Hata', 'Şifre yanlış.');
        else Alert.alert('Hata', error.message);
        throw error;
    }
};

// ÇIKIŞ YAP FONKSİYONU
export const logoutUser = async () => {
    try {
        await auth().signOut();
    } catch (error) {
        Alert.alert('Hata', 'Çıkış yapılamadı.');
        throw error;
    }
};

// KAYIT FONKSİYONU (Güncellendi)
export const registerUser = async (email, password, userData) => {
    try {
        // 1. Auth'a kaydet
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 2. Firestore'a kaydet
        await firestore().collection('Users').doc(user.uid).set({
            name: userData.name,
            surname: userData.surname,
            role: userData.role, // student veya company
            email: email,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        // Doğrulama linki gönder
        await user.sendEmailVerification();

        // Kullanıcıyı hemen dışarı at (Otomatik giriş yapmasın)
        await auth().signOut();

        return user;
    } catch (error) {
        Alert.alert('Kayıt Hatası', error.message);
        throw error;
    }
};

// 1. Kullanıcı Bilgilerini Çekme (Profil Ekranı için)
export const getUserProfile = async (uid) => {
    try {
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        throw error;
    }
};

// 2. Kullanıcı Bilgilerini Güncelleme (Ayarlar Ekranı için)
export const updateUserProfile = async (uid, data) => {
    try {
        await firestore().collection('Users').doc(uid).update({
            name: data.name,
            school: data.school,
            department: data.department,
            bio: data.bio,
            profileImage: data.profileImage, // Şimdilik sadece resim yolunu (URI) kaydediyoruz
            ghostMode: data.ghostMode,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error('Güncelleme hatası:', error);
        throw error;
    }
};