'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Type Imports
import type { EmployeeRecord } from '../../all/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

type Props = {
  employeeData?: EmployeeRecord
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Belum diatur'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Belum diatur'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const getEmployeeType = (type?: string | null) => {
  switch (type) {
    case 'internal':
      return { label: 'Internal', color: 'primary' as const }
    case 'contract':
      return { label: 'Kontrak', color: 'warning' as const }
    case 'internship':
      return { label: 'Magang', color: 'info' as const }
    default:
      return { label: 'Belum diatur', color: 'secondary' as const }
  }
}

const getStatus = (status?: string | null) => {
  switch (status) {
    case 'Aktif':
      return { label: 'Aktif', color: 'success' as const }
    case 'Nonaktif':
      return { label: 'Nonaktif', color: 'secondary' as const }
    case 'Menunggu Aktivasi':
      return { label: 'Menunggu Aktivasi', color: 'warning' as const }
    default:
      return { label: 'Belum diatur', color: 'secondary' as const }
  }
}

const getDuration = (start?: string | null, end?: string | null) => {
  if (!start) return 'Belum tercatat'

  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return 'Belum tercatat'
  }

  if (endDate < startDate) return 'Belum dimulai'

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth()

  if (endDate.getDate() < startDate.getDate()) months--

  if (months < 0) return 'Belum dimulai'

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0 && remainingMonths === 0) return 'Kurang dari 1 bulan'

  return [
    years > 0 ? `${years} tahun` : '',
    remainingMonths > 0 ? `${remainingMonths} bulan` : ''
  ]
    .filter(Boolean)
    .join(' ')
}

const DetailRow = ({
  label,
  value
}: {
  label: string
  value?: string | null
}) => (
  <div className='flex items-start justify-between gap-4'>
    <Typography variant='body2' color='text.secondary'>
      {label}
    </Typography>

    <Typography
      variant='body2'
      className='text-end font-medium'
      sx={{ overflowWrap: 'anywhere' }}
    >
      {value?.trim() || 'Belum diisi'}
    </Typography>
  </div>
)

