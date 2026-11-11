// MUI Imports
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const DiscordConfig = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography className='text-textPrimary font-medium'>
          Discord Webhook
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          className='mt-1'
        >
          Kirim notifikasi sistem ke channel Discord melalui webhook.
        </Typography>
      </div>

      <CustomTextField
        fullWidth
        label='Webhook URL'
        placeholder='https://discord.com/api/webhooks/...'
        helperText='Masukkan URL webhook dari channel Discord tujuan.'
      />
    </div>
  )
}

export default DiscordConfig
