
'use client'

// React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import Swal from 'sweetalert2'
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

import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'

import type {
  TrainingRegistrationTableType,
  RegistrationHistoryType,
  RegistrationStatus,
  RegistrationDocumentType
} from '@/types/apps/registrationTypes'

// Component Imports
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

type RegistrationAction = {
  text: string
  icon: string
  menuItemProps?: {
    className?: string
    onClick?: () => void
  }
}

type RegistrationStatusConfig = {
  color: ThemeColor
  label: string
}

type RegistrationListTableProps = {
  tableData?: TrainingRegistrationTableType[]
}

type HistoryAction = RegistrationHistoryType['action']

type RegistrationDecision = {
  action: HistoryAction
  description: string
  newStatus?: RegistrationStatus
  notes?: string
  rejectionReason?: string
}

type DetailRowProps = {
  label: string
  value: React.ReactNode
}

// ---------------------------------------------------------
// Constants
// ---------------------------------------------------------

const registrationStatusConfig: Record<
  RegistrationStatus,
  RegistrationStatusConfig
> = {
  pending: {
    color: 'warning',
    label: 'Menunggu'
  },
  approved: {
    color: 'success',
    label: 'Disetujui'
  },
  rejected: {
    color: 'error',
    label: 'Ditolak'
  },
  waitlisted: {
    color: 'info',
    label: 'Daftar Tunggu'
  },
  cancelled: {
    color: 'secondary',
    label: 'Dibatalkan'
  }
}

const documentStatusConfig: Record<
  RegistrationDocumentType['verificationStatus'],
  RegistrationStatusConfig
> = {
  pending: {
    color: 'warning',
    label: 'Belum Ditinjau'
  },
  approved: {
    color: 'success',
    label: 'Disetujui'
  },
  rejected: {
    color: 'error',
    label: 'Ditolak'
  }
}

const historyActionLabels: Record<HistoryAction, string> = {
  submitted: 'Pendaftaran Dikirim',
  approved: 'Pendaftaran Disetujui',
  rejected: 'Pendaftaran Ditolak',
  cancelled: 'Pendaftaran Dibatalkan',
  waitlisted: 'Masuk Daftar Tunggu',
  document_approved: 'Dokumen Disetujui',
  document_rejected: 'Dokumen Ditolak',
  note_added: 'Catatan Ditambahkan',
  status_changed: 'Status Diubah'
}

const historyActionIcons: Record<HistoryAction, string> = {
  submitted: 'tabler-send',
  approved: 'tabler-circle-check',
  rejected: 'tabler-circle-x',
  cancelled: 'tabler-ban',
  waitlisted: 'tabler-clock',
  document_approved: 'tabler-file-check',
  document_rejected: 'tabler-file-x',
  note_added: 'tabler-note',
  status_changed: 'tabler-refresh'
}

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

const formatDate = (value?: string) => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatShortDate = (value?: string) => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

// ---------------------------------------------------------
// Fuzzy Filter
// ---------------------------------------------------------

const fuzzyFilter: FilterFn<TrainingRegistrationTableType> = (
  row,
  _columnId,
  value,
  addMeta
) => {
  const searchValue = String(value ?? '').trim().toLowerCase()

  if (!searchValue) return true

  const registration = row.original

  const searchableText = [
    registration.id,
    registration.registrationCode,
    registration.participant?.participantCode,
    registration.participant?.fullName,
    registration.participant?.nik,
    registration.participant?.email,
    registration.participant?.phone,
    registration.trainingId,
    registration.trainingName,
    registration.trainingBatch,
    registration.registrationStatus,
    registration.reviewedByName
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
      onChange={event => setValue(event.target.value)}
    />
  )
}

// ---------------------------------------------------------
// Status Chip
// ---------------------------------------------------------

const RegistrationStatusChip = ({
                                  status
                                }: {
  status: RegistrationStatus
}) => {
  const config = registrationStatusConfig[status]

  return (
    <Chip
      variant='tonal'
      size='small'
      color={config?.color ?? 'secondary'}
      label={config?.label ?? status}
    />
  )
}

