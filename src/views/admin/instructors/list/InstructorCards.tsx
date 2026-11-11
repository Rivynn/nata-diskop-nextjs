'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import Link from '@components/Link'
import ManageInstructorExpertiseDialog from './ManageInstructorExpertiseDialog'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type InstructorCardType = {
  id: number
  name: string
  username: string
  avatar: string
  position: string
  description: string

  rating: number
  totalReviews: number
  totalTrainings: number
  totalParticipants: number

  status: 'active' | 'inactive'

  expertise: {
    title: string
    color:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'error'
      | 'warning'
      | 'info'
  }[]

  participants: {
    name: string
    avatar: string
  }[]
}

// -----------------------------------------------------------------------------
// Fake Data
// -----------------------------------------------------------------------------

const defaultInstructors: InstructorCardType[] = [
  {
    id: 1,
    name: 'Ahmad Fauzan',
    username: '@ahmad.fauzan',
    avatar: '/images/avatars/1.png',
    position: 'Pelatih Teknologi & Digital',
    description:
      'Pelatih dengan fokus pada pengembangan kompetensi digital, pemrograman, pengembangan aplikasi web, dan transformasi teknologi.',
    rating: 4.9,
    totalReviews: 128,
    totalTrainings: 24,
    totalParticipants: 386,
    status: 'active',

    expertise: [
      {
        title: 'Programming',
        color: 'primary'
      },
      {
        title: 'Laravel',
        color: 'success'
      },
      {
        title: 'Web Development',
        color: 'info'
      },
      {
        title: 'Database',
        color: 'warning'
      }
    ],

    participants: [
      {
        name: 'Muhammad Rizki',
        avatar: '/images/avatars/7.png'
      },
      {
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/8.png'
      },
      {
        name: 'Dimas Pratama',
        avatar: '/images/avatars/9.png'
      }
    ]
  },

  {
    id: 2,
    name: 'Siti Rahma',
    username: '@siti.rahma',
    avatar: '/images/avatars/2.png',
    position: 'Pelatih Kewirausahaan',
    description:
      'Berfokus pada pengembangan kewirausahaan, pengelolaan usaha, strategi bisnis, dan pengembangan kapasitas pelaku UMKM.',
    rating: 4.8,
    totalReviews: 96,
    totalTrainings: 18,
    totalParticipants: 312,
    status: 'active',

    expertise: [
      {
        title: 'Kewirausahaan',
        color: 'success'
      },
      {
        title: 'UMKM',
        color: 'warning'
      },
      {
        title: 'Business Planning',
        color: 'primary'
      },
      {
        title: 'Manajemen',
        color: 'info'
      }
    ],

    participants: [
      {
        name: 'Aulia Putri',
        avatar: '/images/avatars/10.png'
      },
      {
        name: 'Nanda Saputra',
        avatar: '/images/avatars/11.png'
      },
      {
        name: 'Rina Amelia',
        avatar: '/images/avatars/12.png'
      }
    ]
  },

  {
    id: 3,
    name: 'Budi Santoso',
    username: '@budi.santoso',
    avatar: '/images/avatars/3.png',
    position: 'Pelatih Digital Marketing',
    description:
      'Pelatih bidang pemasaran digital dengan pengalaman pada strategi branding, media sosial, pemasaran konten, dan pengembangan bisnis.',
    rating: 4.8,
    totalReviews: 87,
    totalTrainings: 16,
    totalParticipants: 287,
    status: 'active',

    expertise: [
      {
        title: 'Digital Marketing',
        color: 'primary'
      },
      {
        title: 'SEO',
        color: 'success'
      },
      {
        title: 'Branding',
        color: 'secondary'
      },
      {
        title: 'Social Media',
        color: 'info'
      }
    ],

    participants: [
      {
        name: 'Andi Setiawan',
        avatar: '/images/avatars/13.png'
      },
      {
        name: 'Maya Sari',
        avatar: '/images/avatars/14.png'
      },
      {
        name: 'Rafi Pratama',
        avatar: '/images/avatars/15.png'
      }
    ]
  },

  {
    id: 4,
    name: 'Dewi Lestari',
    username: '@dewi.lestari',
    avatar: '/images/avatars/4.png',
    position: 'Pelatih Administrasi',
    description:
      'Pelatih administrasi dan perkantoran yang berfokus pada pengelolaan dokumen, tata kelola administrasi, dan produktivitas kerja.',
    rating: 4.7,
    totalReviews: 72,
    totalTrainings: 14,
    totalParticipants: 241,
    status: 'active',

    expertise: [
      {
        title: 'Administrasi',
        color: 'info'
      },
      {
        title: 'Perkantoran',
        color: 'primary'
      },
      {
        title: 'Microsoft Office',
        color: 'success'
      }
    ],

    participants: [
      {
        name: 'Salsa Maharani',
        avatar: '/images/avatars/16.png'
      },
      {
        name: 'Putri Ananda',
        avatar: '/images/avatars/17.png'
      },
      {
        name: 'Rizal Akbar',
        avatar: '/images/avatars/18.png'
      }
    ]
  },

  {
    id: 5,
    name: 'Rizky Pratama',
    username: '@rizky.pratama',
    avatar: '/images/avatars/5.png',
    position: 'Pelatih Industri & Manufaktur',
    description:
      'Pelatih bidang industri dan manufaktur dengan fokus pada keselamatan kerja, proses produksi, dan peningkatan kompetensi teknis.',
    rating: 4.6,
    totalReviews: 64,
    totalTrainings: 11,
    totalParticipants: 198,
    status: 'active',

    expertise: [
      {
        title: 'Manufaktur',
        color: 'warning'
      },
      {
        title: 'K3',
        color: 'error'
      },
      {
        title: 'Produksi',
        color: 'primary'
      }
    ],

    participants: [
      {
        name: 'Fauzan Ramadhan',
        avatar: '/images/avatars/19.png'
      },
      {
        name: 'Agus Setiawan',
        avatar: '/images/avatars/20.png'
      },
      {
        name: 'Doni Kurniawan',
        avatar: '/images/avatars/21.png'
      }
    ]
  },

  {
    id: 6,
    name: 'Nadia Putri',
    username: '@nadia.putri',
    avatar: '/images/avatars/6.png',
    position: 'Pelatih Keuangan',
    description:
      'Pelatih pengelolaan keuangan dan pembukuan dengan fokus pada literasi keuangan dan pengelolaan keuangan usaha.',
    rating: 4.9,
    totalReviews: 54,
    totalTrainings: 13,
    totalParticipants: 176,
    status: 'active',

    expertise: [
      {
        title: 'Keuangan',
        color: 'success'
      },
      {
        title: 'Pembukuan',
        color: 'primary'
      },
      {
        title: 'Literasi Keuangan',
        color: 'warning'
      }
    ],

    participants: [
      {
        name: 'Novi Anggraini',
        avatar: '/images/avatars/22.png'
      },
      {
        name: 'Ilham Maulana',
        avatar: '/images/avatars/23.png'
      },
      {
        name: 'Sarah Aulia',
        avatar: '/images/avatars/24.png'
      }
    ]
  }
]

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

