import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, FlatList, SafeAreaView, 
    StatusBar, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { ThemeColors } from '../../theme/types';

interface FavoritesScreenProps {
  activeTheme: ThemeColors;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ activeTheme }) => {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  // 1. FAVORİLERİ CANLI DİNLE
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = firestore()
      .collection('Favorites')
      .where('userId', '==', currentUser.uid)
      .onSnapshot(querySnapshot => {
        const favs = querySnapshot?.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) || [];
        setFavorites(favs);
        setLoading(false);
      }, error => {
        console.error("Favoriler çekilirken hata:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // 2. FAVORİDEN KALDIR
  const removeFavorite = async (favId: string) => {
    try {
      await firestore().collection('Favorites').doc(favId).delete();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const renderFavoriteItem = ({ item }: { item: any }) => {
    // Veri yapısı JobData veya ItemData olabilir (İş veya Etkinlik)
    const data = item.jobData || item.itemData;
    const isJob = item.type !== 'event';

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: activeTheme.surface }]}
        onPress={() => navigation.navigate(isJob ? 'JobDetail' : 'EventDetail', { [isJob ? 'job' : 'item']: data })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: activeTheme.primary + '15' }]}>
            <Feather name={isJob ? "briefcase" : "calendar"} size={20} color={activeTheme.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: activeTheme.text }]} numberOfLines={1}>{data?.title}</Text>
            <Text style={[styles.subtitle, { color: activeTheme.textSecondary }]}>{data?.companyName}</Text>
          </View>
          <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeBtn}>
            <Feather name="heart" size={20} color="#EF4444" fill="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* BAŞLIK */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Favorilerim</Text>
        <Text style={[styles.headerSubtitle, { color: activeTheme.textSecondary }]}>
          Kaydettiğin {favorites.length} içerik bulunuyor.
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeTheme.primary} />
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => 'fav-' + item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="heart" size={60} color={activeTheme.textSecondary} style={{ opacity: 0.3 }} />
              <Text style={[styles.emptyText, { color: activeTheme.textSecondary }]}>
                Henüz hiçbir ilanı favorilerine eklemedin.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { padding: 16, borderRadius: 20, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  removeBtn: { padding: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 15, lineHeight: 22 },
});

export default FavoritesScreen;