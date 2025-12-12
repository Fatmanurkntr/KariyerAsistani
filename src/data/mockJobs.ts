// src/data/mockJobs.ts
import { JobPost } from '../components/JobCard';

// Gerçek hayattan örnek ilanlar
export const JOBS: JobPost[] = [
  {
    id: '1',
    title: 'Junior React Native Developer',
    company: 'Trendyol',
    location: 'İstanbul, Maslak',
    type: 'Hybrid',
    postedAt: '2 saat önce',
    logoUrl: 'https://cdn.webrazzi.com/uploads/2018/06/trendyol-logo-518.png', 
  },
  {
    id: '2',
    title: 'Software Engineer Intern',
    company: 'Google',
    location: 'Remote',
    type: 'Remote',
    postedAt: '1 gün önce',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Getir',
    location: 'İstanbul, Etiler',
    type: 'Tam Zamanlı',
    postedAt: '3 gün önce',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Getir_Logo.svg/1200px-Getir_Logo.svg.png',
  },
  {
    id: '4',
    title: 'Backend Developer (Node.js)',
    company: 'Papara',
    location: 'İstanbul, Üsküdar',
    type: 'Ofis',
    postedAt: '5 gün önce',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Papara_Logo.svg/2560px-Papara_Logo.svg.png',
  },
];