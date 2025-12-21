import { validateEmail, validatePassword } from '../src/utils/validation';

describe('Güvenlik ve Doğrulama Birim Testleri', () => {

    describe('E-posta Format Doğrulaması', () => {
        test('TC-V1.1: Standart geçerli e-posta formatlarını kabul etmeli', () => {
            expect(validateEmail('test@gmail.com')).toBe(true);
            expect(validateEmail('ogrenci@edu.tr')).toBe(true);
        });

        test('TC-V1.2: "@" işareti olmayan formatları reddetmeli', () => {
            expect(validateEmail('hatalimail.com')).toBe(false);
        });

        test('TC-V1.3: Nokta (.) uzantısı eksik olan formatları reddetmeli', () => {
            expect(validateEmail('test@gmail')).toBe(false);
        });

        test('TC-V1.4: Boş e-posta girişini reddetmeli', () => {
            expect(validateEmail('')).toBe(false);
        });
    });

    describe('Şifre Güvenlik Doğrulaması', () => {
        test('TC-V2.1: 6 karakter ve üzeri şifreleri kabul etmeli', () => {
            expect(validatePassword('123456')).toBe(true);
            expect(validatePassword('sifre123')).toBe(true);
        });

        test('TC-V2.2: 6 karakterden kısa şifreleri reddetmeli', () => {
            expect(validatePassword('12345')).toBe(false);
            expect(validatePassword('abc')).toBe(false);
        });

        test('TC-V2.3: Boş şifre girişini reddetmeli', () => {
            expect(validatePassword('')).toBe(false);
            expect(validatePassword(null)).toBe(false);
        });
    });
});