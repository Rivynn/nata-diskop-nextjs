'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TablePagination from '@mui/material/TablePagination'
import { styled } from '@mui/material/styles'
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
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { RoleType } from './types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Dialog Imports
import RoleDialog from '@components/dialogs/role-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type RoleTypeWithAction = RoleType & {
  action?: string
}

type RoleVisualType = {
  [key: string]: {
    icon: string
    color: ThemeColor
    label: string
  }
}

// Styled Components
const Icon = styled('i')({})

// Vars
const roleVisualObj: RoleVisualType = {
  admin: {
    icon: 'tabler-shield',
    color: 'success',
    label: 'Administrator'
  },

  pegawai: {
    icon: 'tabler-building',
    color: 'info',
    label: 'Pegawai'
  },

  pelatih: {
    icon: 'tabler-presentation',
    color: 'warning',
    label: 'Pelatih'
  },

  peserta: {
    icon: 'tabler-users',
    color: 'secondary',
    label: 'Peserta'
  },

  mitra: {
    icon: 'tabler-building-skyscraper',
    color: 'primary',
    label: 'Mitra'
  }
}

// Fuzzy Filter
const fuzzyFilter: FilterFn<any> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(
    String(row.getValue(columnId) ?? ''),
    value
  )

  addMeta({
    itemRank
  })

  return itemRank.passed
}

// Debounced Input
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

// Column Helper
const columnHelper = createColumnHelper<RoleTypeWithAction>()

