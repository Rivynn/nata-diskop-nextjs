'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import Swal from 'sweetalert2'
import { rankItem } from '@tanstack/match-sorter-utils'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import type {
  ColumnDef,
  FilterFn
} from '@tanstack/react-table'

import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import AddExpertiseDrawer from './AddExpertiseDrawer'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// -----------------------------------------------------------------------------
// Type Augmentation
// -----------------------------------------------------------------------------

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ExpertiseInstructorType = {
  id: number
  name: string
  avatar: string
}

export type InstructorExpertiseType = {
  id: number
  name: string
  slug: string
  totalInstructors: number
  totalTrainings: number
  instructors: ExpertiseInstructorType[]
  createdAt: string
  updatedAt: string
}

type ExpertiseWithActionsType =
  InstructorExpertiseType & {
  actions?: string
}

type ExpertiseFormMode =
  | 'create'
  | 'edit'

// -----------------------------------------------------------------------------
// Fuzzy Filter
// -----------------------------------------------------------------------------

const fuzzyFilter: FilterFn<any> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(
    row.getValue(columnId),
    value
  )

  addMeta({
    itemRank
  })

  return itemRank.passed
}

// -----------------------------------------------------------------------------
// Debounced Input
// -----------------------------------------------------------------------------

const DebouncedInput = ({
                          value: initialValue,
                          onChange,
                          debounce = 500,
                          ...props
                        }: {
  value: string | number
  onChange: (
    value: string | number
  ) => void
  debounce?: number
} & Omit<
  TextFieldProps,
  'onChange'
>) => {
  const [value, setValue] =
    useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () =>
      clearTimeout(timeout)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e =>
        setValue(e.target.value)
      }
    />
  )
}

// -----------------------------------------------------------------------------
// Temporary Data
// -----------------------------------------------------------------------------

