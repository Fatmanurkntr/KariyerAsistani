import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, FlatList, TextInput, 
    TouchableOpacity, SafeAreaView, ActivityIndicator, StatusBar, ScrollView 
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = ({ activeTheme }: any) => {
    const navigation = useNavigation<any>(); 
    
    const [allApprovedData, setAllApprovedData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    
    // 🔥 Filtre State'i
    const [activeFilter, setActiveFilter] = useState('Hepsi');

    const filters = [
        { id: '1', label: 'Hepsi' },
        { id: '2', label: 'Etkinlik' },
        { id: '3', label: 'Staj' },
        { id: '4', label: 'Tam Zamanlı' },
        { id: '5', label: 'Yarı Zamanlı' },
    ];

    useEffect(() => {
        setLoading(true);
        const jobSub = firestore()
            .collection('JobPostings')
            .where('status', '==', 'approved')
            .onSnapshot(jobSnap => {
                const jobs = jobSnap?.docs.map(doc => ({ 
                    id: doc.id, 
                    dataType: 'job', 
                    ...doc.data() 
                })) || [];
                
                firestore()
                    .collection('EventPostings')
                    .where('status', '==', 'approved')
                    .onSnapshot(eventSnap => {
                        const events = eventSnap?.docs.map(doc => ({ 
                            id: doc.id, 
                            dataType: 'event', 
                            ...doc.data() 
                        })) || [];
                        
                        const combined = [...jobs, ...events].sort((a: any, b: any) => 
                            (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
                        );
                        
                        setAllApprovedData(combined);
                        setFilteredData(combined);
                        setLoading(false);
                    }, () => setLoading(false));
            }, () => setLoading(false));

        return () => jobSub();
    }, []);

    // 🔥 Arama ve Filtreleme Mantığı
    useEffect(() => {
        let result = allApprovedData;

        // 1. Metin Filtresi
        if (searchText) {
            result = result.filter(item => 
                item.title?.toLowerCase().includes(searchText.toLowerCase()) || 
                item.companyName?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // 2. Kategori/Tip Filtresi
        if (activeFilter !== 'Hepsi') {
            result = result.filter(item => {
                if (activeFilter === 'Etkinlik') return item.dataType === 'event';
                // İlanın içindeki 'type' alanı ile filtre etiketini karşılaştırır
                return item.type === activeFilter;
            });
        }

        setFilteredData(result);
    }, [searchText, activeFilter, allApprovedData]);

    const renderItem = ({ item }: any) => (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: activeTheme?.surface || '#FFF' }]}
            onPress={() => navigation.navigate(item.dataType === 'job' ? 'JobDetail' : 'EventDetail', { item: item })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.titleWrapper}>
                    <Feather 
                        name={item.dataType === 'job' ? "briefcase" : "calendar"} 
                        size={16} 
                        color={activeTheme?.primary || '#7C3AED'} 
                        style={styles.typeIcon} 
                    />
                    <Text style={[styles.cardTitle, { color: activeTheme?.text || '#000' }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: (activeTheme?.primary || '#7C3AED') + '15' }]}>
                    <Text style={[styles.badgeText, { color: activeTheme?.primary || '#7C3AED' }]}>
                        {item.dataType === 'job' ? (item.type?.toUpperCase() || 'İŞ') : 'ETKİNLİK'}
                    </Text>
                </View>
            </View>
            
            <View style={styles.cardFooter}>
                <Feather name="map-pin" size={12} color={activeTheme?.textSecondary || '#666'} />
                <Text style={[styles.cardCompany, { color: activeTheme?.textSecondary || '#666' }]}>
                    {item.companyName} • {item.location}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme?.background || '#FFF' }]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: activeTheme?.text || '#000' }]}>Keşfet</Text>
                
                {/* Arama Çubuğu */}
                <View style={[styles.searchBox, { backgroundColor: activeTheme?.surface || '#F3F4F6' }]}>
                    <Feather name="search" size={20} color="#9CA3AF" />
                    <TextInput 
                        placeholder="İlan veya firma ara..." 
                        placeholderTextColor="#9CA3AF"
                        style={[styles.input, { color: activeTheme?.text || '#000' }]}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* 🔥 Yatay Filtre Çipleri */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.filterScroll}
                    contentContainerStyle={styles.filterContent}
                >
                    {filters.map((f) => (
                        <TouchableOpacity 
                            key={f.id}
                            onPress={() => setActiveFilter(f.label)}
                            style={[
                                styles.chip, 
                                { backgroundColor: activeFilter === f.label ? activeTheme?.primary : (activeTheme?.surface || '#F3F4F6') }
                            ]}
                        >
                            <Text style={[
                                styles.chipText, 
                                { color: activeFilter === f.label ? '#FFF' : (activeTheme?.textSecondary || '#666') }
                            ]}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator color={activeTheme?.primary || '#7C3AED'} style={{ marginTop: 50 }} />
            ) : (
                <FlatList 
                    data={filteredData}
                    keyExtractor={(item) => 'search-' + item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Feather name="info" size={40} color="#9CA3AF" />
                            <Text style={styles.empty}>Sonuç bulunamadı.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', marginHorizontal: 20, marginTop: 10, marginBottom: 15, letterSpacing: -0.5 },
    searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 16, height: 54, marginHorizontal: 20 },
    input: { flex: 1, marginLeft: 10, fontWeight: '500', fontSize: 15 },
    
    // 🔥 Filtre Stilleri
    filterScroll: { marginTop: 15, paddingLeft: 20 },
    filterContent: { paddingRight: 40, gap: 8 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8 },
    chipText: { fontSize: 13, fontWeight: '700' },

    card: { padding: 18, borderRadius: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    titleWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    typeIcon: { marginRight: 8 },
    cardTitle: { fontWeight: '700', fontSize: 17, flex: 1 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '800' },
    cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    cardCompany: { marginLeft: 6, fontSize: 13, fontWeight: '500' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    empty: { textAlign: 'center', marginTop: 12, color: '#9CA3AF', fontSize: 15, fontWeight: '500' }
});

export default SearchScreen;