const EmployeeDetails = ({ employeeData }: Props) => {
  const name = employeeData?.name?.trim() || 'Nama belum diatur'

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  const employeeType = getEmployeeType(employeeData?.employeeType)
  const status = getStatus(employeeData?.status)

  const duration = getDuration(
    employeeData?.employmentStartDate,
    employeeData?.employmentEndDate
  )

  const employmentEndDate = employeeData?.employmentEndDate
    ? new Date(employeeData.employmentEndDate)
    : null

  const daysRemaining =
    employmentEndDate && !Number.isNaN(employmentEndDate.getTime())
      ? Math.ceil(
          (new Date(
            employmentEndDate.getFullYear(),
            employmentEndDate.getMonth(),
            employmentEndDate.getDate()
          ).getTime() -
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            ).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null

  return (
    <Card>
      <CardContent className='flex flex-col gap-7 pbs-10'>
        {/* PROFILE */}
        <div className='flex flex-col items-center gap-5'>
          <div className='relative'>
            <div className='absolute -inset-3 rounded-full bg-primary/15 blur-xl' />

            {employeeData?.avatar ? (
              <CustomAvatar
                src={employeeData.avatar}
                variant='rounded'
                alt={name}
                size={116}
                className='relative rounded-2xl shadow-lg ring-4 ring-background'
              />
            ) : (
              <div className='relative flex h-[116px] w-[116px] items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-background shadow-lg ring-4 ring-background'>
                <div className='absolute -right-5 -top-5 h-16 w-16 rounded-full bg-primary/15 blur-md' />
                <div className='absolute -bottom-6 -left-4 h-16 w-16 rounded-full bg-primary/10 blur-md' />

                <span className='relative select-none text-4xl font-bold tracking-wide text-primary'>
                  {initials || 'P'}
                </span>

                <div className='absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg border border-primary/10 bg-background/80 shadow-sm'>
                  <i className='tabler-user text-sm text-primary' />
                </div>
              </div>
            )}
          </div>

          <div className='flex flex-col items-center gap-1.5 text-center'>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <Typography variant='h5'>{name}</Typography>

              <Chip
                label={status.label}
                variant='tonal'
                color={status.color}
                size='small'
              />
            </div>

            <Typography variant='body2' color='text.secondary'>
              {employeeData?.username
                ? `@${employeeData.username.replace(/^@/, '')}`
                : 'Username belum diatur'}
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              {employeeData?.position || 'Jabatan belum diatur'}
            </Typography>

            <Typography
              variant='caption'
              color='text.disabled'
              className='mbe-1'
            >
              ID Pegawai #{employeeData?.id ?? '-'}
            </Typography>
          </div>
        </div>

        {/* QUICK STATISTICS */}
        <div className='grid grid-cols-3 overflow-hidden rounded-lg border border-divider'>
          <div className='flex flex-col items-center gap-2 p-3'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='primary'
              size={38}
            >
              <i className='tabler-calendar-check text-lg' />
            </CustomAvatar>

            <div className='flex flex-col items-center text-center'>
              <Typography variant='subtitle1' fontWeight={600}>
                {duration === 'Belum tercatat' ? '-' : duration}
              </Typography>

              <Typography variant='caption' color='text.secondary'>
                Masa Kerja
              </Typography>
            </div>
          </div>

          <div className='flex flex-col items-center gap-2 border-is border-divider p-3'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='info'
              size={38}
            >
              <i className='tabler-id text-lg' />
            </CustomAvatar>

            <div className='flex flex-col items-center text-center'>
              <Typography variant='subtitle1' fontWeight={600}>
                {employeeData?.nip ? 'Ada' : '—'}
              </Typography>

              <Typography variant='caption' color='text.secondary'>
                NIP
              </Typography>
            </div>
          </div>

          <div className='flex flex-col items-center gap-2 border-is border-divider p-3'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color={employeeType.color}
              size={38}
            >
              <i className='tabler-briefcase text-lg' />
            </CustomAvatar>

            <div className='flex flex-col items-center text-center'>
              <Typography variant='subtitle1' fontWeight={600}>
                {employeeType.label}
              </Typography>

              <Typography variant='caption' color='text.secondary'>
                Tipe
              </Typography>
            </div>
          </div>
        </div>

        {/* DETAIL PEGAWAI */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <Typography variant='h6'>Detail Pegawai</Typography>
            <i className='tabler-user text-textSecondary' />
          </div>

          <Divider />

          <div className='flex flex-col gap-3'>
            <DetailRow label='Username' value={employeeData?.username} />
            <DetailRow label='Jabatan' value={employeeData?.position} />
            <DetailRow label='NIP' value={employeeData?.nip} />
            <DetailRow label='NIK' value={employeeData?.nik} />

            <div className='flex items-center justify-between gap-4'>
              <Typography variant='body2' color='text.secondary'>
                Status Akun
              </Typography>

              <Chip
                label={status.label}
                variant='tonal'
                color={status.color}
                size='small'
              />
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='h6'>Kontak</Typography>

              <Typography variant='caption' color='text.secondary'>
                Informasi komunikasi pegawai
              </Typography>
            </div>

            <i className='tabler-address-book text-textSecondary' />
          </div>

          <Divider />

          <div className='flex flex-col gap-3'>
            <DetailRow label='Email' value={employeeData?.email} />
            <DetailRow label='Nomor Telepon' value={employeeData?.phone} />
          </div>
        </div>

        {/* EDUCATION */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='h6'>Pendidikan</Typography>

              <Typography variant='caption' color='text.secondary'>
                Latar belakang pendidikan terakhir
              </Typography>
            </div>

            <i className='tabler-school text-textSecondary' />
          </div>

          <Divider />

          <div className='flex flex-col gap-3'>
            <DetailRow
              label='Pendidikan Terakhir'
              value={employeeData?.education}
            />
            <DetailRow
              label='Institusi Pendidikan'
              value={employeeData?.institution}
            />
          </div>
        </div>

        {/* KETERIKATAN KERJA */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <Typography variant='h6'>Keterikatan Kerja</Typography>

              <Typography variant='caption' color='text.secondary'>
                Periode dan jenis hubungan kerja
              </Typography>
            </div>

            <div className='flex bs-9 is-9 items-center justify-center rounded-lg bg-primary/10'>
              <i className='tabler-briefcase text-primary' />
            </div>
          </div>

          <Divider />

          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between gap-4'>
              <Typography variant='body2' color='text.secondary'>
                Jenis Keterikatan
              </Typography>

              <Chip
                label={employeeType.label}
                size='small'
                variant='tonal'
                color={employeeType.color}
              />
            </div>

            <DetailRow
              label='Tanggal Mulai'
              value={formatDate(employeeData?.employmentStartDate)}
            />

            <DetailRow
              label='Tanggal Berakhir'
              value={formatDate(employeeData?.employmentEndDate)}
            />

            <div className='flex items-center justify-between gap-4'>
              <Typography variant='body2' color='text.secondary'>
                Sisa Masa Kerja
              </Typography>

              <Typography
                variant='body2'
                fontWeight={500}
                color={
                  daysRemaining !== null && daysRemaining < 0
                    ? 'error.main'
                    : daysRemaining !== null && daysRemaining <= 30
                      ? 'warning.main'
                      : 'text.primary'
                }
              >
                {daysRemaining === null
                  ? 'Tidak ditentukan'
                  : daysRemaining < 0
                    ? `Berakhir ${Math.abs(daysRemaining)} hari lalu`
                    : daysRemaining === 0
                      ? 'Berakhir hari ini'
                      : `${daysRemaining} hari`}
              </Typography>
            </div>
          </div>
        </div>

        {/* INFORMASI SISTEM */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='h6'>Informasi Sistem</Typography>

              <Typography variant='caption' color='text.secondary'>
                Riwayat pencatatan data pegawai
              </Typography>
            </div>

            <i className='tabler-settings text-textSecondary' />
          </div>

          <Divider />

          <div className='flex flex-col gap-3'>
            <DetailRow
              label='Tanggal Dibuat'
              value={formatDate(employeeData?.createdAt)}
            />

            <DetailRow
              label='Terakhir Diperbarui'
              value={formatDate(employeeData?.updatedAt)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployeeDetails
