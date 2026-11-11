// MUI Imports
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TelegramConfig = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography className='text-textPrimary font-medium'>
          Telegram Bot
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          className='mt-1'
        >
          Gunakan bot Telegram untuk mengirim notifikasi otomatis dari DISKOP.
        </Typography>
      </div>

      <div className='flex flex-col gap-5'>
        <CustomTextField
          fullWidth
          label='Bot Token'
          type='password'
          placeholder='123456789:AA...'
          helperText='Token dapat diperoleh dari BotFather.'
        />

        <CustomTextField
          fullWidth
          label='Chat ID'
          placeholder='-100123456789'
          helperText='ID tujuan untuk menerima notifikasi.'
        />
      </div>
    </div>
  )
}

export default TelegramConfig
