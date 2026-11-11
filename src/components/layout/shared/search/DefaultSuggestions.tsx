// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

type DefaultSuggestionsType = {
  sectionLabel: string
  items: {
    label: string
    href: string
    icon?: string
  }[]
}

const defaultSuggestions: DefaultSuggestionsType[] = [
  {
    sectionLabel: 'Akses Cepat',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: 'tabler-dashboard'
      },
      {
        label: 'Pelatihan',
        href: '/admin/trainings',
        icon: 'tabler-school'
      },
      {
        label: 'Peserta',
        href: '/admin/participants',
        icon: 'tabler-users'
      },
      {
        label: 'Pendaftaran',
        href: '/admin/registrations',
        icon: 'tabler-clipboard-check'
      }
    ]
  },
  {
    sectionLabel: 'Manajemen',
    items: [
      {
        label: 'Pengguna',
        href: '/admin/users',
        icon: 'tabler-users'
      },
      {
        label: 'Pelatih',
        href: '/admin/instructors',
        icon: 'tabler-chalkboard'
      },
      {
        label: 'Pegawai',
        href: '/admin/employees',
        icon: 'tabler-briefcase'
      },
      {
        label: 'Mitra',
        href: '/admin/partners',
        icon: 'tabler-building-store'
      }
    ]
  },
  {
    sectionLabel: 'Operasional',
    items: [
      {
        label: 'Jadwal Pelatihan',
        href: '/admin/trainings/schedules',
        icon: 'tabler-calendar'
      },
      {
        label: 'Kehadiran',
        href: '/admin/attendance',
        icon: 'tabler-calendar-check'
      },
      {
        label: 'Penilaian',
        href: '/admin/assessments',
        icon: 'tabler-file-certificate'
      },
      {
        label: 'Sertifikat',
        href: '/admin/certificates',
        icon: 'tabler-certificate'
      }
    ]
  },
  {
    sectionLabel: 'Laporan & Sistem',
    items: [
      {
        label: 'Laporan',
        href: '/admin/reports',
        icon: 'tabler-chart-bar'
      },
      {
        label: 'Role & Permission',
        href: '/admin/access/roles',
        icon: 'tabler-shield-lock'
      },
      {
        label: 'Aktivitas Pengguna',
        href: '/admin/access/activity',
        icon: 'tabler-history'
      },
      {
        label: 'Pengaturan',
        href: '/admin/settings',
        icon: 'tabler-settings'
      }
    ]
  }
]

const DefaultSuggestions = ({
                              setOpen
                            }: {
  setOpen: (value: boolean) => void
}) => {
  return (
    <div className='flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      {defaultSuggestions.map((section, index) => (
        <div
          key={index}
          className='flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'
        >
          <p className='text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]'>
            {section.sectionLabel}
          </p>

          <ul className='flex flex-col gap-4'>
            {section.items.map((item, i) => (
              <li
                key={i}
                className='flex'
              >
                <Link
                  href={item.href}
                  className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                  onClick={() => setOpen(false)}
                >
                  {item.icon && (
                    <i
                      className={classnames(
                        item.icon,
                        'flex text-xl'
                      )}
                    />
                  )}

                  <p className='text-[15px] leading-[1.4667] truncate'>
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DefaultSuggestions
