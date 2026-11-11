'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const ContactInformation = () => {
  const [showSensitive, setShowSensitive] = useState(false)

  const contact = {
    email: 'ahmad.fauzan@example.com',
    phone: '+62 851 3637 3842',
    address:
      'Jl. A. Yani No. 45, Kelurahan Loktabat Selatan, Kecamatan Banjarbaru Selatan',
    city: 'Kota Banjarbaru',
    district: 'Banjarbaru Selatan',
    province: 'Kalimantan Selatan',
    postalCode: '70714'
  }

  const maskedEmail = 'ahm•••n@example.com'
  const maskedPhone = '+62 851 •••• 3842'
  const maskedAddress =
    'Jl. A. Yani No. ••, Kelurahan Loktabat Selatan, Kecamatan Banjarbaru Selatan'

  return (
    <Card>
      <CardContent className='flex flex-col gap-7'>

        {/* Header */}
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
              <Typography variant='h5'>
                Kontak & Alamat
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Informasi komunikasi dan domisili pelatih.
              </Typography>
            </div>
          </div>

          <Chip
            size='small'
            variant='tonal'
            color='success'
            icon={<i className='tabler-shield-check' />}
            label='Terlindungi'
          />
        </div>

        {/* Security Toolbar */}
        <div className='rounded-lg border border-divider bg-actionHover p-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='flex bs-9 is-9 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                <i className='tabler-lock text-primary' />
              </div>

              <div className='flex flex-col gap-0.5'>
                <Typography
                  variant='body2'
                  className='font-medium'
                >
                  Informasi sensitif
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Data kontak disamarkan secara default.
                </Typography>
              </div>
            </div>

            <Button
              size='small'
              variant='tonal'
              color={showSensitive ? 'secondary' : 'primary'}
              startIcon={
                <i
                  className={
                    showSensitive
                      ? 'tabler-eye-off'
                      : 'tabler-eye'
                  }
                />
              }
              onClick={() =>
                setShowSensitive(!showSensitive)
              }
            >
              {showSensitive
                ? 'Sembunyikan'
                : 'Tampilkan'}
            </Button>
          </div>
        </div>

        {/* Contact Section */}
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-2'>
            <div className='flex bs-8 is-8 items-center justify-center rounded-md bg-info/10'>
              <i className='tabler-phone text-info text-sm' />
            </div>

            <Typography
              variant='body1'
              className='font-medium'
            >
              Informasi Kontak
            </Typography>
          </div>

          <Divider />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6'>

            {/* Email */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='primary'
                size={38}
              >
                <i className='tabler-mail' />
              </CustomAvatar>

              <div className='flex flex-col min-is-0'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Email
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5 break-all'
                >
                  {showSensitive
                    ? contact.email
                    : maskedEmail}
                </Typography>
              </div>
            </div>

            {/* Phone */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='success'
                size={38}
              >
                <i className='tabler-device-mobile' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Nomor HP
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {showSensitive
                    ? contact.phone
                    : maskedPhone}
                </Typography>
              </div>
            </div>

            {/* Address */}
            <div className='sm:col-span-2 flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='warning'
                size={38}
              >
                <i className='tabler-map-pin' />
              </CustomAvatar>

              <div className='flex flex-col min-is-0'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Alamat
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {showSensitive
                    ? contact.address
                    : maskedAddress}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-2'>
            <div className='flex bs-8 is-8 items-center justify-center rounded-md bg-success/10'>
              <i className='tabler-map text-success text-sm' />
            </div>

            <Typography
              variant='body1'
              className='font-medium'
            >
              Domisili
            </Typography>
          </div>

          <Divider />

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            <div className='flex flex-col gap-1'>
              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kecamatan
              </Typography>

              <Typography
                variant='body2'
                className='font-medium'
              >
                {contact.district}
              </Typography>
            </div>

            <div className='flex flex-col gap-1'>
              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kota / Kabupaten
              </Typography>

              <Typography
                variant='body2'
                className='font-medium'
              >
                {contact.city}
              </Typography>
            </div>

            <div className='flex flex-col gap-1'>
              <Typography
                variant='caption'
                color='text.secondary'
              >
                Provinsi
              </Typography>

              <Typography
                variant='body2'
                className='font-medium'
              >
                {contact.province}
              </Typography>
            </div>

            <div className='flex flex-col gap-1'>
              <Typography
                variant='caption'
                color='text.secondary'
              >
                Kode Pos
              </Typography>

              <Typography
                variant='body2'
                className='font-medium'
              >
                {contact.postalCode}
              </Typography>
            </div>
          </div>
        </div>

        {/* Privacy Footer */}
        <Divider />

        <div className='flex items-start gap-3'>
          <i className='tabler-info-circle text-textSecondary text-lg' />

          <Typography
            variant='caption'
            color='text.secondary'
          >
            Data kontak merupakan informasi pribadi.
            Penayangan data lengkap dibatasi berdasarkan
            hak akses pengguna.
          </Typography>
        </div>

      </CardContent>
    </Card>
  )
}

export default ContactInformation
