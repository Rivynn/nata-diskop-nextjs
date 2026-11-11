'use client'

import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import CustomAvatar from '@core/components/mui/Avatar'

import type { EmployeeRecord } from '../../../all/types'

type Props = {
  employeeId: string
}

const maskValue = (value?: string | null) => {
  if (!value) return 'Belum diisi'
  if (value.length <= 4) return '•'.repeat(value.length)

  return `${value.slice(0, 4)}${'•'.repeat(Math.min(value.length - 4, 12))}`
}

const DetailItem = ({
                      icon,
                      label,
                      value,
                      color = 'primary'
                    }: {
  icon: string
  label: string
  value?: string | null
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info'
}) => (
  <div className='flex min-w-0 items-start gap-3'>
    <CustomAvatar
      variant='rounded'
      skin='light'
      color={color}
      size={38}
    >
      <i className={`${icon} text-lg`} />
    </CustomAvatar>

    <div className='flex min-w-0 flex-col'>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>

      <Typography
        variant='body2'
        className='mt-0.5 font-medium'
        sx={{ overflowWrap: 'anywhere' }}
      >
        {value?.trim() || 'Belum diisi'}
      </Typography>
    </div>
  </div>
)

const PersonalInformation = ({ employeeId }: Props) => {
  const [showSensitive, setShowSensitive] = useState(false)

  // Hubungkan ke sumber data pegawai berdasarkan employeeId.
  // Jangan mengisi identitas menggunakan data contoh yang tidak nyata.
  const personal: EmployeeRecord | undefined = undefined

  const employee = personal?.id?.toString() === employeeId
    ? personal
    : undefined

  const toggleSensitive = () => setShowSensitive(previous => !previous)

  return (
    <Card>
      <CardContent className='flex flex-col gap-7'>
        {/* HEADER */}
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='primary'
              size={50}
            >
              <i className='tabler-id-badge text-[1.5rem]' />
            </CustomAvatar>

            <div className='flex flex-col gap-1'>
              <Typography variant='h5'>
                Informasi Identitas
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                Informasi pribadi dan identitas resmi pegawai.
              </Typography>
            </div>
          </div>

          <Chip
            size='small'
            variant='tonal'
            color='secondary'
            icon={<i className='tabler-clock' />}
            label='Belum diverifikasi'
          />
        </div>

        {/* PRIVACY TOOLBAR */}
        <div className='rounded-lg border border-divider bg-actionHover p-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='flex bs-9 is-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                <i className='tabler-shield-lock text-primary' />
              </div>

              <div className='flex flex-col gap-0.5'>
                <Typography variant='body2' className='font-medium'>
                  Data identitas dilindungi
                </Typography>

                <Typography variant='caption' color='text.secondary'>
                  NIK disamarkan saat halaman pertama kali dibuka.
                </Typography>
              </div>
            </div>

            <Button
              size='small'
              variant='tonal'
              color={showSensitive ? 'secondary' : 'primary'}
              startIcon={
                <i className={showSensitive ? 'tabler-eye-off' : 'tabler-eye'} />
              }
              onClick={toggleSensitive}
            >
              {showSensitive ? 'Sembunyikan' : 'Tampilkan NIK'}
            </Button>
          </div>
        </div>

        {/* IDENTITAS DASAR */}
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-2'>
            <div className='flex bs-8 is-8 items-center justify-center rounded-md bg-primary/10'>
              <i className='tabler-user text-sm text-primary' />
            </div>

            <Typography variant='body1' className='font-medium'>
              Identitas Dasar
            </Typography>
          </div>

          <Divider />

          <div className='grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <DetailItem
                icon='tabler-user'
                label='Nama Lengkap'
                value={employee?.name}
              />
            </div>

            <DetailItem
              icon='tabler-id'
              label='NIK'
              color='warning'
              value={
                employee?.nik
                  ? showSensitive
                    ? employee.nik
                    : maskValue(employee.nik)
                  : undefined
              }
            />

            <DetailItem
              icon='tabler-id-badge-2'
              label='NIP'
              color='info'
              value={employee?.nip}
            />

            <DetailItem
              icon='tabler-at'
              label='Username'
              value={employee?.username}
            />

            <DetailItem
              icon='tabler-briefcase'
              label='Jabatan'
              color='success'
              value={employee?.position}
            />

            <DetailItem
              icon='tabler-fingerprint'
              label='ID Pegawai'
              value={employee?.employeeId}
            />
          </div>
        </div>

        {/* PRIVACY NOTICE */}
        <div className='rounded-lg border border-info/20 bg-info/5 p-4'>
          <div className='flex items-start gap-3'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='info'
              size={38}
            >
              <i className='tabler-shield-check' />
            </CustomAvatar>

            <div className='flex flex-col gap-1'>
              <Typography variant='body2' className='font-medium'>
                Perlindungan Data Pegawai
              </Typography>

              <Typography variant='caption' color='text.secondary'>
                Informasi identitas hanya boleh diakses oleh pengguna yang
                memiliki izin. Data NIK ditampilkan secara terbatas untuk
                mengurangi risiko penyalahgunaan informasi pribadi.
              </Typography>
            </div>
          </div>
        </div>

        <Divider />

        <div className='flex items-start gap-2'>
          <i className='tabler-info-circle text-lg text-textSecondary' />

          <Typography variant='caption' color='text.secondary'>
            Data identitas ditampilkan berdasarkan catatan pegawai yang
            tersedia di sistem. Informasi yang belum tercatat akan ditandai
            sebagai belum diisi.
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default PersonalInformation
