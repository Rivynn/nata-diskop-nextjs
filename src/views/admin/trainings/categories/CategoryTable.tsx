'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
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
import AddCategoryDrawer from './AddCategoryDrawer'
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

export type TrainingCategoryType = {
  id: number
  name: string
  slug: string
  description: string

  /**
   * Derived metrics.
   *
   * In production these should come from database aggregations,
   * not manually maintained category fields.
   */
  totalTrainings: number
  totalParticipants: number

  status: 'active' | 'inactive'

  createdAt: string
  updatedAt: string
}

type CategoryWithActionsType =
  TrainingCategoryType & {
  actions?: string
}

type CategoryFormMode =
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

const categoryData: TrainingCategoryType[] = [
  {
    id: 1,
    name: 'Teknologi & Digital',
    slug: 'teknologi-digital',
    description:
      'Pelatihan teknologi informasi, digitalisasi, dan keterampilan digital.',
    totalTrainings: 12,
    totalParticipants: 286,
    status: 'active',
    createdAt: '2026-01-12',
    updatedAt: '2026-09-28'
  },
  {
    id: 2,
    name: 'Kewirausahaan',
    slug: 'kewirausahaan',
    description:
      'Pelatihan pengembangan usaha, kewirausahaan, dan manajemen bisnis.',
    totalTrainings: 9,
    totalParticipants: 214,
    status: 'active',
    createdAt: '2026-01-15',
    updatedAt: '2026-09-25'
  },
  {
    id: 3,
    name: 'Administrasi & Perkantoran',
    slug: 'administrasi-perkantoran',
    description:
      'Pelatihan administrasi, pengelolaan dokumen, dan keterampilan perkantoran.',
    totalTrainings: 7,
    totalParticipants: 168,
    status: 'active',
    createdAt: '2026-02-02',
    updatedAt: '2026-09-20'
  },
  {
    id: 4,
    name: 'Keuangan',
    slug: 'keuangan',
    description:
      'Pelatihan pengelolaan keuangan, pembukuan, dan literasi keuangan.',
    totalTrainings: 6,
    totalParticipants: 143,
    status: 'active',
    createdAt: '2026-02-14',
    updatedAt: '2026-09-18'
  },
  {
    id: 5,
    name: 'Pemasaran',
    slug: 'pemasaran',
    description:
      'Pelatihan pemasaran, branding, promosi, dan strategi penjualan.',
    totalTrainings: 8,
    totalParticipants: 192,
    status: 'active',
    createdAt: '2026-02-20',
    updatedAt: '2026-09-21'
  },
  {
    id: 6,
    name: 'Keterampilan Kerja',
    slug: 'keterampilan-kerja',
    description:
      'Pelatihan keterampilan untuk meningkatkan kesiapan dan kompetensi kerja.',
    totalTrainings: 11,
    totalParticipants: 327,
    status: 'active',
    createdAt: '2026-01-28',
    updatedAt: '2026-09-30'
  },
  {
    id: 7,
    name: 'Industri & Manufaktur',
    slug: 'industri-manufaktur',
    description:
      'Pelatihan teknis dan kompetensi untuk mendukung kebutuhan sektor industri.',
    totalTrainings: 5,
    totalParticipants: 121,
    status: 'active',
    createdAt: '2026-03-04',
    updatedAt: '2026-09-15'
  },
  {
    id: 8,
    name: 'UMKM',
    slug: 'umkm',
    description:
      'Pelatihan pengembangan kapasitas, produktivitas, dan daya saing UMKM.',
    totalTrainings: 10,
    totalParticipants: 254,
    status: 'active',
    createdAt: '2026-01-20',
    updatedAt: '2026-09-27'
  },
  {
    id: 9,
    name: 'Pariwisata',
    slug: 'pariwisata',
    description:
      'Pelatihan pariwisata, pelayanan, hospitality, dan ekonomi kreatif.',
    totalTrainings: 4,
    totalParticipants: 96,
    status: 'active',
    createdAt: '2026-03-18',
    updatedAt: '2026-09-12'
  },
  {
    id: 10,
    name: 'Pertanian',
    slug: 'pertanian',
    description:
      'Pelatihan keterampilan dan peningkatan produktivitas sektor pertanian.',
    totalTrainings: 3,
    totalParticipants: 74,
    status: 'active',
    createdAt: '2026-04-02',
    updatedAt: '2026-09-10'
  }
]

// -----------------------------------------------------------------------------
// Column Helper
// -----------------------------------------------------------------------------

