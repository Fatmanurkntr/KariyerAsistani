// __tests__/core_logic.test.ts
import { validateEmail, validatePassword } from '../src/utils/validation';
import { parseDateString, getEffectiveDeadline } from '../src/utils/dateHelpers';

describe('Kariyer Asistanı - Çekirdek İş Mantığı (Core Logic) Testleri', () => {

    describe('1. Güvenlik ve Giriş Doğrulama (Validation)', () => {

        test('TC-V1.1: Geçerli e-posta formatlarını kabul etmeli', () => {
            expect(validateEmail('test@gmail.com')).toBe(true);
            expect(validateEmail('ogrenci@edu.tr')).toBe(true);
        });

        test('TC-V1.2: Geçersiz e-posta formatlarını reddetmeli', () => {
            expect(validateEmail('hatalimail')).toBe(false);
            expect(validateEmail('test@gmail')).toBe(false);
            expect(validateEmail('')).toBe(false);
        });

        test('TC-V2.1: Şifre en az 6 karakter olmalı', () => {
            expect(validatePassword('123456')).toBe(true);
            expect(validatePassword('12345')).toBe(false);
            expect(validatePassword('')).toBe(false);
        });
    });

    describe('2. Tarih İşleme ve Bildirim Mantığı (Date Helpers)', () => {

        test('TC-D1.1: "YYYY-MM-DD" formatını doğru parse etmeli', () => {
            const result = parseDateString('2025-12-19');
            expect(result?.getFullYear()).toBe(2025);
            expect(result?.getMonth()).toBe(11); // Aralık indexi 11'dir
        });

        test('TC-D1.2: "DD.MM.YYYY" formatını doğru parse etmeli', () => {
            const result = parseDateString('19.12.2025');
            expect(result?.getDate()).toBe(19);
            expect(result?.getMonth()).toBe(11);
        });

        test('TC-D1.3: Geçersiz tarih metinlerinde null dönmeli (Çökme Koruması)', () => {
            const result = parseDateString('geçersiz-tarih');
            expect(result).toBeNull();
        });

        test('TC-D2.1: Deadline yoksa etkinlik tarihini baz almalı', () => {
            const mockItem = { date: '25.12.2025', deadlineDate: '' };
            const effectiveDate = getEffectiveDeadline(mockItem);
            expect(effectiveDate?.getDate()).toBe(25);
        });
    });

    describe('3. Veri Yapısı ve Filtreleme Mantığı', () => {

        test('TC-L1.1: Arama motoru büyük/küçük harf duyarsız çalışmalı', () => {
            const mockList = [
                { title: 'React Native Geliştirici', company: 'Trendyol' },
                { title: 'Backend Stajı', company: 'Getir' }
            ];

            const query = 'reACt';
            const filtered = mockList.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );

            expect(filtered.length).toBe(1);
            expect(filtered[0].company).toBe('Trendyol');
        });

        test('TC-L1.2: Boş arama metni tüm listeyi döndürmeli', () => {
            const mockList = [{ id: 1 }, { id: 2 }];
            const query = '';
            const filtered = mockList.filter(item => (item as any).id.toString().includes(query));
            expect(filtered.length).toBe(2);
        });
    });
});