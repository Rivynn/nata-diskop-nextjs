'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
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
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type TrainingStatus = {
  text: string
  color: ThemeColor
}

type InstructorTrainingType = {
  id: number
  title: string
  category: string
  status: 'active' | 'completed' | 'cancelled'
  participants: number
  startDate: string
  endDate: string
}

type InstructorTrainingTypeWithAction =
  InstructorTrainingType & {
  action?: string
}

const trainingStatus: {
  [key: string]: TrainingStatus
} = {
  active: {
    text: 'Berlangsung',
    color: 'primary'
  },
  completed: {
    text: 'Selesai',
    color: 'success'
  },
  cancelled: {
    text: 'Dibatalkan',
    color: 'error'
  }
}

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

const DebouncedInput = ({
                          value: initialValue,
                          onChange,
                          debounce = 500,
                          ...props
                        }: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

// Column Definitions
const columnHelper =
  createColumnHelper<InstructorTrainingTypeWithAction>()

const TrainingListTable = () => {
  // Dummy data
  const trainingData: InstructorTrainingType[] = [
    {
      id: 101,
      title: 'Digital Marketing untuk UMKM',
      category: 'Digital Marketing',
      status: 'completed',
      participants: 32,
      startDate: '2026-01-12',
      endDate: '2026-01-16'
    },
    {
      id: 102,
      title: 'Strategi Konten Media Sosial',
      category: 'Digital Marketing',
      status: 'completed',
      participants: 28,
      startDate: '2026-02-02',
      endDate: '2026-02-05'
    },
    {
      id: 103,
      title: 'Branding dan Identitas Usaha',
      category: 'Kewirausahaan',
      status: 'completed',
      participants: 35,
      startDate: '2026-03-09',
      endDate: '2026-03-13'
    },
    {
      id: 104,
      title: 'Pemasaran Digital untuk Pemula',
      category: 'Digital Marketing',
      status: 'completed',
      participants: 30,
      startDate: '2026-04-06',
      endDate: '2026-04-10'
    },
    {
      id: 105,
      title: 'Optimasi Instagram Bisnis',
      category: 'Social Media',
      status: 'completed',
      participants: 26,
      startDate: '2026-05-04',
      endDate: '2026-05-08'
    },
    {
      id: 106,
      title: 'Strategi Promosi Produk UMKM',
      category: 'UMKM',
      status: 'active',
      participants: 40,
      startDate: '2026-09-28',
      endDate: '2026-10-09'
    },
    {
      id: 107,
      title: 'Content Creation dan Copywriting',
      category: 'Digital Marketing',
      status: 'active',
      participants: 24,
      startDate: '2026-10-12',
      endDate: '2026-10-16'
    },
    {
      id: 108,
      title: 'Personal Branding untuk Pelaku Usaha',
      category: 'Branding',
      status: 'cancelled',
      participants: 0,
      startDate: '2026-11-02',
      endDate: '2026-11-06'
    }
  ]

  const [data, setData] =
    useState<InstructorTrainingType[]>(trainingData)

  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<
    ColumnDef<InstructorTrainingTypeWithAction, any>[]
  >(
    () => [
      columnHelper.accessor('title', {
        header: 'Pelatihan',

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography
              component={Link}
              href={`/admin/trainings/${row.original.id}`}
              color='primary.main'
              className='font-medium'
            >
              {row.original.title}
            </Typography>

            <Typography
              variant='caption'
              color='text.secondary'
            >
              {row.original.category}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('startDate', {
        header: 'Periode',

        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='body2'>
              {new Date(
                row.original.startDate
              ).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </Typography>

            <Typography
              variant='caption'
              color='text.secondary'
            >
              s/d{' '}
              {new Date(
                row.original.endDate
              ).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('participants', {
        header: 'Peserta',

        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <i className='tabler-users text-textSecondary' />

            <Typography>
              {row.original.participants}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('status', {
        header: 'Status',

        cell: ({ row }) => {
          const status =
            trainingStatus[row.original.status]

          return (
            <Chip
              label={status.text}
              color={status.color}
              variant='tonal'
              size='small'
            />
          )
        }
      }),

      columnHelper.display({
        id: 'action',
        header: 'Aksi',

        cell: ({ row }) => (
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{
                size: 'medium'
              }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                {
                  text: 'Lihat Pelatihan',
                  icon: 'tabler-eye',
                  href: `/admin/trainings/${row.original.id}`,
                  linkProps: {
                    className:
                      'flex items-center is-full plb-1.5 pli-4'
                  }
                }
              ]}
            />
          </div>
        ),

        enableSorting: false
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,

    filterFns: {
      fuzzy: fuzzyFilter
    },

    state: {
      globalFilter
    },

    initialState: {
      pagination: {
        pageSize: 6
      }
    },

    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Card>
      {/* Header */}
      <CardContent className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h5'>
            Pelatihan yang Ditangani
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
          >
            Daftar pelatihan yang pernah dan sedang
            ditangani pelatih.
          </Typography>
        </div>

        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value =>
            setGlobalFilter(String(value))
          }
          placeholder='Cari Pelatihan'
          className='max-sm:is-full'
        />
      </CardContent>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={classnames({
                        'flex items-center':
                          header.column.getIsSorted(),
                        'cursor-pointer select-none':
                          header.column.getCanSort()
                      })}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
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
              ))}
            </tr>
          ))}
          </thead>

          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
            <tr>
              <td
                colSpan={
                  table.getVisibleFlatColumns().length
                }
                className='text-center'
              >
                Tidak ada data pelatihan
              </td>
            </tr>
            </tbody>
          ) : (
            <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={classnames({
                  selected: row.getIsSelected()
                })}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
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

      {/* Pagination */}
      <TablePagination
        component={() => (
          <TablePaginationComponent table={table} />
        )}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={
          table.getState().pagination.pageSize
        }
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default TrainingListTable
