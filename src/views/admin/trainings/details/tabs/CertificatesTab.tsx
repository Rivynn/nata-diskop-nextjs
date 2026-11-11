'use client'

import { useMemo, useState, type MouseEvent } from 'react'

import Avatar from '@mui/material/Avatar'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

/* =========================================================
   TYPES
========================================================= */

type CertificateStatus = 'ready' | 'issued' | 'incomplete'

type CertificateIssuer = {
  id: string
  name: string
  position: string
  avatarUrl: string
}

type TrainingParticipant = {
  id: string
  name: string
  email: string
  phone: string
  institution: string
  avatarUrl: string

  finalScore: number | null
  evaluationSubmitted: boolean
  reviewSubmitted: boolean

  status: CertificateStatus
  certificateNumber: string
  issuedAt: string | null
  notes: string
}

type CertificatesTabProps = {
  trainingTitle?: string
  trainingCode?: string
}

type ConfirmationAction = {
  type: 'delete' | 'revoke'
  participant: TrainingParticipant
}

/* =========================================================
   MOCK DATA
========================================================= */

const mockIssuers: CertificateIssuer[] = [
  {
    id: 'USR-002',
    name: 'Dr. Ahmad Hidayat',
    position: 'Kepala Dinas',
    avatarUrl: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 'USR-003',
    name: 'Dra. Siti Rahmawati',
    position: 'Sekretaris Dinas',
    avatarUrl: 'https://i.pravatar.cc/150?img=47'
  },
  {
    id: 'USR-004',
    name: 'Budi Santoso, S.Kom.',
    position: 'Kepala Bidang Pelatihan',
    avatarUrl: 'https://i.pravatar.cc/150?img=12'
  }
]

const mockParticipants: TrainingParticipant[] = [
  {
    id: 'REG-001',
    name: 'Aditya Pratama',
    email: 'aditya@example.com',
    phone: '081234567801',
    institution: 'Universitas Lambung Mangkurat',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    finalScore: 88,
    evaluationSubmitted: true,
    reviewSubmitted: true,
    status: 'issued',
    certificateNumber: 'CERT-DM-2026-001',
    issuedAt: '2026-10-10T09:00:00',
    notes: ''
  },
  {
    id: 'REG-002',
    name: 'Nadia Putri',
    email: 'nadia@example.com',
    phone: '081234567802',
    institution: 'SMK Negeri 1 Banjarbaru',
    avatarUrl: 'https://i.pravatar.cc/150?img=44',
    finalScore: 92,
    evaluationSubmitted: true,
    reviewSubmitted: false,
    status: 'ready',
    certificateNumber: '',
    issuedAt: null,
    notes: ''
  },
  {
    id: 'REG-003',
    name: 'Rizky Ramadhan',
    email: 'rizky@example.com',
    phone: '081234567803',
    institution: 'Dinas Koperasi dan UKM',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
    finalScore: 65,
    evaluationSubmitted: true,
    reviewSubmitted: true,
    status: 'incomplete',
    certificateNumber: '',
    issuedAt: null,
    notes: 'Nilai akhir belum memenuhi standar penerbitan.'
  },
  {
    id: 'REG-004',
    name: 'Siti Rahmawati',
    email: 'siti@example.com',
    phone: '081234567804',
    institution: 'UMKM Banjarbaru',
    avatarUrl: 'https://i.pravatar.cc/150?img=45',
    finalScore: 85,
    evaluationSubmitted: true,
    reviewSubmitted: true,
    status: 'ready',
    certificateNumber: '',
    issuedAt: null,
    notes: ''
  },
  {
    id: 'REG-005',
    name: 'Muhammad Fajar',
    email: 'fajar@example.com',
    phone: '081234567805',
    institution: 'Universitas Islam Kalimantan',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    finalScore: null,
    evaluationSubmitted: false,
    reviewSubmitted: false,
    status: 'incomplete',
    certificateNumber: '',
    issuedAt: null,
    notes: ''
  },
  {
    id: 'REG-006',
    name: 'Dewi Anggraini',
    email: 'dewi@example.com',
    phone: '081234567806',
    institution: 'Koperasi Sejahtera',
    avatarUrl: 'https://i.pravatar.cc/150?img=49',
    finalScore: 95,
    evaluationSubmitted: true,
    reviewSubmitted: true,
    status: 'issued',
    certificateNumber: 'CERT-DM-2026-002',
    issuedAt: '2026-10-11T10:30:00',
    notes: ''
  },
  {
    id: 'REG-007',
    name: 'Andi Saputra',
    email: 'andi@example.com',
    phone: '081234567807',
    institution: 'Pelaku UMKM',
    avatarUrl: 'https://i.pravatar.cc/150?img=60',
    finalScore: 70,
    evaluationSubmitted: true,
    reviewSubmitted: false,
    status: 'incomplete',
    certificateNumber: '',
    issuedAt: null,
    notes: 'Nilai akhir belum memenuhi standar penerbitan.'
  },
  {
    id: 'REG-008',
    name: 'Putri Amelia',
    email: 'putri@example.com',
    phone: '081234567808',
    institution: 'Universitas Lambung Mangkurat',
    avatarUrl: 'https://i.pravatar.cc/150?img=48',
    finalScore: 90,
    evaluationSubmitted: true,
    reviewSubmitted: true,
    status: 'ready',
    certificateNumber: '',
    issuedAt: null,
    notes: ''
  }
]

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

function formatDateTime(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}

function getGrade(score: number | null) {
  if (score === null) return '—'
  if (score >= 90) return 'A'
  if (score >= 85) return 'A-'
  if (score >= 80) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 70) return 'C+'
  if (score >= 65) return 'C'
  if (score >= 60) return 'D'

  return 'E'
}

function getScoreColor(score: number | null) {
  if (score === null) return 'secondary' as const
  if (score >= 75) return 'success' as const

  return 'warning' as const
}

function getCertificateStatusLabel(status: CertificateStatus) {
  switch (status) {
    case 'issued':
      return 'Sudah diterbitkan'
    case 'ready':
      return 'Siap diterbitkan'
    default:
      return 'Belum dapat diterbitkan'
  }
}

function getCertificateStatusColor(status: CertificateStatus) {
  switch (status) {
    case 'issued':
      return 'success' as const
    case 'ready':
      return 'info' as const
    default:
      return 'warning' as const
  }
}

