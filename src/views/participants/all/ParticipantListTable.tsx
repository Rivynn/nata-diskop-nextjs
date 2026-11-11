
'use client'

// React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import Swal from 'sweetalert2'
import { rankItem } from '@tanstack/match-sorter-utils'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import type {
  ColumnDef,
  FilterFn
} from '@tanstack/react-table'

import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type {
  ParticipantsType,
  ParticipantsTypeWithAction
} from '@/types/apps/participantTypes'

// Component Imports
import TableFilters from './TableFilters'
import AddParticipantDrawer from './AddParticipantDrawer'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// ---------------------------------------------------------
// TanStack Types
// ---------------------------------------------------------

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

type ParticipantStatusType = {
  [key: string]: ThemeColor
}

type ParticipantAction = {
  text: string
  icon: string
  menuItemProps?: {
    className?: string
    onClick?: () => void
  }
}

// ---------------------------------------------------------
// Verification Status
// ---------------------------------------------------------

const verificationStatusObj: ParticipantStatusType = {
  pending: 'warning',
  verified: 'success',
  rejected: 'error'
}

const verificationStatusLabel: Record<string, string> = {
  pending: 'Menunggu Verifikasi',
  verified: 'Terverifikasi',
  rejected: 'Ditolak'
}

// ---------------------------------------------------------
// Account Status
// ---------------------------------------------------------

const accountStatusObj: ParticipantStatusType = {
  active: 'success',
  inactive: 'secondary',
  suspended: 'error'
}

const accountStatusLabel: Record<string, string> = {
  active: 'Aktif',
  inactive: 'Nonaktif',
  suspended: 'Ditangguhkan'
}

// ---------------------------------------------------------
// Fuzzy Filter
// ---------------------------------------------------------

