import { registerUser } from '../src/services/auth';
import { validateEmail, validatePassword } from '../src/utils/validation';

jest.mock('@react-native-firebase/auth', () => () => ({
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({
        user: { uid: 'test-uid-123', sendEmailVerification: jest.fn(), signOut: jest.fn() }
    })),
    signOut: jest.fn()
}));


const mockCollection = jest.fn(() => ({
    doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve()),
    })),
}));

jest.mock('@react-native-firebase/firestore', () => {
    const mock: any = () => ({ collection: mockCollection });
    mock.FieldValue = { serverTimestamp: jest.fn(() => 'mock-timestamp') };
    return mock;
});

describe('Sprint 1: Kayıt ve Güvenlik Testleri', () => {
    test('TC-1.1: Yeni öğrenci kaydı doğru Firestore koleksiyonuna yazılmalı', async () => {
        const studentData = { name: 'Sevde', surname: 'Şahin', school: 'İMU' };
        await registerUser('test@gmail.com', '123456', 'student', studentData);
        expect(mockCollection).toHaveBeenCalledWith('Users');
    });

    test('TC-1.2: Şifre uzunluğu kontrolü (Min 6 Karakter)', () => {
        expect(validatePassword('12345')).toBe(false);
        expect(validatePassword('123456')).toBe(true);
    });

    test('TC-1.3: E-posta format kontrolü', () => {
        expect(validateEmail('hatali-mail')).toBe(false);
        expect(validateEmail('test@gmail.com')).toBe(true);
    });
});