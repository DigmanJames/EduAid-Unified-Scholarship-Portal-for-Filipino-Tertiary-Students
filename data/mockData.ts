
import { Scholarship } from '../types';

export const COMMON_ELIGIBILITY = [
  "Filipino Citizen",
  "Incoming College Freshman",
  "Currently Enrolled in College",
  "GWA of 85% or higher",
  "GWA of 90% or higher",
  "No failing grades",
  "Annual Family Income < ₱300,000",
  "Annual Family Income < ₱150,000",
  "Resident of Priority Region",
  "STEM Strand Graduate",
  "Arts & Design Track",
  "Good Moral Character"
];

export const COMMON_REQUIREMENTS = [
  "Certified True Copy of Grades / Form 138",
  "Certificate of Good Moral Character",
  "Birth Certificate (PSA)",
  "Parents' ITR or Certificate of Indigence",
  "Sketch of Home Map",
  "2x2 ID Picture",
  "Certificate of Enrollment / Registration",
  "Barangay Clearance",
  "Letter of Intent",
  "Recommendation Letter"
];

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: '1',
    title: 'CHED Merit Scholarship Program',
    sponsor: 'Commission on Higher Education (CHED)',
    amount: '₱120,000 / year',
    deadline: '2025-05-31',
    tags: ['Academic Excellence', 'Government', 'Undergraduate'],
    category: 'Merit',
    description: 'Financial assistance for Filipino students with high academic standing enrolled in priority courses. Covers tuition and other school fees, stipend, and book allowance.',
    matchScore: 95,
    isUrgent: true,
    location: 'Quezon City, Metro Manila',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Commission_on_Higher_Education_%28CHED%29.svg/1200px-Commission_on_Higher_Education_%28CHED%29.svg.png',
    websiteUrl: 'https://ched.gov.ph/scholarships/',
    eligibility: [
      'Filipino Citizen',
      'Incoming College Freshman',
      'GWA of 90% or higher'
    ],
    requirements: [
      'Certified True Copy of Grades / Form 138',
      'Parents\' ITR or Certificate of Indigence',
      'Birth Certificate (PSA)'
    ]
  },
  {
    id: '2',
    title: 'DOST-SEI S&T Undergraduate Scholarship',
    sponsor: 'Department of Science and Technology',
    amount: '₱40,000 / sem',
    deadline: '2025-12-31',
    tags: ['STEM', 'Science', 'Engineering', 'Government'],
    category: 'Merit',
    description: 'For talented Filipino students pursuing degree courses in Science, Technology, Engineering, and Mathematics. Includes monthly living allowance, thesis grant, and graduation clothing allowance.',
    matchScore: 88,
    location: 'Taguig City',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Department_of_Science_and_Technology_%28DOST%29.svg/1200px-Department_of_Science_and_Technology_%28DOST%29.svg.png',
    websiteUrl: 'https://www.sei.dost.gov.ph/index.php/programs-and-projects/scholarships/undergraduate-scholarships',
    eligibility: [
      'Filipino Citizen',
      'STEM Strand Graduate',
      'Good Moral Character'
    ],
    requirements: [
      'Certificate of Good Moral Character',
      'Certified True Copy of Grades / Form 138'
    ]
  },
  {
    id: '3',
    title: 'SM Foundation College Scholarship',
    sponsor: 'SM Foundation Inc.',
    amount: 'Full Tuition / year',
    deadline: '2025-03-30',
    tags: ['Private', 'Need-Based', 'Underprivileged'],
    category: 'Need-Based',
    description: 'Comprehensive scholarship for deserving public high school graduates from low-income families. Benefits include full tuition fees, monthly allowance, and opportunities for summer and Christmas jobs.',
    matchScore: 72,
    isUrgent: true,
    location: 'Pasay City',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/SM_Foundation_Logo.svg/1200px-SM_Foundation_Logo.svg.png',
    websiteUrl: 'https://www.sm-foundation.org/programs/education',
    eligibility: [
      'Incoming College Freshman',
      'Annual Family Income < ₱150,000',
      'GWA of 85% or higher'
    ],
    requirements: [
      'Sketch of Home Map',
      'Parents\' ITR or Certificate of Indigence',
      '2x2 ID Picture'
    ]
  },
  {
    id: '4',
    title: 'Ayala Foundation Arts Excellence',
    sponsor: 'Ayala Foundation',
    amount: '₱75,000 / year',
    deadline: '2025-07-15',
    tags: ['Arts', 'Culture', 'Design'],
    category: 'Arts',
    description: 'Supporting promising young Filipino artists and designers to pursue their craft. Open to students enrolled in Fine Arts, Design, or Music programs.',
    matchScore: 65,
    location: 'Makati City',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Ayala_Corporation_logo.png',
    websiteUrl: 'https://www.ayalafoundation.org/',
    eligibility: [
      'Arts & Design Track',
      'GWA of 85% or higher'
    ],
    requirements: [
      'Recommendation Letter',
      'Certified True Copy of Grades / Form 138'
    ]
  },
  {
    id: '5',
    title: 'BPI-DOST Science Awards',
    sponsor: 'BPI Foundation',
    amount: '₱50,000 / year',
    deadline: '2025-02-15',
    tags: ['Research', 'Innovation', 'Science'],
    category: 'Research',
    description: 'Recognizing exceptional science and research projects by Filipino students. Winners receive cash prizes and research grants to further their studies.',
    matchScore: 40,
    location: 'Makati City',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/Bank_of_the_Philippine_Islands_logo.svg/1200px-Bank_of_the_Philippine_Islands_logo.svg.png',
    websiteUrl: 'https://www.bpifoundation.org/',
    eligibility: [
      'Currently Enrolled in College',
      'No failing grades'
    ],
    requirements: [
      'Letter of Intent',
      'Recommendation Letter'
    ]
  },
  {
    id: '6',
    title: 'Gokongwei Brothers Foundation Grant',
    sponsor: 'Gokongwei Brothers Foundation',
    amount: 'Full Tuition / year',
    deadline: '2025-11-20',
    tags: ['STEM', 'Need-Based'],
    category: 'Need-Based',
    description: 'Providing quality STEM education access to underprivileged students in the Philippines. Covers tuition, books, and other academic expenses.',
    matchScore: 92,
    location: 'Pasig City',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/Gokongwei_Brothers_Foundation_logo.png',
    websiteUrl: 'https://www.gokongweibrothersfoundation.org/',
    eligibility: [
      'STEM Strand Graduate',
      'Annual Family Income < ₱300,000',
      'Good Moral Character'
    ],
    requirements: [
      'Letter of Intent',
      'Certified True Copy of Grades / Form 138',
      'Parents\' ITR or Certificate of Indigence'
    ]
  }
];