const RolesTable = ({
                      tableData
                    }: {
  tableData?: RoleType[]
}) => {
  // States
  const [role, setRole] = useState<RoleType['key'] | ''>('')
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<RoleTypeWithAction[]>(
    (tableData ?? []) as RoleTypeWithAction[]
  )
  const [filteredData, setFilteredData] = useState<
    RoleTypeWithAction[]
  >(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Sync external data
  useEffect(() => {
    const nextData = (tableData ?? []) as RoleTypeWithAction[]

    setData(nextData)
    setFilteredData(nextData)
  }, [tableData])

  // Columns
  const columns = useMemo<
    ColumnDef<RoleTypeWithAction, any>[]
  >(
    () => [
      // =========================================
      // SELECT
      // =========================================
      {
        id: 'select',

        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate:
                table.getIsSomeRowsSelected(),
              onChange:
                table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate:
                row.getIsSomeSelected(),
              onChange:
                row.getToggleSelectedHandler()
            }}
          />
        )
      },

      // =========================================
      // ROLE
      // =========================================
      columnHelper.accessor('label', {
        header: 'Role',

        cell: ({ row }) => {
          const roleConfig =
            roleVisualObj[row.original.key]

          return (
            <div className='flex items-center gap-3'>
              <div
                className='flex items-center justify-center rounded-lg'
                style={{
                  width: 38,
                  height: 38,
                  backgroundColor: `var(--mui-palette-${roleConfig?.color}-lightOpacity)`
                }}
              >
                <Icon
                  className={
                    roleConfig?.icon ??
                    'tabler-shield'
                  }
                  sx={{
                    color: `var(--mui-palette-${roleConfig?.color}-main)`,
                    fontSize: '1.35rem'
                  }}
                />
              </div>

              <div className='flex flex-col'>
                <Typography
                  color='text.primary'
                  className='font-medium'
                >
                  {row.original.label}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Role sistem DISKOP
                </Typography>
              </div>
            </div>
          )
        }
      }),

      // =========================================
      // KEY
      // =========================================
      columnHelper.accessor('key', {
        header: 'Kode',

        cell: ({ row }) => {
          const roleConfig =
            roleVisualObj[row.original.key]

          return (
            <Chip
              label={row.original.key.toUpperCase()}
              size='small'
              variant='tonal'
              color={roleConfig?.color ?? 'secondary'}
              className='font-medium'
            />
          )
        }
      }),

      // =========================================
      // DESCRIPTION
      // =========================================
      columnHelper.accessor('description', {
        header: 'Deskripsi',

        cell: ({ row }) => (
          <Typography
            variant='body2'
            color='text.secondary'
            className='max-is-[300px]'
          >
            {row.original.description}
          </Typography>
        )
      }),

      // =========================================
      // USER COUNT
      // =========================================
      columnHelper.accessor('userCount', {
        header: 'Pengguna',

        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon
              className='tabler-users'
              sx={{
                color:
                  'var(--mui-palette-text-secondary)',
                fontSize: '1.2rem'
              }}
            />

            <Typography
              color='text.primary'
              className='font-medium'
            >
              {row.original.userCount}
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              pengguna
            </Typography>
          </div>
        )
      }),

      // =========================================
      // PERMISSIONS
      // =========================================
      columnHelper.accessor('permissions', {
        header: 'Hak Akses',

        cell: ({ row }) => {
          const permissionCount =
            row.original.permissions?.length ?? 0

          return (
            <div className='flex items-center gap-2'>
              <Icon
                className='tabler-lock-access'
                sx={{
                  color:
                    'var(--mui-palette-text-secondary)',
                  fontSize: '1.2rem'
                }}
              />

              <Typography
                color='text.primary'
                className='font-medium'
              >
                {permissionCount}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                izin
              </Typography>
            </div>
          )
        }
      }),

      // =========================================
      // SYSTEM ROLE
      // =========================================
      {
        id: 'system',

        header: 'Tipe',

        cell: () => (
          <Chip
            label='Bawaan Sistem'
            size='small'
            variant='tonal'
            color='secondary'
          />
        )
      },

      // =========================================
      // ACTIONS
      // =========================================
      columnHelper.accessor('action', {
        header: 'Aksi',

        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* Edit */}
            <Tooltip
              title='Edit tampilan role'
              arrow
              placement='top'
            >
              <span>
                <OpenDialogOnElementClick
                  element={IconButton}
                  elementProps={{
                    size: 'small',
                    'aria-label': `Edit ${row.original.label}`,
                    children: (
                      <i className='tabler-edit text-textSecondary' />
                    )
                  }}
                  dialog={RoleDialog}
                  dialogProps={{
                    title: row.original.label
                  }}
                />
              </span>
            </Tooltip>

            {/* Permissions */}
            <Tooltip
              title='Lihat hak akses'
              arrow
              placement='top'
            >
              <IconButton
                size='small'
                aria-label={`Lihat hak akses ${row.original.label}`}
              >
                <i className='tabler-shield-check text-textSecondary' />
              </IconButton>
            </Tooltip>

            {/* Copy */}
            <Tooltip
              title='Salin kode role'
              arrow
              placement='top'
            >
              <IconButton
                size='small'
                aria-label={`Salin kode ${row.original.key}`}
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(
                      row.original.key.toUpperCase()
                    )
                    .catch(() => {})
                }}
              >
                <i className='tabler-copy text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        ),

        enableSorting: false
      })
    ],

    []
  )

  // =========================================
  // FILTER DATA
  // =========================================

  useEffect(() => {
    const nextFilteredData = data.filter(item => {
      if (
        role &&
        item.key !== role
      ) {
        return false
      }

      return true
    })

    setFilteredData(nextFilteredData)
  }, [role, data])

  // =========================================
  // TABLE
  // =========================================

  const table = useReactTable({
    data: filteredData,
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
      getFacetedUniqueValues()
  })

  return (
    <Card>
      {/* =========================================
          FILTER BAR
      ========================================= */}
      <CardContent className='flex justify-between flex-col gap-4 items-start sm:flex-row sm:items-center'>
        {/* Show */}
        <div className='flex items-center gap-2'>
          <Typography>
            Tampilkan
          </Typography>

          <CustomTextField
            select
            value={
              table.getState()
                .pagination.pageSize
            }
            onChange={e =>
              table.setPageSize(
                Number(e.target.value)
              )
            }
            className='max-sm:is-full sm:is-[80px]'
          >
            <MenuItem value='10'>
              10
            </MenuItem>

            <MenuItem value='25'>
              25
            </MenuItem>

            <MenuItem value='50'>
              50
            </MenuItem>
          </CustomTextField>
        </div>

        {/* Search + Filter */}
        <div className='flex gap-4 flex-col !items-start max-sm:is-full sm:flex-row sm:items-center'>
          <DebouncedInput
            value={
              globalFilter ?? ''
            }
            className='max-sm:is-full min-is-[250px]'
            onChange={value =>
              setGlobalFilter(
                String(value)
              )
            }
            placeholder='Cari role...'
          />

          <CustomTextField
            select
            value={role}
            onChange={e =>
              setRole(
                e.target.value as
                  | RoleType['key']
                  | ''
              )
            }
            id='roles-system-role-select'
            className='max-sm:is-full sm:is-[180px]'
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              Semua Role
            </MenuItem>

            <MenuItem value='admin'>
              Administrator
            </MenuItem>

            <MenuItem value='pegawai'>
              Pegawai
            </MenuItem>

            <MenuItem value='pelatih'>
              Pelatih
            </MenuItem>

            <MenuItem value='peserta'>
              Peserta
            </MenuItem>

            <MenuItem value='mitra'>
              Mitra
            </MenuItem>
          </CustomTextField>
        </div>
      </CardContent>

      {/* =========================================
          TABLE
      ========================================= */}
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
                          <>
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
                                ] ?? null}
                            </div>
                          </>
                        )}
                    </th>
                  )
                )}
              </tr>
            ))}
          </thead>

          {table.getFilteredRowModel()
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
                Tidak ada role yang ditemukan
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
                table.getState()
                  .pagination
                  .pageSize
              )
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
                        key={
                          cell.id
                        }
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

      {/* =========================================
          PAGINATION
      ========================================= */}
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
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default RolesTable
