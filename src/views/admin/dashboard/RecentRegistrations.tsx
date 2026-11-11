// RecentRegistrations.tsx

'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
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
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
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

type RegistrationData = {
  id: number
  name: string
  email: string
  training: string
  date: string
  status: 'Diterima' | 'Ditolak'
  statusColor: ThemeColor
  avatar: string
}

const data: RegistrationData[] = [
  {
    id: 1,
    name: 'Ahmad Fauzan',
    email: 'ahmad.fauzan@email.com',
    training: 'Web Development',
    date: '29 Sep 2026',
    status: 'Diterima',
    statusColor: 'success',
    avatar: '/images/avatars/1.png'
  },
  {
    id: 2,
    name: 'Siti Rahma',
    email: 'siti.rahma@email.com',
    training: 'Digital Marketing',
    date: '29 Sep 2026',
    status: 'Diterima',
    statusColor: 'success',
    avatar: '/images/avatars/2.png'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    training: 'Networking',
    date: '28 Sep 2026',
    status: 'Ditolak',
    statusColor: 'error',
    avatar: '/images/avatars/3.png'
  },
  {
    id: 4,
    name: 'Andi Pratama',
    email: 'andi.pratama@email.com',
    training: 'Administrasi Perkantoran',
    date: '28 Sep 2026',
    status: 'Diterima',
    statusColor: 'success',
    avatar: '/images/avatars/4.png'
  },
  {
    id: 5,
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    training: 'Desain Grafis',
    date: '28 Sep 2026',
    status: 'Diterima',
    statusColor: 'success',
    avatar: '/images/avatars/5.png'
  },
  {
    id: 6,
    name: 'Rizky Maulana',
    email: 'rizky.maulana@email.com',
    training: 'Kewirausahaan',
    date: '27 Sep 2026',
    status: 'Ditolak',
    statusColor: 'error',
    avatar: '/images/avatars/6.png'
  }
]

const fuzzyFilter: FilterFn<RegistrationData> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(row.getValue(columnId), value)

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
  }, [value, debounce, onChange])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

const columnHelper = createColumnHelper<RegistrationData>()

const RecentRegistrations = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<RegistrationData, any>[]>(
    () => [
      {
        id: 'select',

        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },

      columnHelper.accessor('name', {
        header: 'Peserta',

        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar
              src={row.original.avatar}
              size={38}
            />

            <div className='flex flex-col'>
              <Typography
                className='font-medium'
                color='text.primary'
              >
                {row.original.name}
              </Typography>

              <Typography variant='body2'>
                {row.original.email}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('training', {
        header: 'Pelatihan',

        cell: ({ row }) => (
          <Typography
            className='font-medium'
            color='text.primary'
          >
            {row.original.training}
          </Typography>
        )
      }),

      columnHelper.accessor('date', {
        header: 'Tanggal Daftar',

        cell: ({ row }) => (
          <Typography
            className='font-medium'
            color='text.primary'
          >
            {row.original.date}
          </Typography>
        )
      }),

      columnHelper.accessor('status', {
        header: 'Status',

        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            color={row.original.statusColor}
            variant='tonal'
            size='small'
          />
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
      rowSelection,
      globalFilter
    },

    initialState: {
      pagination: {
        pageSize: 5
      }
    },

    enableRowSelection: true,

    globalFilterFn: fuzzyFilter,

    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card
      sx={{
        minHeight: 430
      }}
    >
      <CardHeader
        title='Pendaftaran Terbaru'
        action={
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Cari peserta...'
          />
        }
        className='flex-wrap gap-4'
      />

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
                        'flex items-center': header.column.getIsSorted(),
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
                      }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
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
                colSpan={table.getVisibleFlatColumns().length}
                className='text-center'
              >
                Tidak ada data pendaftaran
              </td>
            </tr>
            </tbody>
          ) : (
            <tbody>
            {table
              .getRowModel()
              .rows
              .slice(
                0,
                table.getState().pagination.pageSize
              )
              .map(row => (
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

      <TablePagination
        component={() => (
          <TablePaginationComponent table={table} />
        )}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default RecentRegistrations
