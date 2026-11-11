const adminMenu = [
  {
    label: 'Dashboard',
    type: 'section',
    children: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: 'tabler-dashboard'
      }
    ]
  },

  {
    label: 'Manajemen',
    type: 'section',
    children: [
      {
        label: 'Pelatihan',
        icon: 'tabler-school',
        children: [
          {
            label: 'Semua Pelatihan',
            href: '/admin/trainings'
          },
          {
            label: 'Tambah Pelatihan',
            href: '/admin/trainings/create'
          },
          {
            label: 'Kategori',
            href: '/admin/trainings/categories'
          },
          {
            label: 'Jadwal',
            href: '/admin/trainings/schedules'
          },
          {
            label: 'Materi',
            href: '/admin/materials'
          }
        ]
      },
      {
        label: 'Peserta',
        icon: 'tabler-users',
        children: [
          {
            label: 'Semua Peserta',
            href: '/admin/participants'
          },
          {
            label: 'Pendaftaran',
            href: '/admin/registrations',
            badge: '18'
          },
          {
            label: 'Kehadiran',
            href: '/admin/attendance'
          },
          {
            label: 'Penilaian',
            href: '/admin/assessments'
          },
          {
            label: 'Sertifikat',
            href: '/admin/certificates'
          }
        ]
      },
      {
        label: 'SDM Pelatihan',
        icon: 'tabler-chalkboard',
        children: [
          {
            label: 'Pelatih',
            href: '/admin/instructors'
          },
          {
            label: 'Tambah Pelatih',
            href: '/admin/instructors/create'
          },
          {
            label: 'Keahlian',
            href: '/admin/instructors/expertise'
          },
          {
            label: 'Pegawai',
            href: '/admin/employees'
          },
          {
            label: 'Tambah Pegawai',
            href: '/admin/employees/create'
          }
        ]
      },
      {
        label: 'Akun & Pengguna',
        icon: 'tabler-user-cog',
        children: [
          {
            label: 'Semua Pengguna',
            href: '/admin/users'
          },
          {
            label: 'Administrator',
            href: '/admin/users/admin'
          },
        ]
      }
    ]
  },

  {
    label: 'Kemitraan',
    type: 'section',
    children: [
      {
        label: 'Mitra & Kerja Sama',
        icon: 'tabler-building-community',
        children: [
          {
            label: 'Mitra',
            href: '/admin/partners'
          },
          {
            label: 'Kerja Sama',
            href: '/admin/partnerships'
          }
        ]
      },
      {
        label: 'Penempatan',
        icon: 'tabler-briefcase',
        children: [
          {
            label: 'Kebutuhan Tenaga Kerja',
            href: '/admin/workforce'
          },
          {
            label: 'Kandidat',
            href: '/admin/candidates'
          },
          {
            label: 'Penempatan & Rekrutmen',
            href: '/admin/recruitment'
          }
        ]
      }
    ]
  },

  {
    label: 'Konten',
    type: 'section',
    children: [
      {
        label: 'Publikasi',
        icon: 'tabler-news',
        children: [
          {
            label: 'Banner',
            href: '/admin/cms/banners'
          },
          {
            label: 'Program Unggulan',
            href: '/admin/cms/programs'
          },
          {
            label: 'Berita',
            href: '/admin/cms/news'
          },
          {
            label: 'Pengumuman',
            href: '/admin/cms/announcements'
          }
        ]
      }
    ]
  },

  {
    label: 'Laporan & Analitik',
    type: 'section',
    children: [
      {
        label: 'Ringkasan Laporan',
        href: '/admin/reports',
        icon: 'tabler-chart-bar'
      },
      {
        label: 'Pelatihan',
        href: '/admin/reports/trainings',
        icon: 'tabler-chart-line'
      },
      {
        label: 'Peserta',
        href: '/admin/reports/participants',
        icon: 'tabler-chart-dots'
      },
      {
        label: 'Penempatan',
        href: '/admin/reports/employment',
        icon: 'tabler-chart-arcs'
      }
    ]
  },

  {
    label: 'Sistem',
    type: 'section',
    children: [
      {
        label: 'Akses & Keamanan',
        icon: 'tabler-shield-lock',
        children: [
          {
            label: 'Role',
            href: '/admin/access/roles'
          },
          {
            label: 'Permission',
            href: '/admin/access/permissions'
          },
          {
            label: 'Sesi Aktif',
            href: '/admin/access/sessions'
          },
          {
            label: 'Aktivitas Pengguna',
            href: '/admin/access/activity'
          }
        ]
      },
      {
        label: 'Pengaturan',
        icon: 'tabler-settings',
        children: [
          {
            label: 'Umum',
            href: '/admin/settings/general'
          },
          {
            label: 'Notifikasi',
            href: '/admin/settings/notifications'
          },
          {
            label: 'Integrasi',
            href: '/admin/settings/integrations'
          }
        ]
      }
    ]
  }
]

export default adminMenu
