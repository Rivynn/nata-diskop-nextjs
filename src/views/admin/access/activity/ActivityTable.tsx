'use client'

import {
  useEffect,
  useMemo,
  useState
} from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
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

import type {
  ColumnDef,
  FilterFn
} from '@tanstack/react-table'

import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'

import ActivityDetailsDrawer from './ActivityDetailsDrawer'

import type {
  ActivityAction,
  ActivityStatus,
  ActivityType
} from './types'

import tableStyles from '@core/styles/table.module.css'

import styles from './ActivityTable.module.css'

type Props = {
  data: ActivityType[]
}

type ActivityWithAction =
  ActivityType & {
  action?: string
}

const columnHelper =
  createColumnHelper<ActivityWithAction>()

// -----------------------------------------------------------------------------
// Labels
// -----------------------------------------------------------------------------

const actionLabels: Record<
  ActivityAction,
  string
> = {
  login: 'Login',
  logout: 'Logout',
  login_failed: 'Login Gagal',
  create: 'Membuat Data',
  update: 'Mengubah Data',
  delete: 'Menghapus Data',
  approve: 'Menyetujui',
  reject: 'Menolak',
  verify: 'Verifikasi',
  change_role: 'Mengubah Role',
  change_password: 'Mengubah Password',
  publish: 'Publikasi',
  unpublish: 'Batalkan Publikasi'
}

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
    String(row.getValue(columnId) ?? ''),
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
  onChange: (value: string | number) => void
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

    return () => clearTimeout(timeout)
  }, [
    value,
    debounce,
    onChange
  ])

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
// Component
// -----------------------------------------------------------------------------

