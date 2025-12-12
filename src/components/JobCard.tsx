// src/components/JobCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemeColors } from '../theme/types';

// İlan Verisinin Şablonu (Interface)
export interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;    // Örn: Remote, Hybrid
  logoUrl: string; // Resim linki
  postedAt: string;
}

interface JobCardProps {
  item: JobPost;          // Kartın içine gelecek veri
  activeTheme: ThemeColors; // Tema renkleri
  onPress: () => void;    // Tıklanınca ne olsun?
}

const JobCard: React.FC<JobCardProps> = ({ item, activeTheme, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: activeTheme.surface, shadowColor: activeTheme.text }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 1. Logo Kısmı */}
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: item.logoUrl }} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>

      {/* 2. Bilgi Kısmı */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: activeTheme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.company, { color: activeTheme.textSecondary }]}>
          {item.company} • {item.location}
        </Text>

        {/* 3. Alt Etiketler */}
        <View style={styles.footer}>
          <View style={[styles.badge, { backgroundColor: activeTheme.background }]}>
            <Text style={[styles.badgeText, { color: activeTheme.primary }]}>
              {item.type}
            </Text>
          </View>
          <Text style={[styles.date, { color: activeTheme.textSecondary }]}>
            {item.postedAt}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Yan yana dizilim
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    // Gölge Efektleri (iOS ve Android uyumlu)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    marginHorizontal: 2, // Yanlardan hafif boşluk
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logo: {
    width: 36,
    height: 36,
  },
  infoContainer: {
    flex: 1, // Kalan boşluğu doldur
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
});

export default JobCard;