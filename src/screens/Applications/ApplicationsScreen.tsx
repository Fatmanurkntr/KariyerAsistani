import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, FlatList, SafeAreaView, 
    StatusBar, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native'; // 🔥 useRoute eklendi

// --- ALT BİLEŞEN: UYGULAMA KARTI ---
const ApplicationCard = ({ item, activeTheme, navigation }: any) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser || !item.jobId) return;

        const unsubscribe = firestore()
            .collection('Favorites')
            .where('userId', '==', currentUser.uid)
            .where('jobId', '==', item.jobId)
            .onSnapshot(snap => {
                setIsFavorite(!snap?.empty);
            }, err => console.log("Favori takibi hatası:", err));

        return () => unsubscribe();
    }, [currentUser, item.jobId]);

    const isJob = item.type !== 'event';

    return (
        <View style={[styles.card, { backgroundColor: activeTheme.surface }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${activeTheme.primary}15` }]}>
                    <Feather name={isJob ? "briefcase" : "calendar"} size={20} color={activeTheme.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: activeTheme.text }]} numberOfLines={1}>
                        {item.jobTitle || 'İsimsiz İlan'}
                    </Text>
                    <Text style={[styles.subtitle, { color: activeTheme.textSecondary }]}>
                        {item.companyName || 'Kurumsal Firma'}
                    </Text>
                </View>
                <Feather 
                    name="heart" 
                    size={18} 
                    color={isFavorite ? "#EF4444" : activeTheme.textSecondary} 
                />
            </View>
            <TouchableOpacity 
                style={styles.detailBtn}
                onPress={() => {
                    // 🔥 GÜVENLİ VERİ YAPISI: Detay sayfasına mutlaka bir 'id' gönderiyoruz
                    const detailData = { 
                        ...(item.jobData || item), 
                        id: item.jobId || item.id 
                    };
                    
                    navigation.navigate(isJob ? 'JobDetail' : 'EventDetail', { 
                        item: detailData,
                        job: detailData 
                    });
                }}
            >
                <Text style={[styles.detailBtnText, { color: activeTheme.textSecondary }]}>Detayları Gör</Text>
                <Feather name="arrow-right" size={14} color={activeTheme.textSecondary} />
            </TouchableOpacity>
        </View>
    );
};

// --- ANA BİLEŞEN: BAŞVURULAR EKRANI ---
const ApplicationsScreen = ({ activeTheme: propsTheme }: any) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); // 🔥 route undefined hatası için kanca kullanıldı
  
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  // 🔥 Tema hatası için koruma
  const activeTheme = propsTheme || { background: '#FFFFFF', text: '#111827', primary: '#7C3AED', surface: '#F9FAFB', textSecondary: '#6B7280' };

  // 🔥 Parametre çekme (route.params kontrolü ile)
  const filterType = route.params?.filterType || 'all';

  useEffect(() => {
    if (!currentUser) {
        setLoading(false);
        return;
    }

    const unsubscribe = firestore()
      .collection('Applications')
      .where('userId', '==', currentUser.uid)
      .onSnapshot(snap => {
        const apps = snap?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];
        
        const sorted = [...apps].sort((a: any, b: any) => 
            (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0)
        );
        
        setApplications(sorted);
        setLoading(false);
      }, error => {
        setLoading(false);
      });

    return () => unsubscribe();
  }, [currentUser]); 

  // 🔥 LİSTEYİ FİLTRELEME
  const filteredData = applications.filter(item => {
    if (filterType === 'event') {
        return item.type === 'event';
    }
    return true; 
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>
            {filterType === 'event' ? 'Etkinliklerim' : 'Başvurularım'}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={activeTheme.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <ApplicationCard item={item} activeTheme={activeTheme} navigation={navigation} />
          )}
          keyExtractor={item => `app-${item.id}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
                <Feather name="info" size={40} color={activeTheme.textSecondary} style={{marginBottom: 10}} />
                <Text style={[styles.emptyText, { color: activeTheme.textSecondary }]}>
                    {filterType === 'event' ? 'Henüz bir etkinliğe katılmadınız.' : 'Henüz bir başvurunuz yok.'}
                </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

// Stiller aynı kalıyor...
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  card: { padding: 16, borderRadius: 24, marginBottom: 16, elevation: 2, shadowOpacity: 0.05 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
  detailBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    marginTop: 15, 
    paddingTop: 10, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(0,0,0,0.03)' 
  },
  detailBtnText: { fontSize: 12, fontWeight: '600', marginRight: 6 },
  loader: { marginTop: 50 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', fontSize: 14, fontWeight: '500' }
});

export default ApplicationsScreen;