type Props = {
  data?: InstructorCardType[]
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const InstructorCards = ({ data = defaultInstructors }: Props) => {
  const [search, setSearch] = useState('')
  const [expertiseFilter, setExpertiseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const [expertiseModalOpen, setExpertiseModalOpen] = useState(false)

  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorCardType | null>(null)

  // ---------------------------------------------------------------------------
  // Expertise Modal
  // ---------------------------------------------------------------------------

  const handleManageExpertise = (
    instructor: InstructorCardType
  ) => {
    setSelectedInstructor(instructor)
    setExpertiseModalOpen(true)
  }

  const handleCloseExpertiseModal = () => {
    setExpertiseModalOpen(false)
    setSelectedInstructor(null)
  }

  // ---------------------------------------------------------------------------
  // Expertise Options
  // ---------------------------------------------------------------------------

  const expertiseOptions = useMemo(() => {
    const expertiseSet = new Set<string>()

    data.forEach(instructor => {
      instructor.expertise.forEach(item => {
        expertiseSet.add(item.title)
      })
    })

    return Array.from(expertiseSet).sort()
  }, [data])

  // ---------------------------------------------------------------------------
  // Filter & Sort
  // ---------------------------------------------------------------------------

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    const filtered = data.filter(instructor => {
      const matchesSearch =
        !keyword ||
        instructor.name.toLowerCase().includes(keyword) ||
        instructor.username.toLowerCase().includes(keyword) ||
        instructor.position.toLowerCase().includes(keyword) ||
        instructor.expertise.some(item =>
          item.title.toLowerCase().includes(keyword)
        )

      const matchesExpertise =
        expertiseFilter === 'all' ||
        instructor.expertise.some(
          item => item.title === expertiseFilter
        )

      const matchesStatus =
        statusFilter === 'all' ||
        instructor.status === statusFilter

      return (
        matchesSearch &&
        matchesExpertise &&
        matchesStatus
      )
    })

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating

        case 'trainings':
          return b.totalTrainings - a.totalTrainings

        case 'participants':
          return b.totalParticipants - a.totalParticipants

        case 'popular':
        default:
          return b.totalParticipants - a.totalParticipants
      }
    })
  }, [
    data,
    search,
    expertiseFilter,
    statusFilter,
    sortBy
  ])

  // ---------------------------------------------------------------------------
  // Reset Filters
  // ---------------------------------------------------------------------------

  const handleResetFilters = () => {
    setSearch('')
    setExpertiseFilter('all')
    setStatusFilter('all')
    setSortBy('popular')
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className='flex flex-col gap-6'>
      {/* Filters */}

      <Card>
        <CardContent>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            {/* Search */}

            <CustomTextField
              value={search}
              onChange={event => {
                setSearch(event.target.value)
              }}
              placeholder='Cari pelatih, keahlian, atau bidang...'
              className='max-sm:is-full sm:is-[320px]'
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search' />
                    </InputAdornment>
                  )
                }
              }}
            />

            {/* Filter Controls */}

            <div className='flex flex-wrap items-center gap-3 max-sm:is-full'>
              {/* Expertise */}

              <CustomTextField
                select
                value={expertiseFilter}
                onChange={event => {
                  setExpertiseFilter(event.target.value)
                }}
                label='Keahlian'
                className='max-sm:is-full sm:is-[190px]'
                slotProps={{
                  select: {
                    displayEmpty: true
                  }
                }}
              >
                <MenuItem value='all'>
                  Semua Keahlian
                </MenuItem>

                {expertiseOptions.map(expertise => (
                  <MenuItem
                    key={expertise}
                    value={expertise}
                  >
                    {expertise}
                  </MenuItem>
                ))}
              </CustomTextField>

              {/* Status */}

              <CustomTextField
                select
                value={statusFilter}
                onChange={event => {
                  setStatusFilter(event.target.value)
                }}
                label='Status'
                className='max-sm:is-full sm:is-[150px]'
              >
                <MenuItem value='all'>
                  Semua Status
                </MenuItem>

                <MenuItem value='active'>
                  Aktif
                </MenuItem>

                <MenuItem value='inactive'>
                  Nonaktif
                </MenuItem>
              </CustomTextField>

              {/* Sort */}

              <CustomTextField
                select
                value={sortBy}
                onChange={event => {
                  setSortBy(event.target.value)
                }}
                label='Urutkan'
                className='max-sm:is-full sm:is-[180px]'
              >
                <MenuItem value='popular'>
                  Paling Populer
                </MenuItem>

                <MenuItem value='rating'>
                  Rating Tertinggi
                </MenuItem>

                <MenuItem value='trainings'>
                  Pelatihan Terbanyak
                </MenuItem>

                <MenuItem value='participants'>
                  Peserta Terbanyak
                </MenuItem>
              </CustomTextField>

              {/* Reset */}

              <Button
                variant='text'
                color='secondary'
                startIcon={
                  <i className='tabler-refresh' />
                }
                onClick={handleResetFilters}
                className='max-sm:is-full'
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Info */}

      <div className='flex items-center justify-between gap-4'>
        <div>
          <Typography
            variant='h5'
            className='font-semibold'
          >
            SDM Pelatih
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
          >
            Kelola tenaga pelatih dan kompetensi yang
            tersedia untuk program pelatihan.
          </Typography>
        </div>

        <Typography
          variant='body2'
          color='text.secondary'
        >
          {filteredData.length} pelatih
        </Typography>
      </div>

      {/* Instructor Cards */}

      {filteredData.length > 0 ? (
        <Grid container spacing={6}>
          {filteredData.map(instructor => {
            const isPopular =
              instructor.totalParticipants >= 300

            return (
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                  lg: 4
                }}
                key={instructor.id}
              >
                <Card className='h-full'>
                  <CardContent className='flex flex-col gap-4 h-full'>
                    {/* Header */}

                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2 min-is-0'>
                        <Tooltip
                          title={`${instructor.name} ${instructor.username}`}
                        >
                          <Avatar
                            src={instructor.avatar}
                            alt={instructor.name}
                            className='bs-[42px] is-[42px] shrink-0'
                          />
                        </Tooltip>

                        <div className='min-is-0'>
                          <div className='flex items-center gap-2'>
                            <Typography
                              variant='h6'
                              className='font-medium truncate'
                            >
                              {instructor.name}
                            </Typography>

                            {isPopular && (
                              <Tooltip title='Pelatih populer berdasarkan jumlah peserta'>
                                <i className='tabler-flame text-warning text-base shrink-0' />
                              </Tooltip>
                            )}
                          </div>

                          <Typography
                            variant='body2'
                            color='text.secondary'
                            className='truncate'
                          >
                            {instructor.position}
                          </Typography>
                        </div>
                      </div>

                      <div className='flex items-center'>
                        <Tooltip title='Favorit'>
                          <IconButton size='small'>
                            <i className='tabler-star text-textDisabled' />
                          </IconButton>
                        </Tooltip>

                        <OptionMenu
                          iconButtonProps={{
                            size: 'medium'
                          }}
                          iconClassName='text-textDisabled'
                          options={[
                            {
                              text: 'Lihat Profil',
                              icon: 'tabler-user',
                              menuItemProps: {
                                component: Link,
                                href: `/admin/instructors/${instructor.id}`
                              }
                            },
                            {
                              text: 'Edit Pelatih',
                              icon: 'tabler-edit'
                            },
                            {
                              text: 'Kelola Keahlian',
                              icon: 'tabler-sparkles',
                              menuItemProps: {
                                onClick: () =>
                                  handleManageExpertise(instructor)
                              }
                            },
                            {
                              text: 'Lihat Pelatihan',
                              icon: 'tabler-school',
                              menuItemProps: {
                                component: Link,
                                href: `/admin/trainings?instructor=${instructor.id}`
                              }
                            },
                            {
                              text: 'Lihat Evaluasi',
                              icon: 'tabler-star',
                              menuItemProps: {
                                component: Link,
                                href: `/admin/instructors/${instructor.id}/evaluations`
                              }
                            },
                            {
                              divider: true
                            },
                            {
                              text:
                                instructor.status === 'active'
                                  ? 'Nonaktifkan'
                                  : 'Aktifkan',
                              icon:
                                instructor.status === 'active'
                                  ? 'tabler-user-off'
                                  : 'tabler-user-check'
                            },
                            {
                              text: 'Hapus Pelatih',
                              icon: 'tabler-trash',
                              menuItemProps: {
                                className:
                                  'text-error hover:bg-[var(--mui-palette-error-lightOpacity)]'
                              }
                            }
                          ]}
                        />
                      </div>
                    </div>

                    {/* Description */}

                    <Tooltip
                      title={
                        <div
                          style={{
                            maxWidth: 360,
                            whiteSpace: 'normal',
                            lineHeight: 1.6
                          }}
                        >
                          {instructor.description}
                        </div>
                      }
                      arrow
                      placement='top-start'
                    >
                      <Typography
                        className='line-clamp-3 cursor-help'
                        color='text.secondary'
                      >
                        {instructor.description}
                      </Typography>
                    </Tooltip>

                    {/* Statistics */}

                    <div className='flex items-center flex-wrap gap-x-5 gap-y-3'>
                      {/* Rating */}

                      <Tooltip
                        title={`${instructor.rating.toFixed(
                          1
                        )} dari ${instructor.totalReviews} evaluasi`}
                      >
                        <div className='flex items-center gap-1.5 cursor-help'>
                          <i className='tabler-star-filled text-warning text-lg' />

                          <Typography
                            variant='body2'
                            className='font-medium'
                          >
                            {instructor.rating.toFixed(1)}
                          </Typography>

                          <Typography
                            variant='caption'
                            color='text.secondary'
                          >
                            ({instructor.totalReviews})
                          </Typography>
                        </div>
                      </Tooltip>

                      {/* Trainings */}

                      <Tooltip
                        title={`${instructor.totalTrainings} pelatihan yang telah ditangani`}
                      >
                        <div className='flex items-center gap-1.5 cursor-help'>
                          <i className='tabler-school text-textSecondary' />

                          <Typography
                            variant='body2'
                            color='text.secondary'
                          >
                            {instructor.totalTrainings} Pelatihan
                          </Typography>
                        </div>
                      </Tooltip>

                      {/* Participants */}

                      <Tooltip
                        title={`${instructor.totalParticipants} peserta telah mengikuti pelatihan`}
                        arrow
                      >
                        <div className='flex items-center gap-2 min-h-[36px] cursor-help'>
                          <AvatarGroup
                            total={instructor.totalParticipants}
                            className='items-center'
                            sx={{
                              '& .MuiAvatar-root': {
                                width: '1.9rem',
                                height: '1.9rem',
                                fontSize: '0.7rem',
                                border:
                                  '2px solid var(--mui-palette-background-paper)',
                                transition: 'transform 180ms ease'
                              },
                              '& .MuiAvatar-root:hover': {
                                transform: 'translateY(-3px)'
                              }
                            }}
                          >
                            {instructor.participants
                              .slice(0, 2)
                              .map((participant, index) => (
                                <Tooltip
                                  key={`${participant.name}-${index}`}
                                  title={participant.name}
                                  arrow
                                  placement='top'
                                >
                                  <Avatar
                                    src={participant.avatar}
                                    alt={participant.name}
                                  />
                                </Tooltip>
                              ))}
                          </AvatarGroup>

                          <Typography
                            variant='body2'
                            color='text.secondary'
                            className='font-medium'
                          >
                            Peserta
                          </Typography>
                        </div>
                      </Tooltip>
                    </div>

                    {/* Expertise & Status */}

                    <div className='mt-auto flex flex-col gap-3'>
                      {/* Expertise */}

                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-1.5'>
                          <i className='tabler-sparkles text-textSecondary text-sm' />

                          <Typography
                            variant='caption'
                            color='text.secondary'
                            className='font-medium'
                          >
                            Keahlian
                          </Typography>
                        </div>

                        <div className='flex items-center gap-2 flex-wrap'>
                          {instructor.expertise
                            .slice(0, 3)
                            .map((expertise, index) => (
                              <Chip
                                key={index}
                                variant='tonal'
                                size='small'
                                label={expertise.title}
                                color={expertise.color}
                              />
                            ))}

                          {instructor.expertise.length > 3 && (
                            <Tooltip
                              title={
                                <div
                                  className='flex flex-col gap-1'
                                  style={{
                                    lineHeight: 1.6
                                  }}
                                >
                                  {instructor.expertise
                                    .slice(3)
                                    .map((item, index) => (
                                      <span key={index}>
                                        • {item.title}
                                      </span>
                                    ))}
                                </div>
                              }
                              arrow
                              placement='top'
                            >
                              <Chip
                                variant='tonal'
                                size='small'
                                label={`+${instructor.expertise.length - 3}`}
                                color='secondary'
                                className='cursor-help'
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {/* Status */}

                      <div className='flex items-center justify-between gap-3 pt-3 border-t border-divider'>
                        <div className='flex items-center gap-1.5'>
                          <i
                            className={
                              instructor.status === 'active'
                                ? 'tabler-shield-check text-success'
                                : 'tabler-shield-off text-textSecondary'
                            }
                          />

                          <Typography
                            variant='caption'
                            color='text.secondary'
                            className='font-medium'
                          >
                            Status Pelatih
                          </Typography>
                        </div>

                        <Chip
                          size='small'
                          variant='tonal'
                          color={
                            instructor.status === 'active'
                              ? 'success'
                              : 'secondary'
                          }
                          icon={
                            <i
                              className={
                                instructor.status === 'active'
                                  ? 'tabler-circle-check'
                                  : 'tabler-circle-off'
                              }
                            />
                          }
                          label={
                            instructor.status === 'active'
                              ? 'Aktif'
                              : 'Nonaktif'
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <Card>
          <CardContent className='flex flex-col items-center justify-center text-center py-16'>
            <div className='flex items-center justify-center bs-14 is-14 rounded-full bg-actionHover mbe-4'>
              <i className='tabler-user-search text-3xl text-textSecondary' />
            </div>

            <Typography
              variant='h6'
              className='mbe-1'
            >
              Pelatih tidak ditemukan
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              className='mbe-4'
            >
              Coba ubah kata pencarian atau filter yang digunakan.
            </Typography>

            <Button
              variant='outlined'
              color='secondary'
              startIcon={<i className='tabler-refresh' />}
              onClick={handleResetFilters}
            >
              Reset Filter
            </Button>
          </CardContent>
        </Card>
      )}

      <ManageInstructorExpertiseDialog
        open={expertiseModalOpen}
        instructor={selectedInstructor}
        expertiseOptions={expertiseOptions}
        onClose={handleCloseExpertiseModal}
      />
    </div>
  )
}

export default InstructorCards
