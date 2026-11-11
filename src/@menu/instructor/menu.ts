const instructorMenu = [
  {
    label: 'Dashboard',
    href: '/instructor',
    icon: 'tabler-dashboard'
  },

  {
    label: 'Pelatihan Saya',
    icon: 'tabler-school',
    children: [
      {
        label: 'Kelas',
        href: '/instructor/trainings'
      },
      {
        label: 'Jadwal',
        href: '/instructor/schedules'
      },
      {
        label: 'Peserta',
        href: '/instructor/participants'
      },
      {
        label: 'Materi',
        href: '/instructor/materials'
      },
      {
        label: 'Kehadiran',
        href: '/instructor/attendance'
      },
      {
        label: 'Penilaian',
        href: '/instructor/assessments'
      }
    ]
  },

  {
    label: 'Dokumen',
    icon: 'tabler-file-text',
    children: [
      {
        label: 'Materi Pembelajaran',
        href: '/instructor/documents/materials'
      },
      {
        label: 'Sertifikat',
        href: '/instructor/documents/certificates'
      }
    ]
  },

  {
    label: 'Profil',
    icon: 'tabler-user',
    children: [
      {
        label: 'Profil Saya',
        href: '/instructor/profile'
      }
    ]
  }
]

export default instructorMenu