const expertiseData: InstructorExpertiseType[] = [
  {
    id: 1,
    name: 'Programming',
    slug: 'programming',
    totalInstructors: 4,
    totalTrainings: 12,
    instructors: [
      {
        id: 1,
        name: 'Ahmad Fauzan',
        avatar: '/images/avatars/1.png'
      },
      {
        id: 2,
        name: 'Rizky Pratama',
        avatar: '/images/avatars/2.png'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        avatar: '/images/avatars/3.png'
      },
      {
        id: 4,
        name: 'Dimas Saputra',
        avatar: '/images/avatars/4.png'
      }
    ],
    createdAt: '2026-01-10',
    updatedAt: '2026-09-28'
  },

  {
    id: 2,
    name: 'Web Development',
    slug: 'web-development',
    totalInstructors: 5,
    totalTrainings: 14,
    instructors: [
      {
        id: 1,
        name: 'Ahmad Fauzan',
        avatar: '/images/avatars/1.png'
      },
      {
        id: 2,
        name: 'Rizky Pratama',
        avatar: '/images/avatars/2.png'
      },
      {
        id: 5,
        name: 'Nadia Putri',
        avatar: '/images/avatars/5.png'
      },
      {
        id: 6,
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/6.png'
      },
      {
        id: 4,
        name: 'Dimas Saputra',
        avatar: '/images/avatars/4.png'
      }
    ],
    createdAt: '2026-01-12',
    updatedAt: '2026-09-26'
  },

  {
    id: 3,
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    totalInstructors: 3,
    totalTrainings: 9,
    instructors: [
      {
        id: 7,
        name: 'Siti Rahma',
        avatar: '/images/avatars/7.png'
      },
      {
        id: 8,
        name: 'Dewi Lestari',
        avatar: '/images/avatars/8.png'
      },
      {
        id: 5,
        name: 'Nadia Putri',
        avatar: '/images/avatars/5.png'
      }
    ],
    createdAt: '2026-01-15',
    updatedAt: '2026-09-25'
  },

  {
    id: 4,
    name: 'Kewirausahaan',
    slug: 'kewirausahaan',
    totalInstructors: 8,
    totalTrainings: 18,
    instructors: [
      {
        id: 7,
        name: 'Siti Rahma',
        avatar: '/images/avatars/7.png'
      },
      {
        id: 8,
        name: 'Dewi Lestari',
        avatar: '/images/avatars/8.png'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        avatar: '/images/avatars/3.png'
      },
      {
        id: 6,
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/6.png'
      },
      {
        id: 5,
        name: 'Nadia Putri',
        avatar: '/images/avatars/5.png'
      },
      {
        id: 2,
        name: 'Rizky Pratama',
        avatar: '/images/avatars/2.png'
      },
      {
        id: 4,
        name: 'Dimas Saputra',
        avatar: '/images/avatars/4.png'
      },
      {
        id: 1,
        name: 'Ahmad Fauzan',
        avatar: '/images/avatars/1.png'
      }
    ],
    createdAt: '2026-01-18',
    updatedAt: '2026-09-27'
  },

  {
    id: 5,
    name: 'UMKM',
    slug: 'umkm',
    totalInstructors: 6,
    totalTrainings: 15,
    instructors: [
      {
        id: 7,
        name: 'Siti Rahma',
        avatar: '/images/avatars/7.png'
      },
      {
        id: 8,
        name: 'Dewi Lestari',
        avatar: '/images/avatars/8.png'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        avatar: '/images/avatars/3.png'
      },
      {
        id: 5,
        name: 'Nadia Putri',
        avatar: '/images/avatars/5.png'
      },
      {
        id: 6,
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/6.png'
      },
      {
        id: 2,
        name: 'Rizky Pratama',
        avatar: '/images/avatars/2.png'
      }
    ],
    createdAt: '2026-01-20',
    updatedAt: '2026-09-24'
  },

  {
    id: 6,
    name: 'Keuangan',
    slug: 'keuangan',
    totalInstructors: 2,
    totalTrainings: 6,
    instructors: [
      {
        id: 3,
        name: 'Budi Santoso',
        avatar: '/images/avatars/3.png'
      },
      {
        id: 8,
        name: 'Dewi Lestari',
        avatar: '/images/avatars/8.png'
      }
    ],
    createdAt: '2026-02-02',
    updatedAt: '2026-09-20'
  },

  {
    id: 7,
    name: 'Administrasi Perkantoran',
    slug: 'administrasi-perkantoran',
    totalInstructors: 5,
    totalTrainings: 11,
    instructors: [
      {
        id: 7,
        name: 'Siti Rahma',
        avatar: '/images/avatars/7.png'
      },
      {
        id: 8,
        name: 'Dewi Lestari',
        avatar: '/images/avatars/8.png'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        avatar: '/images/avatars/3.png'
      },
      {
        id: 6,
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/6.png'
      },
      {
        id: 5,
        name: 'Nadia Putri',
        avatar: '/images/avatars/5.png'
      }
    ],
    createdAt: '2026-02-10',
    updatedAt: '2026-09-18'
  },

  {
    id: 8,
    name: 'Microsoft Office',
    slug: 'microsoft-office',
    totalInstructors: 7,
    totalTrainings: 16,
    instructors: [
      {
        id: 7,
        name: 'Siti Rahma',
        avatar: '/images/avatars/7.png'
      },
      {
        id: 8,
        name: 'Dewi Lestari',
        avatar: '/images/avatars/8.png'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        avatar: '/images/avatars/3.png'
      },
      {
        id: 6,
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/6.png'
      },
      {
        id: 5,
        name: 'Nadia Putri',
        avatar: '/images/avatars/5.png'
      },
      {
        id: 4,
        name: 'Dimas Saputra',
        avatar: '/images/avatars/4.png'
      },
      {
        id: 2,
        name: 'Rizky Pratama',
        avatar: '/images/avatars/2.png'
      }
    ],
    createdAt: '2026-02-15',
    updatedAt: '2026-09-22'
  },

  {
    id: 9,
    name: 'K3',
    slug: 'k3',
    totalInstructors: 1,
    totalTrainings: 4,
    instructors: [
      {
        id: 6,
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/6.png'
      }
    ],
    createdAt: '2026-03-01',
    updatedAt: '2026-09-15'
  },

  {
    id: 10,
    name: 'Manajemen Bisnis',
    slug: 'manajemen-bisnis',
    totalInstructors: 4,
    totalTrainings: 10,
    instructors: [
      {
        id: 1,
        name: 'Ahmad Fauzan',
        avatar: '/images/avatars/1.png'
      },
      {
        id: 7,
        name: 'Siti Rahma',
        avatar: '/images/avatars/7.png'
      },
      {
        id: 3,
        name: 'Budi Santoso',
        avatar: '/images/avatars/3.png'
      },
      {
        id: 5,
        name: 'Nadia Putri',
        avatar: '/images/avatars/5.png'
      }
    ],
    createdAt: '2026-03-05',
    updatedAt: '2026-09-16'
  },

  {
    id: 11,
    name: 'Industri & Manufaktur',
    slug: 'industri-manufaktur',
    totalInstructors: 2,
    totalTrainings: 5,
    instructors: [
      {
        id: 6,
        name: 'Fajar Hidayat',
        avatar: '/images/avatars/6.png'
      },
      {
        id: 4,
        name: 'Dimas Saputra',
        avatar: '/images/avatars/4.png'
      }
    ],
    createdAt: '2026-03-12',
    updatedAt: '2026-09-14'
  },

  {
    id: 12,
    name: 'Desain Grafis',
    slug: 'desain-grafis',
    totalInstructors: 0,
    totalTrainings: 2,
    instructors: [],
    createdAt: '2026-03-18',
    updatedAt: '2026-08-30'
  }
]

