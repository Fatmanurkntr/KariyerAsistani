// src/screens/Home/FeedScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView,
  TextInput, Dimensions, TouchableOpacity, Image, ActivityIndicator, Linking, Alert, ScrollView, Modal
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ThemeColors } from '../../theme/types';
import { JobPost } from '../../components/JobCard';
import HorizontalJobCard from '../../components/HorizontalJobCard';
import QuickAccessCard from '../../components/QuickAccessCard';
import { useNavigation } from '@react-navigation/native';


import Feather from 'react-native-vector-icons/Feather';

import { fetchJobs, fetchEvents } from '../../services/opportunities';
import { buildSearchQuery } from '../../utils/searchLogic';
import { getEffectiveDeadline } from '../../utils/dateHelpers';

import NotificationService from '../../services/NotificationService';
import notifee from '@notifee/react-native';
const GUIDE_CONTENTS = {
  cv: {
    title: "Etkili CV Hazırlama Taktikleri",
    icon: "file-text",
    color: "#2563EB",
    items: [
      { id: 1, text: "Tek Sayfa Kuralı: Öğrenciysen veya yeni mezunsan CV'ni tek sayfada tutmaya çalış." },
      { id: 2, text: "ATS Dostu Ol: Tasarım şovları yerine okunabilir, sade fontlar kullan. Robotlar okuyamazsa elenirsin." },
      { id: 3, text: "Projelerini Öne Çıkar: İş deneyimin azsa GitHub projelerini ve kullandığın teknolojileri (React, Node.js vb.) detaylandır." },
      { id: 4, text: "Linkler Önemli: GitHub, LinkedIn ve varsa Portfolyo linklerini en üste, tıklanabilir şekilde koy." },
      { id: 5, text: "Hobileri Abartma: 'Kitap okumak' yerine teknik blog yazarlığı gibi sektörel hobilerini yaz." }
    ]
  },
  interview: {
    title: "Mülakatın Şifreleri",
    icon: "users",
    color: "#10B981",
    items: [
      { id: 1, text: "Şirketi Araştır: 'Neden biz?' sorusuna verecek cevabın olsun. Vizyonlarını bildiğini göster." },
      { id: 2, text: "STAR Tekniği: Sorulara 'Durum, Görev, Aksiyon, Sonuç' sırasıyla hikayeleştirerek cevap ver." },
      { id: 3, text: "Soru Sor: Mülakat sonunda 'Sorun var mı?' dediklerinde mutlaka şirketin teknolojileri veya ekibi hakkında soru sor." },
      { id: 4, text: "Kamera ve Işık: Online mülakatta ışığı karşına al, kameraya bakarak konuş, ekrana değil." },
      { id: 5, text: "Teknik Hazırlık: LeetCode gibi platformlardan veri yapıları ve algoritma sorularına göz at." }
    ]
  }
};
const { width } = Dimensions.get('window');

