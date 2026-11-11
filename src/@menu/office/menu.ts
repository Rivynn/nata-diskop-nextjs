const officeMenu = [
  {
    type: 'section',
    label: 'Dashboard',
    children: [
      {
        label: 'Dashboard',
        href: '/office',
        icon: 'tabler-dashboard'
      }
    ]
  },

  {
    type: 'section',
    label: 'Pelatihan Pegawai',
    children: [
      {
        label: 'Pelatihan',
        href: '/office/trainings',
        icon: 'tabler-school'
      },
      {
        label: 'Jadwal',
        href: '/office/schedules',
        icon: 'tabler-calendar-event'
      },
      {
        label: 'Peserta',
        href: '/office/participants',
        icon: 'tabler-users'
      },
      {
        label: 'Pelatih',
        href: '/office/instructors',
        icon: 'tabler-chalkboard'
      },
      {
        label: 'Kehadiran',
        href: '/office/attendance',
        icon: 'tabler-calendar-check'
      },
      {
        label: 'Penilaian',
        href: '/office/assessments',
        icon: 'tabler-file-certificate'
      }
    ]
  },

  {
    type: 'section',
    label: 'Kemitraan',
    children: [
      {
        label: 'Mitra',
        href: '/office/partners',
        icon: 'tabler-building-community'
      },
      {
        label: 'Kebutuhan Tenaga Kerja',
        href: '/office/workforce',
        icon: 'tabler-briefcase-2'
      },
      {
        label: 'Kandidat',
        href: '/office/candidates',
        icon: 'tabler-user-search'
      }
    ]
  },

  {
    type: 'section',
    label: 'Laporan',
    children: [
      {
        label: 'Pelatihan',
        href: '/office/reports/trainings',
        icon: 'tabler-chart-line'
      },
      {
        label: 'Peserta',
        href: '/office/reports/participants',
        icon: 'tabler-chart-dots'
      },
      {
        label: 'Penempatan',
        href: '/office/reports/employment',
        icon: 'tabler-chart-arcs'
      }
    ]
  }
]

export default officeMenu
