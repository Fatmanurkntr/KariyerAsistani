// src/navigation/AppNavigator.tsx

import React from 'react';
import AuthStack from './AuthStack';
import MainStack from './MainStack'; // ✅ Ana sayfa ve menülerin olduğu yapı
import { ThemeProps } from '../theme/types';

interface AppNavigatorProps extends ThemeProps {
  user?: any; // Firebase kullanıcısı (Doluysa giriş yapılmış, null ise yapılmamış)
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ activeTheme, user }) => {
  
  return (
    user ? (
      <MainStack activeTheme={activeTheme} />
    ) : (
      <AuthStack activeTheme={activeTheme} />
    )
  );
};

export default AppNavigator;