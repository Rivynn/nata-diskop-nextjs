import type { UsersType } from '@/types/apps/userTypes'

export const db: UsersType[] = [
  // =========================================================
  // ADMIN
  // =========================================================

  {
    id: 1,
    fullName: 'Ahmad Fauzan',
    username: 'ahmad.fauzan',
    email: 'ahmad.fauzan@diskop.banjarbarukota.go.id',
    phone: '081251234567',
    role: 'admin',
    status: 'active',
    emailVerifiedAt: '2026-01-08T09:15:00.000Z',
    phoneVerifiedAt: '2026-01-08T09:20:00.000Z',
    avatar: '/images/avatars/1.png',
    avatarColor: 'primary',
    lastLoginAt: '2026-10-04T07:30:00.000Z',
    createdAt: '2026-01-08',
    updatedAt: '2026-10-04',

    profile: {
      type: 'admin',
      isPrimary: true,
      position: 'Administrator Utama',
      department: 'Dinas Koperasi, Usaha Mikro dan Tenaga Kerja',
      lastLoginAt: '2026-10-04T07:30:00.000Z'
    }
  },

  {
    id: 31,
    fullName: 'Rudi Hartono',
    username: 'rudi.hartono',
    email: 'rudi.hartono@diskop.banjarbarukota.go.id',
    phone: '081251234597',
    role: 'admin',
    status: 'active',
    emailVerifiedAt: '2026-04-10T09:00:00.000Z',
    phoneVerifiedAt: '2026-04-10T09:05:00.000Z',
    avatar: '/images/avatars/8.png',
    avatarColor: 'info',
    lastLoginAt: '2026-10-03T08:15:00.000Z',
    createdAt: '2026-04-10',
    updatedAt: '2026-10-03',

    profile: {
      type: 'admin',
      isPrimary: false,
      position: 'Administrator Sistem',
      department: 'Bidang Pelatihan dan Pengembangan SDM',
      lastLoginAt: '2026-10-03T08:15:00.000Z'
    }
  },

  {
    id: 32,
    fullName: 'Nurul Hidayah',
    username: 'nurul.hidayah',
    email: 'nurul.hidayah@diskop.banjarbarukota.go.id',
    phone: '081351234598',
    role: 'admin',
    status: 'pending',
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    avatar: '',
    avatarColor: 'success',
    lastLoginAt: null,
    createdAt: '2026-04-15',
    updatedAt: '2026-04-15',

    profile: {
      type: 'admin',
      isPrimary: false,
      position: 'Administrator',
      department: 'Sekretariat',
      lastLoginAt: null
    }
  },

  // =========================================================
  // PEGAWAI
  // =========================================================

  {
    id: 2,
    fullName: 'Siti Rahma',
    username: 'siti.rahma',
    email: 'siti.rahma@diskop.banjarbarukota.go.id',
    phone: '081351234568',
    role: 'pegawai',
    status: 'active',
    emailVerifiedAt: '2026-01-10T10:20:00.000Z',
    phoneVerifiedAt: '2026-01-10T10:25:00.000Z',
    avatar: '/images/avatars/2.png',
    lastLoginAt: '2026-10-03T08:10:00.000Z',
    createdAt: '2026-01-10',
    updatedAt: '2026-10-03',

    profile: {
      type: 'pegawai',
      nik: '6372014501890001',
      nip: '198901152015032001',
      department: 'Bidang Pelatihan',
      position: 'Analis Pelatihan',
      employmentType: 'pns',
      joinedAt: '2015-03-01'
    }
  },

  {
    id: 3,
    fullName: 'Budi Santoso',
    username: 'budi.santoso',
    email: 'budi.santoso@diskop.banjarbarukota.go.id',
    phone: '081251234569',
    role: 'pegawai',
    status: 'active',
    emailVerifiedAt: '2026-01-12T08:45:00.000Z',
    phoneVerifiedAt: '2026-01-12T08:50:00.000Z',
    avatar: '/images/avatars/3.png',
    avatarColor: 'warning',
    lastLoginAt: '2026-10-02T09:20:00.000Z',
    createdAt: '2026-01-12',
    updatedAt: '2026-10-02',

    profile: {
      type: 'pegawai',
      nik: '6372011202880002',
      nip: '198802122016021002',
      department: 'Bidang Ketenagakerjaan',
      position: 'Pengelola Program',
      employmentType: 'pns',
      joinedAt: '2016-02-01'
    }
  },

  {
    id: 17,
    fullName: 'Rina Wulandari',
    username: 'rina.wulandari',
    email: 'rina.wulandari@diskop.banjarbarukota.go.id',
    phone: '081251234583',
    role: 'pegawai',
    status: 'active',
    emailVerifiedAt: '2026-03-10T08:20:00.000Z',
    phoneVerifiedAt: '2026-03-10T08:25:00.000Z',
    avatar: '/images/avatars/5.png',
    lastLoginAt: '2026-10-01T07:45:00.000Z',
    createdAt: '2026-03-10',
    updatedAt: '2026-10-01',

    profile: {
      type: 'pegawai',
      nik: '6372015603900003',
      nip: '199003162019032003',
      department: 'Sekretariat',
      position: 'Pengelola Administrasi',
      employmentType: 'pppk',
      joinedAt: '2019-03-01'
    }
  },

  {
    id: 18,
    fullName: 'Yoga Pranata',
    username: 'yoga.pranata',
    email: 'yoga.pranata@diskop.banjarbarukota.go.id',
    phone: '081351234584',
    role: 'pegawai',
    status: 'active',
    emailVerifiedAt: '2026-03-12T09:30:00.000Z',
    phoneVerifiedAt: '2026-03-12T09:35:00.000Z',
    avatar: '',
    avatarColor: 'success',
    lastLoginAt: '2026-09-30T10:10:00.000Z',
    createdAt: '2026-03-12',
    updatedAt: '2026-09-30',

    profile: {
      type: 'pegawai',
      nik: '6372011001910004',
      nip: '199101102020011004',
      department: 'Bidang Koperasi',
      position: 'Pengelola Data',
      employmentType: 'pns',
      joinedAt: '2020-01-01'
    }
  },

  // =========================================================
  // PESERTA
  // =========================================================

  {
    id: 4,
    fullName: 'Dewi Lestari',
    username: 'dewi.lestari',
    email: 'dewi.lestari@gmail.com',
    phone: '081351234570',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-02-03T11:10:00.000Z',
    phoneVerifiedAt: '2026-02-03T11:15:00.000Z',
    avatar: '/images/avatars/4.png',
    lastLoginAt: '2026-10-03T12:10:00.000Z',
    createdAt: '2026-02-03',
    updatedAt: '2026-10-03',

    profile: {
      type: 'peserta',
      nik: '6372016505980001',
      nickname: 'Dewi',
      birthPlace: 'Banjarbaru',
      birthDate: '1998-05-25',
      gender: 'female',
      address: 'Jl. A. Yani, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Lambung Mangkurat',
      major: 'Manajemen',
      graduationYear: 2021,
      employmentStatus: 'bekerja',
      occupation: 'Staff Administrasi',
      companyName: 'PT Banua Sejahtera'
    }
  },

  {
    id: 5,
    fullName: 'Rizky Maulana',
    username: 'rizky.maulana',
    email: 'rizky.maulana@gmail.com',
    phone: '081251234571',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-02-05T13:25:00.000Z',
    phoneVerifiedAt: '2026-02-05T13:30:00.000Z',
    avatar: '',
    avatarColor: 'success',
    lastLoginAt: '2026-10-02T15:00:00.000Z',
    createdAt: '2026-02-05',
    updatedAt: '2026-10-02',

    profile: {
      type: 'peserta',
      nik: '6372012203990002',
      nickname: 'Rizky',
      birthPlace: 'Martapura',
      birthDate: '1999-03-22',
      gender: 'male',
      address: 'Jl. Intan, Martapura',
      education: 'SMA',
      institution: 'SMAN 1 Martapura',
      major: 'IPS',
      graduationYear: 2017,
      employmentStatus: 'wirausaha',
      occupation: 'Pemilik Usaha',
      companyName: 'Rizky Digital'
    }
  },

  {
    id: 6,
    fullName: 'Andi Pratama',
    username: 'andi.pratama',
    email: 'andi.pratama@gmail.com',
    phone: '081351234572',
    role: 'peserta',
    status: 'pending',
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    avatar: '/images/avatars/5.png',
    lastLoginAt: null,
    createdAt: '2026-02-08',
    updatedAt: '2026-02-08',

    profile: {
      type: 'peserta',
      nik: '6372011506050003',
      nickname: 'Andi',
      birthPlace: 'Banjarbaru',
      birthDate: '2005-06-15',
      gender: 'male',
      address: 'Jl. Trikora, Banjarbaru',
      education: 'SMK',
      institution: 'SMKN 1 Banjarbaru',
      major: 'Teknik Komputer dan Jaringan',
      graduationYear: 2024,
      employmentStatus: 'belum_bekerja',
      occupation: null,
      companyName: null
    }
  },

  {
    id: 7,
    fullName: 'Nadia Putri',
    username: 'nadia.putri',
    email: 'nadia.putri@gmail.com',
    phone: '081251234573',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-02-11T14:30:00.000Z',
    phoneVerifiedAt: '2026-02-11T14:35:00.000Z',
    avatar: '/images/avatars/6.png',
    lastLoginAt: '2026-10-01T13:00:00.000Z',
    createdAt: '2026-02-11',
    updatedAt: '2026-10-01',

    profile: {
      type: 'peserta',
      nik: '6372015801970004',
      nickname: 'Nadia',
      birthPlace: 'Banjarmasin',
      birthDate: '1997-01-18',
      gender: 'female',
      address: 'Jl. Guntung Manggis, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Lambung Mangkurat',
      major: 'Akuntansi',
      graduationYear: 2020,
      employmentStatus: 'bekerja',
      occupation: 'Staff Keuangan',
      companyName: 'CV Banua Mandiri'
    }
  },

  {
    id: 14,
    fullName: 'Muhammad Ilham',
    username: 'muhammad.ilham',
    email: 'muhammad.ilham@gmail.com',
    phone: '081251234580',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-03-03T11:20:00.000Z',
    phoneVerifiedAt: '2026-03-03T11:25:00.000Z',
    avatar: '/images/avatars/3.png',
    lastLoginAt: '2026-09-29T08:00:00.000Z',
    createdAt: '2026-03-03',
    updatedAt: '2026-09-29',

    profile: {
      type: 'peserta',
      nik: '6372012802950005',
      nickname: 'Ilham',
      birthPlace: 'Banjarbaru',
      birthDate: '1995-02-28',
      gender: 'male',
      address: 'Jl. RO Ulin, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Islam Kalimantan',
      major: 'Teknik Informatika',
      graduationYear: 2018,
      employmentStatus: 'bekerja',
      occupation: 'Web Developer',
      companyName: 'PT Borneo Digital'
    }
  },

  {
    id: 15,
    fullName: 'Putri Amelia',
    username: 'putri.amelia',
    email: 'putri.amelia@gmail.com',
    phone: '081251234581',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-03-05T13:10:00.000Z',
    phoneVerifiedAt: '2026-03-05T13:15:00.000Z',
    avatar: '',
    avatarColor: 'primary',
    lastLoginAt: '2026-09-28T14:20:00.000Z',
    createdAt: '2026-03-05',
    updatedAt: '2026-09-28',

    profile: {
      type: 'peserta',
      nik: '6372014404000006',
      nickname: 'Putri',
      birthPlace: 'Banjarbaru',
      birthDate: '2000-04-04',
      gender: 'female',
      address: 'Jl. Panglima Batur, Banjarbaru',
      education: 'D3',
      institution: 'Politeknik Negeri Banjarmasin',
      major: 'Administrasi Bisnis',
      graduationYear: 2021,
      employmentStatus: 'bekerja',
      occupation: 'Admin',
      companyName: 'PT Kalsel Kreatif'
    }
  },

  {
    id: 16,
    fullName: 'Dimas Ramadhan',
    username: 'dimas.ramadhan',
    email: 'dimas.ramadhan@gmail.com',
    phone: '081251234582',
    role: 'peserta',
    status: 'pending',
    emailVerifiedAt: '2026-03-07T10:00:00.000Z',
    phoneVerifiedAt: null,
    avatar: '/images/avatars/4.png',
    lastLoginAt: null,
    createdAt: '2026-03-07',
    updatedAt: '2026-03-07',

    profile: {
      type: 'peserta',
      nik: '6372011012020007',
      nickname: 'Dimas',
      birthPlace: 'Banjarbaru',
      birthDate: '2002-12-10',
      gender: 'male',
      address: 'Jl. Mistar Cokrokusumo, Banjarbaru',
      education: 'SMA',
      institution: 'SMAN 2 Banjarbaru',
      major: 'IPA',
      graduationYear: 2021,
      employmentStatus: 'belum_bekerja',
      occupation: null,
      companyName: null
    }
  },

  {
    id: 22,
    fullName: 'Salsabila Putri',
    username: 'salsabila.putri',
    email: 'salsabila.putri@gmail.com',
    phone: '081251234588',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-03-22T11:45:00.000Z',
    phoneVerifiedAt: '2026-03-22T11:50:00.000Z',
    avatar: '/images/avatars/1.png',
    lastLoginAt: '2026-09-30T11:00:00.000Z',
    createdAt: '2026-03-22',
    updatedAt: '2026-09-30',

    profile: {
      type: 'peserta',
      nik: '6372015203990008',
      nickname: 'Salsa',
      birthPlace: 'Banjarmasin',
      birthDate: '1999-03-12',
      gender: 'female',
      address: 'Jl. A. Yani KM 33, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Lambung Mangkurat',
      major: 'Ilmu Komunikasi',
      graduationYear: 2021,
      employmentStatus: 'bekerja',
      occupation: 'Content Creator',
      companyName: 'Banua Creative'
    }
  },

  {
    id: 23,
    fullName: 'Rafi Kurniawan',
    username: 'rafi.kurniawan',
    email: 'rafi.kurniawan@gmail.com',
    phone: '081251234589',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-03-24T13:00:00.000Z',
    phoneVerifiedAt: '2026-03-24T13:05:00.000Z',
    avatar: '',
    avatarColor: 'info',
    lastLoginAt: '2026-09-27T10:30:00.000Z',
    createdAt: '2026-03-24',
    updatedAt: '2026-09-27',

    profile: {
      type: 'peserta',
      nik: '6372012501000009',
      nickname: 'Rafi',
      birthPlace: 'Banjarbaru',
      birthDate: '2000-01-25',
      gender: 'male',
      address: 'Jl. Kebun Karet, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Lambung Mangkurat',
      major: 'Teknik Informatika',
      graduationYear: 2022,
      employmentStatus: 'bekerja',
      occupation: 'IT Support',
      companyName: 'PT Banua Teknologi'
    }
  },

  {
    id: 24,
    fullName: 'Yuni Kartika',
    username: 'yuni.kartika',
    email: 'yuni.kartika@gmail.com',
    phone: '081251234590',
    role: 'peserta',
    status: 'pending',
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    avatar: '/images/avatars/2.png',
    lastLoginAt: null,
    createdAt: '2026-03-26',
    updatedAt: '2026-03-26',

    profile: {
      type: 'peserta',
      nik: '6372016502020010',
      nickname: 'Yuni',
      birthPlace: 'Banjarbaru',
      birthDate: '2002-02-25',
      gender: 'female',
      address: 'Jl. Sungai Besar, Banjarbaru',
      education: 'SMK',
      institution: 'SMKN 2 Banjarbaru',
      major: 'Bisnis Daring dan Pemasaran',
      graduationYear: 2020,
      employmentStatus: 'wirausaha',
      occupation: 'Pemilik UMKM',
      companyName: 'Yuni Fashion'
    }
  },

  {
    id: 25,
    fullName: 'Fikri Akbar',
    username: 'fikri.akbar',
    email: 'fikri.akbar@gmail.com',
    phone: '081251234591',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-03-28T09:40:00.000Z',
    phoneVerifiedAt: '2026-03-28T09:45:00.000Z',
    avatar: '/images/avatars/3.png',
    lastLoginAt: '2026-09-26T09:00:00.000Z',
    createdAt: '2026-03-28',
    updatedAt: '2026-09-26',

    profile: {
      type: 'peserta',
      nik: '6372011404980011',
      nickname: 'Fikri',
      birthPlace: 'Martapura',
      birthDate: '1998-04-14',
      gender: 'male',
      address: 'Jl. Sekumpul, Martapura',
      education: 'D3',
      institution: 'Politeknik Negeri Banjarmasin',
      major: 'Teknik Mesin',
      graduationYear: 2020,
      employmentStatus: 'bekerja',
      occupation: 'Teknisi',
      companyName: 'PT Borneo Engineering'
    }
  },

  {
    id: 26,
    fullName: 'Dian Permata',
    username: 'dian.permata',
    email: 'dian.permata@gmail.com',
    phone: '081251234592',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-04-01T10:20:00.000Z',
    phoneVerifiedAt: '2026-04-01T10:25:00.000Z',
    avatar: '/images/avatars/4.png',
    lastLoginAt: '2026-09-25T12:00:00.000Z',
    createdAt: '2026-04-01',
    updatedAt: '2026-09-25',

    profile: {
      type: 'peserta',
      nik: '6372014505970012',
      nickname: 'Dian',
      birthPlace: 'Banjarbaru',
      birthDate: '1997-05-05',
      gender: 'female',
      address: 'Jl. Landasan Ulin, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Lambung Mangkurat',
      major: 'Pendidikan Ekonomi',
      graduationYear: 2019,
      employmentStatus: 'bekerja',
      occupation: 'Instruktur',
      companyName: 'Lembaga Pelatihan Banua'
    }
  },

  {
    id: 28,
    fullName: 'Rangga Saputra',
    username: 'rangga.saputra',
    email: 'rangga.saputra@gmail.com',
    phone: '081251234594',
    role: 'peserta',
    status: 'pending',
    emailVerifiedAt: '2026-04-05T12:10:00.000Z',
    phoneVerifiedAt: null,
    avatar: '/images/avatars/5.png',
    lastLoginAt: null,
    createdAt: '2026-04-05',
    updatedAt: '2026-04-05',

    profile: {
      type: 'peserta',
      nik: '6372011803990013',
      nickname: 'Rangga',
      birthPlace: 'Banjarbaru',
      birthDate: '1999-03-18',
      gender: 'male',
      address: 'Jl. Guntung Payung, Banjarbaru',
      education: 'SMA',
      institution: 'SMAN 3 Banjarbaru',
      major: 'IPS',
      graduationYear: 2017,
      employmentStatus: 'belum_bekerja',
      occupation: null,
      companyName: null
    }
  },

  {
    id: 29,
    fullName: 'Nur Aisyah',
    username: 'nur.aisyah',
    email: 'nur.aisyah@gmail.com',
    phone: '081251234595',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-04-07T14:30:00.000Z',
    phoneVerifiedAt: '2026-04-07T14:35:00.000Z',
    avatar: '/images/avatars/6.png',
    lastLoginAt: '2026-09-24T08:00:00.000Z',
    createdAt: '2026-04-07',
    updatedAt: '2026-09-24',

    profile: {
      type: 'peserta',
      nik: '6372014801960014',
      nickname: 'Aisyah',
      birthPlace: 'Banjarbaru',
      birthDate: '1996-01-08',
      gender: 'female',
      address: 'Jl. Cempaka, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Islam Kalimantan',
      major: 'Manajemen',
      graduationYear: 2018,
      employmentStatus: 'wirausaha',
      occupation: 'Pemilik UMKM',
      companyName: 'Aisyah Food'
    }
  },

  {
    id: 30,
    fullName: 'Bagus Prasetyo',
    username: 'bagus.prasetyo',
    email: 'bagus.prasetyo@gmail.com',
    phone: '081251234596',
    role: 'peserta',
    status: 'active',
    emailVerifiedAt: '2026-04-10T15:00:00.000Z',
    phoneVerifiedAt: '2026-04-10T15:05:00.000Z',
    avatar: '/images/avatars/7.png',
    lastLoginAt: '2026-09-23T15:30:00.000Z',
    createdAt: '2026-04-10',
    updatedAt: '2026-09-23',

    profile: {
      type: 'peserta',
      nik: '6372012002000015',
      nickname: 'Bagus',
      birthPlace: 'Banjarbaru',
      birthDate: '2000-02-20',
      gender: 'male',
      address: 'Jl. A. Yani, Banjarbaru',
      education: 'S1',
      institution: 'Universitas Lambung Mangkurat',
      major: 'Teknik Sipil',
      graduationYear: 2022,
      employmentStatus: 'bekerja',
      occupation: 'Staff Teknik',
      companyName: 'PT Borneo Konstruksi'
    }
  },

  // =========================================================
  // PELATIH
  // =========================================================

  {
    id: 8,
    fullName: 'Fajar Hidayat',
    username: 'fajar.hidayat',
    email: 'fajar.hidayat@gmail.com',
    phone: '081351234574',
    role: 'pelatih',
    status: 'active',
    emailVerifiedAt: '2026-02-15T09:00:00.000Z',
    phoneVerifiedAt: '2026-02-15T09:05:00.000Z',
    avatar: '/images/avatars/7.png',
    lastLoginAt: '2026-10-02T09:00:00.000Z',
    createdAt: '2026-02-15',
    updatedAt: '2026-10-02',

    profile: {
      type: 'pelatih',
      nik: null,
      birthPlace: 'Banjarmasin',
      birthDate: '1985-07-12',
      gender: 'male',
      address: 'Jl. Veteran, Banjarmasin',
      education: 'S2',
      institution: 'Universitas Lambung Mangkurat',
      expertise: ['Digital Marketing', 'Branding', 'Social Media'],
      specialization: 'Digital Marketing',
      certification: ['BNSP Digital Marketing', 'Google Ads Certification'],
      experienceYears: 12,
      organization: 'Banua Digital Academy',
      position: 'Senior Trainer',
      bio: 'Praktisi digital marketing dan trainer profesional.'
    }
  },

  {
    id: 9,
    fullName: 'Maya Sari',
    username: 'maya.sari',
    email: 'maya.sari@gmail.com',
    phone: '081251234575',
    role: 'pelatih',
    status: 'active',
    emailVerifiedAt: '2026-02-18T10:15:00.000Z',
    phoneVerifiedAt: '2026-02-18T10:20:00.000Z',
    avatar: '',
    avatarColor: 'warning',
    lastLoginAt: '2026-09-30T10:00:00.000Z',
    createdAt: '2026-02-18',
    updatedAt: '2026-09-30',

    profile: {
      type: 'pelatih',
      nik: null,
      birthPlace: 'Banjarbaru',
      birthDate: '1988-03-20',
      gender: 'female',
      address: 'Jl. Panglima Batur, Banjarbaru',
      education: 'S2',
      institution: 'Universitas Indonesia',
      expertise: ['Kewirausahaan', 'UMKM', 'Business Planning'],
      specialization: 'Pengembangan UMKM',
      certification: ['BNSP Pendamping UMKM'],
      experienceYears: 10,
      organization: 'Konsultan UMKM Banua',
      position: 'Business Consultant',
      bio: 'Konsultan dan trainer pengembangan usaha mikro dan kecil.'
    }
  },

  {
    id: 10,
    fullName: 'Arif Setiawan',
    username: 'arif.setiawan',
    email: 'arif.setiawan@gmail.com',
    phone: '081351234576',
    role: 'pelatih',
    status: 'active',
    emailVerifiedAt: '2026-02-20T15:40:00.000Z',
    phoneVerifiedAt: '2026-02-20T15:45:00.000Z',
    avatar: '/images/avatars/8.png',
    lastLoginAt: '2026-09-29T13:00:00.000Z',
    createdAt: '2026-02-20',
    updatedAt: '2026-09-29',

    profile: {
      type: 'pelatih',
      nik: null,
      birthPlace: 'Banjarbaru',
      birthDate: '1983-11-05',
      gender: 'male',
      address: 'Jl. Trikora, Banjarbaru',
      education: 'S1',
      institution: 'Institut Teknologi Bandung',
      expertise: ['Programming', 'Web Development', 'Database'],
      specialization: 'Web Development',
      certification: ['BNSP Junior Web Developer', 'AWS Certified'],
      experienceYears: 15,
      organization: 'PT Kalsel Teknologi',
      position: 'Lead Developer',
      bio: 'Software engineer dan instruktur pengembangan aplikasi.'
    }
  },

  {
    id: 19,
    fullName: 'Lina Marlina',
    username: 'lina.marlina',
    email: 'lina.marlina@gmail.com',
    phone: '081251234585',
    role: 'pelatih',
    status: 'active',
    emailVerifiedAt: '2026-03-15T14:15:00.000Z',
    phoneVerifiedAt: '2026-03-15T14:20:00.000Z',
    avatar: '/images/avatars/6.png',
    lastLoginAt: '2026-09-28T09:00:00.000Z',
    createdAt: '2026-03-15',
    updatedAt: '2026-09-28',

    profile: {
      type: 'pelatih',
      nik: null,
      birthPlace: 'Martapura',
      birthDate: '1987-09-17',
      gender: 'female',
      address: 'Jl. Sekumpul, Martapura',
      education: 'S2',
      institution: 'Universitas Gadjah Mada',
      expertise: ['Administrasi', 'Manajemen Perkantoran', 'Microsoft Office'],
      specialization: 'Administrasi Perkantoran',
      certification: ['Microsoft Office Specialist', 'BNSP Administrasi'],
      experienceYears: 11,
      organization: 'Lembaga Pelatihan Banua',
      position: 'Trainer',
      bio: 'Trainer bidang administrasi dan manajemen perkantoran.'
    }
  },

  {
    id: 20,
    fullName: 'Hendra Wijaya',
    username: 'hendra.wijaya',
    email: 'hendra.wijaya@gmail.com',
    phone: '081251234586',
    role: 'pelatih',
    status: 'pending',
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    avatar: '/images/avatars/7.png',
    lastLoginAt: null,
    createdAt: '2026-03-18',
    updatedAt: '2026-03-18',

    profile: {
      type: 'pelatih',
      nik: null,
      birthPlace: 'Banjarmasin',
      birthDate: '1986-06-11',
      gender: 'male',
      address: 'Jl. Kayu Tangi, Banjarmasin',
      education: 'S1',
      institution: 'Universitas Lambung Mangkurat',
      expertise: ['Teknik Mesin', 'Maintenance', 'K3'],
      specialization: 'Keselamatan dan Kesehatan Kerja',
      certification: ['Ahli K3 Umum'],
      experienceYears: 9,
      organization: 'PT Borneo Engineering',
      position: 'Safety Officer',
      bio: 'Praktisi keselamatan kerja dan trainer K3.'
    }
  },

  // =========================================================
  // MITRA
  // =========================================================

  {
    id: 11,
    fullName: 'PT Banua Digital',
    username: 'banua.digital',
    email: 'hr@banuadigital.co.id',
    phone: '081251234577',
    role: 'mitra',
    status: 'active',
    emailVerifiedAt: '2026-02-23T08:30:00.000Z',
    phoneVerifiedAt: '2026-02-23T08:35:00.000Z',
    avatar: '',
    avatarColor: 'info',
    lastLoginAt: '2026-10-01T08:00:00.000Z',
    createdAt: '2026-02-23',
    updatedAt: '2026-10-01',

    profile: {
      type: 'mitra',
      companyType: 'pt',
      companyName: 'PT Banua Digital',
      companyNpwp: '01.234.567.8-731.000',
      businessField: 'Teknologi Informasi',
      companyAddress: 'Jl. A. Yani KM 34, Banjarbaru',
      website: 'https://banuadigital.co.id',
      picName: 'Andika Pratama',
      picPosition: 'HR Manager',
      picEmail: 'andika@banuadigital.co.id',
      picPhone: '081251234577',
      employeeCount: 85,
      cooperationStatus: 'active'
    }
  },

  {
    id: 12,
    fullName: 'CV Kreatif Banua',
    username: 'kreatif.banua',
    email: 'admin@kreatifbanua.id',
    phone: '081351234578',
    role: 'mitra',
    status: 'active',
    emailVerifiedAt: '2026-02-25T09:45:00.000Z',
    phoneVerifiedAt: '2026-02-25T09:50:00.000Z',
    avatar: '/images/avatars/1.png',
    lastLoginAt: '2026-09-29T09:30:00.000Z',
    createdAt: '2026-02-25',
    updatedAt: '2026-09-29',

    profile: {
      type: 'mitra',
      companyType: 'cv',
      companyName: 'CV Kreatif Banua',
      companyNpwp: '02.345.678.9-731.000',
      businessField: 'Kreatif dan Multimedia',
      companyAddress: 'Jl. RO Ulin, Banjarbaru',
      website: null,
      picName: 'Maya Andriani',
      picPosition: 'Owner',
      picEmail: 'maya@kreatifbanua.id',
      picPhone: '081351234578',
      employeeCount: 24,
      cooperationStatus: 'active'
    }
  },

  {
    id: 13,
    fullName: 'PT Kalsel Teknologi',
    username: 'kalsel.teknologi',
    email: 'hr@kalselteknologi.co.id',
    phone: '081251234579',
    role: 'mitra',
    status: 'pending',
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    avatar: '/images/avatars/2.png',
    lastLoginAt: null,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',

    profile: {
      type: 'mitra',
      companyType: 'pt',
      companyName: 'PT Kalsel Teknologi',
      companyNpwp: '03.456.789.0-731.000',
      businessField: 'Teknologi Informasi',
      companyAddress: 'Jl. Trikora, Banjarbaru',
      website: null,
      picName: 'Arif Setiawan',
      picPosition: 'HR Business Partner',
      picEmail: 'hr@kalselteknologi.co.id',
      picPhone: '081251234579',
      employeeCount: 120,
      cooperationStatus: 'pending'
    }
  },

  {
    id: 21,
    fullName: 'PT Borneo Mandiri',
    username: 'borneo.mandiri',
    email: 'hr@borneomandiri.co.id',
    phone: '081251234587',
    role: 'mitra',
    status: 'active',
    emailVerifiedAt: '2026-03-20T10:30:00.000Z',
    phoneVerifiedAt: '2026-03-20T10:35:00.000Z',
    avatar: '/images/avatars/8.png',
    lastLoginAt: '2026-09-27T08:00:00.000Z',
    createdAt: '2026-03-20',
    updatedAt: '2026-09-27',

    profile: {
      type: 'mitra',
      companyType: 'pt',
      companyName: 'PT Borneo Mandiri',
      companyNpwp: '04.567.890.1-731.000',
      businessField: 'Manufaktur',
      companyAddress: 'Kawasan Industri Banjarbaru',
      website: 'https://borneomandiri.co.id',
      picName: 'Hendra Gunawan',
      picPosition: 'HRD Manager',
      picEmail: 'hr@borneomandiri.co.id',
      picPhone: '081251234587',
      employeeCount: 240,
      cooperationStatus: 'active'
    }
  },

  {
    id: 27,
    fullName: 'PT Mitra Banua Sejahtera',
    username: 'mitra.banua',
    email: 'hr@mitrabanua.co.id',
    phone: '081251234593',
    role: 'mitra',
    status: 'pending',
    emailVerifiedAt: null,
    phoneVerifiedAt: null,
    avatar: '',
    avatarColor: 'warning',
    lastLoginAt: null,
    createdAt: '2026-04-03',
    updatedAt: '2026-04-03',

    profile: {
      type: 'mitra',
      companyType: 'pt',
      companyName: 'PT Mitra Banua Sejahtera',
      companyNpwp: '05.678.901.2-731.000',
      businessField: 'Perdagangan',
      companyAddress: 'Jl. A. Yani, Banjarbaru',
      website: null,
      picName: 'Satria Nugraha',
      picPosition: 'HR Manager',
      picEmail: 'hr@mitrabanua.co.id',
      picPhone: '081251234593',
      employeeCount: 60,
      cooperationStatus: 'pending'
    }
  }
]
