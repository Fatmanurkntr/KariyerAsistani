import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, FlatList, SafeAreaView, 
    TouchableOpacity, Alert, StatusBar, TextInput, ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ThemeColors } from '../../theme/types';
import { useNavigation } from '@react-navigation/native';

interface Props {
  activeTheme: ThemeColors;
}

const StatCard = ({ label, count, color, bg, activeTheme }: any) => (
    <View style={[styles.statCard, { backgroundColor: activeTheme.surface }]}>
        <View style={[styles.statIconBadge, { backgroundColor: bg }]}>
            <Text style={[styles.statCount, { color: color }]}>{count}</Text>
        </View>
        <Text style={[styles.statLabel, { color: activeTheme.textSecondary }]}>{label}</Text>
    </View>
);

const AdminDashboardScreen: React.FC<Props> = ({ activeTheme }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchText, setSearchText] = useState('');

  // --- 🔥 KIRMIZI HATA DÜZELTMESİ: PARALEL DİNLEYİCİLER ---
  useEffect(() => {
    setLoading(true);
    let jobs: any[] = [];
    let events: any[] = [];

    const combineData = () => {
      setData([...jobs, ...events]);
      setLoading(false);
    };

    // İş ilanlarını bağımsız dinle
    const jobUnsub = firestore().collection('JobPostings').onSnapshot(snap => {
      jobs = snap?.docs.map(doc => ({ id: doc.id, dataType: 'job', ...doc.data() })) || [];
      combineData();
    }, () => setLoading(false));

    // Etkinlikleri bağımsız dinle
    const eventUnsub = firestore().collection('EventPostings').onSnapshot(snap => {
      events = snap?.docs.map(doc => ({ id: doc.id, dataType: 'event', ...doc.data() })) || [];
      combineData();
    }, () => setLoading(false));

    // Temizleme: İki aboneliği de durdur
    return () => {
      jobUnsub();
      eventUnsub();
    };
  }, []);

  const handleUpdateStatus = async (item: any, newStatus: 'approved' | 'rejected') => {
    const collectionName = item.dataType === 'job' || item.type === 'job' ? 'JobPostings' : 'EventPostings';
    try {
      await firestore().collection(collectionName).doc(item.id).update({
        status: newStatus,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Başarılı", `İşlem tamamlandı.`);
    } catch (error) {
      Alert.alert("Hata", "Güncelleme başarısız.");
    }
  };

  const getFilteredList = () => {
    let list = data.filter(item => (item.status === activeTab) || (activeTab === 'pending' && !item.status));
    if (searchText) {
      list = list.filter(item => 
        item.title?.toLowerCase().includes(searchText.toLowerCase()) || 
        item.companyName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return list;
  };

  const getTypeBadge = (item: any) => {
    const isEvent = item.dataType === 'event' || item.type === 'event';
    return isEvent 
      ? { label: 'ETKİNLİK', bg: '#F3E8FF', color: '#9333EA' } 
      : { label: 'İŞ İLANI', bg: '#ECFDF5', color: '#059669' };
  };

  // AdminDashboardScreen.tsx içinde renderCard fonksiyonunu bulun ve şu şekilde güncelleyin:

const renderCard = ({ item }: { item: any }) => {
  const badge = getTypeBadge(item);
  return (
      <TouchableOpacity 
          style={[styles.card, { backgroundColor: activeTheme.surface }]}
          // Admin detay sayfasına yönlendiriyoruz
          onPress={() => navigation.navigate('AdminDetail', { item: item })} 
      >
          <View style={styles.cardHeader}>
              <View style={styles.cardInfoContainer}>
                  <Text style={[styles.cardTitle, { color: activeTheme.text }]}>{item.title}</Text>
                  <Text style={[styles.cardOrg, { color: activeTheme.textSecondary }]}>{item.companyName || 'Kurumsal Firma'}</Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.typeBadgeText, { color: badge.color }]}>{badge.label}</Text>
              </View>
          </View>
          {/* ... Mevcut card içeriği aynı kalabilir ... */}
      </TouchableOpacity>
  );
};
  const getStats = () => ({
    pending: data.filter(i => !i.status || i.status === 'pending').length,
    approved: data.filter(i => i.status === 'approved').length,
    rejected: data.filter(i => i.status === 'rejected').length,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backIcon, { color: activeTheme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Admin Onay Paneli</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <ActivityIndicator color={activeTheme.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={getFilteredList()}
          keyExtractor={(item, index) => `${item.dataType || 'admin'}-${item.id || index}`}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.headerPadding}>
                <View style={styles.statsRow}>
                    <StatCard activeTheme={activeTheme} label="Bekleyen" count={getStats().pending} color="#F59E0B" bg="#FEF3C7" />
                    <StatCard activeTheme={activeTheme} label="Onaylı" count={getStats().approved} color="#10B981" bg="#D1FAE5" />
                    <StatCard activeTheme={activeTheme} label="Red" count={getStats().rejected} color="#EF4444" bg="#FEE2E2" />
                </View>
                <View style={[styles.searchBox, { backgroundColor: activeTheme.surface }]}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput 
                        placeholder="İlan veya firma ara..."
                        placeholderTextColor={activeTheme.textSecondary}
                        style={[styles.searchInput, { color: activeTheme.text }]}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                <View style={styles.tabsWrapper}>
                    {['pending', 'approved', 'rejected'].map(tab => (
                        <TouchableOpacity 
                            key={tab}
                            style={[styles.tabItem, activeTab === tab && { backgroundColor: activeTheme.primary }]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : activeTheme.textSecondary }]}>
                                {tab === 'pending' ? 'Bekleyen' : tab === 'approved' ? 'Onaylı' : 'Red'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
          }
          renderItem={renderCard}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: activeTheme.text }]}>Kayıt bulunamadı.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    headerTitle: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
    backBtn: { padding: 5 },
    backIcon: { fontSize: 20 },
    headerSpacer: { width: 30 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
    statCard: { width: '31%', paddingVertical: 15, borderRadius: 16, alignItems: 'center', elevation: 2, shadowOpacity: 0.05 },
    statIconBadge: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    statCount: { fontSize: 18, fontWeight: 'bold' },
    statLabel: { fontSize: 12, marginTop: 8, fontWeight: '600' },
    searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45, borderRadius: 12, marginBottom: 20 },
    searchIcon: { fontSize: 14 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
    tabsWrapper: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)', padding: 4, borderRadius: 12, marginBottom: 20 },
    tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
    tabText: { fontSize: 12, fontWeight: '800' },
    card: { marginHorizontal: 20, marginBottom: 15, padding: 16, borderRadius: 16, elevation: 3, shadowOpacity: 0.05 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardInfoContainer: { flex: 1, paddingRight: 10 },
    cardTitle: { fontSize: 15, fontWeight: '700' },
    cardOrg: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    typeBadgeText: { fontSize: 10, fontWeight: '800' },
    cardDesc: { marginTop: 10, fontSize: 13, lineHeight: 18 },
    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateText: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
    actionButtons: { flexDirection: 'row' },
    rejectBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FEE2E2' },
    approveBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DCFCE7', marginLeft: 10 },
    actionIconTextRed: { fontSize: 16, color: '#991B1B', fontWeight: 'bold' },
    actionIconTextGreen: { fontSize: 16, color: '#166534', fontWeight: 'bold' },
    statusTag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    statusTagText: { fontSize: 11, fontWeight: '800' },
    loader: { marginTop: 50 },
    listContent: { paddingBottom: 30 },
    headerPadding: { paddingHorizontal: 20 },
    emptyContainer: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
    emptyText: { fontWeight: '600' }
});

export default AdminDashboardScreen;