// src/screens/Home/FeedScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, TextInput, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ThemeColors } from '../../theme/types';
import JobCard, { JobPost } from '../../components/JobCard'; 
import HorizontalJobCard from '../../components/HorizontalJobCard'; 
import CategoryFilter from '../../components/CategoryFilter'; 
import QuickAccessCard from '../../components/QuickAccessCard'; 
import { JOBS } from '../../data/mockJobs'; 
import { useNavigation } from '@react-navigation/native'; 
interface FeedScreenProps {
  activeTheme: ThemeColors;
}

const { width } = Dimensions.get('window');

const FeedScreen: React.FC<FeedScreenProps> = ({ activeTheme }) => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchText, setSearchText] = useState('');

  // --- VERİ SETLERİ ---

  // 1. HIZLI ARAMA (GRID)
  const QUICK_ACCESS_ITEMS = [
    { id: '1', title: 'Yazılım', icon: '💻', color: '#4F46E5' },
    { id: '2', title: 'Tasarım', icon: '🎨', color: '#EC4899' },
    { id: '3', title: 'Veri', icon: '📊', color: '#8B5CF6' },
    { id: '4', title: 'Marketing', icon: '📈', color: '#F59E0B' },
    { id: '5', title: 'Finans', icon: '💰', color: '#10B981' },
    { id: '6', title: 'İnsan K.', icon: '👥', color: '#3B82F6' },
    { id: '7', title: 'Satış', icon: '🤝', color: '#EF4444' },
    { id: '8', title: 'Siber G.', icon: '🛡️', color: '#6366F1' },
    { id: '9', title: 'Yönetim', icon: '👔', color: '#14B8A6' },
  ];

  // 2. POPÜLER ŞİRKETLER
  const POPULAR_COMPANIES = [
    { id: 'c1', name: 'Trendyol', logo: 'https://cdn.webrazzi.com/uploads/2018/06/trendyol-logo-518.png' },
    { id: 'c2', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png' },
    { id: 'c3', name: 'Getir', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Getir_Logo.svg/1200px-Getir_Logo.svg.png' },
    { id: 'c4', name: 'Papara', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Papara_Logo.svg/2560px-Papara_Logo.svg.png' },
    { id: 'c5', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png' },
    { id: 'c6', name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png' },
  ];

  // 3. 🔥 YENİ: TEMATİK MODLAR (Large Banners)
  const THEMATIC_COLLECTIONS = [
    { id: 't1', title: 'Evden Çalışma Keyfi 🏠', subtitle: 'Remote ilanlar', color: '#3B82F6' },
    { id: 't2', title: 'Start-up Ruhu 🚀', subtitle: 'Hızlı büyü', color: '#F59E0B' },
    { id: 't3', title: 'Global Kariyer 🌍', subtitle: 'Yurt dışı fırsatları', color: '#10B981' },
  ];

  // 4. 🔥 YENİ: KARİYER REHBERİ (Tips)
  const CAREER_TIPS = [
    { id: 'tip1', title: 'Etkili CV Hazırlama', duration: '5 dk okuma', icon: '📄', bg: '#EEF2FF' },
    { id: 'tip2', title: 'Mülakat Tüyoları', duration: '3 dk video', icon: '🎥', bg: '#FFF7ED' },
    { id: 'tip3', title: 'LinkedIn Profili', duration: '7 dk okuma', icon: '💼', bg: '#ECFDF5' },
  ];

  // FİLTRELEME
  const filteredJobs = JOBS.filter(job => {
    const textMatch = searchText === '' || job.title.toLowerCase().includes(searchText.toLowerCase());
    const categoryMatch = selectedCategory === 'Tümü' || 
      (selectedCategory.includes('Remote') && job.type === 'Remote') ||
      (selectedCategory.includes('Staj') && job.title.toLowerCase().includes('intern'));
    return textMatch && categoryMatch;
  });

  const featuredJobs = JOBS.slice(0, 3); 

  // --- RENDER FONKSİYONLARI ---

  const renderVerticalItem = ({ item }: { item: JobPost }) => (
    <JobCard item={item} activeTheme={activeTheme} onPress={() => console.log('Dikey:', item.title)} />
  );

  const renderHorizontalItem = ({ item }: { item: JobPost }) => (
    <HorizontalJobCard item={item} activeTheme={activeTheme} onPress={() => console.log('Yatay:', item.title)} />
  );

  const renderCompanyItem = ({ item }: any) => (
    <TouchableOpacity style={styles.companyItem} onPress={() => console.log('Şirket:', item.name)}>
        <View style={[styles.companyLogoContainer, { borderColor: activeTheme.surface, backgroundColor: '#fff' }]}>
            <Image source={{ uri: item.logo }} style={styles.companyLogo} resizeMode="contain" />
        </View>
        <Text style={[styles.companyName, { color: activeTheme.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  // YENİ: Tematik Banner Render
  const renderThematicItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.thematicCard, { backgroundColor: item.color }]} activeOpacity={0.9}>
        <View>
            <Text style={styles.thematicSubtitle}>{item.subtitle}</Text>
            <Text style={styles.thematicTitle}>{item.title}</Text>
        </View>
        <View style={styles.thematicCircle} />
    </TouchableOpacity>
  );

  // YENİ: İpucu Kartı Render
  const renderTipItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.tipCard, { backgroundColor: item.bg, borderColor: activeTheme.surface }]} activeOpacity={0.8}>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</Text>
        <Text style={[styles.tipTitle, { color: '#1F2937' }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.tipDuration, { color: '#6B7280' }]}>{item.duration}</Text>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, onPress }: { title: string, onPress?: () => void }) => (
    <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>{title}</Text>
        <TouchableOpacity onPress={onPress} style={styles.arrowButton}>
            <Text style={{ color: activeTheme.textSecondary, fontSize: 20, fontWeight: '900' }}> {'>'} </Text>
        </TouchableOpacity>
    </View>
  );

  // --- ANA HEADER ---
  const renderMainHeader = () => (
    <View>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.greeting, { color: activeTheme.textSecondary }]}>Tekrar Hoş Geldin 👋</Text>
          <Text style={[styles.title, { color: activeTheme.text }]}>Kariyerini Şekillendir</Text>
        </View>

        {/* SAĞ TARAF */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            
            

            {/* 3. BURAYI GÜNCELLE: View yerine TouchableOpacity yaptık */}
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ProfileDetail' as never)} // 👈 İŞTE SİHİRLİ KOD
                style={[styles.profilePlaceholder, { backgroundColor: activeTheme.surface }]}
            >
                <Text style={{fontSize: 20}}>👩‍💻</Text>
            </TouchableOpacity>

        </View>
      </View>

      

      <CategoryFilter activeTheme={activeTheme} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* 3. HIZLI ARAMA (GRID) */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="Hızlı Arama" onPress={() => console.log('Hızlı Arama detay')} />
        <View style={styles.gridContainer}>
            {QUICK_ACCESS_ITEMS.map((item) => (
                <View key={item.id} style={styles.gridItemWrapper}>
                    <QuickAccessCard 
                        title={item.title} 
                        icon={item.icon} 
                        color={item.color} 
                        activeTheme={activeTheme} 
                        onPress={() => console.log('Hızlı Arama:', item.title)} 
                    />
                </View>
            ))}
        </View>
      </View>

      {/* 4. POPÜLER ŞİRKETLER */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: activeTheme.text, paddingHorizontal: 20, marginBottom: 15 }]}>
            Popüler Şirketler 🚀
        </Text>
        <FlatList 
            data={POPULAR_COMPANIES}
            renderItem={renderCompanyItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      {/* 5. 🔥 YENİ: TEMATİK MODLAR (GÜNÜN MODU) */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="Günün Modu 🎯" onPress={() => console.log('Tüm modlar')} />
        <FlatList 
            data={THEMATIC_COLLECTIONS}
            renderItem={renderThematicItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>

      {/* 6. VİTRİN */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="Sizin İçin Seçilenler ✨" onPress={() => console.log('Hepsini gör')} />
        <FlatList
          data={featuredJobs}
          renderItem={renderHorizontalItem}
          keyExtractor={(item) => 'featured-' + item.id}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        />
      </View>

      {/* 7. 🔥 YENİ: KARİYER REHBERİ */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: activeTheme.text, paddingHorizontal: 20, marginBottom: 15 }]}>
            Kariyer Rehberi 💡
        </Text>
        <FlatList 
            data={CAREER_TIPS}
            renderItem={renderTipItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>
      
      {/* 8. SON İLANLAR BAŞLIĞI */}
      <View style={[styles.sectionHeader, { marginTop: 10, paddingHorizontal: 20 }]}>
         <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>
           {searchText ? 'Arama Sonuçları' : (selectedCategory === 'Tümü' ? 'Son İlanlar' : `${selectedCategory} İlanları`)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle={activeTheme.background === '#1A1C22' ? 'light-content' : 'dark-content'} />
      <FlatList
        data={filteredJobs}
        renderItem={renderVerticalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderMainHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 40 },
  headerTop: {
    paddingHorizontal: 20, paddingTop: 20, marginBottom: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  greeting: { fontSize: 14, marginBottom: 4, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '800' },
  profilePlaceholder: {
    width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)'
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 24,
    paddingHorizontal: 15, height: 52, borderRadius: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  
  sectionContainer: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  arrowButton: { padding: 4 }, 
  
  horizontalListContent: { paddingHorizontal: 20, paddingBottom: 10 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  gridItemWrapper: { width: (width - 60) / 3, marginBottom: 15 },

  // ŞİRKETLER (STORIES)
  companyItem: { alignItems: 'center', marginRight: 16, width: 70 },
  companyLogoContainer: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  companyLogo: { width: 40, height: 40 },
  companyName: { fontSize: 12, fontWeight: '500', textAlign: 'center' },

  // 🔥 YENİ: TEMATİK BANNER KARTLARI
  thematicCard: {
    width: width * 0.7, // Ekranın %70'i genişliğinde
    height: 100,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 4,
  },
  thematicTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  thematicSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  thematicCircle: {
    position: 'absolute', right: -20, bottom: -20, width: 80, height: 80,
    borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)'
  },

  // 🔥 YENİ: İPUCU KARTLARI
  tipCard: {
    width: 140, height: 140,
    borderRadius: 16, padding: 16, marginRight: 16,
    justifyContent: 'space-between', borderWidth: 1,
  },
  tipTitle: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  tipDuration: { fontSize: 12, fontWeight: '500' },
});

export default FeedScreen;