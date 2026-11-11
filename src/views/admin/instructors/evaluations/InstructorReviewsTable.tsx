'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import TablePagination from '@mui/material/TablePagination'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type {
  ColumnDef,
  FilterFn
} from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type EvaluationSource =
  | 'peserta'
  | 'pegawai'
  | 'mitra'

type EvaluationVisibility =
  | 'visible'
  | 'hidden'

type EvaluationType = {
  id: number

  evaluator: {
    name: string
    username: string
    avatar: string
  }

  training: string
  rating: number
  title: string
  comment: string
  date: string

  visibility: EvaluationVisibility
}

type EvaluationWithActionsType =
  EvaluationType & {
  actions?: string
}

type Props = {
  instructorId: string
  source: EvaluationSource
}

// -----------------------------------------------------------------------------
// Temporary Data
// -----------------------------------------------------------------------------

const evaluationData: Record<
  EvaluationSource,
  EvaluationType[]
> = {
  peserta: [
    {
      id: 1,
      evaluator: {
        name: 'Siti Rahma',
        username: '@siti.rahma',
        avatar: '/images/avatars/2.png'
      },
      training: 'Digital Marketing untuk UMKM',
      rating: 5,
      title: 'Penyampaian sangat mudah dipahami',
      comment:
        'Materi disampaikan dengan jelas dan contoh yang diberikan sangat relevan dengan kebutuhan peserta.',
      date: '2026-10-05',
      visibility: 'visible'
    },

    {
      id: 2,
      evaluator: {
        name: 'Fajar Hidayat',
        username: '@fajar.hidayat',
        avatar: '/images/avatars/8.png'
      },
      training: 'Pengembangan Website Dasar',
      rating: 5,
      title: 'Pelatih sangat komunikatif',
      comment:
        'Penjelasan step by step dan peserta diberi kesempatan untuk bertanya selama pelatihan.',
      date: '2026-10-04',
      visibility: 'visible'
    },

    {
      id: 3,
      evaluator: {
        name: 'Dewi Lestari',
        username: '@dewi.lestari',
        avatar: '/images/avatars/4.png'
      },
      training: 'Pemrograman Web Dasar',
      rating: 4,
      title: 'Materi cukup baik',
      comment:
        'Materi sangat membantu, tetapi waktu praktik bisa dibuat lebih panjang.',
      date: '2026-10-03',
      visibility: 'hidden'
    },

    {
      id: 4,
      evaluator: {
        name: 'Rizky Pratama',
        username: '@rizky.pratama',
        avatar: '/images/avatars/5.png'
      },
      training: 'Digitalisasi UMKM',
      rating: 5,
      title: 'Sangat membantu',
      comment:
        'Pelatih memahami kondisi peserta dan memberikan contoh yang mudah diterapkan.',
      date: '2026-10-02',
      visibility: 'visible'
    },

    {
      id: 5,
      evaluator: {
        name: 'Nadia Putri',
        username: '@nadia.putri',
        avatar: '/images/avatars/6.png'
      },
      training: 'Strategi Pemasaran Digital',
      rating: 5,
      title: 'Sangat direkomendasikan',
      comment:
        'Penyampaian menarik dan interaktif dari awal sampai akhir pelatihan.',
      date: '2026-10-01',
      visibility: 'hidden'
    }
  ],

  pegawai: [
    {
      id: 101,
      evaluator: {
        name: 'Rina Wulandari',
        username: '@rina.wulandari',
        avatar: '/images/avatars/9.png'
      },
      training: 'Digital Marketing untuk UMKM',
      rating: 5,
      title: 'Profesional dan disiplin',
      comment:
        'Pelatih hadir tepat waktu dan seluruh kebutuhan administrasi pelatihan terpenuhi dengan baik.',
      date: '2026-10-04',
      visibility: 'visible'
    },

    {
      id: 102,
      evaluator: {
        name: 'Budi Santoso',
        username: '@budi.santoso',
        avatar: '/images/avatars/3.png'
      },
      training: 'Pengembangan Website Dasar',
      rating: 5,
      title: 'Koordinasi sangat baik',
      comment:
        'Koordinasi dengan panitia dan tim penyelenggara berjalan dengan sangat baik.',
      date: '2026-10-02',
      visibility: 'visible'
    },

    {
      id: 103,
      evaluator: {
        name: 'Ahmad Fauzan',
        username: '@ahmad.fauzan',
        avatar: '/images/avatars/1.png'
      },
      training: 'Pemrograman Web Dasar',
      rating: 4,
      title: 'Administrasi baik',
      comment:
        'Pelaksanaan berjalan sesuai jadwal dengan beberapa catatan kecil pada dokumentasi.',
      date: '2026-09-30',
      visibility: 'hidden'
    }
  ],

  mitra: [
    {
      id: 201,
      evaluator: {
        name: 'PT Banua Digital',
        username: '@banuadigital',
        avatar: '/images/avatars/11.png'
      },
      training: 'Pengembangan Website Dasar',
      rating: 5,
      title: 'Kompetensi sangat relevan',
      comment:
        'Materi dan kompetensi yang diberikan relevan dengan kebutuhan tenaga kerja kami.',
      date: '2026-10-03',
      visibility: 'visible'
    },

    {
      id: 202,
      evaluator: {
        name: 'CV Karya Mandiri',
        username: '@karyamandiri',
        avatar: '/images/avatars/12.png'
      },
      training: 'Digital Marketing untuk UMKM',
      rating: 4,
      title: 'Materi sesuai kebutuhan industri',
      comment:
        'Kompetensi peserta cukup sesuai dengan kebutuhan pekerjaan di perusahaan kami.',
      date: '2026-09-28',
      visibility: 'hidden'
    },

    {
      id: 203,
      evaluator: {
        name: 'PT Banua Kreatif',
        username: '@banuakreatif',
        avatar: '/images/avatars/13.png'
      },
      training: 'Strategi Pemasaran Digital',
      rating: 5,
      title: 'Pelatihan sangat relevan',
      comment:
        'Pendekatan pelatihan membantu mempersiapkan peserta untuk kebutuhan industri.',
      date: '2026-09-25',
      visibility: 'visible'
    }
  ]
}

