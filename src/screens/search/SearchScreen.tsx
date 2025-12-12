// src/screens/Search/SearchScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { ThemeColors } from '../../theme/types';

interface SearchScreenProps {
  activeTheme: ThemeColors;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ activeTheme }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <View style={styles.content}>
        <Text style={{ fontSize: 50 }}>🔍</Text>
        <Text style={[styles.text, { color: activeTheme.text }]}>Keşfet Sayfası</Text>
        <Text style={{ color: activeTheme.textSecondary, marginTop: 10 }}>Burada detaylı arama yapılacak.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
});

export default SearchScreen;