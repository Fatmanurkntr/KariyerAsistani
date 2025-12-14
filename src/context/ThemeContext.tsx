import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeColors, lightTheme } from '../theme/types'; // ThemeColors tipini varsayıyoruz

interface ThemeContextType {
    activeTheme: ThemeColors;
    toggleTheme: () => void; // Temayı değiştirmek için fonksiyon
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Yer tutucu Theme Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Şimdilik sadece sabit lightTheme kullanıyoruz
    const activeTheme = lightTheme; 
    
    const toggleTheme = () => {
        // Gerçek mantık burada olacak
        console.log("Tema değiştirme fonksiyonu çalıştı.");
    };

    return (
        <ThemeContext.Provider value={{ activeTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme, ThemeProvider içinde kullanılmalıdır.');
    }
    return context;
};