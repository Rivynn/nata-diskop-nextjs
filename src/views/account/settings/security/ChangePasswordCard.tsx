'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

type PasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const initialForm: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
}

const ChangePasswordCard = () => {
  const [formData, setFormData] =
    useState<PasswordForm>(initialForm)

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false)

  const [showNewPassword, setShowNewPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const handleChange = (
    field: keyof PasswordForm,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleReset = () => {
    setFormData(initialForm)
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    // TODO: Sambungkan ke API perubahan password.
  }

  return (
    <Card>
      <CardHeader
        title='Ubah Kata Sandi'
        subheader='Perbarui kata sandi akun Anda secara berkala untuk menjaga keamanan akun.'
      />

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>

            {/* Current Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Kata Sandi Saat Ini'
                type={
                  showCurrentPassword
                    ? 'text'
                    : 'password'
                }
                value={formData.currentPassword}
                placeholder='Masukkan kata sandi saat ini'
                onChange={event =>
                  handleChange(
                    'currentPassword',
                    event.target.value
                  )
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() =>
                            setShowCurrentPassword(
                              prev => !prev
                            )
                          }
                          onMouseDown={event =>
                            event.preventDefault()
                          }
                          aria-label={
                            showCurrentPassword
                              ? 'Sembunyikan kata sandi'
                              : 'Tampilkan kata sandi'
                          }
                        >
                          <i
                            className={
                              showCurrentPassword
                                ? 'tabler-eye-off'
                                : 'tabler-eye'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* New Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Kata Sandi Baru'
                type={
                  showNewPassword
                    ? 'text'
                    : 'password'
                }
                value={formData.newPassword}
                placeholder='Masukkan kata sandi baru'
                onChange={event =>
                  handleChange(
                    'newPassword',
                    event.target.value
                  )
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() =>
                            setShowNewPassword(
                              prev => !prev
                            )
                          }
                          onMouseDown={event =>
                            event.preventDefault()
                          }
                        >
                          <i
                            className={
                              showNewPassword
                                ? 'tabler-eye-off'
                                : 'tabler-eye'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Konfirmasi Kata Sandi Baru'
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                value={formData.confirmPassword}
                placeholder='Ulangi kata sandi baru'
                onChange={event =>
                  handleChange(
                    'confirmPassword',
                    event.target.value
                  )
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() =>
                            setShowConfirmPassword(
                              prev => !prev
                            )
                          }
                          onMouseDown={event =>
                            event.preventDefault()
                          }
                        >
                          <i
                            className={
                              showConfirmPassword
                                ? 'tabler-eye-off'
                                : 'tabler-eye'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            {/* Requirements */}
            <Grid size={{ xs: 12 }}>
              <div className='flex flex-col gap-3'>
                <Typography
                  variant='subtitle1'
                  className='text-textPrimary font-medium'
                >
                  Persyaratan Kata Sandi
                </Typography>

                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2.5'>
                    <i className='tabler-circle-filled text-[7px]' />
                    <Typography variant='body2'>
                      Minimal 8 karakter.
                    </Typography>
                  </div>

                  <div className='flex items-center gap-2.5'>
                    <i className='tabler-circle-filled text-[7px]' />
                    <Typography variant='body2'>
                      Mengandung huruf besar dan huruf kecil.
                    </Typography>
                  </div>

                  <div className='flex items-center gap-2.5'>
                    <i className='tabler-circle-filled text-[7px]' />
                    <Typography variant='body2'>
                      Mengandung angka atau karakter khusus.
                    </Typography>
                  </div>
                </div>
              </div>
            </Grid>

            {/* Actions */}
            <Grid
              size={{ xs: 12 }}
              className='flex flex-wrap gap-4'
            >
              <Button
                variant='contained'
                type='submit'
              >
                Simpan Perubahan
              </Button>

              <Button
                variant='tonal'
                color='secondary'
                type='button'
                onClick={handleReset}
              >
                Reset
              </Button>
            </Grid>

          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
