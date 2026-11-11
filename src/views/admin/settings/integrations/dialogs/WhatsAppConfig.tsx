// MUI Imports
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const WhatsAppConfig = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography className='text-textPrimary font-medium'>
          WhatsApp Business
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          className='mt-1'
        >
          Hubungkan WhatsApp Business untuk mengirim notifikasi kepada peserta dan pengguna.
        </Typography>
      </div>

      <div className='flex flex-col gap-5'>
        <CustomTextField
          fullWidth
          label='Nama Bisnis'
          placeholder='Contoh: DISKOP Banjarbaru'
        />

        <CustomTextField
          fullWidth
          label='Nomor WhatsApp'
          placeholder='628123456789'
          helperText='Gunakan format internasional tanpa tanda +.'
        />

        <CustomTextField
          fullWidth
          label='Phone Number ID'
          placeholder='Masukkan Phone Number ID'
        />

        <CustomTextField
          fullWidth
          type='password'
          label='Access Token'
          placeholder='Masukkan access token'
        />
      </div>
    </div>
  )
}

export default WhatsAppConfig