// -----------------------------------------------------------------------------
// Helpers
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
                          debounce = 400,
                          ...props
                        }: {
  value: string | number
  onChange: (
    value: string | number
  ) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
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
  }, [value, debounce, onChange])

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
// Column Helper
// -----------------------------------------------------------------------------

const columnHelper =
  createColumnHelper<
    EvaluationWithActionsType
  >()

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const InstructorReviewsTable = ({
                                  instructorId,
                                  source
                                }: Props) => {
  const [visibility, setVisibility] =
    useState<
      'all' | EvaluationVisibility
    >('all')

  const [ratingFilter, setRatingFilter] =
    useState<number | 'all'>('all')

  const [trainingFilter, setTrainingFilter] =
    useState('all')

  const [rowSelection, setRowSelection] =
    useState({})

  const [allData, setAllData] =
    useState<EvaluationType[]>(
      evaluationData[source] ?? []
    )

  const [data, setData] =
    useState<EvaluationType[]>(
      evaluationData[source] ?? []
    )

  const [globalFilter, setGlobalFilter] =
    useState('')

  const [trainingSearch, setTrainingSearch] =
    useState('')

  // ---------------------------------------------------------------------------
  // Source Change
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const sourceData =
      evaluationData[source] ?? []

    setAllData(sourceData)
    setData(sourceData)
    setVisibility('all')
    setRatingFilter('all')
    setTrainingFilter('all')
    setTrainingSearch('')
    setGlobalFilter('')
    setRowSelection({})
  }, [source, instructorId])

  // ---------------------------------------------------------------------------
  // Training Options
  // ---------------------------------------------------------------------------

  const trainingOptions = useMemo(() => {
    return Array.from(
      new Set(
        allData.map(
          item => item.training
        )
      )
    )
  }, [allData])

  const filteredTrainingOptions =
    useMemo(() => {
      const keyword =
        trainingSearch
          .trim()
          .toLowerCase()

      if (!keyword) {
        return trainingOptions
      }

      return trainingOptions.filter(
        training =>
          training
            .toLowerCase()
            .includes(keyword)
      )
    }, [
      trainingOptions,
      trainingSearch
    ])

  // ---------------------------------------------------------------------------
  // Apply Filters
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const filteredData =
      allData.filter(item => {

        if (
          visibility !== 'all' &&
          item.visibility !== visibility
        ) {
          return false
        }

        if (
          ratingFilter !== 'all' &&
          item.rating !== ratingFilter
        ) {
          return false
        }

        if (
          trainingFilter !== 'all' &&
          item.training !== trainingFilter
        ) {
          return false
        }

        return true
      })

    setData(filteredData)
  }, [
    allData,
    visibility,
    ratingFilter,
    trainingFilter
  ])

  // ---------------------------------------------------------------------------
  // Columns
  // ---------------------------------------------------------------------------

  const columns =
    useMemo<
      ColumnDef<
        EvaluationWithActionsType,
        any
      >[]
    >(
      () => [
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

        // Evaluator
        columnHelper.accessor(
          row => row.evaluator.name,
          {
            id: 'evaluator',

            header: 'Evaluator',

            cell: ({ row }) => (
              <div className='flex items-center gap-4'>

                <CustomAvatar
                  src={
                    row.original
                      .evaluator.avatar
                  }
                  size={36}
                />

                <div className='flex flex-col'>

                  <Typography
                    className='font-medium'
                    color='text.primary'
                  >
                    {
                      row.original
                        .evaluator.name
                    }
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    {
                      row.original
                        .evaluator.username
                    }
                  </Typography>

                </div>

              </div>
            )
          }
        ),

        // Training
        columnHelper.accessor(
          'training',
          {
            header: 'Pelatihan',

            cell: ({ row }) => (
              <Typography
                className='font-medium max-is-[220px]'
              >
                {row.original.training}
              </Typography>
            )
          }
        ),

        // Evaluation
        columnHelper.accessor(
          'rating',
          {
            header: 'Evaluasi',

            sortingFn: (
              rowA,
              rowB
            ) =>
              rowA.original.rating -
              rowB.original.rating,

            cell: ({ row }) => (
              <div className='flex flex-col gap-1'>

                <Rating
                  name={`evaluation-${row.original.id}`}
                  readOnly
                  value={
                    row.original.rating
                  }
                  size='small'
                  emptyIcon={
                    <i className='tabler-star-filled text-[18px]' />
                  }
                />

                <Typography
                  className='font-medium'
                  color='text.primary'
                >
                  {row.original.title}
                </Typography>

                <Tooltip
                  title={
                    row.original.comment
                  }
                  arrow
                  placement='top-start'
                >
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    className='max-is-[320px] line-clamp-2 cursor-help'
                  >
                    {
                      row.original.comment
                    }
                  </Typography>
                </Tooltip>

              </div>
            )
          }
        ),

        // Date
        columnHelper.accessor(
          'date',
          {
            header: 'Tanggal',

            sortingFn: (
              rowA,
              rowB
            ) =>
              new Date(
                rowA.original.date
              ).getTime() -
              new Date(
                rowB.original.date
              ).getTime(),

            cell: ({ row }) => (
              <Typography>
                {new Date(
                  row.original.date
                ).toLocaleDateString(
                  'id-ID',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }
                )}
              </Typography>
            )
          }
        ),

        // Visibility
        columnHelper.accessor(
          'visibility',
          {
            header: 'Tampilan',

            cell: ({ row }) => {
              const visible =
                row.original
                  .visibility ===
                'visible'

              return (
                <Chip
                  icon={
                    <i
                      className={
                        visible
                          ? 'tabler-eye'
                          : 'tabler-eye-off'
                      }
                    />
                  }
                  label={
                    visible
                      ? 'Ditampilkan'
                      : 'Disembunyikan'
                  }
                  variant='tonal'
                  color={
                    visible
                      ? 'success'
                      : 'secondary'
                  }
                  size='small'
                />
              )
            }
          }
        ),

        // Actions
        columnHelper.display({
          id: 'actions',

          header: 'Aksi',

          cell: ({ row }) => {
            const visible =
              row.original
                .visibility === 'visible'

            return (
              <OptionMenu
                iconButtonProps={{
                  size: 'medium'
                }}
                iconClassName='text-textSecondary'
                options={[
                  {
                    text: 'Lihat Evaluasi',
                    icon: 'tabler-eye'
                  },
                  {
                    text: visible
                      ? 'Sembunyikan Review'
                      : 'Tampilkan Review',
                    icon: visible
                      ? 'tabler-eye-off'
                      : 'tabler-eye-check'
                  }
                ]}
              />
            )
          },

          enableSorting: false
        })
      ],
      []
    )

  // ---------------------------------------------------------------------------
  // Table
  // ---------------------------------------------------------------------------

  const table = useReactTable({
    data:
      data as EvaluationWithActionsType[],

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

    globalFilterFn: fuzzyFilter,

    onRowSelectionChange:
    setRowSelection,

    onGlobalFilterChange:
    setGlobalFilter,

    getCoreRowModel:
      getCoreRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getSortedRowModel:
      getSortedRowModel(),

    getPaginationRowModel:
      getPaginationRowModel()
  })

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Card className='overflow-visible'>

      {/* =================================================================== */}
      {/* Toolbar */}
      {/* =================================================================== */}

      <div className='p-5 border-b border-divider'>

        <div className='flex flex-col gap-4'>

          {/* Search */}

          <div className='flex items-center gap-2'>

            <div className='flex items-center justify-center bs-9 is-9 rounded-lg bg-primary/10'>
              <i className='tabler-message-star text-primary text-lg' />
            </div>

            <div>
              <Typography
                variant='h6'
                className='font-semibold'
              >
                Ulasan & Evaluasi
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Pilih evaluasi yang layak ditampilkan
                untuk publik dan materi promosi.
              </Typography>
            </div>

          </div>

          {/* Filters */}

          <div className='flex flex-wrap items-center gap-3'>

            {/* Global Search */}

            <DebouncedInput
              value={
                globalFilter ?? ''
              }
              onChange={value =>
                setGlobalFilter(
                  String(value)
                )
              }
              placeholder='Cari evaluator atau ulasan...'
              className='max-sm:is-full sm:is-[280px]'
              slotProps={{
                input: {
                  startAdornment: (
                    <i className='tabler-search mr-2' />
                  )
                }
              }}
            />

            {/* Training */}

            <CustomTextField
              select
              value={trainingFilter}
              onChange={e =>
                setTrainingFilter(
                  e.target.value
                )
              }
              className='max-sm:is-full sm:is-[230px]'
              SelectProps={{
                displayEmpty: true,
                renderValue: selected => {
                  if (
                    selected ===
                    'all'
                  ) {
                    return 'Semua Pelatihan'
                  }

                  return selected as string
                }
              }}
            >

              <MenuItem value='all'>
                Semua Pelatihan
              </MenuItem>

              {/* Live search */}

              <div
                className='px-3 py-2 sticky top-0 bg-background z-10'
                onClick={e =>
                  e.stopPropagation()
                }
              >
                <CustomTextField
                  fullWidth
                  size='small'
                  placeholder='Cari pelatihan...'
                  value={
                    trainingSearch
                  }
                  onChange={e =>
                    setTrainingSearch(
                      e.target.value
                    )
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <i className='tabler-search mr-2' />
                      )
                    }
                  }}
                />
              </div>

              {filteredTrainingOptions.map(
                training => (
                  <MenuItem
                    key={training}
                    value={training}
                  >
                    {training}
                  </MenuItem>
                )
              )}

            </CustomTextField>

            {/* Rating */}

            <CustomTextField
              select
              value={ratingFilter}
              onChange={e =>
                setRatingFilter(
                  e.target.value === 'all'
                    ? 'all'
                    : Number(
                      e.target.value
                    )
                )
              }
              className='max-sm:is-full sm:is-[155px]'
              SelectProps={{
                displayEmpty: true
              }}
            >

              <MenuItem value='all'>
                Semua Bintang
              </MenuItem>

              {[5, 4, 3, 2, 1].map(
                rating => (
                  <MenuItem
                    key={rating}
                    value={rating}
                  >
                    <span className='flex items-center gap-2'>
                      <i className='tabler-star-filled text-warning' />
                      {rating} Bintang
                    </span>
                  </MenuItem>
                )
              )}

            </CustomTextField>

            {/* Visibility */}

            <CustomTextField
              select
              value={visibility}
              onChange={e =>
                setVisibility(
                  e.target.value as
                    | 'all'
                    | 'visible'
                    | 'hidden'
                )
              }
              className='max-sm:is-full sm:is-[175px]'
            >

              <MenuItem value='all'>
                Semua Tampilan
              </MenuItem>

              <MenuItem value='visible'>
                Ditampilkan
              </MenuItem>

              <MenuItem value='hidden'>
                Disembunyikan
              </MenuItem>

            </CustomTextField>

            {/* Page Size */}

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
              className='max-sm:is-full sm:is-[100px]'
            >
              <MenuItem value={10}>
                10
              </MenuItem>

              <MenuItem value={25}>
                25
              </MenuItem>

              <MenuItem value={50}>
                50
              </MenuItem>
            </CustomTextField>

            {/* Export */}

            <Button
              variant='tonal'
              color='secondary'
              startIcon={
                <i className='tabler-upload' />
              }
              className='max-sm:is-full'
            >
              Export
            </Button>

          </div>

        </div>

      </div>

      {/* =================================================================== */}
      {/* Table */}
      {/* =================================================================== */}

      <div className='overflow-x-auto'>

        <table
          className={
            tableStyles.table
          }
        >

          <thead>
          {table
            .getHeaderGroups()
            .map(headerGroup => (
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
                            onClick={header.column.getToggleSortingHandler()}
                          >

                            {flexRender(
                              header.column
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
            ))}
          </thead>

          {table
            .getFilteredRowModel()
            .rows.length === 0 ? (
            <tbody>

            <tr>

              <td
                colSpan={
                  table.getVisibleFlatColumns()
                    .length
                }
                className='text-center'
              >

                <div className='flex flex-col items-center justify-center py-12 gap-2'>

                  <div className='flex items-center justify-center bs-12 is-12 rounded-full bg-actionHover'>
                    <i className='tabler-message-off text-2xl text-textSecondary' />
                  </div>

                  <Typography
                    className='font-medium'
                  >
                    Tidak ada evaluasi
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    Coba ubah filter yang
                    digunakan.
                  </Typography>

                </div>

              </td>

            </tr>

            </tbody>
          ) : (
            <tbody>

            {table
              .getRowModel()
              .rows
              .map(row => (
                <tr
                  key={row.id}
                  className={classnames({
                    selected:
                      row.getIsSelected()
                  })}
                >

                  {row
                    .getVisibleCells()
                    .map(cell => (
                      <td
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column
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

      {/* =================================================================== */}
      {/* Pagination */}
      {/* =================================================================== */}

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
            .pagination
            .pageSize
        }
        page={
          table.getState()
            .pagination
            .pageIndex
        }
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />

    </Card>
  )
}

export default InstructorReviewsTable
