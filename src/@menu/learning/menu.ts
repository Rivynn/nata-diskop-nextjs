const learningMenu = [
  {
    label: 'Dashboard',
    href: '/learning',
    icon: 'tabler-dashboard'
  },

  {
    label: 'Pelatihan',
    icon: 'tabler-school',
    children: [
      {
        label: 'Jelajahi Pelatihan',
        href: '/learning/trainings'
      },
      {
        label: 'Pelatihan Saya',
        href: '/learning/my-courses'
      },
      {
        label: 'Jadwal Saya',
        href: '/learning/schedules'
      },
      {
        label: 'Riwayat',
        href: '/learning/history'
      }
    ]
  },

  {
    label: 'Pembelajaran',
    icon: 'tabler-book',
    children: [
      {
        label: 'Materi',
        href: '/learning/materials'
      },
      {
        label: 'Tugas & Ujian',
        href: '/learning/assessments'
      },
      {
        label: 'Penilaian',
        href: '/learning/scores'
      }
    ]
  },

  {
    label: 'Dokumen',
    icon: 'tabler-certificate',
    children: [
      {
        label: 'Sertifikat',
        href: '/learning/certificates'
      }
    ]
  },

  {
    label: 'Profil',
    icon: 'tabler-user',
    children: [
      {
        label: 'Profil Saya',
        href: '/learning/profile'
      }
    ]
  }
]

export default learningMenu