const columnHelper =
  createColumnHelper<CategoryWithActionsType>()

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const CategoryTable = () => {
  const router = useRouter()

  // ---------------------------------------------------------------------------
  // States
  // ---------------------------------------------------------------------------

  const [
    addCategoryOpen,
    setAddCategoryOpen
  ] = useState(false)

  const [
    selectedCategory,
    setSelectedCategory
  ] =
    useState<TrainingCategoryType | null>(
      null
    )

  const [
    categoryFormMode,
    setCategoryFormMode
  ] =
    useState<CategoryFormMode>('create')

  const [
    rowSelection,
    setRowSelection
  ] = useState({})

  const [data, setData] =
    useState<TrainingCategoryType[]>(
      categoryData
    )

  const [
    globalFilter,
    setGlobalFilter
  ] = useState('')

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const openCreateDrawer = () => {
    setSelectedCategory(null)
    setCategoryFormMode('create')
    setAddCategoryOpen(true)
  }

  const openEditDrawer = (
    category: TrainingCategoryType
  ) => {
    setSelectedCategory(category)
    setCategoryFormMode('edit')
    setAddCategoryOpen(true)
  }

  const handleCloseDrawer = () => {
    setAddCategoryOpen(false)
    setSelectedCategory(null)
    setCategoryFormMode('create')
  }

  // ---------------------------------------------------------------------------
  // Status Action
  // ---------------------------------------------------------------------------

  const handleToggleStatus = (
    category: TrainingCategoryType
  ) => {
    const isActive =
      category.status === 'active'

    Swal.fire({
      title: isActive
        ? 'Nonaktifkan kategori?'
        : 'Aktifkan kategori?',

      html: isActive
        ? `
            <div style="line-height:1.7">
              Kategori <strong>${category.name}</strong>
              akan dinonaktifkan.
              <br />
              Kategori ini tidak akan tersedia
              untuk pelatihan baru.
            </div>
          `
        : `
            <div style="line-height:1.7">
              Kategori <strong>${category.name}</strong>
              akan diaktifkan kembali dan dapat
              digunakan pada pelatihan baru.
            </div>
          `,

      icon: isActive
        ? 'warning'
        : 'question',

      showCancelButton: true,

      confirmButtonText: isActive
        ? 'Ya, Nonaktifkan'
        : 'Ya, Aktifkan',

      cancelButtonText: 'Batal',

      reverseButtons: true,

      focusCancel: true
    }).then(result => {
      if (!result.isConfirmed) return

      const nextStatus =
        isActive
          ? 'inactive'
          : 'active'

      setData(currentData =>
        currentData.map(item =>
          item.id === category.id
            ? {
              ...item,
              status: nextStatus,
              updatedAt:
                new Date().toISOString()
            }
            : item
        )
      )

      Swal.fire({
        title: isActive
          ? 'Kategori dinonaktifkan'
          : 'Kategori diaktifkan',

        text: `"${category.name}" berhasil diperbarui.`,

        icon: 'success',

        confirmButtonText: 'Selesai'
      })
    })
  }

  // ---------------------------------------------------------------------------
  // Delete Action
  // ---------------------------------------------------------------------------

  const handleDelete = (
    category: TrainingCategoryType
  ) => {
    if (
      category.totalTrainings > 0
    ) {
      Swal.fire({
        title:
          'Kategori masih digunakan',

        html: `
          <div style="line-height:1.7">
            Kategori <strong>${category.name}</strong>
            masih digunakan oleh
            <strong>${category.totalTrainings}</strong>
            pelatihan.
            <br /><br />
            Untuk menjaga histori data,
            kategori ini tidak dapat dihapus.
            Gunakan <strong>Nonaktifkan</strong>
            jika sudah tidak ingin digunakan.
          </div>
        `,

        icon: 'warning',

        confirmButtonText:
          'Mengerti'
      })

      return
    }

    Swal.fire({
      title: 'Hapus kategori?',

      html: `
        <div style="line-height:1.7">
          Kategori <strong>${category.name}</strong>
          akan dihapus secara permanen.
          <br />
          Tindakan ini tidak dapat dibatalkan.
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
      if (!result.isConfirmed) return

      setData(currentData =>
        currentData.filter(
          item =>
            item.id !== category.id
        )
      )

      Swal.fire({
        title:
          'Kategori dihapus',

        text: `"${category.name}" berhasil dihapus.`,

        icon: 'success',

        confirmButtonText:
          'Selesai'
      })
    })
  }

  // ---------------------------------------------------------------------------
  // Popular Category
  // ---------------------------------------------------------------------------

  /**
   * Prototype rule:
   *
   * Popular category = top 3 active categories
   * berdasarkan jumlah peserta.
   *
   * Nanti ketika sudah masuk database,
   * nilai ini sebaiknya dihitung dari aggregation:
   *
   * - jumlah pendaftar
   * - jumlah peserta
   * - pertumbuhan peserta
   * - completion rate
   * - evaluation
   * - engagement
   */
  const popularCategoryIds =
    useMemo(() => {
      return new Set(
        [...data]
          .filter(
            category =>
              category.status ===
              'active'
          )
          .sort(
            (a, b) =>
              b.totalParticipants -
              a.totalParticipants
          )
          .slice(0, 3)
          .map(
            category =>
              category.id
          )
      )
    }, [data])

  // ---------------------------------------------------------------------------
  // Columns
  // ---------------------------------------------------------------------------

  const columns = useMemo<
    ColumnDef<
      CategoryWithActionsType,
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
            onChange={table.getToggleAllRowsSelectedHandler()}
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
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },

      // -----------------------------------------------------------------------
      // Category
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'name',
        {
          header: 'Kategori',

          cell: ({ row }) => {
            const category =
              row.original

            const isPopular =
              popularCategoryIds.has(
                category.id
              )

            return (
              <div className='flex items-center gap-3 min-w-0'>
                <div className='flex items-center justify-center bs-11 is-11 rounded-lg bg-primaryLight shrink-0'>
                  <i className='tabler-category-2 text-xl text-primary' />
                </div>

                <div className='flex flex-col min-is-0'>
                  <div className='flex items-center gap-2'>
                    <Typography
                      color='text.primary'
                      className='font-medium truncate'
                    >
                      {category.name}
                    </Typography>

                    {isPopular && (
                      <Chip
                        size='small'
                        variant='tonal'
                        color='warning'
                        icon={
                          <i className='tabler-flame' />
                        }
                        label='Populer'
                        className='max-sm:hidden shrink-0'
                      />
                    )}
                  </div>

                  {/* --------------------------------------------------------- */}
                  {/* Description Tooltip */}
                  {/* --------------------------------------------------------- */}

                  <Tooltip
                    title={
                      <div
                        style={{
                          maxWidth: 360,
                          whiteSpace: 'normal',
                          lineHeight: 1.6
                        }}
                      >
                        {category.description ||
                          'Tidak ada deskripsi kategori.'}
                      </div>
                    }
                    arrow
                    placement='top-start'
                    enterDelay={250}
                    slotProps={{
                      tooltip: {
                        sx: {
                          maxWidth: 380,
                          px: 1.75,
                          py: 1.5,
                          borderRadius: 1.5,
                          fontSize:
                            '0.8125rem',
                          lineHeight: 1.6,
                          boxShadow:
                            '0 8px 30px rgba(0, 0, 0, 0.14)'
                        }
                      },
                      arrow: {
                        sx: {
                          color:
                            'var(--mui-palette-background-paper)'
                        }
                      }
                    }}
                  >
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      className='max-is-[420px] truncate cursor-help'
                    >
                      {category.description ||
                        'Tidak ada deskripsi kategori.'}
                    </Typography>
                  </Tooltip>
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
            <div className='flex items-center gap-2'>
              <div className='flex items-center justify-center bs-8 is-8 rounded bg-actionHover'>
                <i className='tabler-school text-lg text-textSecondary' />
              </div>

              <div className='flex flex-col'>
                <Typography
                  color='text.primary'
                  className='font-medium'
                >
                  {row.original.totalTrainings.toLocaleString(
                    'id-ID'
                  )}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Program
                </Typography>
              </div>
            </div>
          )
        }
      ),

      // -----------------------------------------------------------------------
      // Participants
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'totalParticipants',
        {
          header: 'Peserta',

          cell: ({ row }) => (
            <div className='flex items-center gap-2'>
              <div className='flex items-center justify-center bs-8 is-8 rounded bg-actionHover'>
                <i className='tabler-users text-lg text-textSecondary' />
              </div>

              <div className='flex flex-col'>
                <Typography
                  color='text.primary'
                  className='font-medium'
                >
                  {row.original.totalParticipants.toLocaleString(
                    'id-ID'
                  )}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Terdaftar
                </Typography>
              </div>
            </div>
          )
        }
      ),

      // -----------------------------------------------------------------------
      // Status
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'status',
        {
          header: 'Status',

          cell: ({ row }) => {
            const isActive =
              row.original.status ===
              'active'

            return (
              <Chip
                size='small'
                variant='tonal'
                color={
                  isActive
                    ? 'success'
                    : 'secondary'
                }
                icon={
                  <i
                    className={
                      isActive
                        ? 'tabler-circle-check'
                        : 'tabler-circle-off'
                    }
                  />
                }
                label={
                  isActive
                    ? 'Aktif'
                    : 'Nonaktif'
                }
              />
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // Actions
      // -----------------------------------------------------------------------

      columnHelper.display({
        id: 'actions',

        header: 'Aksi',

        cell: ({ row }) => {
          const category =
            row.original

          const isActive =
            category.status ===
            'active'

          return (
            <div className='flex items-center'>
              {/* ------------------------------------------------------------- */}
              {/* Edit */}
              {/* ------------------------------------------------------------- */}

              <Tooltip title='Edit kategori'>
                <IconButton
                  size='small'
                  aria-label={`Edit ${category.name}`}
                  onClick={() =>
                    openEditDrawer(
                      category
                    )
                  }
                >
                  <i className='tabler-edit text-textSecondary' />
                </IconButton>
              </Tooltip>

              {/* ------------------------------------------------------------- */}
              {/* More Actions */}
              {/* ------------------------------------------------------------- */}

              <OptionMenu
                iconButtonProps={{
                  size: 'medium'
                }}
                iconClassName='text-textSecondary'
                options={[
                  // -----------------------------------------------------------
                  // Lihat Pelatihan
                  // -----------------------------------------------------------

                  {
                    text: 'Lihat Pelatihan',

                    icon: 'tabler-school',

                    menuItemProps: {
                      onClick: () => {
                        router.push(
                          `/admin/trainings?category=${category.slug}`
                        )
                      }
                    }
                  },

                  // -----------------------------------------------------------
                  // Activate / Deactivate
                  // -----------------------------------------------------------

                  {
                    text: isActive
                      ? 'Nonaktifkan'
                      : 'Aktifkan',

                    icon: isActive
                      ? 'tabler-eye-off'
                      : 'tabler-eye-check',

                    menuItemProps: {
                      onClick: () =>
                        handleToggleStatus(
                          category
                        )
                    }
                  },

                  // -----------------------------------------------------------
                  // Delete
                  // -----------------------------------------------------------

                  {
                    text: 'Hapus',

                    icon: 'tabler-trash',

                    menuItemProps: {
                      className:
                        'text-error',

                      onClick: () =>
                        handleDelete(
                          category
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
    [
      popularCategoryIds,
      router
    ]
  )

  // ---------------------------------------------------------------------------
  // Table
  // ---------------------------------------------------------------------------

  const table =
    useReactTable({
      data,

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
      <Card className='overflow-hidden'>
        {/* ----------------------------------------------------------------- */}
        {/* Header */}
        {/* ----------------------------------------------------------------- */}

        <div className='flex flex-wrap items-center justify-between gap-4 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center bs-11 is-11 rounded-lg bg-primaryLight'>
              <i className='tabler-category-2 text-xl text-primary' />
            </div>

            <div>
              <Typography
                variant='h5'
                color='text.primary'
                className='font-semibold'
              >
                Kategori Pelatihan
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Kelompok bidang yang digunakan
                dalam program pelatihan DISKOP.
              </Typography>
            </div>
          </div>

          <Button
            variant='contained'
            startIcon={
              <i className='tabler-plus' />
            }
            onClick={
              openCreateDrawer
            }
          >
            Tambah Kategori
          </Button>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Toolbar */}
        {/* ----------------------------------------------------------------- */}

        <div className='flex flex-wrap justify-between gap-4 border-bs p-6'>
          <DebouncedInput
            value={
              globalFilter ?? ''
            }
            onChange={value =>
              setGlobalFilter(
                String(value)
              )
            }
            placeholder='Cari kategori...'
            className='max-sm:is-full'
          />

          <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
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
              className='flex-auto max-sm:is-full sm:is-[80px]'
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
                                onClick={header.column.getToggleSortingHandler()}
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
                                    ] ??
                                  null}
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
                  <div className='flex flex-col items-center justify-center py-10'>
                    <div className='flex items-center justify-center bs-12 is-12 rounded-full bg-actionHover mbe-3'>
                      <i className='tabler-category-off text-2xl text-textSecondary' />
                    </div>

                    <Typography
                      color='text.primary'
                      className='font-medium'
                    >
                      Kategori tidak ditemukan
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                    >
                      Coba gunakan kata kunci
                      pencarian lain.
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
                    key={row.id}
                    className={classnames(
                      {
                        selected:
                          row.getIsSelected()
                      }
                    )}
                  >
                    {row
                      .getVisibleCells()
                      .map(
                        cell => (
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
                        )
                      )}
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
      {/* Add / Edit Category Drawer */}
      {/* ------------------------------------------------------------------- */}

      <AddCategoryDrawer
        open={addCategoryOpen}
        categoryData={data}
        selectedCategory={
          selectedCategory
        }
        mode={categoryFormMode}
        setData={setData}
        handleClose={
          handleCloseDrawer
        }
      />
    </>
  )
}

export default CategoryTable
