'use client'

import { useMemo, useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import type { ThemeColor } from '@core/types'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type EmploymentStatus = {
  text: string
  color: ThemeColor
}

type EmploymentHistory = {
  id: number
  employeeId: string
  type: 'internal' | 'contract' | 'internship'
  organization: string
  position: string
  startDate: string
  endDate: string | null
  status: 'active' | 'completed' | 'upcoming'
}

type EmploymentHistoryWithAction = EmploymentHistory & {
  action?: string
}

const employmentStatus: Record<string, EmploymentStatus> = {
  active: { text: 'Berlangsung', color: 'success' },
  completed: { text: 'Selesai', color: 'secondary' },
  upcoming: { text: 'Belum Dimulai', color: 'warning' }
}

const employmentTypeLabel: Record<EmploymentHistory['type'], string> = {
  internal: 'Internal',
  contract: 'Kontrak',
  internship: 'Magang'
}

const fuzzyFilter: FilterFn<EmploymentHistoryWithAction> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

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
    const timeout = setTimeout(() => onChange(value), debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  )
}

const columnHelper = createColumnHelper<EmploymentHistoryWithAction>()

type Props = {
  employeeId: string
}

const EmploymentHistoryTable = ({ employeeId }: Props) => {
  // Ganti dengan data dari database/API.
  // Jangan gunakan data dummy sebagai riwayat kerja sungguhan.
  const historyData: EmploymentHistory[] = []

  const [data] = useState<EmploymentHistory[]>(historyData)
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<EmploymentHistoryWithAction, any>[]>(
    () => [
      columnHelper.accessor('organization', {
        header: 'Instansi / Mitra',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium'>
              {row.original.organization}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {employmentTypeLabel[row.original.type]}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('position', {
        header: 'Jabatan',
        cell: ({ row }) => (
          <Typography variant='body2'>
            {row.original.position || '-'}
          </Typography>
        )
      }),

      columnHelper.accessor('startDate', {
        header: 'Periode',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='body2'>
              {new Date(row.original.startDate).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              s/d{' '}
              {row.original.endDate
                ? new Date(row.original.endDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
                : 'Tidak ditentukan'}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('status', {
        header: 'Status Periode',
        cell: ({ row }) => {
          const status = employmentStatus[row.original.status]

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
          <OptionMenu
            iconButtonProps={{ size: 'medium' }}
            iconClassName='text-textSecondary text-[22px]'
            options={[
              {
                text: 'Lihat Detail',
                icon: 'tabler-eye',
                href: `/admin/employees/${employeeId}/employment/${row.original.id}`,
                linkProps: {
                  className: 'flex items-center is-full plb-1.5 pli-4'
                }
              }
            ]}
          />
        ),
        enableSorting: false
      })
    ],
    [employeeId]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    initialState: { pagination: { pageSize: 6 } },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Card>
      <CardContent className='flex flex-col items-start justify-between gap-y-4 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h5'>Riwayat Keterikatan Kerja</Typography>
          <Typography variant='body2' color='text.secondary'>
            Daftar hubungan kerja pegawai dengan instansi atau mitra.
          </Typography>
        </div>

        <DebouncedInput
          value={globalFilter}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Cari riwayat'
          className='max-sm:is-full'
        />
      </CardContent>

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
                        'cursor-pointer select-none': header.column.getCanSort()
                      })}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {{
                        asc: <i className='tabler-chevron-up text-xl' />,
                        desc: <i className='tabler-chevron-down text-xl' />
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
                className='py-10 text-center'
              >
                <div className='flex flex-col items-center gap-2'>
                  <i className='tabler-briefcase text-3xl text-textDisabled' />
                  <Typography variant='body1' fontWeight={500}>
                    Belum Ada Riwayat Keterikatan Kerja
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Riwayat kerja pegawai akan muncul setelah datanya tersedia.
                  </Typography>
                </div>
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

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
    </Card>
  )
}

export default EmploymentHistoryTable
