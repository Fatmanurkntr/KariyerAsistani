import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

export const loginUser = async (email, password, mode) => {
    console.log(`${mode} girişi yapılıyor...`);
    try {
        // 1. Firebase Auth ile giriş yap
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // --- 🔥 YENİ EKLENEN: E-POSTA DOĞRULAMA KONTROLÜ 🔥 ---
        if (!user.emailVerified) {
            await auth().signOut(); // Oturumu hemen kapat
            Alert.alert(
                'E-posta Doğrulanmadı',
                'Giriş yapabilmek için lütfen e-posta adresinize gelen doğrulama linkine tıklayınız.'
            );
            // Hata fırlatarak akışı durduruyoruz
            throw new Error('E-posta adresi henüz doğrulanmamış.');
        }
        // -------------------------------------------------------

        // 2. Firestore'dan kullanıcının rolünü çek
        const uid = user.uid;
        const userDoc = await firestore().collection('Users').doc(uid).get();

        if (!userDoc.exists) {
            await auth().signOut();
            throw new Error('Kullanıcı verisi bulunamadı.');
        }

        const userData = userDoc.data();
        const userRole = userData.role;

        // 3. Rol Doğrulaması (Student/Company Mode Kontrolü)
        let isAuthorized = false;

        if (mode === 'student') {
            if (userRole === 'student' || userRole === 'admin') {
                isAuthorized = true;
            }
        } else if (mode === 'company') {
            if (userRole === 'company') {
                isAuthorized = true;
            }
        }

        // 4. Yetki yoksa at
        if (!isAuthorized) {
            await auth().signOut();
            throw new Error(`Bu hesaba ${mode === 'student' ? 'Firma' : 'Öğrenci'} girişinden erişemezsiniz.`);
        }

        // Her şey yolundaysa kullanıcıyı döndür
        return user;

    } catch (error) {
        console.error("Login Hatası:", error);

        // Hata mesajlarını özelleştir (invalid-credential eklendi)
        if (error.message === 'E-posta adresi henüz doğrulanmamış.') {
            // Bu bizim fırlattığımız hata, zaten alert gösterdik, ekstra bir şey yapma.
        }
        else if (error.code === 'auth/invalid-email') {
            Alert.alert('Hata', 'Geçersiz e-posta adresi formatı.');
        }
        else if (error.code === 'auth/user-not-found') {
            Alert.alert('Hata', 'Kullanıcı bulunamadı.');
        }
        else if (error.code === 'auth/wrong-password') {
            Alert.alert('Hata', 'Şifre yanlış.');
        }
        else if (error.code === 'auth/invalid-credential') {
            Alert.alert('Hata', 'E-posta veya şifre hatalı. Lütfen kontrol ediniz.');
        }
        else {
            // Rol hatası veya diğer bilinmeyen hatalar
            Alert.alert('Giriş Başarısız', error.message);
        }

        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await auth().signOut();
    } catch (error) {
        Alert.alert('Hata', 'Çıkış yapılamadı.');
        throw error;
    }
};

export const registerUser = async (email, password, role, additionalData) => {
    try {
        // 1. Kullanıcıyı oluştur
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 2. Veritabanı objesini hazırla
        let dbData = {
            uid: user.uid,
            email: email,
            role: role,
            createdAt: firestore.FieldValue.serverTimestamp(),
            profileImage: null,
        };

        if (role === 'student') {
            dbData = {
                ...dbData,
                name: additionalData.name || '',
                surname: additionalData.surname || '',
                school: additionalData.school || '',
                department: additionalData.department || '',
                bio: '',
                ghostMode: false,
            };
        } else if (role === 'company') {
            dbData = {
                ...dbData,
                companyName: additionalData.companyName || '',
                sector: additionalData.sector || '',
                website: additionalData.website || '',
                description: '',
            };
        }

        // 3. Veritabanına kaydet
        await firestore().collection('Users').doc(user.uid).set(dbData);
        console.log('Kullanıcı ve detayları başarıyla kaydedildi.');

        // 4. Doğrulama maili gönder
        await user.sendEmailVerification();

        // 5. 🔥 ÖNEMLİ: Oturumu kapat ki AppNavigator ana ekrana yönlendirmesin
        await auth().signOut();

        return user;
    } catch (error) {
        console.error("Kayıt hatası:", error);
        Alert.alert('Kayıt Hatası', error.message);
        throw error;
    }
};

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

export const updateUserProfile = async (uid, data) => {
    try {
        await firestore().collection('Users').doc(uid).update({
            ...data,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('Profil güncellendi!');
    } catch (error) {
        console.error('Güncelleme hatası:', error);
        throw error;
    }
};