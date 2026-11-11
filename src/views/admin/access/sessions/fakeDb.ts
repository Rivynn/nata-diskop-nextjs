import type { SessionType } from './types'

export const sessionDb: SessionType[] = [
  {
    id: 1,

    userId: 1,

    user: {
      name: 'Ahmad Fauzan',
      username: 'ahmad.fauzan',
      avatar: '/images/avatars/1.png',
      role: 'admin'
    },

    device: 'desktop',

    operatingSystem: 'Windows 11',

    browser: 'Chrome 154',

    ipAddress: '192.168.1.xxx',

    location: 'Banjarbaru, Kalimantan Selatan',

    loginAt: '04 Oktober 2026, 15:42',

    lastActivityAt: '04 Oktober 2026, 15:47',

    status: 'active',

    isCurrent: true
  },

  {
    id: 2,

    userId: 2,

    user: {
      name: 'Siti Rahma',
      username: 'siti.rahma',
      avatar: '/images/avatars/4.png',
      role: 'pegawai'
    },

    device: 'desktop',

    operatingSystem: 'Windows 11',

    browser: 'Edge 154',

    ipAddress: '10.10.1.xxx',

    location: 'Banjarbaru, Kalimantan Selatan',

    loginAt: '04 Oktober 2026, 15:20',

    lastActivityAt: '04 Oktober 2026, 15:35',

    status: 'active',

    isCurrent: false
  },

  {
    id: 3,

    userId: 8,

    user: {
      name: 'Fajar Hidayat',
      username: 'fajar.hidayat',
      avatar: '/images/avatars/7.png',
      role: 'pelatih'
    },

    device: 'desktop',

    operatingSystem: 'Windows 10',

    browser: 'Chrome 153',

    ipAddress: '192.168.2.xxx',

    location: 'Banjarmasin, Kalimantan Selatan',

    loginAt: '04 Oktober 2026, 14:10',

    lastActivityAt: '04 Oktober 2026, 14:55',

    status: 'idle',

    isCurrent: false
  },

  {
    id: 4,

    userId: 4,

    user: {
      name: 'Dewi Lestari',
      username: 'dewi.lestari',
      avatar: '/images/avatars/10.png',
      role: 'peserta'
    },

    device: 'mobile',

    operatingSystem: 'Android 15',

    browser: 'Chrome Mobile',

    ipAddress: '172.16.1.xxx',

    location: 'Banjarbaru, Kalimantan Selatan',

    loginAt: '04 Oktober 2026, 13:42',

    lastActivityAt: '04 Oktober 2026, 14:01',

    status: 'idle',

    isCurrent: false
  },

  {
    id: 5,

    userId: 11,

    user: {
      name: 'PT Banua Digital',
      username: 'banua.digital',
      avatar: '/images/avatars/13.png',
      role: 'mitra'
    },

    device: 'desktop',

    operatingSystem: 'Windows 11',

    browser: 'Chrome 154',

    ipAddress: '103.xxx.xxx.xxx',

    location: 'Banjarbaru, Kalimantan Selatan',

    loginAt: '04 Oktober 2026, 12:30',

    lastActivityAt: '04 Oktober 2026, 12:42',

    status: 'idle',

    isCurrent: false
  },

  {
    id: 6,

    userId: 17,

    user: {
      name: 'Rina Wulandari',
      username: 'rina.wulandari',
      avatar: '/images/avatars/6.png',
      role: 'pegawai'
    },

    device: 'mobile',

    operatingSystem: 'iOS 18',

    browser: 'Safari Mobile',

    ipAddress: '10.20.2.xxx',

    location: 'Banjarbaru, Kalimantan Selatan',

    loginAt: '04 Oktober 2026, 11:18',

    lastActivityAt: '04 Oktober 2026, 11:40',

    status: 'idle',

    isCurrent: false
  }
]
