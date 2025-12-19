import React, { useState, useEffect, useRef } from 'react';
import { 
    View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, 
    TextInput, Dimensions, TouchableOpacity, Image, ActivityIndicator, Linking, Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore'; 
import auth from '@react-native-firebase/auth'; // Auth eklendi
import { ThemeColors } from '../../theme/types';
import JobCard, { JobPost } from '../../components/JobCard'; 
import HorizontalJobCard from '../../components/HorizontalJobCard'; 
import QuickAccessCard from '../../components/QuickAccessCard'; 
import { useNavigation } from '@react-navigation/native'; 

// İKONLAR
import Feather from 'react-native-vector-icons/Feather';

// SERVİSLER
import { fetchJobs, fetchEvents } from '../../services/opportunities';
import { buildSearchQuery } from '../../utils/searchLogic';

const { width } = Dimensions.get('window');

const FeedScreen: React.FC<{activeTheme: ThemeColors}> = ({ activeTheme }) => {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null); 
  const currentUser = auth().currentUser;
  
  // --- STATE YAPISI ---
  const [activeTab, setActiveTab] = useState('Tümü'); 
  const [activeTopic, setActiveTopic] = useState<string | null>(null); 
  const [searchText, setSearchText] = useState('');
  const [opportunities, setOpportunities] = useState<JobPost[]>([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [hasSearched, setHasSearched] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); 

  // Admin Onaylı Önerilen İlanlar State
  const [recommendedAds, setRecommendedAds] = useState<JobPost[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(true);

  // --- 1. ONAYLANAN İLANLARI CANLI DİNLE (Senkronizasyon) ---
  useEffect(() => {
    setIsRecLoading(true);
    // onSnapshot kullanarak favori veya başvuru değişimlerini anlık yakalıyoruz
    const unsubscribe = firestore()
        .collection('JobPostings')
        .where('status', '==', 'approved')
        .limit(10)
        .onSnapshot(querySnapshot => {
            const ads = querySnapshot?.docs.map(doc => ({
                id: doc.id,
                company: doc.data().companyName || 'Kurumsal Firma',
                title: doc.data().title || 'İsimsiz İlan',
                ...doc.data()
            })) as JobPost[];
            setRecommendedAds(ads);
            setIsRecLoading(false);
        }, error => {
            console.error("Firestore Dinleme Hatası:", error);
            setIsRecLoading(false);
        });

    return () => unsubscribe();
  }, []);

  // --- 2. SEKTÖREL VERİ ÇEKME ---
  useEffect(() => {
    if (!activeTopic) return;

    const loadData = async () => {
        setOpportunities([]); 
        setIsLoading(true);
        setHasSearched(true);
        setIsCollapsed(false); 
        
        try {
            let allData: JobPost[] = [];
            if (activeTab === 'Tümü') {
                const [jobs, events] = await Promise.all([
                    fetchJobs(buildSearchQuery('İş', activeTopic), 'İş'),
                    fetchEvents(buildSearchQuery('Etkinlikler', activeTopic))
                ]);
                allData = [...events, ...jobs];
            } else if (activeTab === 'Etkinlikler') {
                allData = await fetchEvents(buildSearchQuery('Etkinlikler', activeTopic));
            } else {
                const type = activeTab === 'Staj' ? 'Staj' : 'İş';
                allData = await fetchJobs(buildSearchQuery(type, activeTopic), type);
            }
            setOpportunities(allData);
        } catch (error) {
            console.error("Yükleme Hatası:", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, [activeTab, activeTopic]);

  // --- YARDIMCI FONKSİYONLAR ---
  const handleCardPress = (link?: string) => {
      if (link && link.startsWith('http')) {
          Linking.openURL(link).catch(() => Alert.alert('Hata', 'Bağlantı açılamadı.'));
      }
  };

  const handleQuickSearch = (topicName: string) => {
      setSearchText(''); 
      setActiveTopic(topicName); 
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const filteredList = opportunities.filter(item => 
    (item.title || '').toLowerCase().includes(searchText.toLowerCase()) || 
    (item.company || '').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme?.background || '#FFFFFF' }]}>
      <StatusBar barStyle={activeTheme?.background === '#000000' || activeTheme?.background === '#0A0A32' ? 'light-content' : 'dark-content'} />
      
      <FlatList
          ref={flatListRef}
          data={[]} 
          renderItem={null}
          keyExtractor={() => 'main-scroll'}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
              <View>
                {/* 1. HEADER */}
                <View style={styles.headerTop}>
                  <View>
                    <Text style={[styles.greeting, { color: activeTheme?.textSecondary }]}>Tekrar Hoş Geldin </Text>
                    <Text style={[styles.title, { color: activeTheme?.text }]}>Kariyerini Şekillendir</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('ProfileDetail')} 
                    style={[styles.profileButton, { borderColor: activeTheme?.surface, backgroundColor: activeTheme?.surface }]}
                  >
                    <Feather name="user" size={24} color={activeTheme?.primary} />
                  </TouchableOpacity>
                </View>

                {/* 2. ARAMA BARI */}
                <View style={[styles.searchContainer, { 
                    backgroundColor: activeTheme?.surface || 'rgba(0,0,0,0.05)',
                    borderColor: 'rgba(0,0,0,0.05)'
                }]}>
                    <Feather name="search" size={20} color={activeTheme?.textSecondary} style={{ marginRight: 10 }} />
                    <TextInput 
                        placeholder="İlan veya şirket ara..." 
                        placeholderTextColor={activeTheme?.textSecondary} 
                        style={[styles.searchInput, { color: activeTheme?.text }]} 
                        value={searchText} 
                        onChangeText={setSearchText} 
                    />
                </View>
                
                {/* 3. FİLTRE ÇİPLERİ */}
                <View style={styles.filterContainer}>
                    {['Tümü', 'İş İlanı', 'Staj', 'Etkinlikler'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.filterChip,
                                activeTab === tab 
                                    ? { backgroundColor: activeTheme?.primary } 
                                    : { backgroundColor: activeTheme?.surface }
                            ]}
                        >
                            <Text style={[
                                styles.filterText, 
                                { color: activeTab === tab ? '#FFF' : activeTheme?.textSecondary }
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 4. SEKTÖR SONUÇLARI */}
                {isLoading ? (
                    <View style={styles.statusContainer}>
                        <ActivityIndicator size="large" color={activeTheme?.primary} />
                        <Text style={[styles.statusText, { color: activeTheme?.textSecondary }]}>Fırsatlar taranıyor...</Text>
                    </View>
                ) : activeTopic && filteredList.length > 0 ? (
                    <View style={styles.sectionContainer}>
                      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.collapseHeader}>
                        <Text style={[styles.sectionTitle, { color: activeTheme?.text }]}>
                          {activeTopic} Fırsatları ({filteredList.length})
                        </Text>
                        <Feather name={isCollapsed ? 'chevron-down' : 'chevron-up'} size={20} color={activeTheme?.primary} />
                      </TouchableOpacity>
                      {!isCollapsed && (
                        <FlatList 
                          data={filteredList} 
                          renderItem={({item}) => (<HorizontalJobCard item={item} activeTheme={activeTheme} onPress={() => handleCardPress(item.link)} />)} 
                          keyExtractor={(item) => 'result-' + item.id} 
                          horizontal showsHorizontalScrollIndicator={false} 
                          contentContainerStyle={{ paddingHorizontal: 20, marginTop: 12 }} 
                        />
                      )}
                    </View>
                ) : null}

                {/* 5. SEKTÖR GRID (Minimalist İkonlar) */}
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: activeTheme?.text, paddingHorizontal: 20, marginBottom: 15 }]}>Sektör Seç & Keşfet</Text>
                  <View style={styles.gridContainer}>
                      {[
                          { id: '1', title: 'Yazılım', icon: 'code', color: '#4F46E5' }, 
                          { id: '2', title: 'Tasarım', icon: 'layers', color: '#EC4899' },
                          { id: '3', title: 'Yapay Zeka', icon: 'cpu', color: '#8B5CF6' }, 
                          { id: '4', title: 'Girişim', icon: 'zap', color: '#F59E0B' },
                          { id: '5', title: 'Oyun Geliş.', icon: 'play-circle', color: '#10B981' }, 
                          { id: '6', title: 'Veri Bilimi', icon: 'pie-chart', color: '#6366F1' },
                          { id: '7', title: 'Siber Güv.', icon: 'shield', color: '#EF4444' }, 
                          { id: '8', title: 'Web3', icon: 'link', color: '#3B82F6' },
                          { id: '9', title: 'Pazarlama', icon: 'trending-up', color: '#14B8A6' },
                      ].map((item) => (
                          <View key={item.id} style={styles.gridItemWrapper}>
                              <QuickAccessCard 
                                title={item.title} 
                                icon={<Feather name={item.icon as any} size={20} color="#FFF" />} 
                                color={item.color} 
                                activeTheme={activeTheme} 
                                onPress={() => handleQuickSearch(item.title)} 
                              />
                          </View>
                      ))}
                  </View>
                </View>

                {/* 6. POPÜLER ŞİRKETLER */}
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: activeTheme?.text, paddingHorizontal: 20, marginBottom: 15 }]}>Popüler Şirketler</Text>
                  <FlatList 
                    data={[
                        { id: 'c1', name: 'Trendyol', logo: 'https://cdn.webrazzi.com/uploads/2018/06/trendyol-logo-518.png' }, 
                        { id: 'c2', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png' }, 
                        { id: 'c3', name: 'Getir', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Getir_Logo.svg/1200px-Getir_Logo.svg.png' }
                    ]} 
                    renderItem={({item}) => (
                        <View style={{ alignItems: 'center', marginRight: 20 }}>
                            <View style={[styles.companyLogoBox, { borderColor: activeTheme?.surface, backgroundColor: '#fff' }]}>
                                <Image source={{ uri: item.logo }} style={{ width: 35, height: 35 }} resizeMode="contain" />
                            </View>
                            <Text style={{ fontSize: 12, marginTop: 8, color: activeTheme?.text }}>{item.name}</Text>
                        </View>
                    )} 
                    keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }} 
                  />
                </View>

                {/* 7. ÖNERİLENLER */}
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: activeTheme?.text, paddingHorizontal: 20, marginBottom: 12 }]}>Sizin İçin Önerilenler</Text>
                  {isRecLoading ? <ActivityIndicator color={activeTheme?.primary} /> : (
                    <FlatList 
                        data={recommendedAds} 
                        renderItem={({item}) => (
                            <HorizontalJobCard 
                                item={item} 
                                activeTheme={activeTheme} 
                                onPress={() => navigation.navigate('JobDetail', { item: item })} 
                            />
                        )} 
                        keyExtractor={(item) => 'rec-' + item.id} 
                        horizontal showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={{ paddingHorizontal: 20 }} 
                    />
                  )}
                </View>

                {/* 8. KARİYER REHBERİ */}
                <View style={[styles.sectionContainer, { marginBottom: 40 }]}>
                  <Text style={[styles.sectionTitle, { color: activeTheme?.text, paddingHorizontal: 20, marginBottom: 15 }]}>Kariyer Rehberi</Text>
                  <FlatList 
                    data={[
                        { id: 'tip1', title: 'Etkili CV', icon: 'file-text', bg: '#EEF2FF', color: '#4F46E5' }, 
                        { id: 'tip2', title: 'Mülakat', icon: 'video', bg: '#FFF7ED', color: '#F97316' }
                    ]} 
                    renderItem={({item}) => (
                    <TouchableOpacity style={[styles.guideCard, { backgroundColor: item.bg }]}>
                        <Feather name={item.icon as any} size={24} color={item.color} />
                        <View>
                            <Text style={styles.guideTitle}>{item.title}</Text>
                            <Text style={styles.guideSubtitle}>Yeni İçerik</Text>
                        </View>
                    </TouchableOpacity>
                    )} 
                    keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }} 
                  />
                </View>
              </View>
          }
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 20 },
  headerTop: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '800' },
  profileButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, elevation: 2 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 24, paddingHorizontal: 15, height: 50, borderRadius: 16, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10 },
  filterText: { fontSize: 13, fontWeight: '600' },
  sectionContainer: { marginVertical: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  gridItemWrapper: { width: (width - 60) / 3, marginBottom: 15 },
  statusContainer: { marginVertical: 30, alignItems: 'center' },
  statusText: { marginTop: 12, fontWeight: '600' },
  collapseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  companyLogoBox: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 1, elevation: 2 },
  guideCard: { width: 180, height: 90, borderRadius: 20, padding: 16, marginRight: 16, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2 },
  guideTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  guideSubtitle: { fontSize: 12, color: '#6B7280' }
});

export default FeedScreen;