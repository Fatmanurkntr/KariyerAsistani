// src/navigation/AppNavigator.tsx
import React from 'react';
import AuthStack from './AuthStack';
import MainStack from './MainStack'; // <--- YENİ: Bunu ekle
import { ThemeProps } from '../theme/types';

interface AppNavigatorProps extends ThemeProps {
  user: any;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ activeTheme, user }) => {

  return (
    user ? (
      // ESKİSİ: <HomeScreen activeTheme={activeTheme} /> 
      // YENİSİ: MainStack kullanıyoruz ki Home ve Profile arasında gezebilelim
      <MainStack activeTheme={activeTheme} />
    ) : (
      <AuthStack activeTheme={activeTheme} />
    )
  );
};

export default AppNavigator;