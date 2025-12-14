import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Tema ve stil tiplerini tanımla
interface ButtonProps {
    onPress: () => void;
    title: string;
    
    // 👇 BURAYI DEĞİŞTİRDİK: 'activeTheme' artık opsiyonel
    activeTheme?: any; // activeTheme objesi (mor/koyu renkler)
    
    isLoading?: boolean;
    disabled?: boolean;
    
    buttonStyle?: ViewStyle; // Butonun ana kapsayıcısına stil vermek için
    textStyle?: TextStyle;   // Butonun içindeki yazıya stil vermek için
}

const CustomButton: React.FC<ButtonProps> = ({ 
    onPress, 
    title, 
    activeTheme, 
    isLoading = false, 
    disabled = false, 
    buttonStyle, 
    textStyle   
}) => {
    
    // activeTheme gelmezse (CompanyLogin'deki gibi), varsayılan bir renk atayalım.
    // Bu, activeTheme'i kullanmayan ekranlarda hata vermesini engeller.
    const defaultTheme = activeTheme || { primary: '#6366F1', background: '#FFFFFF' }; // Varsayılan Mor Tema
    
    const defaultButtonColor = defaultTheme.primary;
    const defaultTextColor = defaultTheme.background; 

    // Dışarıdan gelen stil varsa onu, yoksa varsayılan tema rengini kullan
    const finalButtonColor = buttonStyle?.backgroundColor || defaultButtonColor;
    const finalTextColor = textStyle?.color || defaultTextColor;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            style={[
                styles.button,
                { backgroundColor: finalButtonColor }, // Hesaplanan rengi kullan
                (disabled || isLoading) && styles.disabled, // Pasif/yükleniyor durumu
                buttonStyle, // 👈 Dışarıdan gelen butona ait stiller
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={finalTextColor} size="small" />
            ) : (
                <Text style={[styles.text, { color: finalTextColor }, textStyle]}> 
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.6, // Yükleniyor veya pasifken rengi soluklaştır
    },
});

export default CustomButton;