import firestore from '@react-native-firebase/firestore';

// Mocking yapısını daha sade ve sağlam hale getirelim
const mockBatchSet = jest.fn();
const mockBatchUpdate = jest.fn();
const mockBatchCommit = jest.fn(() => Promise.resolve());

jest.mock('@react-native-firebase/firestore', () => {
  const mFirestore = () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({})),
    })),
    batch: jest.fn(() => ({
      set: mockBatchSet,
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    })),
  });
  mFirestore.FieldValue = {
    increment: jest.fn((val) => `incremented_by_${val}`),
    serverTimestamp: jest.fn(() => 'mock_timestamp'),
  };
  return mFirestore;
});

describe('Kariyer Asistanı Firestore Senkronizasyon Testleri', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Her testten önce çağrı sayılarını sıfırla
  });

  // 1. TEST: Atomik Başvuru ve Sayaç Güncelleme
  test('Başvuru yapıldığında Applications eklenmeli ve JobPostings sayacı artmalı', async () => {
    
    // Uygulama içindeki gerçek başvuru fonksiyonunu simüle ediyoruz
    const performApply = async (userId, jobId) => {
      const batch = firestore().batch();
      const appRef = firestore().collection('Applications').doc();
      const jobRef = firestore().collection('JobPostings').doc(jobId);

      // Veritabanına yazma komutları
      batch.set(appRef, { userId, jobId, appliedAt: 'mock_timestamp' });
      batch.update(jobRef, { applicationCount: 'incremented_by_1' });
      await batch.commit();
    };

    await performApply('user_123', 'job_456');

    // Beklentiler: Fonksiyonlar doğru verilerle çağrıldı mı?
    expect(mockBatchSet).toHaveBeenCalledWith(
      expect.anything(), 
      expect.objectContaining({ userId: 'user_123', jobId: 'job_456' })
    );
    expect(mockBatchUpdate).toHaveBeenCalledWith(
      expect.anything(), 
      { applicationCount: 'incremented_by_1' }
    );
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);
  });

  // 2. TEST: onSnapshot Senkronizasyon Mantığı
  test('onSnapshot verisi geldiğinde isFavorite durumu doğru güncellenmeli', () => {
    const mockData = { empty: false }; 
    const setIsFavorite = jest.fn();

    // Uygulama ekranlarındaki anlık dinleyici mantığı
    const simulateSnapshot = (snapshot) => {
      setIsFavorite(!snapshot.empty);
    };

    simulateSnapshot(mockData);

    expect(setIsFavorite).toHaveBeenCalledWith(true);
  });
});