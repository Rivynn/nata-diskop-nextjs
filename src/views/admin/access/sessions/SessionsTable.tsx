'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
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

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Drawer
import SessionDetailsDrawer from './SessionDetailsDrawer'

// Types
import type { SessionType } from './types'

// Styles
import tableStyles from '@core/styles/table.module.css'
import styles from './SessionsTable.module.css'

type Props = {
  data: SessionType[]
  onDataChange: (data: SessionType[]) => void
  onTerminate: (session: SessionType) => void
}

type SessionWithAction = SessionType & {
  action?: string
}

const columnHelper =
  createColumnHelper<SessionWithAction>()

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

// -----------------------------------------------------------------------------
// Sessions Table
// -----------------------------------------------------------------------------

const SessionsTable = ({
                         data,
                         onDataChange,
                         onTerminate
                       }: Props) => {
  const [rowSelection, setRowSelection] =
    useState({})

  const [globalFilter, setGlobalFilter] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('')

  const [deviceFilter, setDeviceFilter] =
    useState('')

  const [selectedSession, setSelectedSession] =
    useState<SessionType | null>(null)

  const [drawerOpen, setDrawerOpen] =
    useState(false)

  /**
   * Track which IP addresses are currently visible.
   *
   * Example:
   * {
   *   1: true,
   *   4: false
   * }
   */
  const [visibleIps, setVisibleIps] =
    useState<Record<number, boolean>>({})

  // ---------------------------------------------------------------------------
  // Filtered Data
  // ---------------------------------------------------------------------------

  const filteredData = useMemo(() => {
    return data.filter(session => {
      if (
        statusFilter &&
        session.status !== statusFilter
      ) {
        return false
      }

      if (
        deviceFilter &&
        session.device !== deviceFilter
      ) {
        return false
      }

      return true
    })
  }, [
    data,
    statusFilter,
    deviceFilter
  ])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleViewSession = (
    session: SessionType
  ) => {
    setSelectedSession(session)
    setDrawerOpen(true)
  }

  const handleTerminate = (
    session: SessionType
  ) => {
    onTerminate(session)

    if (
      selectedSession?.id === session.id
    ) {
      setDrawerOpen(false)
      setSelectedSession(null)
    }
  }

  const toggleIpVisibility = (
    sessionId: number
  ) => {
    setVisibleIps(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }))
  }

  // ---------------------------------------------------------------------------
  // Columns
  // ---------------------------------------------------------------------------

  const columns = useMemo<
    ColumnDef<SessionWithAction, any>[]
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
                src={row.original.user.avatar}
                skin='light'
                size={38}
              />

              <div className='flex flex-col'>
                <Typography
                  className='font-medium'
                  color='text.primary'
                >
                  {row.original.user.name}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  @{row.original.user.username}
                </Typography>
              </div>
            </div>
          )
        }
      ),

      // -----------------------------------------------------------------------
      // Device
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'device',
        {
          header: 'Perangkat',

          cell: ({ row }) => {
            const isMobile =
              row.original.device ===
              'mobile'

            const isTablet =
              row.original.device ===
              'tablet'

            const deviceIcon = isMobile
              ? 'tabler-device-mobile'
              : isTablet
                ? 'tabler-device-tablet'
                : 'tabler-device-desktop'

            return (
              <div className='flex items-center gap-3'>
                <div className={styles.deviceIcon}>
                  <i
                    className={`${deviceIcon} text-[18px]`}
                  />
                </div>

                <div className='flex flex-col'>
                  <Typography
                    color='text.primary'
                    className='font-medium'
                  >
                    {
                      row.original
                        .operatingSystem
                    }
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    {row.original.browser}
                  </Typography>
                </div>
              </div>
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // IP Address
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'ipAddress',
        {
          header: 'IP Address',

          cell: ({ row }) => {
            const session = row.original

            const isVisible =
              Boolean(
                visibleIps[session.id]
              )

            return (
              <div
                className={
                  styles.ipAddressWrapper
                }
              >
                <Typography
                  color='text.primary'
                  className={
                    styles.ipAddress
                  }
                >
                  {isVisible
                    ? session.ipAddress
                    : '•••.•••.•••.•••'}
                </Typography>

                <Tooltip
                  title={
                    isVisible
                      ? 'Sembunyikan IP'
                      : 'Tampilkan IP'
                  }
                  arrow
                >
                  <IconButton
                    size='small'
                    onClick={() =>
                      toggleIpVisibility(
                        session.id
                      )
                    }
                    className={
                      styles.ipToggle
                    }
                    aria-label={
                      isVisible
                        ? 'Sembunyikan IP'
                        : 'Tampilkan IP'
                    }
                  >
                    <i
                      className={
                        isVisible
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
      // Location
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'location',
        {
          header: 'Lokasi',

          cell: ({ row }) => (
            <div className='flex items-center gap-2'>
              <i className='tabler-map-pin text-textSecondary' />

              <Typography
                variant='body2'
                color='text.primary'
                className='max-is-[220px]'
              >
                {row.original.location}
              </Typography>
            </div>
          )
        }
      ),

      // -----------------------------------------------------------------------
      // Last Activity
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'lastActivityAt',
        {
          header: 'Aktivitas Terakhir',

          cell: ({ row }) => (
            <div className='flex flex-col'>
              <Typography
                variant='body2'
                color='text.primary'
              >
                {
                  row.original
                    .lastActivityAt
                }
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Login{' '}
                {
                  row.original
                    .loginAt
                }
              </Typography>
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
              <div
                className={
                  styles.statusWrapper
                }
              >
                <span
                  className={
                    isActive
                      ? styles.statusDotActive
                      : styles.statusDotIdle
                  }
                />

                <Chip
                  variant='tonal'
                  size='small'
                  color={
                    isActive
                      ? 'success'
                      : 'secondary'
                  }
                  label={
                    isActive
                      ? 'Aktif'
                      : 'Idle'
                  }
                />
              </div>
            )
          }
        }
      ),

      // -----------------------------------------------------------------------
      // Actions
      // -----------------------------------------------------------------------

      columnHelper.accessor(
        'action',
        {
          header: 'Aksi',

          cell: ({ row }) => {
            const session =
              row.original

            return (
              <div
                className={
                  styles.actionGroup
                }
              >
                {/* Detail */}
                <Tooltip
                  title='Lihat detail sesi'
                  arrow
                >
                  <IconButton
                    size='small'
                    onClick={() =>
                      handleViewSession(
                        session
                      )
                    }
                    className={
                      styles.actionButton
                    }
                    aria-label='Lihat detail sesi'
                  >
                    <i className='tabler-eye' />
                  </IconButton>
                </Tooltip>

                {/* More */}
                <OptionMenu
                  iconButtonProps={{
                    size: 'small',
                    className:
                    styles.actionButton,
                    'aria-label':
                      'Aksi sesi'
                  }}
                  iconClassName={
                    styles.actionIcon
                  }
                  options={[
                    // Detail
                    {
                      text: 'Lihat Detail',
                      icon:
                        'tabler-file-description',
                      menuItemProps: {
                        className:
                          'flex items-center gap-2',
                        onClick: () =>
                          handleViewSession(
                            session
                          )
                      }
                    },

                    // Terminate
                    ...(!session.isCurrent
                      ? [
                        {
                          text: 'Putuskan Sesi',
                          icon:
                            'tabler-logout',
                          menuItemProps: {
                            className:
                              'flex items-center gap-2 text-error',
                            onClick: () =>
                              handleTerminate(
                                session
                              )
                          }
                        }
                      ]
                      : [
                        {
                          text: 'Sesi Saat Ini',
                          icon:
                            'tabler-shield-check',
                          menuItemProps: {
                            className:
                              'flex items-center gap-2 text-success',
                            disabled: true
                          }
                        }
                      ])
                  ]}
                />
              </div>
            )
          },

          enableSorting: false
        }
      )
    ],
    [
      selectedSession,
      visibleIps
    ]
  )

  // ---------------------------------------------------------------------------
  // React Table
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

      getCoreRowModel:
        getCoreRowModel(),

      onGlobalFilterChange:
      setGlobalFilter,

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
        {/* ----------------------------------------------------------------- */}
        {/* Filters */}
        {/* ----------------------------------------------------------------- */}

        <CardContent
          className='flex justify-between flex-col gap-4 items-start sm:flex-row sm:items-center'
        >
          {/* Page Size */}
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

          {/* Filters */}
          <div className='flex gap-4 flex-col !items-start max-sm:is-full sm:flex-row sm:items-center'>
            {/* Search */}
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
              placeholder='Cari pengguna, IP, perangkat...'
            />

            {/* Status */}
            <CustomTextField
              select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(
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
                Semua Status
              </MenuItem>

              <MenuItem value='active'>
                Aktif
              </MenuItem>

              <MenuItem value='idle'>
                Idle
              </MenuItem>
            </CustomTextField>

            {/* Device */}
            <CustomTextField
              select
              value={deviceFilter}
              onChange={e =>
                setDeviceFilter(
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
                Semua Perangkat
              </MenuItem>

              <MenuItem value='desktop'>
                Desktop
              </MenuItem>

              <MenuItem value='mobile'>
                Mobile
              </MenuItem>

              <MenuItem value='tablet'>
                Tablet
              </MenuItem>
            </CustomTextField>
          </div>
        </CardContent>

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
              ))}
            </thead>

            {/* Empty */}
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
                  Tidak ada sesi ditemukan
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
          onPageChange={(_, page) =>
            table.setPageIndex(
              page
            )
          }
        />
      </Card>

      {/* ------------------------------------------------------------------- */}
      {/* Detail Drawer */}
      {/* ------------------------------------------------------------------- */}

      <SessionDetailsDrawer
        open={drawerOpen}
        session={selectedSession}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedSession(null)
        }}
        onTerminate={
          handleTerminate
        }
      />
    </>
  )
}

export default SessionsTable
