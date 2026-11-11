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

type ContactData = EmployeeRecord & {
  address?: string | null
  district?: string | null
  city?: string | null
  province?: string | null
  postalCode?: string | null
}

const maskEmail = (email?: string | null) => {
  if (!email) return 'Belum diisi'

  const [username, domain] = email.split('@')

  if (!domain) return '••••••••'

  return `${username.slice(0, 2)}${'•'.repeat(Math.min(Math.max(username.length - 2, 3), 8))}@${domain}`
}

const maskPhone = (phone?: string | null) => {
  if (!phone) return 'Belum diisi'

  if (phone.length <= 7) return '••••••••'

  return `${phone.slice(0, 5)}${'•'.repeat(Math.min(phone.length - 8, 8))}${phone.slice(-3)}`
}

const maskAddress = (address?: string | null) => {
  if (!address) return 'Belum diisi'

  const words = address.trim().split(/\s+/)

  if (words.length <= 2) return 'Alamat disamarkan'

  return `${words.slice(0, 2).join(' ')} ••••••••`
}

const ContactItem = ({
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

const ContactInformation = ({ employeeId }: Props) => {
  const [showSensitive, setShowSensitive] = useState(false)

  // Hubungkan ke data pegawai dari database/API.
  // Field alamat perlu tersedia di tipe atau relasi profil pegawai.
  const contactData: ContactData | undefined = undefined

  const contact =
    contactData?.id?.toString() === employeeId ? contactData : undefined

  return (
    <Card>
      <CardContent className='flex flex-col gap-7'>
        {/* HEADER */}
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='info'
              size={50}
            >
              <i className='tabler-address-book text-[1.5rem]' />
            </CustomAvatar>

            <div className='flex flex-col gap-1'>
              <Typography variant='h5'>Kontak & Alamat</Typography>

              <Typography variant='body2' color='text.secondary'>
                Informasi komunikasi dan domisili pegawai.
              </Typography>
            </div>
          </div>

          <Chip
            size='small'
            variant='tonal'
            color='info'
            icon={<i className='tabler-shield-lock' />}
            label='Data Pribadi'
          />
        </div>

        {/* PRIVACY TOOLBAR */}
        <div className='rounded-lg border border-divider bg-actionHover p-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='flex bs-9 is-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                <i className='tabler-lock text-primary' />
              </div>

              <div className='flex flex-col gap-0.5'>
                <Typography variant='body2' className='font-medium'>
                  Informasi kontak dilindungi
                </Typography>

                <Typography variant='caption' color='text.secondary'>
                  Data sensitif disamarkan secara default.
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
              onClick={() => setShowSensitive(previous => !previous)}
            >
              {showSensitive ? 'Sembunyikan' : 'Tampilkan'}
            </Button>
          </div>
        </div>

        {/* INFORMASI KONTAK */}
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-2'>
            <div className='flex bs-8 is-8 items-center justify-center rounded-md bg-info/10'>
              <i className='tabler-phone text-sm text-info' />
            </div>

            <Typography variant='body1' className='font-medium'>
              Informasi Kontak
            </Typography>
          </div>

          <Divider />

          <div className='grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2'>
            <ContactItem
              icon='tabler-mail'
              label='Email'
              color='primary'
              value={
                contact?.email
                  ? showSensitive
                    ? contact.email
                    : maskEmail(contact.email)
                  : undefined
              }
            />

            <ContactItem
              icon='tabler-device-mobile'
              label='Nomor HP'
              color='success'
              value={
                contact?.phone
                  ? showSensitive
                    ? contact.phone
                    : maskPhone(contact.phone)
                  : undefined
              }
            />

            <div className='sm:col-span-2'>
              <ContactItem
                icon='tabler-map-pin'
                label='Alamat Lengkap'
                color='warning'
                value={
                  contact?.address
                    ? showSensitive
                      ? contact.address
                      : maskAddress(contact.address)
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        {/* DOMISILI */}
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-2'>
            <div className='flex bs-8 is-8 items-center justify-center rounded-md bg-success/10'>
              <i className='tabler-map text-sm text-success' />
            </div>

            <Typography variant='body1' className='font-medium'>
              Domisili
            </Typography>
          </div>

          <Divider />

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='flex flex-col gap-1'>
              <Typography variant='caption' color='text.secondary'>
                Kecamatan
              </Typography>

              <Typography variant='body2' className='font-medium'>
                {contact?.district || 'Belum diisi'}
              </Typography>
            </div>

            <div className='flex flex-col gap-1'>
              <Typography variant='caption' color='text.secondary'>
                Kota / Kabupaten
              </Typography>

              <Typography variant='body2' className='font-medium'>
                {contact?.city || 'Belum diisi'}
              </Typography>
            </div>

            <div className='flex flex-col gap-1'>
              <Typography variant='caption' color='text.secondary'>
                Provinsi
              </Typography>

              <Typography variant='body2' className='font-medium'>
                {contact?.province || 'Belum diisi'}
              </Typography>
            </div>

            <div className='flex flex-col gap-1'>
              <Typography variant='caption' color='text.secondary'>
                Kode Pos
              </Typography>

              <Typography variant='body2' className='font-medium'>
                {contact?.postalCode || 'Belum diisi'}
              </Typography>
            </div>
          </div>
        </div>

        {/* PRIVACY FOOTER */}
        <Divider />

        <div className='flex items-start gap-3'>
          <i className='tabler-info-circle text-lg text-textSecondary' />

          <Typography variant='caption' color='text.secondary'>
            Data kontak dan alamat merupakan informasi pribadi pegawai.
            Akses terhadap data lengkap harus mengikuti hak akses pengguna.
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContactInformation
