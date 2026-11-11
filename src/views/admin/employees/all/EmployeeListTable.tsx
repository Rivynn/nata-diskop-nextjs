'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Tooltip from '@mui/material/Tooltip'
import type { TextFieldProps } from '@mui/material/TextField'

import classnames from 'classnames'

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

import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import type { ThemeColor } from '@core/types'

import TableFilters from './TableFilters'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

import { getInitials } from '@/utils/getInitials'

import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type EmployeeType = 'internal' | 'contract' | 'internship'

export type EmployeeStatus = 'Aktif' | 'Nonaktif' | 'Menunggu Aktivasi'

export type EmployeeRecord = {
  id: number | string
  name?: string | null
  username?: string | null
  email?: string | null
  phone?: string | null
  avatar?: string | null
  employeeId?: string | null
  nip?: string | null
  nik?: string | null
  position?: string | null
  employeeType?: EmployeeType | null
  employmentStartDate?: string | null
  employmentEndDate?: string | null
  education?: string | null
  institution?: string | null
  status?: EmployeeStatus | null
  createdAt?: string | null
  updatedAt?: string | null
}

type EmployeeWithAction = EmployeeRecord & {
  action?: string
}

type EmployeeTypeConfig = {
  label: string
  icon: string
  color: ThemeColor
}

const employeeTypeConfig: Record<EmployeeType, EmployeeTypeConfig> = {
  internal: {
    label: 'Internal',
    icon: 'tabler-building-community',
    color: 'success'
  },
  contract: {
    label: 'Kontrak',
    icon: 'tabler-file-description',
    color: 'warning'
  },
  internship: {
    label: 'Magang',
    icon: 'tabler-school',
    color: 'info'
  }
}

const employeeStatusConfig: Record<EmployeeStatus, ThemeColor> = {
  Aktif: 'success',
  Nonaktif: 'secondary',
  'Menunggu Aktivasi': 'warning'
}

const columnHelper = createColumnHelper<EmployeeWithAction>()

const fuzzyFilter: FilterFn<EmployeeWithAction> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const getValue = (value?: string | number | null) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return '—'
  }

  return String(value)
}

const getName = (employee: EmployeeRecord) =>
  employee.name?.trim() || employee.username?.trim() || `Pegawai #${employee.id}`

const getEmployeeCode = (employee: EmployeeRecord) =>
  employee.employeeId?.trim() || `PGW-${String(employee.id).padStart(6, '0')}`

const getEmployeeType = (type?: EmployeeType | null) => {
  if (!type) return null

  return employeeTypeConfig[type]
}

const formatPhone = (phone?: string | null) => {
  if (!phone?.trim()) return null

  const digits = phone.replace(/\D/g, '')
  let number = digits

  if (number.startsWith('62')) number = number.slice(2)
  else if (number.startsWith('0')) number = number.slice(1)

  if (!/^8\d{8,11}$/.test(number)) return phone

  const first = number.slice(0, 3)
  const second = number.slice(3, 7)
  const third = number.slice(7)

  return ['+62', first, second, third].filter(Boolean).join(' ')
}

const parseDate = (value?: string | null) => {
  if (!value) return null

  const date = new Date(`${value.slice(0, 10)}T00:00:00`)

  return Number.isNaN(date.getTime()) ? null : date
}

const formatDate = (value?: string | null) => {
  const date = parseDate(value)

  if (!date) return null

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const getDurationLabel = (endDate?: string | null) => {
  const end = parseDate(endDate)

  if (!end) return null

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const days = Math.ceil((end.getTime() - today.getTime()) / 86400000)

  if (days < 0) return `Berakhir ${Math.abs(days)} hari lalu`
  if (days === 0) return 'Berakhir hari ini'
  if (days === 1) return 'Sisa 1 hari'
  if (days < 30) return `Sisa ${days} hari`

  const months = Math.floor(days / 30)
  const remainingDays = days % 30

  if (months < 12) {
    return remainingDays
      ? `Sisa ${months} bulan ${remainingDays} hari`
      : `Sisa ${months} bulan`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  return remainingMonths
    ? `Sisa ${years} tahun ${remainingMonths} bulan`
    : `Sisa ${years} tahun`
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 400,
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
  }, [value, debounce, onChange])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  )
}

const EmployeeListTable = ({
  tableData = []
}: {
  tableData?: EmployeeRecord[] | null
}) => {
  const [data, setData] = useState<EmployeeRecord[]>(tableData ?? [])
  const [filteredData, setFilteredData] = useState<EmployeeRecord[]>(tableData ?? [])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    const nextData = tableData ?? []

    setData(nextData)
    setFilteredData(nextData)
  }, [tableData])

  const handleSearchChange = useCallback((value: string | number) => {
    setGlobalFilter(String(value))
  }, [])

  const columns = useMemo<ColumnDef<EmployeeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            inputProps={{ 'aria-label': 'Pilih semua pegawai di halaman ini' }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            inputProps={{ 'aria-label': `Pilih ${getName(row.original)}` }}
          />
        ),
        enableSorting: false
      },

      columnHelper.accessor(row => getName(row), {
        id: 'employee',
        header: 'Pegawai',
        cell: ({ row }) => {
          const employee = row.original
          const name = getName(employee)

          return (
            <div className='flex items-center gap-4'>
              {employee.avatar ? (
                <CustomAvatar src={employee.avatar} size={40} />
              ) : (
                <CustomAvatar size={40}>{getInitials(name)}</CustomAvatar>
              )}

              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {name}
                </Typography>

                <div className='flex items-center flex-wrap gap-x-2'>
                  <Typography variant='body2' color='text.secondary'>
                    {employee.username
                      ? `@${employee.username.replace(/^@/, '')}`
                      : 'Username belum tersedia'}
                  </Typography>

                  <Typography variant='body2' color='text.disabled'>
                    {getEmployeeCode(employee)}
                  </Typography>
                </div>

                {employee.position && (
                  <Typography variant='caption' color='text.secondary'>
                    {employee.position}
                  </Typography>
                )}
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor(row => `${row.email ?? ''} ${row.phone ?? ''}`, {
        id: 'contact',
        header: 'Akun & Kontak',
        cell: ({ row }) => {
          const employee = row.original
          const phone = formatPhone(employee.phone)

          return (
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <i className='tabler-mail text-lg text-textSecondary' />

                <Typography
                  variant='body2'
                  color={employee.email ? 'text.primary' : 'text.disabled'}
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {employee.email || 'Email belum tersedia'}
                </Typography>
              </div>

              <div className='flex items-center gap-2'>
                <i className='tabler-phone text-lg text-textSecondary' />

                <Typography
                  variant='body2'
                  color={phone ? 'text.secondary' : 'text.disabled'}
                >
                  {phone || 'Nomor HP belum tersedia'}
                </Typography>
              </div>
            </div>
          )
        }
      }),

      columnHelper.accessor(row => row.nip ?? '', {
        id: 'nip',
        header: 'NIP',
        cell: ({ row }) => (
          <Typography
            color={row.original.nip ? 'text.primary' : 'text.disabled'}
            className='font-medium'
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {getValue(row.original.nip)}
          </Typography>
        )
      }),

      columnHelper.accessor(row => row.education ?? '', {
        id: 'education',
        header: 'Pendidikan',
        cell: ({ row }) => {
          const { education, institution } = row.original

          if (!education && !institution) {
            return (
              <Typography variant='body2' color='text.disabled'>
                —
              </Typography>
            )
          }

          return (
            <div className='flex flex-col gap-1'>
              <Typography variant='body2' color='text.primary' className='font-medium'>
                {education || 'Pendidikan belum diisi'}
              </Typography>

              {institution && (
                <Tooltip title={institution}>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{
                      maxWidth: 190,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {institution}
                  </Typography>
                </Tooltip>
              )}
            </div>
          )
        }
      }),

      columnHelper.accessor(row => row.employeeType ?? '', {
        id: 'employeeType',
        header: 'Tipe Pegawai',
        cell: ({ row }) => {
          const employee = row.original
          const type = getEmployeeType(employee.employeeType)
          const startDate = formatDate(employee.employmentStartDate)
          const endDate = formatDate(employee.employmentEndDate)

          return (
            <div className='flex flex-col items-start gap-1'>
              {type ? (
                <div className='flex items-center gap-2'>
                  <i
                    className={`${type.icon} text-lg`}
                    style={{ color: `var(--mui-palette-${type.color}-main)` }}
                  />

                  <Chip
                    variant='tonal'
                    size='small'
                    color={type.color}
                    label={type.label}
                    className='capitalize'
                  />
                </div>
              ) : (
                <Typography variant='body2' color='text.disabled'>
                  Belum ditentukan
                </Typography>
              )}

              {(startDate || endDate) && (
                <Typography variant='caption' color='text.secondary'>
                  {startDate || 'Tanggal mulai —'}
                  {' – '}
                  {endDate || 'Tanpa batas tanggal'}
                </Typography>
              )}
            </div>
          )
        }
      }),

      columnHelper.accessor(row => row.status ?? '', {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const employee = row.original
          const status = employee.status
          const duration =
            status === 'Aktif' ? getDurationLabel(employee.employmentEndDate) : null

          return (
            <div className='flex flex-col items-start gap-1'>
              <Chip
                variant='tonal'
                label={status || 'Belum diatur'}
                size='small'
                color={status ? employeeStatusConfig[status] : 'secondary'}
                className='capitalize'
              />

              {duration && (
                <Typography
                  variant='caption'
                  color={
                    duration.startsWith('Berakhir')
                      ? 'error.main'
                      : duration === 'Sisa 1 hari' || duration === 'Berakhir hari ini'
                        ? 'warning.main'
                        : 'text.secondary'
                  }
                >
                  {duration}
                </Typography>
              )}
            </div>
          )
        }
      }),
      columnHelper.accessor('action', {
        header: 'Aksi',
        cell: ({ row }) => {
          const employee = row.original
          const name = getName(employee)
          const detailHref = `/admin/employees/${employee.id}`
          const editHref = `/admin/employees/${employee.id}/edit`
          const status = employee.status

          return (
            <div className='flex items-center gap-1'>
              <Tooltip title='Lihat detail'>
                <IconButton
                  component={Link}
                  href={detailHref}
                  aria-label={`Lihat detail ${name}`}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <i className='tabler-eye text-xl' />
                </IconButton>
              </Tooltip>

              <OptionMenu
                iconButtonProps={{
                  size: 'medium',
                  'aria-label': `Menu aksi ${name}`,
                  sx: {
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover'
                    }
                  }
                }}
                iconClassName='text-xl'
                options={[

                  {
                    text: 'Lihat detail',
                    icon: 'tabler-user-circle',
                    menuItemProps: {
                      onClick: () => {
                        window.location.href = detailHref
                      }
                    }
                  },
                  {
                    text: 'Edit pegawai',
                    icon: 'tabler-edit',
                    menuItemProps: {
                      onClick: () => {
                        window.location.href = editHref
                      }
                    }
                  },
                  {
                    text: 'Kelola akun',
                    icon: 'tabler-user-cog'
                  },
                  {
                    text: 'Atur ulang kata sandi',
                    icon: 'tabler-lock-password'
                  },
                  ...(status === 'Aktif'
                    ? [
                      {
                        text: 'Nonaktifkan pegawai',
                        icon: 'tabler-user-off'
                      }
                    ]
                    : [
                      {
                        text:
                          status === 'Menunggu Aktivasi'
                            ? 'Aktifkan akun'
                            : 'Aktifkan pegawai',
                        icon: 'tabler-user-check'
                      }
                    ]),
                  {
                    text: 'Hapus pegawai',
                    icon: 'tabler-trash',
                    menuItemProps: {
                      sx: {
                        color: 'error.main',
                        '& i': {
                          color: 'error.main'
                        }
                      }
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
[]
)

const table = useReactTable({
  data: filteredData as EmployeeWithAction[],
  columns,
  filterFns: { fuzzy: fuzzyFilter },
  state: { rowSelection, globalFilter },
  initialState: {
    pagination: {
      pageSize: 10
    }
  },
  enableRowSelection: true,
  globalFilterFn: (row, _columnId, filterValue) => {
    const employee = row.original
    const query = String(filterValue ?? '').toLowerCase().trim()

    if (!query) return true

    const values = [
      employee.id,
      employee.name,
      employee.username,
      employee.employeeId,
      employee.email,
      employee.phone,
      employee.nip,
      employee.nik,
      employee.position,
      employee.employeeType,
      employee.employmentStartDate,
      employee.employmentEndDate,
      employee.education,
      employee.institution,
      employee.status
    ]

    return values.some(value => String(value ?? '').toLowerCase().includes(query))
  },
  onRowSelectionChange: setRowSelection,
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel()
})

const handleExport = () => {
  const rows = table.getFilteredRowModel().rows.map(row => row.original)

  const headers = [
    'ID',
    'Nama',
    'Username',
    'Email',
    'Nomor HP',
    'NIP',
    'NIK',
    'Jabatan',
    'Pendidikan',
    'Institusi',
    'Tipe Pegawai',
    'Tanggal Mulai',
    'Tanggal Akhir',
    'Status'
  ]

  const csvRows = rows.map(employee => [
    employee.id,
    employee.name,
    employee.username,
    employee.email,
    employee.phone,
    employee.nip,
    employee.nik,
    employee.position,
    employee.education,
    employee.institution,
    employee.employeeType,
    employee.employmentStartDate,
    employee.employmentEndDate,
    employee.status
  ])

  const escapeCSV = (value: unknown) =>
    `"${String(value ?? '').replace(/"/g, '""')}"`

  const csv = [headers, ...csvRows]
    .map(row => row.map(escapeCSV).join(','))
    .join('\r\n')

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `data-pegawai-${new Date().toISOString().slice(0, 10)}.csv`

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

return (
  <Card>
    <CardHeader
      title='Daftar Pegawai'
      subheader='Kelola profil, pendidikan, tipe kepegawaian, dan masa kerja pegawai.'
      className='pbe-4'
    />

    <TableFilters tableData={data} setData={setFilteredData} />

    <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
      <CustomTextField
        select
        value={table.getState().pagination.pageSize}
        onChange={event => table.setPageSize(Number(event.target.value))}
        className='max-sm:is-full sm:is-[70px]'
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={50}>50</MenuItem>
      </CustomTextField>

      <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={handleSearchChange}
          placeholder='Cari nama, akun, NIP, NIK...'
          className='max-sm:is-full'
        />

        <Button
          color='secondary'
          variant='tonal'
          startIcon={<i className='tabler-download' />}
          className='max-sm:is-full'
          onClick={handleExport}
        >
          Export
        </Button>

        <Button
          variant='contained'
          startIcon={<i className='tabler-plus' />}
          className='max-sm:is-full'
          component={Link}
          href='/admin/employees/create'
        >
          Tambah Pegawai
        </Button>
      </div>
    </div>

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
                      'flex items-center gap-1': header.column.getIsSorted(),
                      'cursor-pointer select-none': header.column.getCanSort()
                    })}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}

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
            <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
              Tidak ada data pegawai
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

export default EmployeeListTable
