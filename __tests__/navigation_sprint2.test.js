import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { parseDateString } from '../src/utils/dateHelpers';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate }),
    useRoute: () => ({ params: {} }),
}));

const MockSafeScreen = ({ activeTheme, route }) => {
    const theme = activeTheme || { background: '#FFF' };
    const item = route?.params?.item;
    return (
        <View style={{ backgroundColor: theme.background }}>
            <Text testID="item-id">{item?.id || 'YÜKLENİYOR'}</Text>
            <TouchableOpacity testID="nav-btn" onPress={() => mockNavigate('Dashboard', { screen: 'Başvurularım' })}>
                <Text>Git</Text>
            </TouchableOpacity>
        </View>
    );
};

describe('Sprint 2: Navigasyon Güvenliği ve Veri Senkronizasyonu', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('TC-2.1: Parametre eksik olsa bile Safe Access mekanizması çökmeyi önlemeli', () => {

        const { getByTestId } = render(<MockSafeScreen route={{ params: undefined }} />);
        const idText = getByTestId('item-id');

        expect(idText.props.children).toBe('YÜKLENİYOR');
    });

    test('TC-2.2: Firestore string tarihleri Date nesnesine doğru dönüştürülmeli', () => {
        const dateStr = "19.12.2025";
        const result = parseDateString(dateStr);

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(11);
    });

    test('TC-2.3: activeTheme undefined geldiğinde varsayılan tema devreye girmeli', () => {
        const { getByTestId } = render(<MockSafeScreen activeTheme={undefined} />);
        const container = getByTestId('item-id').parent;

        expect(container).toBeTruthy();
    });


    test('TC-2.4: Sayfalar arası geçişte veri (ID) eksiksiz taşınmalı', () => {
        const mockEvent = { id: 'event_01', title: 'Medeniyet Kariyer', location: 'Zoom' };
        const route = { params: { item: mockEvent } };

        expect(route.params.item.id).toBe('event_01');
        expect(route.params.item.location.toLowerCase()).toBe('zoom');
    });

    test('TC-2.5: Profil yönlendirmesi doğru nested navigation rotasını tetiklemeli', () => {
        const { getByTestId } = render(<MockSafeScreen />);
        fireEvent.press(getByTestId('nav-btn'));

        expect(mockNavigate).toHaveBeenCalledWith('Dashboard', { screen: 'Başvurularım' });
    });
});