// src/components/HorizontalJobCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ThemeColors } from '../theme/types';
import { JobPost } from './JobCard'; // Tip tanımını diğer dosyadan ödünç alıyoruz

interface HorizontalJobCardProps {
  item: JobPost;
  activeTheme: ThemeColors;
  onPress: () => void;
}

// Ekran genişliğine göre kart boyutu ayarlayalım
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; // Ekranın %75'ini kaplasın

const HorizontalJobCard: React.FC<HorizontalJobCardProps> = ({ item, activeTheme, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: activeTheme.surface }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 1. Üst Kısım: Logo ve Etiket */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: '#fff' }]}>
            <Image 
              source={{ uri: item.logoUrl }} 
              style={styles.logo} 
              resizeMode="contain"
            />
        </View>
        <View style={[styles.badge, { backgroundColor: activeTheme.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: activeTheme.primary }]}>{item.type}</Text>
        </View>
      </View>

      {/* 2. Orta Kısım: Başlıklar */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: activeTheme.text }]} numberOfLines={2}>
            {item.title}
        </Text>
        <Text style={[styles.company, { color: activeTheme.textSecondary }]}>
            {item.company}
        </Text>
      </View>

      {/* 3. Alt Kısım: Konum ve Tarih */}
      <View style={styles.footer}>
        <Text style={[styles.location, { color: activeTheme.textSecondary }]}>📍 {item.location}</Text>
        <Text style={[styles.date, { color: activeTheme.textSecondary }]}>{item.postedAt}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    padding: 16,
    marginRight: 16, // Kartlar arası boşluk
    borderRadius: 24, // Youtube Music gibi iyice yuvarlatılmış köşeler
    // Hafif gölge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  logo: {
    width: 40,
    height: 40,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 24,
  },
  company: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  location: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
  },
});

export default HorizontalJobCard;