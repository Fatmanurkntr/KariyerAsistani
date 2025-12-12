// src/screens/Favorites/FavoritesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { ThemeColors } from '../../theme/types';

interface FavoritesScreenProps {
  activeTheme: ThemeColors;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ activeTheme }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <View style={styles.content}>
        <Text style={{ fontSize: 50 }}>❤️</Text>
        <Text style={[styles.text, { color: activeTheme.text }]}>Favori İlanların</Text>
        <Text style={{ color: activeTheme.textSecondary, marginTop: 10, textAlign: 'center' }}>
          Beğendiğin ve kaydettiğin tüm ilanlar burada listelenecek.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
});

export default FavoritesScreen;