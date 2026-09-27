/**
 * NyayaSetu — Mock Lawyers Data
 * Featured Advocates: Adv. Shruti Kirty & Adv. Prince Kumar
 * Flat Fee: ₹500 per session across all advocates.
 * Includes QR code image paths and UPI IDs for direct payments.
 */

export const MOCK_LAWYERS = [
  {
    id: 'lw-001',
    name: 'Adv. Shruti Kirty',
    slug: 'shruti-kirty',
    avatar: null,
    initials: 'SK',
    specializations: ['High Court Writs', 'Civil & Commercial Law'],
    languages: ['Hindi', 'English'],
    experience: 1,
    location: 'Ranchi High Court',
    bio: 'Dedicated legal professional providing consultation and representation across a wide range of legal matters. Focused on understanding clients\' concerns and providing clear, practical legal guidance.',
    rating: 4.9,
    consultationCount: 10,
    ratePerSession: 500,
    pricePerMinute: 25,
    ratePerMinute: 25,
    upiId: 'shrutikirty@upi',
    qrCodeImage: '/img/qrcodes/shruti_kirty_qr.png',
    consultationModes: ['Video Call', 'Phone', 'Chat'],
    available: true,
    verified: true,
    badge: 'Verified Advocate',
    accentColor: '#C8941A',
  },
  {
    id: 'lw-002',
    name: 'Adv. Prince Kumar',
    slug: 'prince-kumar',
    avatar: null,
    initials: 'PK',
    specializations: ['District Court Litigation', 'Consumer & Property'],
    languages: ['Hindi', 'English'],
    experience: 2,
    location: 'Deoghar Court',
    bio: 'Committed to helping clients understand their legal options and navigate court procedures with confidence. Provides practical guidance and professional assistance across a variety of everyday legal matters.',
    rating: 4.8,
    consultationCount: 18,
    ratePerSession: 500,
    pricePerMinute: 25,
    ratePerMinute: 25,
    upiId: 'princekumar@upi',
    qrCodeImage: '/img/qrcodes/prince_kumar_qr.png',
    consultationModes: ['Video Call', 'In-Person'],
    available: true,
    verified: true,
    badge: 'Verified Advocate',
    accentColor: '#5724ff',
  },
];

export const POPULAR_PROBLEMS = [
  {
    id: 'p1',
    problem: 'My landlord is refusing to return my security deposit',
    category: 'property-rental',
    categoryLabel: 'Property & Rental',
    searches: '12,400',
    icon: '🏠',
  },
  {
    id: 'p2',
    problem: 'Unauthorized UPI transaction — money deducted without consent',
    category: 'banking-finance',
    categoryLabel: 'Banking & Finance',
    searches: '8,900',
    icon: '💳',
  },
  {
    id: 'p3',
    problem: 'Employer has not paid my salary for 2 months',
    category: 'employment-workplace',
    categoryLabel: 'Employment',
    searches: '7,200',
    icon: '💼',
  },
  {
    id: 'p4',
    problem: 'Online order arrived damaged, company refusing replacement',
    category: 'consumer-rights',
    categoryLabel: 'Consumer Rights',
    searches: '15,600',
    icon: '📦',
  },
];
