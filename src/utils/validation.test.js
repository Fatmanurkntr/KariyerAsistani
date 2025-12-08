import { validateEmail, validatePassword } from './validation';

describe('Validation Kontrolleri', () => {

    // 1. E-POSTA TESTLERİ
    test('Geçerli bir e-posta adresi TRUE dönmeli', () => {
        expect(validateEmail('ogrenci@okul.edu.tr')).toBe(true);
        expect(validateEmail('test@gmail.com')).toBe(true);
    });

    test('Geçersiz e-posta adresi FALSE dönmeli', () => {
        expect(validateEmail('hatalimail')).toBe(false);      // @ yok
        expect(validateEmail('mail@com')).toBe(false);        // . yok
        expect(validateEmail('')).toBe(false);                // Boş
    });

    // 2. ŞİFRE TESTLERİ
    test('6 karakterden uzun şifre TRUE dönmeli', () => {
        expect(validatePassword('123456')).toBe(true);
        expect(validatePassword('guclubirsifre')).toBe(true);
    });

    test('6 karakterden kısa şifre FALSE dönmeli', () => {
        expect(validatePassword('12345')).toBe(false);
        expect(validatePassword('abc')).toBe(false);
        expect(validatePassword('')).toBe(false);
    });

});