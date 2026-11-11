// MUI Imports
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const WebhookConfig = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography className='text-textPrimary font-medium'>
          Webhook
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          className='mt-1'
        >
          Hubungkan DISKOP dengan layanan eksternal melalui webhook.
        </Typography>
      </div>

      <div className='flex flex-col gap-5'>
        <CustomTextField
          fullWidth
          label='Endpoint URL'
          placeholder='https://example.com/webhook'
          helperText='URL tujuan yang akan menerima event dari DISKOP.'
        />

        <CustomTextField
          fullWidth
          type='password'
          label='Secret'
          placeholder='Masukkan secret webhook'
          helperText='Digunakan untuk memverifikasi request yang dikirim.'
        />
      </div>
    </div>
  )
}

export default WebhookConfig