const fuzzyFilter: FilterFn<ParticipantsTypeWithAction> = (
  row,
  _columnId,
  value,
  addMeta
) => {
  const searchValue = String(value ?? '').trim().toLowerCase()

  if (!searchValue) return true

  const participant = row.original

  const searchableText = [
    participant.id,
    participant.participantCode,
    `#${participant.participantCode}`,
    participant.fullName,
    participant.nik,
    participant.email,
    participant.phone,
    participant.address,
    participant.education,
    participant.occupation,
    participant.institution
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const itemRank = rankItem(searchableText, searchValue)

  addMeta({ itemRank })

  return itemRank.passed
}

// ---------------------------------------------------------
// Debounced Input
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// Participant Avatar
// ---------------------------------------------------------

const getParticipantAvatar = ({
                                avatar,
                                fullName
                              }: Pick<ParticipantsType, 'avatar' | 'fullName'>) => {
  if (avatar) {
    return <CustomAvatar src={avatar} size={34} />
  }

  return (
    <CustomAvatar size={34}>
      {getInitials(fullName)}
    </CustomAvatar>
  )
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const ParticipantListTable = ({
                                tableData
                              }: {
  tableData?: ParticipantsType[]
}) => {
  // -------------------------------------------------------
  // States
  // -------------------------------------------------------

  const [addParticipantOpen, setAddParticipantOpen] = useState(false)

  const [editingParticipant, setEditingParticipant] =
    useState<ParticipantsType | null>(null)

  const [rowSelection, setRowSelection] = useState({})

  const [data, setData] = useState<ParticipantsType[]>(
    tableData ?? []
  )

  const [filteredData, setFilteredData] = useState<ParticipantsType[]>(
    tableData ?? []
  )

  const [globalFilter, setGlobalFilter] = useState('')

  // -------------------------------------------------------
  // Sync Local Data
  // -------------------------------------------------------

  useEffect(() => {
    const nextData = tableData ?? []

    setData(nextData)
    setFilteredData(nextData)
  }, [tableData])

  // -------------------------------------------------------
  // Drawer
  // -------------------------------------------------------

  const handleAddParticipant = useCallback(() => {
    setEditingParticipant(null)
    setAddParticipantOpen(true)
  }, [])

  const handleEditParticipant = useCallback(
    (participant: ParticipantsType) => {
      setEditingParticipant(participant)
      setAddParticipantOpen(true)
    },
    []
  )

  const handleCloseParticipantDrawer = useCallback(() => {
    setAddParticipantOpen(false)
    setEditingParticipant(null)
  }, [])

  // -------------------------------------------------------
  // Alert Helpers
  // -------------------------------------------------------

  const showSuccessAlert = useCallback(
    async (title: string, text: string) => {
      await Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16805A'
      })
    },
    []
  )

  const confirmAction = useCallback(
    async ({
             title,
             html,
             confirmButtonText,
             confirmButtonColor = '#16805A'
           }: {
      title: string
      html: string
      confirmButtonText: string
      confirmButtonColor?: string
    }) => {
      const result = await Swal.fire({
        title,
        html,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Batal',
        reverseButtons: true,
        focusCancel: true,
        confirmButtonColor,
        cancelButtonColor: '#6c757d'
      })

      return result.isConfirmed
    },
    []
  )

  // -------------------------------------------------------
  // Approve Participant Verification
  // -------------------------------------------------------

  const handleApproveParticipant = useCallback(
    async (participant: ParticipantsType) => {
      const confirmed = await confirmAction({
        title: 'Verifikasi peserta?',
        html: `
          Data peserta
          <strong>${participant.fullName}</strong>
          akan ditandai sebagai terverifikasi.
        `,
        confirmButtonText: 'Ya, verifikasi'
      })

      if (!confirmed) return

      const now = new Date().toISOString()

      const updatedData = data.map(item =>
        item.id === participant.id
          ? {
            ...item,
            verificationStatus: 'verified' as const,
            verifiedAt: now,
            verificationNotes: '',
            updatedAt: now
          }
          : item
      )

      setData(updatedData)

      await showSuccessAlert(
        'Peserta berhasil diverifikasi',
        `${participant.fullName} sekarang berstatus terverifikasi.`
      )
    },
    [data, confirmAction, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Reject Participant Verification
  // -------------------------------------------------------

  const handleRejectParticipant = useCallback(
    async (participant: ParticipantsType) => {
      const confirmed = await confirmAction({
        title: 'Tolak verifikasi peserta?',
        html: `
          Verifikasi data peserta
          <strong>${participant.fullName}</strong>
          akan ditolak.
        `,
        confirmButtonText: 'Ya, tolak verifikasi',
        confirmButtonColor: '#d32f2f'
      })

      if (!confirmed) return

      const now = new Date().toISOString()

      const updatedData = data.map(item =>
        item.id === participant.id
          ? {
            ...item,
            verificationStatus: 'rejected' as const,
            verifiedAt: undefined,
            updatedAt: now
          }
          : item
      )

      setData(updatedData)

      await showSuccessAlert(
        'Verifikasi ditolak',
        `Verifikasi ${participant.fullName} berhasil ditolak.`
      )
    },
    [data, confirmAction, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Delete Participant
  // -------------------------------------------------------

  const handleDeleteParticipant = useCallback(
    async (participant: ParticipantsType) => {
      const confirmed = await confirmAction({
        title: 'Hapus peserta?',
        html: `
          Peserta
          <strong>${participant.fullName}</strong>
          akan dihapus dari daftar peserta.
          <br /><br />
          <strong>Tindakan ini tidak dapat dibatalkan.</strong>
        `,
        confirmButtonText: 'Ya, hapus peserta',
        confirmButtonColor: '#d32f2f'
      })

      if (!confirmed) return

      const updatedData = data.filter(
        item => item.id !== participant.id
      )

      setData(updatedData)

      await showSuccessAlert(
        'Peserta dihapus',
        `${participant.fullName} berhasil dihapus.`
      )
    },
    [data, confirmAction, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Participant Actions
  // -------------------------------------------------------

  const getParticipantActions = useCallback(
    (participant: ParticipantsType): ParticipantAction[] => {
      const actions: ParticipantAction[] = [
        {
          text: 'Edit Peserta',
          icon: 'tabler-edit',
          menuItemProps: {
            onClick: () => handleEditParticipant(participant)
          }
        }
      ]

      if (participant.verificationStatus === 'pending') {
        actions.push(
          {
            text: 'Verifikasi Peserta',
            icon: 'tabler-user-check',
            menuItemProps: {
              className: 'flex items-center gap-2 text-success',
              onClick: () => handleApproveParticipant(participant)
            }
          },
          {
            text: 'Tolak Verifikasi',
            icon: 'tabler-user-x',
            menuItemProps: {
              className: 'flex items-center gap-2 text-error',
              onClick: () => handleRejectParticipant(participant)
            }
          }
        )
      }

      actions.push({
        text: 'Hapus Peserta',
        icon: 'tabler-trash',
        menuItemProps: {
          className: 'flex items-center gap-2 text-error',
          onClick: () => handleDeleteParticipant(participant)
        }
      })

      return actions
    },
    [
      handleEditParticipant,
      handleApproveParticipant,
      handleRejectParticipant,
      handleDeleteParticipant
    ]
  )

  // -------------------------------------------------------
  // Column Definitions
  // -------------------------------------------------------

  const columnHelper = createColumnHelper<ParticipantsTypeWithAction>()

  const columns = useMemo<ColumnDef<ParticipantsTypeWithAction, any>[]>(
    () => [
      // Checkbox
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
        ),
        enableSorting: false
      },

      // Participant Code
      columnHelper.accessor('participantCode', {
        header: 'ID Peserta',
        cell: ({ row }) => (
          <Typography
            variant='body2'
            color='text.secondary'
            className='font-medium whitespace-nowrap'
          >
            {row.original.participantCode}
          </Typography>
        )
      }),

      // Participant
      columnHelper.accessor('fullName', {
        header: 'Peserta',
        cell: ({ row }) => (
          <div className='flex items-center gap-3 min-is-[220px]'>
            {getParticipantAvatar({
              avatar: row.original.avatar,
              fullName: row.original.fullName
            })}

            <div className='flex flex-col'>
              <Typography
                color='text.primary'
                className='font-medium'
              >
                {row.original.fullName}
              </Typography>

              <Typography variant='body2'>
                NIK: {row.original.nik}
              </Typography>
            </div>
          </div>
        )
      }),

      // Contact
      columnHelper.accessor('email', {
        header: 'Kontak',
        cell: ({ row }) => (
          <div className='flex flex-col min-is-[200px]'>
            <Typography
              color='text.primary'
              className='font-medium truncate max-is-[240px]'
              title={row.original.email}
            >
              {row.original.email}
            </Typography>

            <Typography variant='body2'>
              {row.original.phone}
            </Typography>
          </div>
        )
      }),

      // Education & Occupation
      columnHelper.accessor('education', {
        header: 'Pendidikan & Pekerjaan',
        cell: ({ row }) => (
          <div className='flex flex-col min-is-[180px]'>
            <Typography
              color='text.primary'
              className='font-medium'
            >
              {row.original.education}
            </Typography>

            <Typography variant='body2'>
              {row.original.occupation}
            </Typography>
          </div>
        )
      }),

      // Verification Status
      columnHelper.accessor('verificationStatus', {
        header: 'Status Verifikasi',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            size='small'
            color={
              verificationStatusObj[
                row.original.verificationStatus
                ] ?? 'secondary'
            }
            label={
              verificationStatusLabel[
                row.original.verificationStatus
                ] ?? row.original.verificationStatus
            }
          />
        )
      }),

      // Account Status
      columnHelper.accessor('accountStatus', {
        header: 'Status Akun',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            size='small'
            color={
              accountStatusObj[
                row.original.accountStatus
                ] ?? 'secondary'
            }
            label={
              accountStatusLabel[
                row.original.accountStatus
                ] ?? row.original.accountStatus
            }
          />
        )
      }),

      // Created At
      columnHelper.accessor('createdAt', {
        header: 'Tanggal Registrasi',
        cell: ({ row }) => (
          <Typography
            variant='body2'
            className='whitespace-nowrap'
          >
            {new Date(row.original.createdAt).toLocaleDateString(
              'id-ID',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }
            )}
          </Typography>
        )
      }),

      // Actions
      columnHelper.display({
        id: 'action',
        header: 'Aksi',
        cell: ({ row }) => {
          const participant = row.original

          return (
            <div className='flex items-center justify-end gap-1'>
              <Tooltip title='Lihat detail'>
                <IconButton
                  size='small'
                  component={Link}
                  href={`/admin/participants/${participant.id}`}
                >
                  <i className='tabler-eye text-textSecondary' />
                </IconButton>
              </Tooltip>

              <OptionMenu
                iconButtonProps={{
                  size: 'small'
                }}
                iconClassName='text-textSecondary'
                options={getParticipantActions(participant)}
              />
            </div>
          )
        },
        enableSorting: false
      })
    ],
    [columnHelper, getParticipantActions]
  )

  // -------------------------------------------------------
  // Table
  // -------------------------------------------------------

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

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <>
      <Card>
        {/* Filter */}

        <CardHeader
          title='Filter Peserta'
          className='pbe-4'
        />

        <TableFilters
          setData={setFilteredData}
          tableData={data}
        />

        {/* Toolbar */}

        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          {/* Page Size */}

          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>

          {/* Actions */}

          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            {/* Search */}

            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => {
                setGlobalFilter(String(value))
              }}
              placeholder='Cari nama, NIK, email, no. HP, atau ID...'
              className='max-sm:is-full'
            />

            {/* Export */}

            <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='max-sm:is-full'
            >
              Export
            </Button>

            {/* Add Participant */}

            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={handleAddParticipant}
              className='max-sm:is-full'
            >
              Tambah Peserta
            </Button>
          </div>
        </div>

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
                  colSpan={table.getVisibleFlatColumns().length}
                  className='text-center'
                >
                  Belum ada data peserta
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
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>

      {/* Add / Edit Participant Drawer */}

      <AddParticipantDrawer
        open={addParticipantOpen}
        handleClose={handleCloseParticipantDrawer}
        participantData={data}
        setData={setData}
        participant={editingParticipant}
      />
    </>
  )
}

export default ParticipantListTable