const FeedScreen: React.FC<{ activeTheme: ThemeColors }> = ({ activeTheme }) => {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);
  const currentUser = auth().currentUser;

  const [activeTab, setActiveTab] = useState('Tümü');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [opportunities, setOpportunities] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recommendedAds, setRecommendedAds] = useState<JobPost[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);

  const openGuide = (type: 'cv' | 'interview') => {
    setSelectedGuide(GUIDE_CONTENTS[type]);
    setModalVisible(true);
  };
  useEffect(() => {
    if (currentUser) {
      firestore().collection('Users').doc(currentUser.uid).get()
        .then(doc => {
          if (doc.exists()) {
            setUserProfile(doc.data());
          }
        })
        .catch(error => console.error("Profil çekme hatası:", error));
    }
  }, [currentUser]);

  useEffect(() => {
    setIsRecLoading(true);
    const unsubscribe = firestore()
      .collection('JobPostings')
      .where('status', '==', 'approved')
      .limit(50)
      .onSnapshot(querySnapshot => {
        const ads = querySnapshot?.docs.map(doc => ({
          id: doc.id,
          company: doc.data().companyName || 'Kurumsal Firma',
          title: doc.data().title || 'İsimsiz İlan',
          ...doc.data()
        })) as JobPost[];

        if (userProfile) {
          const sortedAds = ads.map(ad => {
            const score = calculateRelevanceScore(ad, userProfile);
            return { ...ad, relevanceScore: score };
          }).sort((a: any, b: any) => {
            if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
            return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
          });
          setRecommendedAds(sortedAds.slice(0, 10));
        } else {
          setRecommendedAds(ads.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 10));
        }
        setIsRecLoading(false);
      }, error => {
        console.error("Firestore Dinleme Hatası:", error);
        setIsRecLoading(false);
      });

    return () => unsubscribe();
  }, [userProfile]);

  const calculateRelevanceScore = (job: any, userProfile: any) => {
    if (!userProfile) return 0;
    let score = 0;
    if (job.category && userProfile.interests && Array.isArray(userProfile.interests)) {
      if (userProfile.interests.includes(job.category)) score += 100;
    }
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    const department = (userProfile.department || '').toLowerCase();
    const deptKeywords = department.split(' ').filter((w: string) => w.length > 3);
    deptKeywords.forEach((k: string) => {
      if (jobText.includes(k)) score += 20;
    });
    return score;
  };


  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = firestore()
      .collection('Favorites')
      .where('userId', '==', currentUser.uid)
      .onSnapshot(snapshot => {
        const ids = snapshot.docs.map(doc => doc.data().jobId);
        setFavoriteIds(ids);
      });
    return () => unsubscribe();
  }, []);

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


  const handleToggleFavorite = async (item: JobPost) => {
    if (!currentUser) {
      Alert.alert("Giriş Yap", "Favorilemek için giriş yapmalısınız.");
      return;
    }

    try {
      const favRef = firestore().collection('Favorites');
      const snapshot = await favRef
        .where('userId', '==', currentUser.uid)
        .where('jobId', '==', item.id)
        .get();

      if (snapshot.empty) {
        await favRef.add({
          userId: currentUser.uid,
          jobId: item.id,
          jobData: item,
          type: item.type || 'job',
          addedAt: firestore.FieldValue.serverTimestamp()
        });


        await NotificationService.displayImmediateNotification(item.title);

        await NotificationService.scheduleSmartNotifications(item);

      } else {
        const batch = firestore().batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();


        await NotificationService.cancelNotifications(item.id);
      }
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
    }
  };

  const handleCardPress = (item: JobPost) => {
    navigation.navigate('JobDetail', { item: item, activeTheme: activeTheme });
  };

  const handleQuickSearch = (topicName: string) => {
    setSearchText('');
    setActiveTopic(topicName);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const filteredList = opportunities.filter(item =>
    (item.title || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (item.company || '').toLowerCase().includes(searchText.toLowerCase())
  );
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconBox, { backgroundColor: activeTheme.surface }]}>
        <Feather name="search" size={40} color={activeTheme.textSecondary} style={{ opacity: 0.5 }} />
      </View>
      <Text style={[styles.emptyTitle, { color: activeTheme.text }]}>
        Sonuç Bulunamadı
      </Text>
      <Text style={[styles.emptyText, { color: activeTheme.textSecondary }]}>
        Aradığınız kriterlere uygun aktif ilan veya etkinlik şu an mevcut değil.
      </Text>
    </View>
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
            <View style={styles.headerTop}>
              <View>
                <Text style={[styles.greeting, { color: activeTheme?.textSecondary }]}>Hoş Geldin</Text>
                <Text style={[styles.title, { color: activeTheme?.text }]}>Kariyerini Şekillendir</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProfileDetail')}
                style={[styles.profileButton, { borderColor: activeTheme?.surface, backgroundColor: activeTheme?.surface }]}
              >
                <Feather name="user" size={24} color={activeTheme?.primary} />
              </TouchableOpacity>
            </View>

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

            {isLoading ? (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color={activeTheme?.primary} />
                <Text style={[styles.statusText, { color: activeTheme?.textSecondary }]}>İlanlar taranıyor...</Text>
              </View>
            ) : activeTopic ? (
              filteredList.length > 0 ? (
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
                      renderItem={({ item }) => (
                        <HorizontalJobCard
                          item={item}
                          activeTheme={activeTheme}
                          onPress={() => handleCardPress(item)}
                          isFavorite={favoriteIds.includes(item.id)}
                          onFavoritePress={() => handleToggleFavorite(item)}
                        />
                      )}
                      keyExtractor={(item) => 'result-' + item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 20, marginTop: 12 }}
                    />
                  )}
                </View>
              ) : (
                renderEmptyList()
              )
            ) : null}

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

            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: activeTheme?.text, paddingHorizontal: 20, marginBottom: 12 }]}>Sizin İçin Önerilenler</Text>
              {isRecLoading ? <ActivityIndicator color={activeTheme?.primary} /> : (
                <FlatList
                  data={recommendedAds}
                  renderItem={({ item }) => (
                    <HorizontalJobCard
                      item={item}
                      activeTheme={activeTheme}
                      onPress={() => handleCardPress(item)}
                      isFavorite={favoriteIds.includes(item.id)}
                      onFavoritePress={() => handleToggleFavorite(item)}
                    />
                  )}
                  keyExtractor={(item) => 'rec-' + item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: activeTheme?.text, paddingHorizontal: 20, marginBottom: 15 }]}>Popüler Şirketler</Text>
              <FlatList
                data={[
                  { id: 'c1', name: 'Trendyol', logo: require('../../assets/logos/trendyol.png') },
                  { id: 'c2', name: 'Google', logo: require('../../assets/logos/google.png') },
                  { id: 'c3', name: 'Getir', logo: require('../../assets/logos/getir.png') }
                ]}
                renderItem={({ item }) => (
                  <View style={{ alignItems: 'center', marginRight: 20 }}>
                    <View style={[styles.companyLogoBox, { borderColor: activeTheme?.surface, backgroundColor: '#fff' }]}>

                      <Image
                        source={item.logo}
                        style={{ width: 35, height: 35 }}
                        resizeMode="contain"
                      />

                    </View>
                    <Text style={{ fontSize: 12, marginTop: 8, color: activeTheme?.text }}>{item.name}</Text>
                  </View>
                )}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 40 }}
              />
            </View>
            <View style={[styles.sectionContainer, { marginBottom: 100 }]}>
              <Text style={[styles.sectionTitle, { color: activeTheme?.text, paddingHorizontal: 20, marginBottom: 15 }]}>
                Kariyer Rehberi
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                <TouchableOpacity
                  style={[styles.guideCard, { backgroundColor: activeTheme?.surface }]}
                  onPress={() => openGuide('cv')} // 🔥 BURASI EKLENDİ
                >
                  <View style={{
                    width: 44, height: 44,
                    borderRadius: 12,
                    backgroundColor: activeTheme?.primary + '15',
                    justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Feather name="file-text" size={22} color={activeTheme?.primary} />
                  </View>

                  <View>
                    <Text style={[styles.guideTitle, { color: activeTheme?.text }]}>CV Hazırla</Text>
                    <Text style={[styles.guideSubtitle, { color: activeTheme?.textSecondary }]}>Profesyonel ipuçları</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.guideCard, { backgroundColor: activeTheme?.surface }]}
                  onPress={() => openGuide('interview')} // 🔥 BURASI EKLENDİ
                >
                  <View style={{
                    width: 44, height: 44,
                    borderRadius: 12,
                    backgroundColor: '#10B98115',
                    justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Feather name="users" size={22} color="#10B981" />
                  </View>

                  <View>
                    <Text style={[styles.guideTitle, { color: activeTheme?.text }]}>Mülakat</Text>
                    <Text style={[styles.guideSubtitle, { color: activeTheme?.textSecondary }]}>Sık sorulanlar</Text>
                  </View>
                </TouchableOpacity>

              </ScrollView>
            </View>
          </View>
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeTheme?.background }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name={selectedGuide?.icon} size={24} color={selectedGuide?.color} />
                <Text style={[styles.modalTitle, { color: activeTheme?.text }]}>{selectedGuide?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={activeTheme?.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedGuide?.items.map((item: any) => (
                <View key={item.id} style={styles.guideItem}>
                  <Feather name="check-circle" size={20} color={selectedGuide?.color} style={{ marginTop: 2 }} />
                  <Text style={[styles.guideText, { color: activeTheme?.textSecondary }]}>{item.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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

  guideSubtitle: { fontSize: 12, color: '#6B7280' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: '50%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  guideItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingRight: 10
  },
  guideText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 20,
    minHeight: 20,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  }
});

export default FeedScreen;