const ActivityTable = ({
                         data
                       }: Props) => {
  const [rowSelection, setRowSelection] =
    useState({})

  const [globalFilter, setGlobalFilter] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState<ActivityStatus | ''>('')

  const [moduleFilter, setModuleFilter] =
    useState('')

  const [actionFilter, setActionFilter] =
    useState<ActivityAction | ''>('')

  const [selectedActivity, setSelectedActivity] =
    useState<ActivityType | null>(null)

  const [drawerOpen, setDrawerOpen] =
    useState(false)

  const [visibleIps, setVisibleIps] =
    useState<Record<number, boolean>>({})

  // ---------------------------------------------------------------------------
  // Filter
  // ---------------------------------------------------------------------------

  const filteredData = useMemo(() => {
    return data.filter(activity => {
      if (
        statusFilter &&
        activity.status !== statusFilter
      ) {
        return false
      }

      if (
        moduleFilter &&
        activity.module !== moduleFilter
      ) {
        return false
      }

      if (
        actionFilter &&
        activity.action !== actionFilter
      ) {
        return false
      }

      return true
    })
  }, [
    data,
    statusFilter,
    moduleFilter,
    actionFilter
  ])

  // ---------------------------------------------------------------------------
  // Modules
  // ---------------------------------------------------------------------------

  const modules = useMemo(
    () =>
      Array.from(
        new Set(
          data.map(
            activity => activity.module
          )
        )
      ),
    [data]
  )

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleViewActivity = (
    activity: ActivityType
  ) => {
    setSelectedActivity(activity)
    setDrawerOpen(true)
  }

  const toggleIpVisibility = (
    id: number
  ) => {
    setVisibleIps(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // ---------------------------------------------------------------------------
  // Columns
  // ---------------------------------------------------------------------------

  const columns = useMemo<
    ColumnDef<
      ActivityWithAction,
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
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={
              row.getIsSomeSelected()
            }
            onChange={
              row.getToggleSelectedHandler()
            }
          />
        ),

        enableSorting: false
      },

      // -----------------------------------------------------------------------
      // User
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'user.name',
        {
          id: 'user',

          header: 'Pengguna',

          cell: ({ row }) => (
            <div className='flex items-center gap-3'>
              <CustomAvatar
                src={
                  row.original.user.avatar
                }
                skin='light'
                size={38}
              />

              <div className='flex flex-col'>
                <Typography
                  className='font-medium'
                  color='text.primary'
                >
                  {
                    row.original.user.name
                  }
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  @
                  {
                    row.original.user
                      .username
                  }
                </Typography>
              </div>
            </div>
          )
        }
      ),

      // -----------------------------------------------------------------------
      // Activity
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'activity',
        {
          header: 'Aktivitas',

          cell: ({ row }) => {
            const activity =
              row.original

            return (
              <div
                className={
                  styles.activityCell
                }
              >
                <div
                  className={
                    styles.activityIcon
                  }
                >
                  <i
                    className={
                      activity.action ===
                      'delete'
                        ? 'tabler-trash'
                        : activity.action ===
                        'login' ||
                        activity.action ===
                        'login_failed'
                          ? 'tabler-login-2'
                          : activity.action ===
                          'change_role'
                            ? 'tabler-shield'
                            : activity.action ===
                            'change_password'
                              ? 'tabler-lock'
                              : 'tabler-activity'
                    }
                  />
                </div>

                <div className='flex flex-col'>
                  <Typography
                    className='font-medium'
                    color='text.primary'
                  >
                    {
                      activity.activity
                    }
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    {activity.module}
                    {activity.target
                      ? ` · ${activity.target.name}`
                      : ''}
                  </Typography>
                </div>
              </div>
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // Action
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'action',
        {
          header: 'Jenis',

          cell: ({ row }) => (
            <Chip
              size='small'
              variant='tonal'
              label={
                actionLabels[
                  row.original.action
                  ]
              }
              color={
                row.original.action ===
                'delete'
                  ? 'error'
                  : row.original.action ===
                  'login_failed'
                    ? 'warning'
                    : row.original.action ===
                    'approve' ||
                    row.original.action ===
                    'verify'
                      ? 'success'
                      : 'primary'
              }
            />
          )
        }
      ),

      // -----------------------------------------------------------------------
      // IP
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'ipAddress',
        {
          header: 'IP Address',

          cell: ({ row }) => {
            const activity =
              row.original

            const visible =
              Boolean(
                visibleIps[activity.id]
              )

            return (
              <div
                className={
                  styles.ipWrapper
                }
              >
                <Typography
                  className={
                    styles.ipAddress
                  }
                >
                  {visible
                    ? activity.ipAddress
                    : '•••.•••.•••.•••'}
                </Typography>

                <Tooltip
                  title={
                    visible
                      ? 'Sembunyikan IP'
                      : 'Tampilkan IP'
                  }
                  arrow
                >
                  <IconButton
                    size='small'
                    onClick={() =>
                      toggleIpVisibility(
                        activity.id
                      )
                    }
                    className={
                      styles.ipButton
                    }
                  >
                    <i
                      className={
                        visible
                          ? 'tabler-eye-off'
                          : 'tabler-eye'
                      }
                    />
                  </IconButton>
                </Tooltip>
              </div>
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // Time
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'createdAt',
        {
          header: 'Waktu',

          cell: ({ row }) => (
            <Typography
              variant='body2'
              color='text.primary'
              className='whitespace-nowrap'
            >
              {
                row.original
                  .createdAt
              }
            </Typography>
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
            const success =
              row.original.status ===
              'success'

            return (
              <div
                className={
                  styles.statusWrapper
                }
              >
                <span
                  className={
                    success
                      ? styles.successDot
                      : styles.failedDot
                  }
                />

                <Chip
                  size='small'
                  variant='tonal'
                  color={
                    success
                      ? 'success'
                      : 'error'
                  }
                  label={
                    success
                      ? 'Berhasil'
                      : 'Gagal'
                  }
                />
              </div>
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // Action
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'action',
        {
          id: 'actions',

          header: 'Aksi',

          cell: ({ row }) => (
            <Tooltip
              title='Lihat detail aktivitas'
              arrow
            >
              <IconButton
                size='small'
                onClick={() =>
                  handleViewActivity(
                    row.original
                  )
                }
                className={
                  styles.actionButton
                }
              >
                <i className='tabler-eye' />
              </IconButton>
            </Tooltip>
          ),

          enableSorting: false
        }
      )
    ],
    [visibleIps]
  )

  // ---------------------------------------------------------------------------
  // Table
  // ---------------------------------------------------------------------------

  const table =
    useReactTable({
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

      globalFilterFn:
      fuzzyFilter,

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
    <>
      <Card>
        {/* Filters */}
        <CardContent className='flex justify-between flex-col gap-4 items-start sm:flex-row sm:items-center'>
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
                  Number(
                    e.target.value
                  )
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
              placeholder='Cari pengguna, aktivitas, IP...'
            />

            <CustomTextField
              select
              value={moduleFilter}
              onChange={e =>
                setModuleFilter(
                  e.target.value
                )
              }
              className='max-sm:is-full sm:is-[150px]'
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                Semua Modul
              </MenuItem>

              {modules.map(module => (
                <MenuItem
                  key={module}
                  value={module}
                >
                  {module}
                </MenuItem>
              ))}
            </CustomTextField>

            <CustomTextField
              select
              value={actionFilter}
              onChange={e =>
                setActionFilter(
                  e.target
                    .value as ActivityAction
                )
              }
              className='max-sm:is-full sm:is-[170px]'
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                Semua Aktivitas
              </MenuItem>

              {Object.entries(
                actionLabels
              ).map(
                ([value, label]) => (
                  <MenuItem
                    key={value}
                    value={value}
                  >
                    {label}
                  </MenuItem>
                )
              )}
            </CustomTextField>

            <CustomTextField
              select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(
                  e.target
                    .value as ActivityStatus
                )
              }
              className='max-sm:is-full sm:is-[130px]'
              slotProps={{
                select: {
                  displayEmpty: true
                }
              }}
            >
              <MenuItem value=''>
                Semua Status
              </MenuItem>

              <MenuItem value='success'>
                Berhasil
              </MenuItem>

              <MenuItem value='failed'>
                Gagal
              </MenuItem>
            </CustomTextField>
          </div>
        </CardContent>

        {/* Table */}
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
                          : flexRender(
                            header
                              .column
                              .columnDef
                              .header,
                            header.getContext()
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
                  Tidak ada aktivitas
                  ditemukan
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
          onPageChange={(_, page) =>
            table.setPageIndex(page)
          }
        />
      </Card>

      <ActivityDetailsDrawer
        open={drawerOpen}
        activity={selectedActivity}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedActivity(null)
        }}
      />
    </>
  )
}

export default ActivityTable
