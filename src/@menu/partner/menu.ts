const partnerMenu = [
  {
    label: 'Dashboard',
    href: '/partner',
    icon: 'tabler-dashboard'
  },

  {
    label: 'Perusahaan',
    icon: 'tabler-building',
    children: [
      {
        label: 'Profil Perusahaan',
        href: '/partner/company'
      },
      {
        label: 'Tim',
        href: '/partner/company/team'
      }
    ]
  },

  {
    label: 'Kemitraan',
    icon: 'tabler-handshake',
    children: [
      {
        label: 'Kerja Sama',
        href: '/partner/partnerships'
      },
      {
        label: 'Program Pelatihan',
        href: '/partner/trainings'
      }
    ]
  },

  {
    label: 'Kebutuhan Tenaga Kerja',
    icon: 'tabler-briefcase',
    children: [
      {
        label: 'Kebutuhan',
        href: '/partner/workforce'
      },
      {
        label: 'Kandidat',
        href: '/partner/candidates'
      },
      {
        label: 'Rekrutmen',
        href: '/partner/recruitment'
      }
    ]
  },

  {
    label: 'Laporan',
    icon: 'tabler-chart-bar',
    children: [
      {
        label: 'Penempatan',
        href: '/partner/reports/employment'
      }
    ]
  }
]

export default partnerMenu
