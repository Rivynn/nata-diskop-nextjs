// MUI Imports
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const EmailConfig = () => {
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Typography className='text-textPrimary font-medium'>
          Layanan Email
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          className='mt-1'
        >
          Konfigurasi SMTP yang digunakan DISKOP untuk mengirim email.
        </Typography>
      </div>

      <div className='flex flex-col gap-5'>
        <CustomTextField
          fullWidth
          label='SMTP Host'
          placeholder='smtp.example.com'
        />

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
          <CustomTextField
            fullWidth
            label='Port'
            placeholder='587'
          />

          <CustomTextField
            fullWidth
            label='Enkripsi'
            placeholder='TLS'
          />
        </div>

        <CustomTextField
          fullWidth
          label='Username'
          placeholder='diskop@banjarbarukota.go.id'
        />

        <CustomTextField
          fullWidth
          type='password'
          label='Password'
          placeholder='Masukkan password SMTP'
        />
      </div>
    </div>
  )
}

export default EmailConfig
