// src/controllers/UserController.js
import { auth, db, storage } from '../config/firebase'; // Ayar dosyanız
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const UserController = {
  
  // 1. Kullanıcı Bilgilerini Çekme
  getUserData: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      return null;
    }
  },

  // 2. Profil Güncelleme (Okul, Bölüm, Ghost Mode)
  updateProfile: async (data) => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        ...data, // school, department, bio, ghostMode vb.
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 3. CV Yükleme (En Kritik Kısım)
  uploadCV: async (fileUri) => {
    try {
      const user = auth.currentUser;
      // Blob oluşturma (React Native'de dosya okuma işlemi)
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Storage referansı: cvs/kullaniciID/cv.pdf
      const storageRef = ref(storage, `cvs/${user.uid}/my_cv.pdf`);
      
      // Yükleme işlemi
      await uploadBytes(storageRef, blob);
      
      // Yüklenen dosyanın linkini alma
      const downloadUrl = await getDownloadURL(storageRef);

      // Linki Firestore'a kaydetme
      await updateDoc(doc(db, "users", user.uid), {
        cvUrl: downloadUrl
      });

      return { success: true, url: downloadUrl };
    } catch (error) {
      console.error("CV Yükleme Hatası:", error);
      return { success: false, error: error.message };
    }
  }
};