// ---------------------------------------------------------
// Participant Avatar
// ---------------------------------------------------------

const ParticipantAvatar = ({
                             registration
                           }: {
  registration: TrainingRegistrationTableType
}) => {
  const participant = registration.participant
  const name = participant?.fullName || 'Peserta'

  if (participant?.avatar) {
    return (
      <CustomAvatar
        src={participant.avatar}
        size={34}
      />
    )
  }

  return (
    <CustomAvatar size={34}>
      {getInitials(name)}
    </CustomAvatar>
  )
}

// ---------------------------------------------------------
// Detail Row
// ---------------------------------------------------------

const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className='flex flex-col sm:flex-row gap-1 sm:gap-4'>
    <Typography
      variant='body2'
      color='text.secondary'
      className='sm:is-[170px] shrink-0'
    >
      {label}
    </Typography>

    <div className='flex-1 min-is-0'>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography variant='body2' color='text.primary'>
          {value}
        </Typography>
      ) : (
        value
      )}
    </div>
  </div>
)

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const RegistrationListTable = ({
                                 tableData
                               }: RegistrationListTableProps) => {
  // -------------------------------------------------------
  // States
  // -------------------------------------------------------

  const [data, setData] = useState<TrainingRegistrationTableType[]>(
    tableData ?? []
  )

  const [globalFilter, setGlobalFilter] = useState('')

  const [statusFilter, setStatusFilter] = useState<
    RegistrationStatus | 'all'
  >('all')

  const [trainingFilter, setTrainingFilter] = useState('all')

  const [rowSelection, setRowSelection] = useState({})

  const [selectedRegistrationId, setSelectedRegistrationId] =
    useState<number | null>(null)

  const [detailOpen, setDetailOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  // -------------------------------------------------------
  // Sync Server Data
  // -------------------------------------------------------

  useEffect(() => {
    setData(tableData ?? [])
  }, [tableData])

  // -------------------------------------------------------
  // Selected Registration
  // -------------------------------------------------------

  const selectedRegistration = useMemo(() => {
    if (selectedRegistrationId === null) return null

    return data.find(item => item.id === selectedRegistrationId) ?? null
  }, [data, selectedRegistrationId])

  // -------------------------------------------------------
  // Training Options
  // -------------------------------------------------------

  const trainingOptions = useMemo(() => {
    const trainings = new Map<string, string>()

    data.forEach(registration => {
      trainings.set(
        registration.trainingId,
        registration.trainingName || registration.trainingId
      )
    })

    return Array.from(trainings.entries()).map(([id, name]) => ({
      id,
      name
    }))
  }, [data])

  // -------------------------------------------------------
  // Filtered Data
  // -------------------------------------------------------

  const filteredData = useMemo(() => {
    return data.filter(registration => {
      const matchesStatus =
        statusFilter === 'all' ||
        registration.registrationStatus === statusFilter

      const matchesTraining =
        trainingFilter === 'all' ||
        registration.trainingId === trainingFilter

      return matchesStatus && matchesTraining
    })
  }, [data, statusFilter, trainingFilter])

  // -------------------------------------------------------
  // Alert Helpers
  // -------------------------------------------------------

  const showSuccessAlert = useCallback(
    async (title: string, message: string) => {
      await Swal.fire({
        title,
        text: message,
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
  // Update Registration + History
  // -------------------------------------------------------

  const updateRegistration = useCallback(
    (
      registrationId: number,
      decision: RegistrationDecision
    ) => {
      const now = new Date().toISOString()

      setData(previous =>
        previous.map(registration => {
          if (registration.id !== registrationId) {
            return registration
          }

          const history: RegistrationHistoryType = {
            id:
              Math.max(
                0,
                ...(registration.history ?? []).map(item => item.id)
              ) + 1,
            action: decision.action,
            previousStatus: decision.newStatus
              ? registration.registrationStatus
              : undefined,
            newStatus: decision.newStatus,
            description: decision.description,
            notes: decision.notes,
            changedBy: 1,
            changedByName: 'Administrator',
            changedAt: now
          }

          return {
            ...registration,
            registrationStatus:
              decision.newStatus ?? registration.registrationStatus,
            reviewedAt:
              decision.newStatus ? now : registration.reviewedAt,
            reviewedBy:
              decision.newStatus ? 1 : registration.reviewedBy,
            reviewedByName:
              decision.newStatus
                ? 'Administrator'
                : registration.reviewedByName,
            rejectionReason:
              decision.rejectionReason ??
              registration.rejectionReason,
            adminNotes:
              decision.action === 'note_added'
                ? decision.notes
                : registration.adminNotes,
            history: [...(registration.history ?? []), history],
            updatedAt: now
          }
        })
      )
    },
    []
  )

  // -------------------------------------------------------
  // Approve Registration
  // -------------------------------------------------------

  const handleApproveRegistration = useCallback(
    async (registration: TrainingRegistrationTableType) => {
      if (
        registration.registrationStatus !== 'pending' &&
        registration.registrationStatus !== 'waitlisted'
      ) {
        return
      }

      const name = registration.participant?.fullName || 'Peserta'

      const confirmed = await confirmAction({
        title: 'Setujui pendaftaran?',
        html: `
          Pendaftaran
          <strong>${escapeHtml(name)}</strong>
          untuk pelatihan
          <strong>${escapeHtml(registration.trainingName || '-')}</strong>
          akan disetujui.
        `,
        confirmButtonText: 'Ya, setujui'
      })

      if (!confirmed) return

      updateRegistration(registration.id, {
        action: 'approved',
        description: 'Pendaftaran disetujui oleh administrator',
        newStatus: 'approved'
      })

      await showSuccessAlert(
        'Pendaftaran disetujui',
        `Pendaftaran ${name} berhasil disetujui.`
      )
    },
    [confirmAction, updateRegistration, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Reject Registration
  // -------------------------------------------------------

  const handleRejectRegistration = useCallback(
    async (registration: TrainingRegistrationTableType) => {
      if (
        registration.registrationStatus !== 'pending' &&
        registration.registrationStatus !== 'waitlisted'
      ) {
        return
      }

      const result = await Swal.fire({
        title: 'Tolak pendaftaran?',
        text: 'Masukkan alasan penolakan pendaftaran peserta.',
        input: 'textarea',
        inputLabel: 'Alasan Penolakan',
        inputPlaceholder: 'Tuliskan alasan penolakan...',
        inputValidator: value => {
          if (!value?.trim()) {
            return 'Alasan penolakan wajib diisi.'
          }

          return undefined
        },
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, tolak',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#d32f2f',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
      })

      const reason = String(result.value ?? '').trim()

      if (!result.isConfirmed || !reason) return

      updateRegistration(registration.id, {
        action: 'rejected',
        description: 'Pendaftaran ditolak oleh administrator',
        newStatus: 'rejected',
        rejectionReason: reason,
        notes: reason
      })

      await showSuccessAlert(
        'Pendaftaran ditolak',
        'Pendaftaran berhasil ditolak dan alasan telah dicatat.'
      )
    },
    [updateRegistration, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Waitlist Registration
  // -------------------------------------------------------

  const handleWaitlistRegistration = useCallback(
    async (registration: TrainingRegistrationTableType) => {
      if (registration.registrationStatus !== 'pending') return

      const confirmed = await confirmAction({
        title: 'Masukkan ke daftar tunggu?',
        html: `
          Pendaftaran
          <strong>${escapeHtml(registration.participant?.fullName || 'Peserta')}</strong>
          akan dipindahkan ke daftar tunggu.
        `,
        confirmButtonText: 'Ya, pindahkan'
      })

      if (!confirmed) return

      updateRegistration(registration.id, {
        action: 'waitlisted',
        description: 'Pendaftaran dipindahkan ke daftar tunggu',
        newStatus: 'waitlisted'
      })

      await showSuccessAlert(
        'Berhasil dipindahkan',
        'Pendaftaran sekarang berstatus daftar tunggu.'
      )
    },
    [confirmAction, updateRegistration, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Cancel Registration
  // -------------------------------------------------------

  const handleCancelRegistration = useCallback(
    async (registration: TrainingRegistrationTableType) => {
      if (
        registration.registrationStatus === 'cancelled' ||
        registration.registrationStatus === 'rejected'
      ) {
        return
      }

      const result = await Swal.fire({
        title: 'Batalkan pendaftaran?',
        text: 'Tuliskan alasan pembatalan untuk riwayat pendaftaran.',
        input: 'textarea',
        inputLabel: 'Alasan Pembatalan',
        inputPlaceholder: 'Tuliskan alasan pembatalan...',
        inputValidator: value => {
          if (!value?.trim()) {
            return 'Alasan pembatalan wajib diisi.'
          }

          return undefined
        },
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, batalkan',
        cancelButtonText: 'Kembali',
        confirmButtonColor: '#d32f2f',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
      })

      const notes = String(result.value ?? '').trim()

      if (!result.isConfirmed || !notes) return

      updateRegistration(registration.id, {
        action: 'cancelled',
        description: 'Pendaftaran dibatalkan oleh administrator',
        newStatus: 'cancelled',
        notes
      })

      await showSuccessAlert(
        'Pendaftaran dibatalkan',
        'Pembatalan berhasil dicatat dalam riwayat.'
      )
    },
    [updateRegistration, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Add Admin Note
  // -------------------------------------------------------

  const handleAddNote = useCallback(
    async (registration: TrainingRegistrationTableType) => {
      const result = await Swal.fire({
        title: 'Catatan Administrator',
        input: 'textarea',
        inputLabel: 'Catatan Internal',
        inputValue: registration.adminNotes || '',
        inputPlaceholder: 'Tuliskan catatan internal...',
        inputValidator: value => {
          if (!value?.trim()) {
            return 'Catatan tidak boleh kosong.'
          }

          return undefined
        },
        showCancelButton: true,
        confirmButtonText: 'Simpan Catatan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#16805A',
        cancelButtonColor: '#6c757d',
        reverseButtons: true
      })

      const notes = String(result.value ?? '').trim()

      if (!result.isConfirmed || !notes) return

      updateRegistration(registration.id, {
        action: 'note_added',
        description: 'Administrator menambahkan atau memperbarui catatan',
        notes
      })

      await showSuccessAlert(
        'Catatan disimpan',
        'Catatan administrator berhasil disimpan.'
      )
    },
    [updateRegistration, showSuccessAlert]
  )

  // -------------------------------------------------------
  // Open Detail
  // -------------------------------------------------------

  const handleOpenDetail = useCallback(
    (registration: TrainingRegistrationTableType) => {
      setSelectedRegistrationId(registration.id)
      setDetailOpen(true)
    },
    []
  )

  // -------------------------------------------------------
  // Open History
  // -------------------------------------------------------

  const handleOpenHistory = useCallback(
    (registration: TrainingRegistrationTableType) => {
      setSelectedRegistrationId(registration.id)
      setHistoryOpen(true)
    },
    []
  )

  // -------------------------------------------------------
  // Registration Actions
  // -------------------------------------------------------

  const getRegistrationActions = useCallback(
    (registration: TrainingRegistrationTableType): RegistrationAction[] => {
      const actions: RegistrationAction[] = [
        {
          text: 'Lihat Detail',
          icon: 'tabler-eye',
          menuItemProps: {
            onClick: () => handleOpenDetail(registration)
          }
        },
        {
          text: 'Riwayat Pendaftaran',
          icon: 'tabler-history',
          menuItemProps: {
            onClick: () => handleOpenHistory(registration)
          }
        }
      ]

      if (
        registration.registrationStatus === 'pending' ||
        registration.registrationStatus === 'waitlisted'
      ) {
        actions.push(
          {
            text: 'Setujui Pendaftaran',
            icon: 'tabler-circle-check',
            menuItemProps: {
              className: 'flex items-center gap-2 text-success',
              onClick: () => handleApproveRegistration(registration)
            }
          },
          {
            text: 'Tolak Pendaftaran',
            icon: 'tabler-circle-x',
            menuItemProps: {
              className: 'flex items-center gap-2 text-error',
              onClick: () => handleRejectRegistration(registration)
            }
          }
        )
      }

      if (registration.registrationStatus === 'pending') {
        actions.push({
          text: 'Masukkan Daftar Tunggu',
          icon: 'tabler-clock',
          menuItemProps: {
            onClick: () => handleWaitlistRegistration(registration)
          }
        })
      }

      if (
        registration.registrationStatus !== 'cancelled' &&
        registration.registrationStatus !== 'rejected'
      ) {
        actions.push({
          text: 'Batalkan Pendaftaran',
          icon: 'tabler-ban',
          menuItemProps: {
            className: 'flex items-center gap-2 text-error',
            onClick: () => handleCancelRegistration(registration)
          }
        })
      }

      actions.push({
        text: 'Catatan Administrator',
        icon: 'tabler-note',
        menuItemProps: {
          onClick: () => handleAddNote(registration)
        }
      })

      return actions
    },
    [
      handleOpenDetail,
      handleOpenHistory,
      handleApproveRegistration,
      handleRejectRegistration,
      handleWaitlistRegistration,
      handleCancelRegistration,
      handleAddNote
    ]
  )

  // -------------------------------------------------------
  // Column Definitions
  // -------------------------------------------------------

  const columnHelper = createColumnHelper<TrainingRegistrationTableType>()

  const columns = useMemo<ColumnDef<TrainingRegistrationTableType, any>[]>(
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

      // Registration Code
      columnHelper.accessor('registrationCode', {
        header: 'ID Pendaftaran',
        cell: ({ row }) => (
          <Typography
            variant='body2'
            color='text.secondary'
            className='font-medium whitespace-nowrap'
          >
            {row.original.registrationCode}
          </Typography>
        )
      }),

      // Participant
      columnHelper.accessor(
        row => row.participant?.fullName ?? '',
        {
          id: 'participant',
          header: 'Peserta',
          cell: ({ row }) => (
            <div className='flex items-center gap-3 min-is-[220px]'>
              <ParticipantAvatar registration={row.original} />

              <div className='flex flex-col'>
                <Typography
                  color='text.primary'
                  className='font-medium'
                >
                  {row.original.participant?.fullName || '-'}
                </Typography>

                <Typography variant='body2'>
                  {row.original.participant?.email || '-'}
                </Typography>
              </div>
            </div>
          )
        }
      ),

      // Training
      columnHelper.accessor(
        row => row.trainingName ?? '',
        {
          id: 'training',
          header: 'Program Pelatihan',
          cell: ({ row }) => (
            <div className='flex flex-col min-is-[220px]'>
              <Typography
                color='text.primary'
                className='font-medium'
              >
                {row.original.trainingName || '-'}
              </Typography>

              <Typography variant='body2'>
                {row.original.trainingBatch || row.original.trainingId}
              </Typography>
            </div>
          )
        }
      ),

      // Registered Date
      columnHelper.accessor('registeredAt', {
        header: 'Tanggal Pendaftaran',
        cell: ({ row }) => (
          <Typography
            variant='body2'
            className='whitespace-nowrap'
          >
            {formatShortDate(row.original.registeredAt)}
          </Typography>
        )
      }),

      // Status
      columnHelper.accessor('registrationStatus', {
        header: 'Status',
        cell: ({ row }) => (
          <RegistrationStatusChip
            status={row.original.registrationStatus}
          />
        )
      }),

      // Reviewer
      columnHelper.accessor(
        row => row.reviewedByName ?? '',
        {
          id: 'reviewer',
          header: 'Ditinjau Oleh',
          cell: ({ row }) => (
            <div className='flex flex-col min-is-[140px]'>
              <Typography
                variant='body2'
                color='text.primary'
              >
                {row.original.reviewedByName || '-'}
              </Typography>

              <Typography variant='body2'>
                {formatShortDate(row.original.reviewedAt)}
              </Typography>
            </div>
          )
        }
      ),

      // Actions
      columnHelper.display({
        id: 'action',
        header: 'Aksi',
        cell: ({ row }) => {
          const registration = row.original

          return (
            <div className='flex items-center justify-end gap-1'>
              <Tooltip title='Lihat detail'>
                <IconButton
                  size='small'
                  onClick={() => handleOpenDetail(registration)}
                >
                  <i className='tabler-eye text-textSecondary' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Riwayat pendaftaran'>
                <IconButton
                  size='small'
                  onClick={() => handleOpenHistory(registration)}
                >
                  <i className='tabler-history text-textSecondary' />
                </IconButton>
              </Tooltip>

              <OptionMenu
                iconButtonProps={{
                  size: 'small'
                }}
                iconClassName='text-textSecondary'
                options={getRegistrationActions(registration)}
              />
            </div>
          )
        },
        enableSorting: false
      })
    ],
    [
      columnHelper,
      getRegistrationActions,
      handleOpenDetail,
      handleOpenHistory
    ]
  )

  // -------------------------------------------------------
  // TanStack Table
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
    getPaginationRowModel: getPaginationRowModel()
  })

  // -------------------------------------------------------
  // Reset Filters
  // -------------------------------------------------------

  const handleResetFilters = () => {
    setStatusFilter('all')
    setTrainingFilter('all')
    setGlobalFilter('')
    table.setPageIndex(0)
  }

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <>
      <Card>
        {/* Filter Header */}
        <CardHeader
          title='Filter Pendaftaran'
          subheader='Filter berdasarkan status dan program pelatihan'
          className='pbe-4'
        />

        {/* Filters */}
        <div className='flex flex-col md:flex-row gap-4 p-6 pt-0'>
          <CustomTextField
            select
            fullWidth
            label='Status Pendaftaran'
            value={statusFilter}
            onChange={event => {
              setStatusFilter(
                event.target.value as RegistrationStatus | 'all'
              )
              table.setPageIndex(0)
            }}
          >
            <MenuItem value='all'>Semua Status</MenuItem>
            <MenuItem value='pending'>Menunggu</MenuItem>
            <MenuItem value='approved'>Disetujui</MenuItem>
            <MenuItem value='rejected'>Ditolak</MenuItem>
            <MenuItem value='waitlisted'>Daftar Tunggu</MenuItem>
            <MenuItem value='cancelled'>Dibatalkan</MenuItem>
          </CustomTextField>

          <CustomTextField
            select
            fullWidth
            label='Program Pelatihan'
            value={trainingFilter}
            onChange={event => {
              setTrainingFilter(event.target.value)
              table.setPageIndex(0)
            }}
          >
            <MenuItem value='all'>Semua Pelatihan</MenuItem>

            {trainingOptions.map(training => (
              <MenuItem
                key={training.id}
                value={training.id}
              >
                {training.name}
              </MenuItem>
            ))}
          </CustomTextField>

          <div className='flex items-end'>
            <Button
              color='secondary'
              variant='outlined'
              onClick={handleResetFilters}
              startIcon={<i className='tabler-refresh' />}
              className='whitespace-nowrap max-md:is-full'
            >
              Reset Filter
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          {/* Page Size */}
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={event => {
              table.setPageSize(Number(event.target.value))
            }}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>

          {/* Toolbar Actions */}
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => {
                setGlobalFilter(String(value))
                table.setPageIndex(0)
              }}
              placeholder='Cari peserta, kode, atau pelatihan...'
              className='max-sm:is-full'
            />

            <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='max-sm:is-full'
              disabled
            >
              Export
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
                  Belum ada data pendaftaran
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

      {/* Registration Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth='md'
        scroll='paper'
      >
        <DialogTitle className='flex items-center justify-between'>
          <div>
            <Typography variant='h5'>
              Detail Pendaftaran
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              {selectedRegistration?.registrationCode || '-'}
            </Typography>
          </div>

          <IconButton onClick={() => setDetailOpen(false)}>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent className='flex flex-col gap-6'>
          {selectedRegistration && (
            <>
              {/* Participant */}
              <div>
                <Typography
                  variant='h6'
                  className='mbe-4'
                >
                  Informasi Peserta
                </Typography>

                <div className='flex items-center gap-4'>
                  <ParticipantAvatar
                    registration={selectedRegistration}
                  />

                  <div className='flex flex-col'>
                    <Typography
                      color='text.primary'
                      className='font-medium'
                    >
                      {selectedRegistration.participant?.fullName || '-'}
                    </Typography>

                    <Typography variant='body2'>
                      {selectedRegistration.participant?.email || '-'}
                    </Typography>

                    <Typography variant='body2'>
                      {selectedRegistration.participant?.phone || '-'}
                    </Typography>
                  </div>
                </div>

                <div className='flex flex-col gap-3 mbs-4'>
                  <DetailRow
                    label='ID Peserta'
                    value={
                      selectedRegistration.participant?.participantCode || '-'
                    }
                  />

                  <DetailRow
                    label='NIK'
                    value={selectedRegistration.participant?.nik || '-'}
                  />
                </div>
              </div>

              <Divider />

              {/* Training */}
              <div>
                <Typography variant='h6' className='mbe-4'>
                  Informasi Pelatihan
                </Typography>

                <div className='flex flex-col gap-3'>
                  <DetailRow
                    label='Nama Pelatihan'
                    value={selectedRegistration.trainingName || '-'}
                  />

                  <DetailRow
                    label='ID Pelatihan'
                    value={selectedRegistration.trainingId}
                  />

                  <DetailRow
                    label='Batch'
                    value={selectedRegistration.trainingBatch || '-'}
                  />
                </div>
              </div>

              <Divider />

              {/* Registration */}
              <div>
                <Typography variant='h6' className='mbe-4'>
                  Informasi Pendaftaran
                </Typography>

                <div className='flex flex-col gap-3'>
                  <DetailRow
                    label='Kode Pendaftaran'
                    value={selectedRegistration.registrationCode}
                  />

                  <DetailRow
                    label='Status'
                    value={
                      <RegistrationStatusChip
                        status={selectedRegistration.registrationStatus}
                      />
                    }
                  />

                  <DetailRow
                    label='Tanggal Pendaftaran'
                    value={formatDate(selectedRegistration.registeredAt)}
                  />

                  <DetailRow
                    label='Ditinjau Oleh'
                    value={selectedRegistration.reviewedByName || '-'}
                  />

                  <DetailRow
                    label='Tanggal Peninjauan'
                    value={formatDate(selectedRegistration.reviewedAt)}
                  />
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedRegistration.rejectionReason && (
                <>
                  <Divider />

                  <div>
                    <Typography
                      variant='h6'
                      color='error.main'
                      className='mbe-3'
                    >
                      Alasan Penolakan
                    </Typography>

                    <Typography variant='body2'>
                      {selectedRegistration.rejectionReason}
                    </Typography>
                  </div>
                </>
              )}

              <Divider />

              {/* Documents */}
              <div>
                <Typography variant='h6' className='mbe-4'>
                  Dokumen Pendaftaran
                </Typography>

                {selectedRegistration.documents?.length ? (
                  <div className='flex flex-col gap-3'>
                    {selectedRegistration.documents.map(document => {
                      const config =
                        documentStatusConfig[document.verificationStatus]

                      return (
                        <div
                          key={document.id}
                          className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded border p-4'
                        >
                          <div className='flex items-center gap-3'>
                            <CustomAvatar
                              skin='light'
                              color='primary'
                              size={40}
                            >
                              <i className='tabler-file-text text-xl' />
                            </CustomAvatar>

                            <div className='flex flex-col'>
                              <Typography
                                color='text.primary'
                                className='font-medium'
                              >
                                {document.documentName}
                              </Typography>

                              <Typography variant='body2'>
                                {document.fileName}
                              </Typography>

                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                Diunggah: {formatDate(document.uploadedAt)}
                              </Typography>
                            </div>
                          </div>

                          <Chip
                            variant='tonal'
                            size='small'
                            color={config?.color ?? 'secondary'}
                            label={config?.label ?? '-'}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    Belum ada dokumen pendaftaran.
                  </Typography>
                )}
              </div>

              <Divider />

              {/* Admin Notes */}
              <div>
                <div className='flex items-center justify-between gap-3 mbe-3'>
                  <Typography variant='h6'>
                    Catatan Administrator
                  </Typography>

                  <Button
                    size='small'
                    variant='tonal'
                    startIcon={<i className='tabler-edit' />}
                    onClick={() => handleAddNote(selectedRegistration)}
                  >
                    Edit Catatan
                  </Button>
                </div>

                <div className='rounded border p-4'>
                  <Typography variant='body2'>
                    {selectedRegistration.adminNotes ||
                      'Belum ada catatan administrator.'}
                  </Typography>
                </div>
              </div>
            </>
          )}
        </DialogContent>

        <Divider />

        <DialogActions className='p-4'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => setDetailOpen(false)}
          >
            Tutup
          </Button>

          {selectedRegistration && (
            <Button
              variant='contained'
              startIcon={<i className='tabler-history' />}
              onClick={() => {
                setDetailOpen(false)
                handleOpenHistory(selectedRegistration)
              }}
            >
              Lihat Riwayat
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Registration History Dialog */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        fullWidth
        maxWidth='sm'
        scroll='paper'
      >
        <DialogTitle className='flex items-center justify-between'>
          <div>
            <Typography variant='h5'>
              Riwayat Pendaftaran
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              {selectedRegistration?.registrationCode || '-'}
            </Typography>
          </div>

          <IconButton onClick={() => setHistoryOpen(false)}>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {selectedRegistration && (
            <>
              <div className='flex items-center gap-3 mbe-6'>
                <ParticipantAvatar
                  registration={selectedRegistration}
                />

                <div className='flex flex-col'>
                  <Typography
                    color='text.primary'
                    className='font-medium'
                  >
                    {selectedRegistration.participant?.fullName || '-'}
                  </Typography>

                  <Typography variant='body2'>
                    {selectedRegistration.trainingName || '-'}
                  </Typography>
                </div>
              </div>

              <Divider className='mbe-6' />

              {selectedRegistration.history?.length ? (
                <div className='flex flex-col gap-6'>
                  {[...selectedRegistration.history]
                    .sort(
                      (a, b) =>
                        new Date(b.changedAt).getTime() -
                        new Date(a.changedAt).getTime()
                    )
                    .map(history => (
                      <div
                        key={history.id}
                        className='flex gap-4'
                      >
                        <CustomAvatar
                          skin='light'
                          color={
                            history.action === 'approved'
                              ? 'success'
                              : history.action === 'rejected' ||
                              history.action === 'cancelled'
                                ? 'error'
                                : 'primary'
                          }
                          size={40}
                        >
                          <i
                            className={classnames(
                              historyActionIcons[history.action],
                              'text-xl'
                            )}
                          />
                        </CustomAvatar>

                        <div className='flex-1 min-is-0'>
                          <Typography
                            color='text.primary'
                            className='font-medium'
                          >
                            {historyActionLabels[history.action]}
                          </Typography>

                          <Typography
                            variant='body2'
                            className='mbs-1'
                          >
                            {history.description}
                          </Typography>

                          {history.previousStatus &&
                            history.newStatus && (
                              <div className='flex items-center flex-wrap gap-2 mbs-3'>
                                <RegistrationStatusChip
                                  status={history.previousStatus}
                                />

                                <i className='tabler-arrow-right text-textSecondary' />

                                <RegistrationStatusChip
                                  status={history.newStatus}
                                />
                              </div>
                            )}

                          {history.notes && (
                            <div className='rounded border p-3 mbs-3'>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                Catatan
                              </Typography>

                              <Typography variant='body2'>
                                {history.notes}
                              </Typography>
                            </div>
                          )}

                          <div className='flex items-center flex-wrap gap-2 mbs-2'>
                            <i className='tabler-user text-textSecondary' />

                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              {history.changedByName}
                            </Typography>

                            <span className='text-textDisabled'>•</span>

                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              {formatDate(history.changedAt)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-3 p-6'>
                  <i className='tabler-history text-4xl text-textDisabled' />

                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    Belum ada riwayat pendaftaran.
                  </Typography>
                </div>
              )}
            </>
          )}
        </DialogContent>

        <Divider />

        <DialogActions className='p-4'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => setHistoryOpen(false)}
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RegistrationListTable
