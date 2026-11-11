
import type { ChatDataType } from '@/types/apps/chatTypes'

const now = new Date()
const minutesAgo = (minutes: number) =>
  new Date(now.getTime() - minutes * 60 * 1000)

export const db: ChatDataType = {
  profileUser: {
    id: 1,
    fullName: 'Admin Diskop',
    role: 'Administrator',
    about: 'Administrator platform pelatihan Diskop Kota Banjarbaru.',
    avatar: '/images/avatars/1.png',
    status: 'online',
    settings: {
      isNotificationsOn: true,
      isTwoStepAuthVerificationEnabled: true
    }
  },

  contacts: [
    {
      id: 2,
      fullName: 'Ahmad Fauzan',
      role: 'Pelatih Teknologi & Digital',
      userRole: 'trainer',
      department: 'Instruktur',
      email: 'ahmad.fauzan@example.com',
      about: 'Pelatih bidang teknologi dan digital.',
      avatar: '/images/avatars/2.png',
      status: 'online'
    },
    {
      id: 3,
      fullName: 'Rizky Pratama',
      role: 'Pelatih Web Development',
      userRole: 'trainer',
      department: 'Instruktur',
      email: 'rizky.pratama@example.com',
      about: 'Pelatih pengembangan aplikasi web.',
      avatar: '/images/avatars/3.png',
      status: 'offline'
    },
    {
      id: 4,
      fullName: 'Nadia Putri',
      role: 'Fasilitator Pengembangan Karier',
      userRole: 'trainer',
      department: 'Instruktur',
      email: 'nadia.putri@example.com',
      about: 'Fasilitator pelatihan pengembangan karier.',
      avatar: '/images/avatars/4.png',
      status: 'busy'
    },
    {
      id: 5,
      fullName: 'Budi Santoso',
      role: 'Pegawai Operasional',
      userRole: 'employee',
      department: 'Operasional',
      email: 'budi.santoso@example.com',
      about: 'Pegawai operasional program pelatihan.',
      avatar: '/images/avatars/5.png',
      status: 'online'
    },
    {
      id: 6,
      fullName: 'Siti Rahmawati',
      role: 'Pegawai Administrasi',
      userRole: 'employee',
      department: 'Administrasi',
      email: 'siti.rahmawati@example.com',
      about: 'Mengelola administrasi pelatihan.',
      avatar: '/images/avatars/6.png',
      status: 'away'
    },
    {
      id: 7,
      fullName: 'Andi Saputra',
      role: 'Peserta Web Development',
      userRole: 'participant',
      department: 'Peserta Pelatihan',
      email: 'andi.saputra@example.com',
      about: 'Peserta program Web Development.',
      avatar: '/images/avatars/7.png',
      status: 'online'
    },
    {
      id: 8,
      fullName: 'Dewi Lestari',
      role: 'Peserta Web Development',
      userRole: 'participant',
      department: 'Peserta Pelatihan',
      email: 'dewi.lestari@example.com',
      about: 'Peserta program Web Development.',
      avatar: '/images/avatars/8.png',
      status: 'offline'
    },
    {
      id: 9,
      fullName: 'Fajar Ramadhan',
      role: 'Peserta Digital Marketing',
      userRole: 'participant',
      department: 'Peserta Pelatihan',
      email: 'fajar.ramadhan@example.com',
      about: 'Peserta program Digital Marketing.',
      avatar: '/images/avatars/9.png',
      status: 'online'
    }
  ],


  chats: [
    // ==========================================
    // CHAT PERSONAL
    // Satu percakapan per kontak
    // ==========================================
    {
      id: 1,
      userId: 2,
      type: 'direct',
      unseenMsgs: 2,
      participantIds: [1, 2],
      chat: [
        {
          message: 'Selamat pagi, Admin. Saya ingin mengonfirmasi jadwal pelatihan.',
          time: minutesAgo(35),
          senderId: 2
        },
        {
          message: 'Selamat pagi, Pak Ahmad. Silakan, jadwal yang mana?',
          time: minutesAgo(32),
          senderId: 1,
          msgStatus: { isSent: true, isDelivered: true, isSeen: true }
        },
        {
          message: 'Untuk sesi pelatihan minggu depan.',
          time: minutesAgo(30),
          senderId: 2
        }
      ]
    },
    {
      id: 2,
      userId: 3,
      type: 'direct',
      unseenMsgs: 0,
      participantIds: [1, 3],
      chat: [
        {
          message: 'Draft materi Web Development sudah saya kirim.',
          time: minutesAgo(75),
          senderId: 3
        },
        {
          message: 'Baik, Pak Rizky. Nanti saya periksa.',
          time: minutesAgo(70),
          senderId: 1,
          msgStatus: { isSent: true, isDelivered: true, isSeen: true }
        }
      ]
    },
    {
      id: 3,
      userId: 4,
      type: 'direct',
      unseenMsgs: 1,
      participantIds: [1, 4],
      chat: [
        {
          message: 'Apakah jadwal sesi konsultasi karier sudah ditentukan?',
          time: minutesAgo(18),
          senderId: 4
        }
      ]
    },
    {
      id: 4,
      userId: 5,
      type: 'direct',
      unseenMsgs: 0,
      participantIds: [1, 5],
      chat: [
        {
          message: 'Rekap pendaftaran peserta sudah saya perbarui.',
          time: minutesAgo(90),
          senderId: 5
        },
        {
          message: 'Terima kasih. Tolong cek kembali data yang belum lengkap.',
          time: minutesAgo(85),
          senderId: 1,
          msgStatus: { isSent: true, isDelivered: true, isSeen: true }
        }
      ]
    },
    {
      id: 5,
      userId: 6,
      type: 'direct',
      unseenMsgs: 1,
      participantIds: [1, 6],
      chat: [
        {
          message: 'Ada beberapa berkas pendaftaran yang perlu diverifikasi.',
          time: minutesAgo(12),
          senderId: 6
        }
      ]
    },
    {
      id: 6,
      userId: 7,
      type: 'direct',
      unseenMsgs: 0,
      participantIds: [1, 7],
      chat: [
        {
          message: 'Admin, saya ingin menanyakan sertifikat pelatihan.',
          time: minutesAgo(150),
          senderId: 7
        },
        {
          message: 'Silakan cek status sertifikat melalui akun peserta.',
          time: minutesAgo(145),
          senderId: 1,
          msgStatus: { isSent: true, isDelivered: true, isSeen: true }
        }
      ]
    },
    {
      id: 7,
      userId: 8,
      type: 'direct',
      unseenMsgs: 0,
      participantIds: [1, 8],
      chat: [
        {
          message: 'Terima kasih atas informasi jadwalnya, Admin.',
          time: minutesAgo(300),
          senderId: 8
        }
      ]
    },
    {
      id: 8,
      userId: 9,
      type: 'direct',
      unseenMsgs: 3,
      participantIds: [1, 9],
      chat: [
        {
          message: 'Saya ingin memastikan tugas untuk sesi Digital Marketing.',
          time: minutesAgo(8),
          senderId: 9
        }
      ]
    },

    // ==========================================
    // GRUP PELATIHAN
    // Anggota terdiri dari admin, pelatih,
    // dan peserta terkait pelatihan
    // ==========================================
    {
      id: 9,
      userId: 2,
      type: 'group',
      name: 'Pelatihan Web Development',
      avatar: '/images/avatars/3.png',
      description: 'Koordinasi pelaksanaan Web Development.',
      trainingId: 101,
      trainingName: 'Web Development',
      createdBy: 1,
      unseenMsgs: 5,
      participantIds: [1, 2, 3, 7, 8],
      chat: [
        {
          message: 'Selamat datang di grup koordinasi Web Development.',
          time: minutesAgo(240),
          senderId: 1,
          msgStatus: { isSent: true, isDelivered: true, isSeen: true }
        },
        {
          message: 'Materi sesi pertama sudah siap.',
          time: minutesAgo(55),
          senderId: 3
        },
        {
          message: 'Apakah materi bisa dibagikan sebelum kelas?',
          time: minutesAgo(45),
          senderId: 7
        },
        {
          message: 'Bisa, nanti saya unggah sebelum sesi dimulai.',
          time: minutesAgo(40),
          senderId: 3
        }
      ]
    },
    {
      id: 10,
      userId: 4,
      type: 'group',
      name: 'Pelatihan Digital Marketing',
      avatar: '/images/avatars/4.png',
      description: 'Koordinasi materi, tugas, dan jadwal Digital Marketing.',
      trainingId: 102,
      trainingName: 'Digital Marketing',
      createdBy: 1,
      unseenMsgs: 4,
      participantIds: [1, 4, 9],
      chat: [
        {
          message: 'Untuk sesi berikutnya, siapkan contoh konten promosi.',
          time: minutesAgo(65),
          senderId: 4
        },
        {
          message: 'Baik, Bu. Apakah boleh menggunakan produk UMKM?',
          time: minutesAgo(50),
          senderId: 9
        },
        {
          message: 'Boleh, gunakan contoh yang relevan.',
          time: minutesAgo(45),
          senderId: 4
        }
      ]
    },
    {
      id: 11,
      userId: 2,
      type: 'group',
      name: 'Koordinasi Pelatih',
      avatar: '/images/avatars/2.png',
      description: 'Diskusi lintas pelatih dan persiapan program.',
      createdBy: 1,
      unseenMsgs: 2,
      participantIds: [1, 2, 3, 4],
      chat: [
        {
          message: 'Mohon semua pelatih mengumpulkan rencana materi minggu ini.',
          time: minutesAgo(120),
          senderId: 1,
          msgStatus: { isSent: true, isDelivered: true, isSeen: true }
        },
        {
          message: 'Rencana materi saya kirim sore ini.',
          time: minutesAgo(35),
          senderId: 2
        }
      ]
    },

    // ==========================================
    // GRUP INTERNAL PEGAWAI
    // ==========================================
    {
      id: 12,
      userId: 5,
      type: 'group',
      name: 'Koordinasi Pegawai',
      avatar: '/images/avatars/5.png',
      description: 'Koordinasi kegiatan operasional dan administrasi.',
      createdBy: 1,
      unseenMsgs: 2,
      participantIds: [1, 5, 6],
      chat: [
        {
          message: 'Rekap peserta kegiatan minggu ini sudah diperbarui.',
          time: minutesAgo(95),
          senderId: 5
        },
        {
          message: 'Baik, saya akan memeriksa dokumen pendukungnya.',
          time: minutesAgo(80),
          senderId: 6
        }
      ]
    },
    {
      id: 13,
      userId: 6,
      type: 'group',
      name: 'Tim Administrasi',
      avatar: '/images/avatars/6.png',
      description: 'Pembahasan berkas, pendaftaran, dan sertifikat.',
      createdBy: 1,
      unseenMsgs: 0,
      participantIds: [1, 5, 6],
      chat: [
        {
          message: 'Daftar sertifikat yang perlu diverifikasi sudah tersedia.',
          time: minutesAgo(210),
          senderId: 6
        },
        {
          message: 'Terima kasih, saya lanjutkan proses pengecekan.',
          time: minutesAgo(200),
          senderId: 1,
          msgStatus: { isSent: true, isDelivered: true, isSeen: true }
        }
      ]
    },
    {
      id: 14,
      userId: 5,
      type: 'group',
      name: 'Operasional Kegiatan',
      avatar: '/images/avatars/5.png',
      description: 'Koordinasi persiapan dan pelaksanaan kegiatan.',
      createdBy: 1,
      unseenMsgs: 1,
      participantIds: [1, 5, 6],
      chat: [
        {
          message: 'Ruangan untuk kegiatan besok sudah dikonfirmasi.',
          time: minutesAgo(25),
          senderId: 5
        }
      ]
    }
  ]

}
