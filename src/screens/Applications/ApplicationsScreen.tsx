// src/screens/Applications/ApplicationsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { ThemeColors } from '../../theme/types';

interface ApplicationsScreenProps {
  activeTheme: ThemeColors;
}

const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({ activeTheme }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <View style={styles.content}>
        <Text style={{ fontSize: 50 }}>💼</Text>
        <Text style={[styles.text, { color: activeTheme.text }]}>Başvurularım</Text>
        <Text style={{ color: activeTheme.textSecondary, marginTop: 10, textAlign: 'center' }}>
          Yaptığınız iş ve staj başvurularının durumunu buradan takip edebilirsiniz.
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

export default ApplicationsScreen;