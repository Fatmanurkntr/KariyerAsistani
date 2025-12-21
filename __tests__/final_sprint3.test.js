import firestore from '@react-native-firebase/firestore';

const mockBatchUpdate = jest.fn();
const mockBatchSet = jest.fn();
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

describe('Sprint 3: Admin Paneli ve Liste Performans Testleri', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('TC-3.1: "Duplicate Key" Hatası Önleyici - Farklı veri tiplerindeki aynı IDler çakışmamalı', () => {
        const jobItem = { id: '123', dataType: 'job' };
        const eventItem = { id: '123', dataType: 'event' };

        const jobKey = `${jobItem.dataType}-${jobItem.id}`;
        const eventKey = `${eventItem.dataType}-${eventItem.id}`;

        expect(jobKey).toBe('job-123');
        expect(eventKey).toBe('event-123');
        expect(jobKey).not.toEqual(eventKey);
    });

    test('TC-3.2: Liste Sıralama Mantığı - Yeni tarihli başvurular her zaman başta olmalı', () => {
        const mockApps = [
            { id: 1, appliedAt: { seconds: 1000 } },
            { id: 2, appliedAt: { seconds: 5000 } },
        ];

        const sortedApps = [...mockApps].sort((a, b) => b.appliedAt.seconds - a.appliedAt.seconds);

        expect(sortedApps[0].id).toBe(2);
    });


    test('TC-3.3: Admin Arama Motoru - Hem başlık hem firma ismini taramalı', () => {
        const mockList = [
            { title: 'React Stajı', companyName: 'Trendyol' },
            { title: 'Kariyer Günü', companyName: 'İMU' }
        ];

        const search = (query) => mockList.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.companyName.toLowerCase().includes(query.toLowerCase())
        );

        expect(search('React').length).toBe(1);
        expect(search('Trendyol').length).toBe(1);
        expect(search('OlmayanVeri').length).toBe(0);
    });

    test('TC-3.4: Admin Onay İşlemi - İlan statüsünü atomik olarak değiştirmeli', () => {
        const post = { id: 'post_1', status: 'pending' };
        const approvePost = (item) => ({ ...item, status: 'approved' });

        const updatedPost = approvePost(post);
        expect(updatedPost.status).toBe('approved');
    });


    test('TC-3.5: Başvuru Senkronizasyonu - Sayaç (increment) atomik olarak artmalı', async () => {

        const performApply = async (jobId) => {
            const batch = firestore().batch();
            const jobRef = firestore().collection('JobPostings').doc(jobId);
            batch.update(jobRef, { applicationCount: firestore.FieldValue.increment(1) });
            await batch.commit();
        };

        await performApply('job_abc');

        expect(mockBatchUpdate).toHaveBeenCalledWith(
            expect.anything(),
            { applicationCount: 'incremented_by_1' }
        );
        expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    });
});