// -----------------------------------------------------------------------------
// Column Helper
// -----------------------------------------------------------------------------

const columnHelper =
  createColumnHelper<ExpertiseWithActionsType>()

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const ExpertiseTable = () => {
  const router = useRouter()

  // ---------------------------------------------------------------------------
  // States
  // ---------------------------------------------------------------------------

  const [
    addExpertiseOpen,
    setAddExpertiseOpen
  ] = useState(false)

  const [
    selectedExpertise,
    setSelectedExpertise
  ] =
    useState<InstructorExpertiseType | null>(
      null
    )

  const [
    expertiseFormMode,
    setExpertiseFormMode
  ] =
    useState<ExpertiseFormMode>('create')

  const [
    rowSelection,
    setRowSelection
  ] = useState({})

  const [data, setData] =
    useState<
      InstructorExpertiseType[]
    >(expertiseData)

  const [
    globalFilter,
    setGlobalFilter
  ] = useState('')

  // ---------------------------------------------------------------------------
  // Drawer Helpers
  // ---------------------------------------------------------------------------

  const openCreateDrawer = () => {
    setSelectedExpertise(null)
    setExpertiseFormMode('create')
    setAddExpertiseOpen(true)
  }

  const openEditDrawer = (
    expertise: InstructorExpertiseType
  ) => {
    setSelectedExpertise(expertise)
    setExpertiseFormMode('edit')
    setAddExpertiseOpen(true)
  }

  const handleCloseDrawer = () => {
    setAddExpertiseOpen(false)
    setSelectedExpertise(null)
    setExpertiseFormMode('create')
  }

  // ---------------------------------------------------------------------------
  // Trainer Requirement Alert
  // ---------------------------------------------------------------------------

  const handleTrainerRequirement = (
    expertise: InstructorExpertiseType
  ) => {
    Swal.fire({
      title: 'Pelatih belum tersedia',

      html: `
        <div style="
          line-height:1.75;
          text-align:left;
        ">
          <p style="margin:0 0 14px;">
            Keahlian
            <strong>${expertise.name}</strong>
            saat ini belum memiliki pelatih.
          </p>

          <div style="
            padding:12px 14px;
            border-radius:10px;
            background:rgba(255, 159, 67, 0.10);
            border:1px solid rgba(255, 159, 67, 0.20);
            margin-bottom:14px;
          ">
            <strong style="
              display:block;
              margin-bottom:4px;
            ">
              Perlu perhatian
            </strong>

            Terdapat
            <strong>
              ${expertise.totalTrainings}
              program pelatihan
            </strong>
            yang menggunakan keahlian ini,
            tetapi belum memiliki pelatih.
          </div>

          <p style="
            margin:0;
            color:#6d6b77;
          ">
            Pertimbangkan untuk menambahkan
            atau mencari pelatih dengan
            kompetensi ini.
          </p>
        </div>
      `,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText:
        'Lihat Pelatih',

      cancelButtonText:
        'Tutup',

      reverseButtons: true,

      focusCancel: true
    }).then(result => {
      if (!result.isConfirmed) {
        return
      }

      router.push(
        `/admin/instructors?expertise=${expertise.slug}`
      )
    })
  }

  // ---------------------------------------------------------------------------
  // Delete Action
  // ---------------------------------------------------------------------------

  const handleDelete = (
    expertise: InstructorExpertiseType
  ) => {
    if (
      expertise.totalInstructors > 0
    ) {
      Swal.fire({
        title:
          'Keahlian masih digunakan',

        html: `
          <div style="
            line-height:1.7;
          ">
            Keahlian
            <strong>
              ${expertise.name}
            </strong>
            masih digunakan oleh
            <strong>
              ${expertise.totalInstructors}
            </strong>
            pelatih.

            <br /><br />

            Untuk menjaga histori data,
            keahlian ini tidak dapat dihapus.
          </div>
        `,

        icon: 'warning',

        confirmButtonText:
          'Mengerti'
      })

      return
    }

    Swal.fire({
      title: 'Hapus keahlian?',

      html: `
        <div style="
          line-height:1.7;
        ">
          Keahlian
          <strong>
            ${expertise.name}
          </strong>
          akan dihapus secara permanen.

          <br />

          Tindakan ini tidak dapat
          dibatalkan.
        </div>
      `,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText:
        'Ya, Hapus',

      cancelButtonText:
        'Batal',

      reverseButtons: true,

      focusCancel: true
    }).then(result => {
      if (!result.isConfirmed) {
        return
      }

      setData(currentData =>
        currentData.filter(
          item =>
            item.id !== expertise.id
        )
      )

      Swal.fire({
        title:
          'Keahlian dihapus',

        text:
          `"${expertise.name}" berhasil dihapus.`,

        icon: 'success',

        confirmButtonText:
          'Selesai'
      })
    })
  }

  // ---------------------------------------------------------------------------
  // Columns
  // ---------------------------------------------------------------------------

  const columns = useMemo<
    ColumnDef<
      ExpertiseWithActionsType,
      any
    >[]
  >(
    () => [
      // -----------------------------------------------------------------------
      // Selection
      // -----------------------------------------------------------------------

      {
        id: 'select',

        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllRowsSelected()
            }
            indeterminate={
              table.getIsSomeRowsSelected()
            }
            onChange={
              table.getToggleAllRowsSelectedHandler()
            }
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            checked={
              row.getIsSelected()
            }
            disabled={
              !row.getCanSelect()
            }
            indeterminate={
              row.getIsSomeSelected()
            }
            onChange={
              row.getToggleSelectedHandler()
            }
          />
        )
      },

      // -----------------------------------------------------------------------
      // Expertise
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'name',
        {
          header: 'Keahlian',

          cell: ({ row }) => {
            const expertise =
              row.original

            const firstLetter =
              expertise.name
                .charAt(0)
                .toUpperCase()

            return (
              <div className='flex items-center gap-3 min-is-0'>
                <div
                  className='flex items-center justify-center shrink-0 rounded-lg bs-10 is-10 font-semibold text-primary'
                  style={{
                    background:
                      'color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent)'
                  }}
                >
                  {firstLetter}
                </div>

                <div className='flex flex-col min-is-0'>
                  <Typography
                    color='text.primary'
                    className='font-semibold truncate'
                  >
                    {
                      expertise.name
                    }
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                    className='truncate'
                  >
                    {
                      expertise.slug
                    }
                  </Typography>
                </div>
              </div>
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // Instructors
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'totalInstructors',
        {
          header: 'Pelatih',

          cell: ({ row }) => {
            const expertise =
              row.original

            // ---------------------------------------------------------------
            // No Trainer
            // ---------------------------------------------------------------

            if (
              expertise.totalInstructors ===
              0
            ) {
              return (
                <Button
                  size='small'
                  color='warning'
                  variant='tonal'
                  onClick={() =>
                    handleTrainerRequirement(
                      expertise
                    )
                  }
                  className='normal-case font-semibold'
                >
                  <i className='tabler-alert-triangle text-lg mie-1' />

                  Butuh Pelatih
                </Button>
              )
            }

            // ---------------------------------------------------------------
            // Maximum 3 Visible Avatars
            // ---------------------------------------------------------------

            const visibleInstructors =
              expertise.instructors.slice(
                0,
                3
              )

            return (
              <div className='flex items-center gap-3'>
                <AvatarGroup
                  total={
                    expertise.totalInstructors
                  }
                  sx={{
                    '& .MuiAvatar-root': {
                      width: '2.1rem',
                      height: '2.1rem',
                      fontSize:
                        '0.875rem',

                      border:
                        '2px solid var(--mui-palette-background-paper)',

                      transition:
                        'transform 180ms ease'
                    },

                    '& .MuiAvatar-root:hover':
                      {
                        transform:
                          'translateY(-3px)'
                      }
                  }}
                  className='items-center pull-up'
                >
                  {visibleInstructors.map(
                    (
                      instructor,
                      index
                    ) => (
                      <Tooltip
                        key={`${instructor.id}-${instructor.name}-${index}`}
                        title={
                          instructor.name
                        }
                        arrow
                        placement='top'
                      >
                        <Avatar
                          src={
                            instructor.avatar
                          }
                          alt={
                            instructor.name
                          }
                        />
                      </Tooltip>
                    )
                  )}
                </AvatarGroup>

                <div className='flex flex-col'>
                  <Typography
                    variant='body2'
                    color='text.primary'
                    className='font-medium'
                  >
                    {
                      expertise.totalInstructors
                    }
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    Pelatih
                  </Typography>
                </div>
              </div>
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // Trainings
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'totalTrainings',
        {
          header: 'Pelatihan',

          cell: ({ row }) => (
            <div className='flex items-center'>
              <span
                className='inline-flex items-center justify-center rounded-md px-2.5 py-1 text-sm font-semibold'
                style={{
                  background:
                    'color-mix(in srgb, var(--mui-palette-primary-main) 9%, transparent)',

                  color:
                    'var(--mui-palette-primary-main)'
                }}
              >
                {row.original.totalTrainings.toLocaleString(
                  'id-ID'
                )}
              </span>
            </div>
          )
        }
      ),

      // -----------------------------------------------------------------------
      // Actions
      // -----------------------------------------------------------------------

      columnHelper.display({
        id: 'actions',

        header: 'Aksi',

        cell: ({ row }) => {
          const expertise =
            row.original

          return (
            <div className='flex items-center'>
              <IconButton
                size='small'
                aria-label={`Edit ${expertise.name}`}
                onClick={() =>
                  openEditDrawer(
                    expertise
                  )
                }
                sx={{
                  transition:
                    'all 180ms ease',

                  '&:hover': {
                    backgroundColor:
                      'var(--mui-palette-primary-lightOpacity)',

                    color:
                      'var(--mui-palette-primary-main)'
                  }
                }}
              >
                <i className='tabler-edit' />
              </IconButton>

              <OptionMenu
                iconButtonProps={{
                  size: 'medium'
                }}
                iconClassName='text-textSecondary'
                options={[
                  {
                    text:
                      'Lihat Pelatih',

                    icon:
                      'tabler-users',

                    menuItemProps: {
                      onClick: () =>
                        router.push(
                          `/admin/instructors?expertise=${expertise.slug}`
                        )
                    }
                  },

                  {
                    text:
                      'Hapus',

                    icon:
                      'tabler-trash',

                    menuItemProps: {
                      className:
                        'text-error',

                      onClick: () =>
                        handleDelete(
                          expertise
                        )
                    }
                  }
                ]}
              />
            </div>
          )
        },

        enableSorting: false
      })
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, data]
  )

  // ---------------------------------------------------------------------------
  // Sorted Data
  // ---------------------------------------------------------------------------

  const sortedData =
    useMemo(() => {
      return [...data].sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
            'id',
            {
              sensitivity:
                'base'
            }
          )
      )
    }, [data])

  // ---------------------------------------------------------------------------
  // Table
  // ---------------------------------------------------------------------------

  const table =
    useReactTable({
      data: sortedData,

      columns,

      filterFns: {
        fuzzy: fuzzyFilter
      },

      state: {
        rowSelection,
        globalFilter
      },

      initialState: {
        pagination: {
          pageSize: 10
        }
      },

      enableRowSelection: true,

      globalFilterFn:
      fuzzyFilter,

      onRowSelectionChange:
      setRowSelection,

      getCoreRowModel:
        getCoreRowModel(),

      onGlobalFilterChange:
      setGlobalFilter,

      getFilteredRowModel:
        getFilteredRowModel(),

      getSortedRowModel:
        getSortedRowModel(),

      getPaginationRowModel:
        getPaginationRowModel(),

      getFacetedRowModel:
        getFacetedRowModel(),

      getFacetedUniqueValues:
        getFacetedUniqueValues(),

      getFacetedMinMaxValues:
        getFacetedMinMaxValues()
    })

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <Card
        className='overflow-hidden'
        sx={{
          border:
            '1px solid var(--mui-palette-divider)',

          boxShadow:
            '0 4px 18px rgba(0, 0, 0, 0.035)',

          '& tbody tr': {
            transition:
              'background-color 180ms ease, box-shadow 180ms ease'
          },

          '& tbody tr:hover': {
            backgroundColor:
              'var(--mui-palette-action-hover)'
          },

          '& tbody tr.selected': {
            backgroundColor:
              'var(--mui-palette-primary-lightOpacity)'
          }
        }}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Header */}
        {/* ----------------------------------------------------------------- */}

        <div
          className='relative flex flex-wrap items-center justify-between gap-4 p-6'
          style={{
            borderBottom:
              '1px solid var(--mui-palette-divider)'
          }}
        >
          <div
            className='absolute top-0 left-0 bs-[3px] is-full'
            style={{
              background:
                'linear-gradient(90deg, var(--mui-palette-primary-main), transparent)'
            }}
          />

          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <Typography
                variant='h5'
                color='text.primary'
                className='font-semibold'
              >
                Keahlian Pelatih
              </Typography>

              <span
                className='inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide'
                style={{
                  color:
                    'var(--mui-palette-primary-main)',

                  background:
                    'color-mix(in srgb, var(--mui-palette-primary-main) 9%, transparent)'
                }}
              >
                Master Data
              </span>
            </div>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              Kelola bidang keahlian yang
              dimiliki tenaga pelatih DISKOP.
            </Typography>
          </div>

          <Button
            variant='contained'
            startIcon={
              <i className='tabler-plus' />
            }
            onClick={
              openCreateDrawer
            }
            sx={{
              boxShadow:
                '0 6px 14px color-mix(in srgb, var(--mui-palette-primary-main) 22%, transparent)'
            }}
          >
            Tambah Keahlian
          </Button>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Toolbar */}
        {/* ----------------------------------------------------------------- */}

        <div
          className='flex flex-wrap items-center justify-between gap-4 p-6'
          style={{
            background:
              'color-mix(in srgb, var(--mui-palette-background-default) 45%, transparent)',

            borderBottom:
              '1px solid var(--mui-palette-divider)'
          }}
        >
          <div className='relative max-sm:is-full'>
            <i
              className='tabler-search absolute top-1/2 -translate-y-1/2 text-textSecondary'
              style={{
                left: '12px',
                zIndex: 1
              }}
            />

            <DebouncedInput
              value={
                globalFilter ?? ''
              }
              onChange={value =>
                setGlobalFilter(
                  String(value)
                )
              }
              placeholder='Cari keahlian...'
              className='max-sm:is-full'
              sx={{
                '& .MuiInputBase-root': {
                  paddingInlineStart:
                    '36px',

                  minWidth:
                    '260px'
                }
              }}
            />
          </div>

          <div className='flex items-center gap-3'>
            <Typography
              variant='body2'
              color='text.secondary'
              className='max-sm:hidden'
            >
              Tampilkan
            </Typography>

            <CustomTextField
              select
              value={
                table.getState()
                  .pagination
                  .pageSize
              }
              onChange={e =>
                table.setPageSize(
                  Number(
                    e.target.value
                  )
                )
              }
              className='is-[82px]'
              size='small'
            >
              <MenuItem value='10'>
                10
              </MenuItem>

              <MenuItem value='15'>
                15
              </MenuItem>

              <MenuItem value='25'>
                25
              </MenuItem>
            </CustomTextField>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Table */}
        {/* ----------------------------------------------------------------- */}

        <div className='overflow-x-auto'>
          <table
            className={
              tableStyles.table
            }
          >
            <thead>
            {table
              .getHeaderGroups()
              .map(
                headerGroup => (
                  <tr
                    key={
                      headerGroup.id
                    }
                  >
                    {headerGroup.headers.map(
                      header => (
                        <th
                          key={
                            header.id
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : (
                              <div
                                className={classnames(
                                  {
                                    'flex items-center':
                                      header.column.getIsSorted(),

                                    'cursor-pointer select-none':
                                      header.column.getCanSort()
                                  }
                                )}
                                onClick={
                                  header.column.getToggleSortingHandler()
                                }
                              >
                                {flexRender(
                                  header
                                    .column
                                    .columnDef
                                    .header,
                                  header.getContext()
                                )}

                                {{
                                  asc: (
                                    <i className='tabler-chevron-up text-xl' />
                                  ),

                                  desc: (
                                    <i className='tabler-chevron-down text-xl' />
                                  )
                                }[
                                  header.column.getIsSorted() as
                                    | 'asc'
                                    | 'desc'
                                  ] ?? null}
                              </div>
                            )}
                        </th>
                      )
                    )}
                  </tr>
                )
              )}
            </thead>

            {table
              .getFilteredRowModel()
              .rows.length ===
            0 ? (
              <tbody>
              <tr>
                <td
                  colSpan={
                    table.getVisibleFlatColumns()
                      .length
                  }
                  className='text-center'
                >
                  <div className='flex flex-col items-center justify-center py-12'>
                    <div
                      className='flex items-center justify-center rounded-full bs-12 is-12 mbe-3'
                      style={{
                        background:
                          'var(--mui-palette-action-hover)'
                      }}
                    >
                      <i className='tabler-search-off text-2xl text-textSecondary' />
                    </div>

                    <Typography
                      color='text.primary'
                      className='font-semibold'
                    >
                      Keahlian tidak
                      ditemukan
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                    >
                      Coba gunakan kata
                      kunci pencarian
                      lain.
                    </Typography>
                  </div>
                </td>
              </tr>
              </tbody>
            ) : (
              <tbody>
              {table
                .getRowModel()
                .rows.map(row => (
                  <tr
                    key={
                      row.id
                    }
                    className={classnames(
                      {
                        selected:
                          row.getIsSelected()
                      }
                    )}
                  >
                    {row
                      .getVisibleCells()
                      .map(cell => (
                        <td
                          key={
                            cell.id
                          }
                        >
                          {flexRender(
                            cell
                              .column
                              .columnDef
                              .cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Pagination */}
        {/* ----------------------------------------------------------------- */}

        <TablePagination
          component={() => (
            <TablePaginationComponent
              table={table}
            />
          )}
          count={
            table
              .getFilteredRowModel()
              .rows.length
          }
          rowsPerPage={
            table.getState()
              .pagination.pageSize
          }
          page={
            table.getState()
              .pagination.pageIndex
          }
          onPageChange={(
            _,
            page
          ) => {
            table.setPageIndex(
              page
            )
          }}
        />
      </Card>

      {/* ------------------------------------------------------------------- */}
      {/* Add / Edit Expertise Drawer */}
      {/* ------------------------------------------------------------------- */}

      <AddExpertiseDrawer
        open={
          addExpertiseOpen
        }
        expertiseData={
          data
        }
        selectedExpertise={
          selectedExpertise
        }
        mode={
          expertiseFormMode
        }
        setData={
          setData
        }
        handleClose={
          handleCloseDrawer
        }
      />
    </>
  )
}

export default ExpertiseTable
