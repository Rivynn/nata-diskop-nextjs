// MUI Imports
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const BrowserConfig = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography className='text-textPrimary font-medium'>
          Notifikasi Browser
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          className='mt-1'
        >
          Atur identitas yang digunakan saat menampilkan notifikasi kepada pengguna.
        </Typography>
      </div>

      <div className='flex flex-col gap-5'>
        <CustomTextField
          fullWidth
          label='Nama Pengirim'
          placeholder='DISKOP'
          helperText='Nama yang akan ditampilkan pada notifikasi.'
        />

        <CustomTextField
          fullWidth
          label='URL Ikon'
          placeholder='/images/logos/diskop.png'
          helperText='Ikon yang digunakan pada notifikasi browser.'
        />
      </div>
    </div>
  )
}

export default BrowserConfig
