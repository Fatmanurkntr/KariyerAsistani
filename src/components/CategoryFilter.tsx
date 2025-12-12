// src/components/CategoryFilter.tsx

import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemeColors } from '../theme/types';

// Kategorilerimiz (İleride backend'den de gelebilir)
const CATEGORIES = ['Tümü', 'Staj 🎓', 'Tam Zamanlı 💼', 'Remote 🏠', 'Part-Time ⏳', 'Etkinlik 🎉'];

interface CategoryFilterProps {
  activeTheme: ThemeColors;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeTheme, selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat, index) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                { 
                  backgroundColor: isSelected ? activeTheme.primary : activeTheme.surface,
                  borderColor: activeTheme.surface,
                  borderWidth: 1
                }
              ]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.text, 
                { color: isSelected ? '#FFF' : activeTheme.textSecondary, fontWeight: isSelected ? '700' : '500' }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // Altındaki listeyle mesafe
  },
  scrollContent: {
    paddingHorizontal: 20, // Soldan başlama boşluğu
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20, // Tam yuvarlak köşeler
    marginRight: 10, // Butonlar arası boşluk
  },
  text: {
    fontSize: 14,
  },
});

export default CategoryFilter;