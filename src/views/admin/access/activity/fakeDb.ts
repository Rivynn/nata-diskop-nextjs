import type { ActivityType } from './types'

export const activityDb: ActivityType[] = [
  {
    id: 1,

    user: {
      id: 31,
      name: 'Rudi Hartono',
      username: 'rudi.hartono',
      avatar: '/images/avatars/1.png',
      role: 'admin'
    },

    action: 'change_role',

    activity: 'Mengubah peran pengguna',

    module: 'Pengguna',

    target: {
      type: 'user',
      id: '1024',
      name: 'Siti Rahma'
    },

    description: 'Mengubah peran Siti Rahma dari Peserta menjadi Pelatih.',

    metadata: {
      before: 'Peserta',
      after: 'Pelatih'
    },

    ipAddress: '192.168.10.24',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'Windows 11',

    browser: 'Chrome 154',

    createdAt: '04 Oktober 2026, 19:42 WITA',

    status: 'success'
  },

  {
    id: 2,

    user: {
      id: 2,
      name: 'Siti Rahma',
      username: 'siti.rahma',
      avatar: '/images/avatars/2.png',
      role: 'pegawai'
    },

    action: 'create',

    activity: 'Membuat pelatihan baru',

    module: 'Pelatihan',

    target: {
      type: 'training',
      id: 'TRN-0024',
      name: 'Digital Marketing untuk UMKM'
    },

    description: 'Membuat program pelatihan baru dengan judul Digital Marketing untuk UMKM.',

    metadata: {
      before: null,
      after: 'Digital Marketing untuk UMKM'
    },

    ipAddress: '10.10.12.41',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'Windows 11',

    browser: 'Edge 154',

    createdAt: '04 Oktober 2026, 19:38 WITA',

    status: 'success'
  },

  {
    id: 3,

    user: {
      id: 4,
      name: 'Rina Wulandari',
      username: 'rina.wulandari',
      avatar: '/images/avatars/3.png',
      role: 'peserta'
    },

    action: 'login',

    activity: 'Login ke sistem',

    module: 'Autentikasi',

    target: null,

    description: 'Berhasil masuk ke dalam sistem DISKOP.',

    ipAddress: '172.16.4.81',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'iPhone',

    browser: 'Safari Mobile',

    createdAt: '04 Oktober 2026, 19:31 WITA',

    status: 'success'
  },

  {
    id: 4,

    user: {
      id: 8,
      name: 'Fajar Hidayat',
      username: 'fajar.hidayat',
      avatar: '/images/avatars/4.png',
      role: 'pelatih'
    },

    action: 'update',

    activity: 'Mengubah jadwal pelatihan',

    module: 'Jadwal',

    target: {
      type: 'schedule',
      id: 'SCH-0091',
      name: 'Pelatihan Web Development'
    },

    description: 'Mengubah jadwal pelatihan Web Development dari 08.00 menjadi 09.00 WITA.',

    metadata: {
      before: '08.00 WITA',
      after: '09.00 WITA'
    },

    ipAddress: '192.168.20.15',

    location: 'Banjarmasin, Kalimantan Selatan',

    device: 'Windows 10',

    browser: 'Chrome 153',

    createdAt: '04 Oktober 2026, 19:25 WITA',

    status: 'success'
  },

  {
    id: 5,

    user: {
      id: 1,
      name: 'Ahmad Fauzan',
      username: 'ahmad.fauzan',
      avatar: '/images/avatars/5.png',
      role: 'admin'
    },

    action: 'delete',

    activity: 'Menghapus pengguna',

    module: 'Pengguna',

    target: {
      type: 'user',
      id: '1031',
      name: 'Budi Santoso'
    },

    description: 'Menghapus akun pengguna Budi Santoso dari sistem.',

    metadata: {
      before: 'Akun aktif',
      after: 'Dihapus'
    },

    ipAddress: '10.0.0.18',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'Windows 11',

    browser: 'Chrome 154',

    createdAt: '04 Oktober 2026, 19:20 WITA',

    status: 'success'
  },

  {
    id: 6,

    user: {
      id: 22,
      name: 'Dewi Lestari',
      username: 'dewi.lestari',
      avatar: '/images/avatars/6.png',
      role: 'peserta'
    },

    action: 'login_failed',

    activity: 'Login gagal',

    module: 'Autentikasi',

    target: null,

    description: 'Percobaan login gagal karena username atau password tidak sesuai.',

    ipAddress: '103.145.22.81',

    location: 'Banjarmasin, Kalimantan Selatan',

    device: 'Android 15',

    browser: 'Chrome Mobile',

    createdAt: '04 Oktober 2026, 19:17 WITA',

    status: 'failed'
  },

  {
    id: 7,

    user: {
      id: 12,
      name: 'PT Banua Digital',
      username: 'banua.digital',
      avatar: '/images/avatars/7.png',
      role: 'mitra'
    },

    action: 'update',

    activity: 'Memperbarui profil mitra',

    module: 'Kemitraan',

    target: {
      type: 'partner',
      id: 'MTR-0012',
      name: 'PT Banua Digital'
    },

    description: 'Memperbarui informasi profil dan bidang usaha perusahaan.',

    metadata: {
      before: 'Teknologi Informasi',
      after: 'Teknologi Informasi & Digital Marketing'
    },

    ipAddress: '36.72.18.44',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'Windows 11',

    browser: 'Chrome 154',

    createdAt: '04 Oktober 2026, 19:10 WITA',

    status: 'success'
  },

  {
    id: 8,

    user: {
      id: 3,
      name: 'Andi Pratama',
      username: 'andi.pratama',
      avatar: '/images/avatars/8.png',
      role: 'pegawai'
    },

    action: 'approve',

    activity: 'Menyetujui peserta',

    module: 'Peserta',

    target: {
      type: 'participant',
      id: 'PST-0082',
      name: 'Muhammad Ilham'
    },

    description: 'Menyetujui pendaftaran Muhammad Ilham pada program pelatihan.',

    metadata: {
      before: 'Menunggu',
      after: 'Diterima'
    },

    ipAddress: '10.10.8.12',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'Windows 11',

    browser: 'Edge 154',

    createdAt: '04 Oktober 2026, 18:56 WITA',

    status: 'success'
  },

  {
    id: 9,

    user: {
      id: 19,
      name: 'Nur Aisyah',
      username: 'nur.aisyah',
      avatar: '/images/avatars/9.png',
      role: 'pelatih'
    },

    action: 'publish',

    activity: 'Mempublikasikan materi',

    module: 'Materi',

    target: {
      type: 'material',
      id: 'MAT-0042',
      name: 'Dasar React & Next.js'
    },

    description: 'Mempublikasikan materi pembelajaran Dasar React & Next.js.',

    metadata: {
      before: 'Draft',
      after: 'Published'
    },

    ipAddress: '192.168.30.51',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'macOS',

    browser: 'Chrome 154',

    createdAt: '04 Oktober 2026, 18:44 WITA',

    status: 'success'
  },

  {
    id: 10,

    user: {
      id: 1,
      name: 'Ahmad Fauzan',
      username: 'ahmad.fauzan',
      avatar: '/images/avatars/5.png',
      role: 'admin'
    },

    action: 'change_password',

    activity: 'Mengubah password pengguna',

    module: 'Pengguna',

    target: {
      type: 'user',
      id: '1028',
      name: 'Rudi Hartono'
    },

    description: 'Mengubah password akun administrator Rudi Hartono.',

    metadata: {
      before: 'Password sebelumnya',
      after: 'Password baru'
    },

    ipAddress: '192.168.10.24',

    location: 'Banjarbaru, Kalimantan Selatan',

    device: 'Windows 11',

    browser: 'Chrome 154',

    createdAt: '04 Oktober 2026, 18:32 WITA',

    status: 'success'
  }
]