function canIssueCertificate(participant: TrainingParticipant) {
  return (
    participant.finalScore !== null &&
    participant.finalScore >= 75 &&
    participant.evaluationSubmitted &&
    participant.reviewSubmitted &&
    participant.status !== 'issued'
  )
}

function getParticipantStatus(
  participant: TrainingParticipant
): CertificateStatus {
  if (participant.status === 'issued') return 'issued'

  return canIssueCertificate({
    ...participant,
    status: 'ready'
  })
    ? 'ready'
    : 'incomplete'
}

function createCertificateNumber(sequence: number) {
  return `CERT-DM-${new Date().getFullYear()}-${String(sequence).padStart(3, '0')}`
}

function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const escapeCsvValue = (value: string | number) =>
    `"${String(value ?? '').replace(/"/g, '""')}"`

  const csvContent = [headers, ...rows]
    .map(row => row.map(escapeCsvValue).join(','))
    .join('\r\n')

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename

  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CertificatesTab({
                                          trainingTitle = 'Fotografi Produk untuk UMKM',
                                          trainingCode = 'TRN-2026-010'
                                        }: CertificatesTabProps) {
  const [issuers, setIssuers] =
    useState<CertificateIssuer[]>(mockIssuers)

  const [selectedIssuerId, setSelectedIssuerId] = useState('USR-002')

  const [participants, setParticipants] =
    useState<TrainingParticipant[]>(mockParticipants)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [issuerDialogOpen, setIssuerDialogOpen] = useState(false)
  const [issuerDraft, setIssuerDraft] =
    useState<CertificateIssuer>(mockIssuers[0])

  const [selectedParticipant, setSelectedParticipant] =
    useState<TrainingParticipant | null>(null)

  const [participantDraft, setParticipantDraft] =
    useState<TrainingParticipant | null>(null)

  const [participantDialogOpen, setParticipantDialogOpen] =
    useState(false)

  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction | null>(null)

  const [actionMenuAnchor, setActionMenuAnchor] =
    useState<HTMLElement | null>(null)

  const [actionMenuParticipant, setActionMenuParticipant] =
    useState<TrainingParticipant | null>(null)

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const [selectedCertificate, setSelectedCertificate] =
    useState<TrainingParticipant | null>(null)

  const selectedIssuer =
    issuers.find(issuer => issuer.id === selectedIssuerId) ?? issuers[0]

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(
    () => ({
      total: participants.length,
      ready: participants.filter(
        participant => getParticipantStatus(participant) === 'ready'
      ).length,
      issued: participants.filter(
        participant => participant.status === 'issued'
      ).length,
      incomplete: participants.filter(
        participant => getParticipantStatus(participant) === 'incomplete'
      ).length,
      evaluationSubmitted: participants.filter(
        participant => participant.evaluationSubmitted
      ).length,
      reviewSubmitted: participants.filter(
        participant => participant.reviewSubmitted
      ).length
    }),
    [participants]
  )

  /* =========================================================
     SEARCH AND FILTER
  ========================================================= */

  const filteredParticipants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return participants.filter(participant => {
      const matchesQuery =
        !normalizedQuery ||
        [
          participant.name,
          participant.email,
          participant.phone,
          participant.institution,
          participant.id,
          participant.certificateNumber
        ].some(value => value.toLowerCase().includes(normalizedQuery))

      const participantStatus = getParticipantStatus(participant)

      const matchesStatus =
        statusFilter === 'all' || participantStatus === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [participants, searchQuery, statusFilter])

  const paginatedParticipants = filteredParticipants.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  /* =========================================================
     ISSUER MANAGEMENT
  ========================================================= */

  const openIssuerDialog = () => {
    if (!selectedIssuer) return

    setIssuerDraft({ ...selectedIssuer })
    setIssuerDialogOpen(true)
  }

  const saveIssuer = () => {
    if (!issuerDraft.name.trim() || !issuerDraft.position.trim()) return

    setIssuers(current =>
      current.map(issuer =>
        issuer.id === issuerDraft.id
          ? {
            ...issuerDraft,
            name: issuerDraft.name.trim(),
            position: issuerDraft.position.trim(),
            avatarUrl: issuerDraft.avatarUrl.trim()
          }
          : issuer
      )
    )

    setIssuerDialogOpen(false)
  }

  /* =========================================================
     PARTICIPANT DETAILS AND EDITING
  ========================================================= */

  const openParticipantDetails = (participant: TrainingParticipant) => {
    setSelectedParticipant(participant)
    setDetailsDialogOpen(true)
    setActionMenuAnchor(null)
  }

  const openParticipantEditor = (participant: TrainingParticipant) => {
    setParticipantDraft({ ...participant })
    setParticipantDialogOpen(true)
    setActionMenuAnchor(null)
  }

  const saveParticipant = () => {
    if (!participantDraft) return

    if (
      !participantDraft.name.trim() ||
      !participantDraft.email.trim() ||
      !participantDraft.institution.trim()
    ) {
      return
    }

    setParticipants(current =>
      current.map(participant => {
        if (participant.id !== participantDraft.id) return participant

        const updatedParticipant = { ...participantDraft }

        // Sertifikat yang sudah terbit tidak dibatalkan otomatis.
        if (participant.status === 'issued') {
          return {
            ...updatedParticipant,
            status: 'issued',
            certificateNumber: participant.certificateNumber,
            issuedAt: participant.issuedAt
          }
        }

        return {
          ...updatedParticipant,
          status: canIssueCertificate({
            ...updatedParticipant,
            status: 'ready'
          })
            ? 'ready'
            : 'incomplete'
        }
      })
    )

    setSelectedParticipant({ ...participantDraft })
    setParticipantDialogOpen(false)
    setParticipantDraft(null)
  }

  /* =========================================================
     ADMIN ACTION MENU
  ========================================================= */

  const openParticipantActionMenu = (
    event: MouseEvent<HTMLElement>,
    participant: TrainingParticipant
  ) => {
    setActionMenuAnchor(event.currentTarget)
    setActionMenuParticipant(participant)
  }

  const closeParticipantActionMenu = () => {
    setActionMenuAnchor(null)
    setActionMenuParticipant(null)
  }

  const openConfirmation = (
    type: ConfirmationAction['type'],
    participant: TrainingParticipant
  ) => {
    setConfirmationAction({ type, participant })
    closeParticipantActionMenu()
  }

  const confirmAdministrativeAction = () => {
    if (!confirmationAction) return

    const { type, participant } = confirmationAction

    if (type === 'delete') {
      setParticipants(current =>
        current.filter(item => item.id !== participant.id)
      )

      if (selectedParticipant?.id === participant.id) {
        setSelectedParticipant(null)
        setDetailsDialogOpen(false)
      }

      if (selectedCertificate?.id === participant.id) {
        setSelectedCertificate(null)
      }
    }

    if (type === 'revoke') {
      setParticipants(current =>
        current.map(item =>
          item.id === participant.id
            ? {
              ...item,
              status: canIssueCertificate({
                ...item,
                status: 'ready',
                certificateNumber: '',
                issuedAt: null
              })
                ? 'ready'
                : 'incomplete',
              certificateNumber: '',
              issuedAt: null
            }
            : item
        )
      )
    }

    setConfirmationAction(null)
  }

  /* =========================================================
     CERTIFICATE ISSUANCE
  ========================================================= */

  const issueCertificate = (participantId: string) => {
    const participant = participants.find(item => item.id === participantId)

    if (!participant || !canIssueCertificate(participant)) return

    const nextSequence =
      participants.filter(item => item.certificateNumber).length + 1

    setParticipants(current =>
      current.map(item =>
        item.id === participantId
          ? {
            ...item,
            status: 'issued',
            certificateNumber: createCertificateNumber(nextSequence),
            issuedAt: new Date().toISOString()
          }
          : item
      )
    )
  }

  const issueAllCertificates = () => {
    const eligibleParticipants = participants.filter(
      participant => canIssueCertificate(participant)
    )

    if (eligibleParticipants.length === 0) return

    setParticipants(current => {
      let sequence = current.filter(
        participant => participant.certificateNumber
      ).length

      return current.map(participant => {
        if (!canIssueCertificate(participant)) return participant

        sequence += 1

        return {
          ...participant,
          status: 'issued',
          certificateNumber: createCertificateNumber(sequence),
          issuedAt: new Date().toISOString()
        }
      })
    })
  }

  /* =========================================================
     EXPORT
  ========================================================= */

  const exportParticipants = () => {
    downloadCsv(
      'rekap-sertifikat-peserta.csv',
      [
        'ID Peserta',
        'Nama Peserta',
        'Email',
        'Nomor Telepon',
        'Instansi',
        'Nilai Akhir',
        'Predikat',
        'Evaluasi',
        'Review',
        'Status Sertifikat',
        'Nomor Sertifikat',
        'Tanggal Terbit'
      ],
      filteredParticipants.map(participant => [
        participant.id,
        participant.name,
        participant.email,
        participant.phone,
        participant.institution,
        participant.finalScore ?? 'Belum dinilai',
        getGrade(participant.finalScore),
        participant.evaluationSubmitted ? 'Sudah diisi' : 'Belum diisi',
        participant.reviewSubmitted ? 'Sudah diisi' : 'Belum diisi',
        getCertificateStatusLabel(getParticipantStatus(participant)),
        participant.certificateNumber,
        formatDateTime(participant.issuedAt)
      ])
    )
  }

  /* =========================================================
     PRINT CERTIFICATE
  ========================================================= */

  const printCertificate = (participant: TrainingParticipant) => {
    if (participant.status !== 'issued' || !selectedIssuer) return

    setSelectedCertificate(participant)

    window.setTimeout(() => window.print(), 300)
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box className='flex flex-col gap-5'>
      {/* PAGE HEADER */}

      <Box className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <Box className='min-w-0'>
          <Box className='mb-1 flex items-center gap-2'>
            <i className='tabler-certificate text-lg text-primary' />

            <Typography variant='caption' color='text.secondary'>
              MANAJEMEN PELATIHAN
            </Typography>
          </Box>

          <Typography variant='h5' className='font-semibold'>
            Sertifikat
          </Typography>

          <Typography variant='body2' color='text.secondary' className='mt-1'>
            Kelola penerbitan sertifikat dan pantau nilai serta evaluasi peserta.
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            {trainingTitle} · {trainingCode}
          </Typography>
        </Box>

        <Box className='flex flex-wrap gap-2'>
          <Button
            variant='outlined'
            startIcon={<i className='tabler-download' />}
            onClick={exportParticipants}
          >
            Ekspor rekap
          </Button>

          <Button
            variant='contained'
            startIcon={<i className='tabler-award' />}
            onClick={issueAllCertificates}
            disabled={statistics.ready === 0}
          >
            Terbitkan semua ({statistics.ready})
          </Button>
        </Box>
      </Box>

      {/* CERTIFICATE ISSUER */}

      <Card>
        <CardContent className='p-4 sm:p-6'>
          <Box className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <Box className='flex min-w-0 items-start gap-3'>
              <Avatar
                variant='rounded'
                className='bs-12 is-12 bg-primaryLight text-primary'
              >
                <i className='tabler-shield-check text-2xl' />
              </Avatar>

              <Box className='min-w-0'>
                <Typography variant='h6' className='font-semibold'>
                  Penerbit Sertifikat
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  Pilih pejabat berwenang yang identitasnya dicantumkan pada
                  sertifikat peserta.
                </Typography>
              </Box>
            </Box>

            <Chip
              size='small'
              color='success'
              variant='tonal'
              icon={<i className='tabler-check text-sm' />}
              label='Penerbitan aktif'
            />
          </Box>

          <Divider className='my-5' />

          <Box className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
            {/* ISSUER SELECTOR */}

            <Box className='flex min-w-0 flex-col gap-3'>
              <Typography variant='subtitle2' className='font-medium'>
                Pejabat berwenang
              </Typography>

              <Autocomplete
                options={issuers}
                value={selectedIssuer}
                disableClearable
                fullWidth
                getOptionLabel={option => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, value) => {
                  if (value) setSelectedIssuerId(value.id)
                }}
                slotProps={{
                  popper: {
                    sx: {
                      zIndex: 1500,
                      minWidth: 320,
                      maxWidth: 'min(500px, calc(100vw - 32px))'
                    },
                    placement: 'bottom-start',
                    modifiers: [
                      {
                        name: 'flip',
                        enabled: true
                      },
                      {
                        name: 'preventOverflow',
                        enabled: true,
                        options: {
                          padding: 8,
                          altAxis: true
                        }
                      }
                    ]
                  },
                  paper: {
                    elevation: 8,
                    sx: {
                      borderRadius: 2,
                      overflow: 'hidden',
                      maxHeight: 360
                    }
                  },
                  listbox: {
                    sx: {
                      padding: 1,
                      maxHeight: 340,
                      '& .MuiAutocomplete-option': {
                        borderRadius: 1.5,
                        minHeight: 68,
                        padding: '10px 12px'
                      }
                    }
                  }
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Pilih pejabat penerbit'
                    placeholder='Cari nama pejabat...'
                    size='small'
                  />
                )}
                renderOption={(props, issuer, { selected }) => {
                  const { key, ...optionProps } = props

                  return (
                    <Box
                      component='li'
                      key={key}
                      {...optionProps}
                      sx={{
                        gap: 1.5,
                        backgroundColor: selected ? 'action.selected' : undefined
                      }}
                    >
                      <Avatar
                        src={issuer.avatarUrl}
                        alt={issuer.name}
                        sx={{ width: 42, height: 42, flexShrink: 0 }}
                      />

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant='body2' fontWeight={600} noWrap>
                          {issuer.name}
                        </Typography>

                        <Typography
                          variant='caption'
                          color='text.secondary'
                          display='block'
                          noWrap
                        >
                          {issuer.position}
                        </Typography>

                        <Typography variant='caption' color='text.secondary'>
                          ID: {issuer.id}
                        </Typography>
                      </Box>

                      {selected && (
                        <i className='tabler-check text-lg text-primary' />
                      )}
                    </Box>
                  )
                }}
              />

              {selectedIssuer && (
                <Box className='rounded-xl border border-divider p-4'>
                  <Box className='flex items-center gap-3'>
                    <Avatar
                      src={selectedIssuer.avatarUrl}
                      alt={selectedIssuer.name}
                      sx={{ width: 60, height: 60 }}
                    />

                    <Box className='min-w-0 flex-1'>
                      <Typography variant='subtitle1' className='font-semibold'>
                        {selectedIssuer.name}
                      </Typography>

                      <Typography variant='body2' color='text.secondary'>
                        {selectedIssuer.position}
                      </Typography>

                      <Typography variant='caption' color='text.secondary'>
                        ID pejabat: {selectedIssuer.id}
                      </Typography>
                    </Box>

                    <Tooltip title='Ubah identitas penerbit'>
                      <IconButton
                        color='primary'
                        onClick={openIssuerDialog}
                        aria-label='Ubah identitas penerbit'
                      >
                        <i className='tabler-edit text-lg' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )}

              <Typography variant='caption' color='text.secondary'>
                Identitas pejabat akan ditampilkan pada bagian tanda tangan
                sertifikat.
              </Typography>
            </Box>

            {/* CERTIFICATE PREVIEW */}

            <Box className='flex min-w-0 flex-col rounded-xl border border-divider p-4 sm:p-5'>
              <Box className='mb-4 flex items-center gap-3'>
                <Avatar
                  variant='rounded'
                  className='bg-primaryLight text-primary'
                >
                  <i className='tabler-file-certificate text-xl' />
                </Avatar>

                <Box className='min-w-0'>
                  <Typography variant='subtitle1' className='font-semibold'>
                    Pratinjau Sertifikat
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    Gambaran informasi yang akan dicantumkan pada sertifikat.
                  </Typography>
                </Box>
              </Box>

              <Box className='rounded-lg border border-dashed border-divider p-4'>
                <Box className='mb-3 flex items-center justify-between gap-2'>
                  <Typography variant='overline' color='text.secondary'>
                    SERTIFIKAT PELATIHAN DISKOP
                  </Typography>

                  <i className='tabler-rosette-discount-check text-2xl text-primary' />
                </Box>

                <Typography variant='h6' className='font-semibold'>
                  {trainingTitle}
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  Kode pelatihan: {trainingCode}
                </Typography>

                <Divider className='my-4' />

                <Box className='flex items-center gap-3'>
                  <Avatar
                    src={selectedIssuer?.avatarUrl}
                    alt={selectedIssuer?.name}
                    sx={{ width: 44, height: 44 }}
                  />

                  <Box className='min-w-0'>
                    <Typography variant='body2' className='font-medium'>
                      {selectedIssuer?.name}
                    </Typography>

                    <Typography variant='body2' color='text.secondary'>
                      {selectedIssuer?.position}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className='mt-3 block'
                >
                  Nomor sertifikat dan tanda tangan pejabat akan dicantumkan
                  pada dokumen yang diterbitkan.
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* STATISTICS */}

      <Box className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          title='Total Peserta'
          value={statistics.total}
          icon='tabler-users'
          color='primary'
          description='Peserta terdaftar'
        />

        <StatCard
          title='Siap Diterbitkan'
          value={statistics.ready}
          icon='tabler-file-check'
          color='info'
          description='Nilai dan evaluasi lengkap'
        />

        <StatCard
          title='Sertifikat Terbit'
          value={statistics.issued}
          icon='tabler-award'
          color='success'
          description='Sertifikat telah diterbitkan'
        />

        <StatCard
          title='Evaluasi Belum Lengkap'
          value={
            participants.filter(
              participant =>
                !participant.evaluationSubmitted ||
                !participant.reviewSubmitted
            ).length
          }
          icon='tabler-clipboard-x'
          color='warning'
          description='Evaluasi atau review belum diisi'
        />
      </Box>

      {/* PARTICIPANT REGISTER */}

      <Card>
        <CardContent className='flex flex-col gap-4 p-4 sm:p-5'>
          <Box className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <Box>
              <Typography variant='h6' className='font-semibold'>
                Daftar Sertifikat Peserta
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                Kelola data, nilai akhir, evaluasi, review, dan penerbitan
                sertifikat peserta.
              </Typography>
            </Box>

            <Box className='flex flex-wrap items-center gap-2'>
              <Chip
                size='small'
                variant='tonal'
                color='primary'
                label={`${filteredParticipants.length} peserta`}
              />

              <Button
                size='small'
                variant='outlined'
                startIcon={<i className='tabler-download' />}
                onClick={exportParticipants}
              >
                Ekspor
              </Button>
            </Box>
          </Box>

          {/* SEARCH AND FILTER */}

          <Box className='flex flex-col gap-3 md:flex-row'>
            <TextField
              fullWidth
              size='small'
              placeholder='Cari nama, ID peserta, instansi, atau nomor sertifikat...'
              value={searchQuery}
              onChange={event => {
                setSearchQuery(event.target.value)
                setPage(0)
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <Box className='mr-2 flex items-center'>
                      <i className='tabler-search text-xl' />
                    </Box>
                  ),
                  endAdornment: searchQuery ? (
                    <IconButton
                      size='small'
                      onClick={() => {
                        setSearchQuery('')
                        setPage(0)
                      }}
                      aria-label='Hapus pencarian'
                    >
                      <i className='tabler-x' />
                    </IconButton>
                  ) : undefined
                }
              }}
            />

            <TextField
              select
              size='small'
              label='Status sertifikat'
              value={statusFilter}
              onChange={event => {
                setStatusFilter(event.target.value)
                setPage(0)
              }}
              sx={{ minWidth: { xs: '100%', md: 220 } }}
            >
              <MenuItem value='all'>Semua status</MenuItem>
              <MenuItem value='ready'>Siap diterbitkan</MenuItem>
              <MenuItem value='issued'>Sudah diterbitkan</MenuItem>
              <MenuItem value='incomplete'>Belum dapat diterbitkan</MenuItem>
            </TextField>
          </Box>

          <Divider />

          <TableContainer>
            <Table sx={{ minWidth: 1250 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Peserta</TableCell>
                  <TableCell>Nilai Akhir</TableCell>
                  <TableCell>Evaluasi & Review</TableCell>
                  <TableCell>Status Sertifikat</TableCell>
                  <TableCell>Nomor Sertifikat</TableCell>
                  <TableCell>Tanggal Terbit</TableCell>
                  <TableCell align='right'>Aksi Admin</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedParticipants.map(participant => {
                  const participantStatus = getParticipantStatus(participant)

                  return (
                    <TableRow key={participant.id} hover>
                      {/* PARTICIPANT */}

                      <TableCell>
                        <Box className='flex items-center gap-3'>
                          <Avatar
                            src={participant.avatarUrl}
                            alt={participant.name}
                            sx={{ width: 42, height: 42 }}
                          />

                          <Box className='min-w-0'>
                            <Typography variant='body2' className='font-medium'>
                              {participant.name}
                            </Typography>

                            <Typography
                              variant='caption'
                              color='text.secondary'
                              display='block'
                            >
                              {participant.id} · {participant.email}
                            </Typography>

                            <Typography
                              variant='caption'
                              color='text.secondary'
                              display='block'
                            >
                              {participant.institution}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* FINAL SCORE */}

                      <TableCell>
                        {participant.finalScore !== null ? (
                          <Box className='flex flex-col items-start gap-1'>
                            <Typography
                              variant='h6'
                              className='font-semibold'
                            >
                              {participant.finalScore}
                              <Typography
                                component='span'
                                variant='caption'
                                color='text.secondary'
                              >
                                {' '}/ 100
                              </Typography>
                            </Typography>

                            <Chip
                              size='small'
                              color={getScoreColor(participant.finalScore)}
                              variant='tonal'
                              label={`Predikat ${getGrade(participant.finalScore)}`}
                            />
                          </Box>
                        ) : (
                          <Typography variant='body2' color='text.disabled'>
                            Belum dinilai
                          </Typography>
                        )}
                      </TableCell>

                      {/* EVALUATION AND REVIEW */}

                      <TableCell>
                        <Stack spacing={1}>
                          <Chip
                            size='small'
                            variant='tonal'
                            color={
                              participant.evaluationSubmitted
                                ? 'success'
                                : 'warning'
                            }
                            icon={
                              <i
                                className={
                                  participant.evaluationSubmitted
                                    ? 'tabler-check'
                                    : 'tabler-clock'
                                }
                              />
                            }
                            label={
                              participant.evaluationSubmitted
                                ? 'Evaluasi terisi'
                                : 'Evaluasi belum diisi'
                            }
                          />

                          <Chip
                            size='small'
                            variant='tonal'
                            color={
                              participant.reviewSubmitted
                                ? 'success'
                                : 'warning'
                            }
                            icon={
                              <i
                                className={
                                  participant.reviewSubmitted
                                    ? 'tabler-check'
                                    : 'tabler-clock'
                                }
                              />
                            }
                            label={
                              participant.reviewSubmitted
                                ? 'Review terisi'
                                : 'Review belum diisi'
                            }
                          />
                        </Stack>
                      </TableCell>

                      {/* CERTIFICATE STATUS */}

                      <TableCell>
                        <Chip
                          size='small'
                          color={getCertificateStatusColor(participantStatus)}
                          variant='tonal'
                          label={getCertificateStatusLabel(participantStatus)}
                        />
                      </TableCell>

                      {/* CERTIFICATE NUMBER */}

                      <TableCell>
                        {participant.certificateNumber ? (
                          <Typography
                            variant='body2'
                            className='font-medium'
                          >
                            {participant.certificateNumber}
                          </Typography>
                        ) : (
                          <Typography variant='body2' color='text.disabled'>
                            Belum diterbitkan
                          </Typography>
                        )}
                      </TableCell>

                      {/* ISSUE DATE */}

                      <TableCell>
                        <Typography variant='body2'>
                          {formatDate(participant.issuedAt)}
                        </Typography>
                      </TableCell>

                      {/* ADMIN ACTIONS */}

                      <TableCell align='right'>
                        <Stack
                          direction='row'
                          justifyContent='flex-end'
                          spacing={0.25}
                        >
                          <Tooltip title='Lihat detail peserta'>
                            <IconButton
                              size='small'
                              color='secondary'
                              onClick={() => openParticipantDetails(participant)}
                              aria-label={`Lihat detail ${participant.name}`}
                            >
                              <i className='tabler-eye text-lg' />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title='Edit data peserta'>
                            <IconButton
                              size='small'
                              color='primary'
                              onClick={() => openParticipantEditor(participant)}
                              aria-label={`Edit ${participant.name}`}
                            >
                              <i className='tabler-edit text-lg' />
                            </IconButton>
                          </Tooltip>

                          {participant.status === 'issued' ? (
                            <Tooltip title='Cetak sertifikat'>
                              <IconButton
                                size='small'
                                color='success'
                                onClick={() => printCertificate(participant)}
                                aria-label={`Cetak sertifikat ${participant.name}`}
                              >
                                <i className='tabler-printer text-lg' />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title={
                                canIssueCertificate(participant)
                                  ? 'Terbitkan sertifikat'
                                  : 'Nilai, evaluasi, atau review belum memenuhi persyaratan'
                              }
                            >
                              <span>
                                <IconButton
                                  size='small'
                                  color='success'
                                  disabled={!canIssueCertificate(participant)}
                                  onClick={() => issueCertificate(participant.id)}
                                  aria-label={`Terbitkan sertifikat ${participant.name}`}
                                >
                                  <i className='tabler-certificate text-lg' />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}

                          <Tooltip title='Aksi administratif lainnya'>
                            <IconButton
                              size='small'
                              color='secondary'
                              onClick={event =>
                                openParticipantActionMenu(event, participant)
                              }
                              aria-label={`Aksi lainnya untuk ${participant.name}`}
                            >
                              <i className='tabler-dots-vertical text-lg' />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {paginatedParticipants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box className='flex flex-col items-center gap-2 py-10 text-center'>
                        <i className='tabler-file-search text-4xl text-textSecondary' />

                        <Typography variant='body1' className='font-medium'>
                          Peserta tidak ditemukan
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                          Coba gunakan kata kunci atau filter status lainnya.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component='div'
            count={filteredParticipants.length}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={event => {
              setRowsPerPage(Number(event.target.value))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage='Baris per halaman'
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} dari ${count}`
            }
          />
        </CardContent>
      </Card>

      {/* PARTICIPANT ACTION MENU */}

      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={closeParticipantActionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 220,
              borderRadius: 2,
              mt: 1
            }
          }
        }}
      >
        <MenuItem
          onClick={() => {
            if (actionMenuParticipant) {
              openParticipantDetails(actionMenuParticipant)
            }

            closeParticipantActionMenu()
          }}
        >
          <i className='tabler-user-circle mr-2 text-lg' />
          Detail peserta
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (actionMenuParticipant) {
              openParticipantEditor(actionMenuParticipant)
            }

            closeParticipantActionMenu()
          }}
        >
          <i className='tabler-edit mr-2 text-lg' />
          Ubah data peserta
        </MenuItem>

        <Divider />

        {actionMenuParticipant?.status === 'issued' && (
          <MenuItem
            onClick={() => {
              if (actionMenuParticipant) {
                openConfirmation('revoke', actionMenuParticipant)
              }
            }}
          >
            <i className='tabler-file-off mr-2 text-lg' />
            Batalkan sertifikat
          </MenuItem>
        )}

        {actionMenuParticipant?.status !== 'issued' &&
          actionMenuParticipant && (
            <MenuItem
              disabled={!canIssueCertificate(actionMenuParticipant)}
              onClick={() => {
                if (actionMenuParticipant) {
                  issueCertificate(actionMenuParticipant.id)
                }

                closeParticipantActionMenu()
              }}
            >
              <i className='tabler-certificate mr-2 text-lg' />
              Terbitkan sertifikat
            </MenuItem>
          )}

        <MenuItem
          onClick={() => {
            if (actionMenuParticipant) {
              openConfirmation('delete', actionMenuParticipant)
            }

            closeParticipantActionMenu()
          }}
          sx={{ color: 'error.main' }}
        >
          <i className='tabler-trash mr-2 text-lg' />
          Hapus data peserta
        </MenuItem>
      </Menu>

      {/* PARTICIPANT DETAILS DIALOG */}

      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>
          <Typography variant='h6' className='font-semibold'>
            Detail Peserta
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Informasi peserta, nilai akhir, dan status evaluasi.
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {selectedParticipant && (
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Box className='flex items-center gap-3'>
                <Avatar
                  src={selectedParticipant.avatarUrl}
                  alt={selectedParticipant.name}
                  sx={{ width: 68, height: 68 }}
                />

                <Box className='min-w-0'>
                  <Typography variant='h6' className='font-semibold'>
                    {selectedParticipant.name}
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    {selectedParticipant.id}
                  </Typography>

                  <Chip
                    size='small'
                    color={getCertificateStatusColor(
                      getParticipantStatus(selectedParticipant)
                    )}
                    variant='tonal'
                    label={getCertificateStatusLabel(
                      getParticipantStatus(selectedParticipant)
                    )}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Divider />

              <DetailRow
                label='Email'
                value={selectedParticipant.email}
              />

              <DetailRow
                label='Nomor telepon'
                value={selectedParticipant.phone}
              />

              <DetailRow
                label='Instansi'
                value={selectedParticipant.institution}
              />

              <DetailRow
                label='Kode pelatihan'
                value={trainingCode}
              />

              <DetailRow
                label='Nilai akhir'
                value={
                  selectedParticipant.finalScore === null
                    ? 'Belum dinilai'
                    : `${selectedParticipant.finalScore} / 100 · Predikat ${getGrade(selectedParticipant.finalScore)}`
                }
              />

              <DetailRow
                label='Pengisian evaluasi'
                value={
                  selectedParticipant.evaluationSubmitted
                    ? 'Sudah diisi'
                    : 'Belum diisi'
                }
              />

              <DetailRow
                label='Pengisian review'
                value={
                  selectedParticipant.reviewSubmitted
                    ? 'Sudah diisi'
                    : 'Belum diisi'
                }
              />

              <DetailRow
                label='Nomor sertifikat'
                value={
                  selectedParticipant.certificateNumber || 'Belum diterbitkan'
                }
              />

              <DetailRow
                label='Tanggal penerbitan'
                value={formatDateTime(selectedParticipant.issuedAt)}
              />

              {selectedParticipant.notes && (
                <Box className='rounded-lg bg-action-hover p-3'>
                  <Typography variant='body2' className='font-medium'>
                    Catatan administrator
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    className='mt-1'
                  >
                    {selectedParticipant.notes}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions className='px-6 pb-4'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => setDetailsDialogOpen(false)}
          >
            Tutup
          </Button>

          {selectedParticipant && (
            <Button
              variant='contained'
              startIcon={<i className='tabler-edit' />}
              onClick={() => {
                setDetailsDialogOpen(false)
                openParticipantEditor(selectedParticipant)
              }}
            >
              Ubah data
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* EDIT PARTICIPANT DIALOG */}

      <Dialog
        open={participantDialogOpen}
        onClose={() => setParticipantDialogOpen(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>
          <Typography variant='h6' className='font-semibold'>
            Ubah Data Peserta
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Perbarui informasi, nilai akhir, serta status evaluasi peserta.
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {participantDraft && (
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Box className='flex items-center gap-3'>
                <Avatar
                  src={participantDraft.avatarUrl}
                  alt={participantDraft.name}
                  sx={{ width: 58, height: 58 }}
                />

                <Box>
                  <Typography variant='body2' className='font-medium'>
                    ID Peserta: {participantDraft.id}
                  </Typography>

                  <Typography variant='caption' color='text.secondary'>
                    ID peserta tidak dapat diubah.
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label='Nama lengkap'
                value={participantDraft.name}
                onChange={event =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, name: event.target.value }
                      : current
                  )
                }
                required
              />

              <TextField
                fullWidth
                label='Email'
                type='email'
                value={participantDraft.email}
                onChange={event =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, email: event.target.value }
                      : current
                  )
                }
                required
              />

              <TextField
                fullWidth
                label='Nomor telepon'
                value={participantDraft.phone}
                onChange={event =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, phone: event.target.value }
                      : current
                  )
                }
              />

              <TextField
                fullWidth
                label='Instansi'
                value={participantDraft.institution}
                onChange={event =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, institution: event.target.value }
                      : current
                  )
                }
                required
              />

              <TextField
                fullWidth
                label='URL foto profil'
                value={participantDraft.avatarUrl}
                onChange={event =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, avatarUrl: event.target.value }
                      : current
                  )
                }
              />

              <Divider />

              <Typography variant='subtitle2' className='font-semibold'>
                Penilaian Akhir
              </Typography>

              <TextField
                fullWidth
                type='number'
                label='Nilai akhir'
                value={participantDraft.finalScore ?? ''}
                onChange={event => {
                  const rawValue = event.target.value
                  const score = rawValue === '' ? null : Number(rawValue)

                  if (
                    score !== null &&
                    (!Number.isFinite(score) || score < 0 || score > 100)
                  ) {
                    return
                  }

                  setParticipantDraft(current =>
                    current
                      ? { ...current, finalScore: score }
                      : current
                  )
                }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                    step: 1
                  }
                }}
                helperText={
                  participantDraft.finalScore === null
                    ? 'Nilai belum diberikan.'
                    : `Predikat saat ini: ${getGrade(participantDraft.finalScore)}`
                }
              />

              <Divider />

              <Typography variant='subtitle2' className='font-semibold'>
                Status Evaluasi Peserta
              </Typography>

              <ProgressCheckbox
                label='Evaluasi akhir sudah diisi'
                checked={participantDraft.evaluationSubmitted}
                onChange={checked =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, evaluationSubmitted: checked }
                      : current
                  )
                }
              />

              <ProgressCheckbox
                label='Review pelatihan sudah diisi'
                checked={participantDraft.reviewSubmitted}
                onChange={checked =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, reviewSubmitted: checked }
                      : current
                  )
                }
              />

              <TextField
                fullWidth
                multiline
                minRows={2}
                label='Catatan administrator'
                value={participantDraft.notes}
                onChange={event =>
                  setParticipantDraft(current =>
                    current
                      ? { ...current, notes: event.target.value }
                      : current
                  )
                }
                placeholder='Tambahkan catatan jika diperlukan...'
              />

              {participantDraft.status === 'issued' && (
                <Box className='rounded-lg border border-warning/30 bg-warningLight p-3'>
                  <Typography variant='body2' className='font-medium'>
                    Sertifikat telah diterbitkan
                  </Typography>

                  <Typography variant='caption' color='text.secondary'>
                    Perubahan nilai atau evaluasi tidak otomatis membatalkan
                    sertifikat yang sudah diterbitkan.
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>

        <Divider />

        <DialogActions className='px-6 py-4'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => setParticipantDialogOpen(false)}
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={saveParticipant}
            disabled={
              !participantDraft?.name.trim() ||
              !participantDraft?.email.trim() ||
              !participantDraft?.institution.trim()
            }
          >
            Simpan perubahan
          </Button>
        </DialogActions>
      </Dialog>

      {/* ISSUER EDIT DIALOG */}

      <Dialog
        open={issuerDialogOpen}
        onClose={() => setIssuerDialogOpen(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>
          <Typography variant='h6' className='font-semibold'>
            Ubah Identitas Penerbit
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            Perbarui informasi pejabat yang tercantum pada sertifikat.
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <Box className='flex items-center gap-3'>
              <Avatar
                src={issuerDraft.avatarUrl}
                alt={issuerDraft.name}
                sx={{ width: 60, height: 60 }}
              />

              <Box>
                <Typography variant='body2' className='font-medium'>
                  ID Pejabat: {issuerDraft.id}
                </Typography>

                <Typography variant='caption' color='text.secondary'>
                  ID pejabat tidak dapat diubah.
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label='Nama pejabat'
              value={issuerDraft.name}
              onChange={event =>
                setIssuerDraft(current => ({
                  ...current,
                  name: event.target.value
                }))
              }
              required
            />

            <TextField
              fullWidth
              label='Jabatan'
              value={issuerDraft.position}
              onChange={event =>
                setIssuerDraft(current => ({
                  ...current,
                  position: event.target.value
                }))
              }
              required
            />

            <TextField
              fullWidth
              label='URL foto profil'
              value={issuerDraft.avatarUrl}
              onChange={event =>
                setIssuerDraft(current => ({
                  ...current,
                  avatarUrl: event.target.value
                }))
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions className='px-6 pb-4'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => setIssuerDialogOpen(false)}
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={saveIssuer}
            disabled={!issuerDraft.name.trim() || !issuerDraft.position.trim()}
          >
            Simpan perubahan
          </Button>
        </DialogActions>
      </Dialog>

      {/* ADMIN CONFIRMATION DIALOG */}

      <Dialog
        open={Boolean(confirmationAction)}
        onClose={() => setConfirmationAction(null)}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>
          {confirmationAction?.type === 'delete'
            ? 'Hapus Data Peserta?'
            : 'Batalkan Sertifikat?'}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {confirmationAction?.type === 'delete'
              ? `Data ${confirmationAction.participant.name} akan dihapus dari daftar peserta. Tindakan ini tidak dapat dibatalkan.`
              : `Sertifikat ${confirmationAction?.participant.certificateNumber} milik ${confirmationAction?.participant.name} akan dibatalkan. Sertifikat dapat diterbitkan kembali jika persyaratan terpenuhi.`}
          </DialogContentText>
        </DialogContent>

        <DialogActions className='px-6 pb-4'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => setConfirmationAction(null)}
          >
            Batal
          </Button>

          <Button
            variant='contained'
            color='error'
            onClick={confirmAdministrativeAction}
          >
            {confirmationAction?.type === 'delete'
              ? 'Ya, hapus data'
              : 'Ya, batalkan sertifikat'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PRINTABLE CERTIFICATE */}

      <Box className='certificate-print-area'>
        {selectedCertificate && selectedIssuer && (
          <Box className='certificate-paper'>
            <Box className='certificate-inner'>
              <Typography className='certificate-kicker'>
                DINAS KOPERASI DAN UKM KOTA BANJARBARU
              </Typography>

              <Typography className='certificate-title'>
                SERTIFIKAT PELATIHAN
              </Typography>

              <Typography className='certificate-subtitle'>
                DIBERIKAN KEPADA
              </Typography>

              <Typography className='certificate-name'>
                {selectedCertificate.name}
              </Typography>

              <Typography className='certificate-description'>
                Atas partisipasi dalam program pelatihan
              </Typography>

              <Typography className='certificate-training'>
                {trainingTitle}
              </Typography>

              <Typography className='certificate-description'>
                Kode pelatihan: {trainingCode}
              </Typography>

              <Box className='certificate-signature'>
                <Typography variant='body2'>
                  Banjarbaru, {formatDate(selectedCertificate.issuedAt)}
                </Typography>

                <Avatar
                  src={selectedIssuer.avatarUrl}
                  alt={selectedIssuer.name}
                  sx={{ width: 56, height: 56, mx: 'auto', my: 1 }}
                />

                <Typography variant='body1' className='font-semibold'>
                  {selectedIssuer.name}
                </Typography>

                <Typography variant='body2'>
                  {selectedIssuer.position}
                </Typography>
              </Box>

              <Typography className='certificate-number'>
                Nomor sertifikat: {selectedCertificate.certificateNumber}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* PROTOTYPE NOTICE */}

      <Box className='flex items-start gap-2 rounded-xl border border-info/20 bg-infoLight p-4'>
        <i className='tabler-info-circle mt-0.5 text-xl text-info' />

        <Box>
          <Typography variant='body2' className='font-medium'>
            Mode demonstrasi
          </Typography>

          <Typography variant='caption' color='text.secondary'>
            Seluruh data merupakan data contoh yang tersimpan sementara di
            frontend. Perubahan akan direset saat halaman dimuat ulang. Belum
            ada integrasi database maupun backend.
          </Typography>
        </Box>
      </Box>

      {/* PRINT STYLES */}

      <style jsx global>{`
        .certificate-print-area {
          display: none;
        }

        @media print {
          @page {
            size: landscape;
            margin: 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          .certificate-print-area,
          .certificate-print-area * {
            visibility: visible !important;
          }

          .certificate-print-area {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
          }

          .certificate-paper {
            display: flex;
            width: 100%;
            min-height: 175mm;
            box-sizing: border-box;
            padding: 12mm;
            border: 5px double #199e95;
            color: #243047;
            background: white;
          }

          .certificate-inner {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 12mm;
            border: 1px solid #c8e5e2;
            text-align: center;
          }

          .certificate-kicker {
            color: #199e95;
            letter-spacing: 0.2em;
            font-size: 12px;
          }

          .certificate-title {
            margin-top: 12px;
            font-size: 34px;
            font-weight: 800;
            letter-spacing: 0.1em;
          }

          .certificate-subtitle {
            margin-top: 20px;
            font-size: 12px;
            letter-spacing: 0.2em;
          }

          .certificate-name {
            margin-top: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #199e95;
            font-size: 30px;
            font-weight: 700;
          }

          .certificate-description {
            margin-top: 16px;
            font-size: 14px;
          }

          .certificate-training {
            margin-top: 8px;
            font-size: 22px;
            font-weight: 700;
          }

          .certificate-signature {
            margin-top: 22px;
            min-width: 220px;
          }

          .certificate-number {
            margin-top: 20px;
            font-size: 12px;
          }
        }
      `}</style>
    </Box>
  )
}

/* =========================================================
   STATISTIC CARD
========================================================= */

function StatCard({
                    title,
                    value,
                    icon,
                    color,
                    description
                  }: {
  title: string
  value: number
  icon: string
  color: 'primary' | 'info' | 'success' | 'warning'
  description: string
}) {
  const colorClasses = {
    primary: 'bg-primaryLight text-primary',
    info: 'bg-infoLight text-info',
    success: 'bg-successLight text-success',
    warning: 'bg-warningLight text-warning'
  }

  return (
    <Card>
      <CardContent className='flex items-center justify-between gap-3 p-5'>
        <Box className='min-w-0'>
          <Typography variant='body2' color='text.secondary'>
            {title}
          </Typography>

          <Typography variant='h4' className='mt-2 font-semibold'>
            {value}
          </Typography>

          <Typography
            variant='caption'
            color='text.secondary'
            className='mt-1 block'
          >
            {description}
          </Typography>
        </Box>

        <Avatar
          variant='rounded'
          className={`bs-12 is-12 ${colorClasses[color]}`}
        >
          <i className={`${icon} text-2xl`} />
        </Avatar>
      </CardContent>
    </Card>
  )
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
                     label,
                     value
                   }: {
  label: string
  value: string
}) {
  return (
    <Box className='flex flex-col gap-1 sm:flex-row sm:items-start'>
      <Typography
        variant='body2'
        color='text.secondary'
        className='sm:w-40 sm:shrink-0'
      >
        {label}
      </Typography>

      <Typography variant='body2' className='font-medium'>
        {value}
      </Typography>
    </Box>
  )
}

/* =========================================================
   EVALUATION STATUS CHECKBOX
========================================================= */

function ProgressCheckbox({
                            label,
                            checked,
                            onChange
                          }: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <Box
      className='flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-divider p-3'
      onClick={() => onChange(!checked)}
      role='button'
      tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onChange(!checked)
        }
      }}
    >
      <Typography variant='body2'>{label}</Typography>

      <Chip
        size='small'
        color={checked ? 'success' : 'warning'}
        variant='tonal'
        icon={
          <i
            className={
              checked ? 'tabler-check text-sm' : 'tabler-clock text-sm'
            }
          />
        }
        label={checked ? 'Sudah diisi' : 'Belum diisi'}
      />
    </Box>
  )
}
