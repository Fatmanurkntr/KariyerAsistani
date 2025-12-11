// src/screens/Auth/Profile/ProfileScreen.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image,
  Alert
} from 'react-native';

interface ProfileScreenProps {
  route: any;
  navigation: any;
}

const UPCOMING_EVENTS = [
  { id: '1', title: 'Kariyer Zirvesi 2025', date: '10 Ara 2025', color: '#E0F2F1', icon: '🗓️' },
  { id: '2', title: 'React Native Workshop', date: '12 Ara 2025', color: '#FFF3E0', icon: '💻' },
];

const APPLICATIONS = [
  { id: '1', title: 'Frontend Developer Stajı', company: 'Teknoloji A.Ş.', status: 'Beklemede', statusColor: '#FFB74D' },
  { id: '2', title: 'UX Tasarımcı', company: 'Creative Agency', status: 'Görüntülendi', statusColor: '#4DB6AC' },
  { id: '3', title: 'Mobil Geliştirici', company: 'Startup Inc.', status: 'Reddedildi', statusColor: '#EF5350' },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  const activeTheme = route.params?.activeTheme || {
    background: '#FFFFFF', text: '#000000', textSecondary: '#666666', primary: '#7C3AED', surface: '#F5F5F5'
  };

  const [userData, setUserData] = useState({
    name: 'Sevde Gül Şahin',
    school: 'İstanbul Teknik Üniversitesi',
    department: 'Bilgisayar Mühendisliği',
    bio: 'Merhaba, ben bir yazılım öğrencisiyim. Mobil uygulama geliştirme üzerine çalışıyorum.',
    profileImage: null,
  });

  const goToSettings = () => {
    navigation.navigate('Settings', {
        currentUser: userData, 
        onUpdate: (newData: any) => setUserData(newData) 
    }); 
  };

  const handleStatPress = (type: string) => {
    Alert.alert(type, `${type} detayları yakında eklenecek.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.topBar}>
           <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Profilim</Text>
           <TouchableOpacity 
                onPress={goToSettings} 
                style={[styles.settingsButton, { backgroundColor: activeTheme.surface, borderColor: activeTheme.primary }]}
            >
              <Text style={styles.settingsIconText}>⚙️</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { borderColor: activeTheme.primary, backgroundColor: activeTheme.surface }]}>
                {userData.profileImage ? (
                    <Image source={{ uri: userData.profileImage }} style={styles.avatarImage} />
                ) : (
                    <Text style={styles.avatarPlaceholder}>👨‍🎓</Text> 
                )}
            </View>
            
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: activeTheme.text }]}>{userData.name}</Text>
                <Text style={[styles.userTitle, { color: activeTheme.textSecondary }]}>{userData.department} Öğrencisi</Text>
                
                <View style={[styles.tagContainer, { backgroundColor: activeTheme.primary + '15' }]}>
                    <Text style={[styles.tagText, { color: activeTheme.primary }]}>{userData.school}</Text>
                </View>

                {userData.bio ? (
                    <Text style={[styles.userBio, { color: activeTheme.textSecondary }]}>{userData.bio}</Text>
                ) : null}
            </View>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: activeTheme.surface }]}>
            <TouchableOpacity style={styles.statItem} onPress={() => handleStatPress('Başvurular')}>
                <Text style={[styles.statNumber, { color: activeTheme.primary }]}>12</Text>
                <Text style={[styles.statLabel, { color: activeTheme.textSecondary }]}>Başvuru</Text>
            </TouchableOpacity>
            <View style={styles.verticalLine} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleStatPress('Etkinlikler')}>
                <Text style={[styles.statNumber, { color: activeTheme.primary }]}>5</Text>
                <Text style={[styles.statLabel, { color: activeTheme.textSecondary }]}>Etkinlik</Text>
            </TouchableOpacity>
            <View style={styles.verticalLine} />
            <TouchableOpacity style={styles.statItem} onPress={() => handleStatPress('Mülakatlar')}>
                <Text style={[styles.statNumber, { color: activeTheme.primary }]}>8</Text>
                <Text style={[styles.statLabel, { color: activeTheme.textSecondary }]}>Mülakat</Text>
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>⏳ Yaklaşan Etkinlikler</Text>
                <TouchableOpacity onPress={() => handleStatPress('Tüm Etkinlikler')}>
                    <Text style={[styles.seeAllText, { color: activeTheme.primary }]}>Tümünü Gör</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {UPCOMING_EVENTS.map((item) => (
                    <TouchableOpacity key={item.id} activeOpacity={0.9} onPress={() => handleStatPress(item.title)}>
                        <View style={[styles.eventCard, { backgroundColor: item.color }]}>
                            <View style={styles.eventIconBadge}>
                                <Text style={styles.iconTextLarge}>{item.icon}</Text>
                            </View>
                            <Text style={styles.eventTitle}>{item.title}</Text>
                            <Text style={styles.eventDate}>{item.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>📄 Son Başvurular</Text>
            <View style={styles.listContainer}>
                {APPLICATIONS.map((item) => (
                    <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => handleStatPress(item.title)}>
                        <View style={[styles.appCard, { backgroundColor: activeTheme.surface }]}>
                            {/* --- ✅ DÜZELTİLDİ: Inline Style Kaldırıldı --- */}
                            <View style={styles.appIconContainer}>
                                <Text>💼</Text>
                            </View>

                            <View style={styles.appContent}>
                                <Text style={[styles.appTitle, { color: activeTheme.text }]}>{item.title}</Text>
                                <Text style={[styles.appCompany, { color: activeTheme.textSecondary }]}>{item.company}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
                                <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 5 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800' },
  settingsButton: { 
      width: 44, height: 44, borderRadius: 14, 
      justifyContent: 'center', alignItems: 'center', 
      borderWidth: 1, elevation: 2, 
      shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity:0.1, shadowRadius:4 
  },
  settingsIconText: { fontSize: 22 },
  profileSection: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { 
      width: 100, height: 100, borderRadius: 50, 
      justifyContent: 'center', alignItems: 'center', 
      borderWidth: 3, elevation: 5, 
      shadowColor: '#000', shadowOffset: {width:0, height:4}, shadowOpacity:0.2, shadowRadius:5 
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  avatarPlaceholder: { fontSize: 50 },
  userInfo: { alignItems: 'center', marginTop: 12, paddingHorizontal: 20 },
  userName: { fontSize: 22, fontWeight: 'bold' },
  userTitle: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  tagContainer: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagText: { fontSize: 12, fontWeight: '600' },
  userBio: { 
    marginTop: 15, textAlign: 'center', fontSize: 14, lineHeight: 20, fontStyle: 'italic', opacity: 0.8
  },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, borderRadius: 16, marginTop: 15 },
  statItem: { alignItems: 'center', padding: 5, minWidth: 70 },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12 },
  verticalLine: { width: 1, backgroundColor: '#DDD' },
  scrollContent: { paddingBottom: 50 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  seeAllText: { fontSize: 12, fontWeight: '600' },
  horizontalScroll: { marginTop: 15 },
  listContainer: { marginTop: 10 },
  eventCard: { width: 150, padding: 15, borderRadius: 20, marginRight: 15, justifyContent: 'space-between', height: 120 },
  eventIconBadge: { width: 36, height: 36, backgroundColor: '#FFF', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  iconTextLarge: { fontSize: 18 },
  eventTitle: { fontSize: 13, fontWeight: '700', color: '#333' },
  eventDate: { fontSize: 11, color: '#666', marginTop: 4 },
  appCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, marginBottom: 10 },
  
  // --- ✅ YENİ EKLENEN STİL ---
  appIconContainer: { 
      width: 44, height: 44, 
      borderRadius: 12, 
      justifyContent: 'center', alignItems: 'center', 
      backgroundColor: '#E3F2FD' // Renk buraya taşındı
  },
  
  appContent: { flex: 1, paddingHorizontal: 12 },
  appTitle: { fontSize: 15, fontWeight: '700' },
  appCompany: { fontSize: 13, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' }
});

export default ProfileScreen;