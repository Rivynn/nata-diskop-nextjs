'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const PersonalInformation = () => {
  const [showSensitive, setShowSensitive] = useState(false)

  const personal = {
    fullName: 'Ahmad Fauzan',
    nik: '6372011508950001',
    birthPlace: 'Banjarbaru',
    birthDate: '15 Mei 1995',
    gender: 'Laki-laki',
    nationality: 'Indonesia',
    maritalStatus: 'Menikah',
    religion: 'Islam',
    verificationStatus: 'verified'
  }

  const maskedNik = `${personal.nik.slice(0, 4)}••••••••${personal.nik.slice(-4)}`

  return (
    <Card>
      <CardContent className='flex flex-col gap-7'>

        {/* Header */}
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

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Informasi pribadi dan identitas resmi pelatih.
              </Typography>
            </div>
          </div>

          <Chip
            size='small'
            variant='tonal'
            color='success'
            icon={
              <i className='tabler-shield-check' />
            }
            label='Terverifikasi'
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
                  Data identitas terlindungi
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Informasi sensitif disamarkan secara default.
                </Typography>
              </div>
            </div>

            <Button
              size='small'
              variant='tonal'
              color={
                showSensitive
                  ? 'secondary'
                  : 'primary'
              }
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

        {/* Identity Section */}
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-2'>
            <div className='flex bs-8 is-8 items-center justify-center rounded-md bg-primary/10'>
              <i className='tabler-user text-primary text-sm' />
            </div>

            <Typography
              variant='body1'
              className='font-medium'
            >
              Identitas Dasar
            </Typography>
          </div>

          <Divider />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6'>

            {/* Full Name */}
            <div className='sm:col-span-2 flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='primary'
                size={38}
              >
                <i className='tabler-user' />
              </CustomAvatar>

              <div className='flex flex-col min-is-0'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Nama Lengkap
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {personal.fullName}
                </Typography>
              </div>
            </div>

            {/* NIK */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='warning'
                size={38}
              >
                <i className='tabler-id' />
              </CustomAvatar>

              <div className='flex flex-col min-is-0'>
                <div className='flex items-center gap-1'>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    NIK
                  </Typography>

                  <Tooltip
                    title={
                      showSensitive
                        ? 'Sembunyikan NIK'
                        : 'Tampilkan NIK'
                    }
                  >
                    <IconButton
                      size='small'
                      onClick={() =>
                        setShowSensitive(!showSensitive)
                      }
                      className='mli-1'
                    >
                      <i
                        className={
                          showSensitive
                            ? 'tabler-eye-off text-sm'
                            : 'tabler-eye text-sm'
                        }
                      />
                    </IconButton>
                  </Tooltip>
                </div>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {showSensitive
                    ? personal.nik
                    : maskedNik}
                </Typography>
              </div>
            </div>

            {/* Nationality */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='info'
                size={38}
              >
                <i className='tabler-world' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Kewarganegaraan
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {personal.nationality}
                </Typography>
              </div>
            </div>

            {/* Birth Place */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='success'
                size={38}
              >
                <i className='tabler-map-pin' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Tempat Lahir
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {personal.birthPlace}
                </Typography>
              </div>
            </div>

            {/* Birth Date */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='secondary'
                size={38}
              >
                <i className='tabler-calendar' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Tanggal Lahir
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {showSensitive
                    ? personal.birthDate
                    : '•• Mei 1995'}
                </Typography>
              </div>
            </div>

            {/* Gender */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='info'
                size={38}
              >
                <i className='tabler-gender-male' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Jenis Kelamin
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {personal.gender}
                </Typography>
              </div>
            </div>

            {/* Marital Status */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='warning'
                size={38}
              >
                <i className='tabler-heart' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Status Pernikahan
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {personal.maritalStatus}
                </Typography>
              </div>
            </div>

            {/* Religion */}
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='secondary'
                size={38}
              >
                <i className='tabler-book' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Agama
                </Typography>

                <Typography
                  variant='body2'
                  className='font-medium mt-0.5'
                >
                  {personal.religion}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className='rounded-lg border border-success/20 bg-success/5 p-4'>
          <div className='flex items-start gap-3'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='success'
              size={38}
            >
              <i className='tabler-shield-check' />
            </CustomAvatar>

            <div className='flex flex-col gap-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <Typography
                  variant='body2'
                  className='font-medium'
                >
                  Identitas terverifikasi
                </Typography>

                <Chip
                  label='Verified'
                  size='small'
                  variant='tonal'
                  color='success'
                />
              </div>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Data identitas pelatih telah melalui proses
                verifikasi dan dapat digunakan sebagai
                referensi administrasi.
              </Typography>
            </div>
          </div>
        </div>

        {/* Privacy Footer */}
        <Divider />

        <div className='flex items-start gap-2'>
          <i className='tabler-info-circle text-textSecondary text-lg' />

          <Typography
            variant='caption'
            color='text.secondary'
          >
            Data identitas bersifat terbatas. Akses dan
            penayangan informasi lengkap mengikuti hak akses
            pengguna.
          </Typography>
        </div>

      </CardContent>
    </Card>
  )
}

export default PersonalInformation
