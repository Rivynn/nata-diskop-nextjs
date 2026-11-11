// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

type Props = {
  mode: Mode
  searchValue: string
  setSearchValue: (value: string) => void
}

const TrainingHeader = (props: Props) => {
  const { mode, searchValue, setSearchValue } = props

  // Vars
  const lightIllustration = '/images/apps/academy/hand-with-bulb-light.png'
  const darkIllustration = '/images/apps/academy/hand-with-bulb-dark.png'

  // Hooks
  const theme = useTheme()
  const leftIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  return (
    <Card className='relative flex justify-center overflow-hidden'>
      <img
        src={leftIllustration}
        alt=''
        aria-hidden='true'
        className='absolute start-8 top-8 max-is-[100px] max-md:hidden'
      />

      <div className='flex w-full flex-col items-center gap-4 px-5 py-10 md:is-3/4 md:py-12'>
        <div className='flex flex-col items-center gap-2'>
          <Typography variant='h4' className='text-center'>
            Kelola Program <span className='text-primary'>Pelatihan</span>
          </Typography>

          <Typography
            color='text.secondary'
            className='max-w-[620px] text-center'
          >
            Kelola informasi pelatihan, pendaftaran peserta, jadwal,
            pemateri, dan program pengembangan kompetensi melalui satu tempat.
          </Typography>
        </div>

        <div className='flex w-full flex-wrap items-center justify-center gap-3'>
          <div className='flex items-center gap-2 max-sm:w-full sm:is-[350px]'>
            <CustomTextField
              fullWidth
              placeholder='Cari nama atau kategori pelatihan...'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />

            <CustomIconButton
              variant='contained'
              color='primary'
              aria-label='Cari pelatihan'
            >
              <i className='tabler-search' />
            </CustomIconButton>
          </div>

          <Button
            component={Link}
            href='/admin/trainings/create'
            variant='contained'
            color='primary'
            startIcon={<i className='tabler-plus' />}
            className='max-sm:w-full'
          >
            Tambah Pelatihan
          </Button>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-x-5 gap-y-2'>
          <div className='flex items-center gap-2'>
            <i className='tabler-calendar-event text-primary' />
            <Typography variant='body2' color='text.secondary'>
              Jadwal Terstruktur
            </Typography>
          </div>

          <div className='flex items-center gap-2'>
            <i className='tabler-users text-primary' />
            <Typography variant='body2' color='text.secondary'>
              Manajemen Peserta
            </Typography>
          </div>

          <div className='flex items-center gap-2'>
            <i className='tabler-certificate text-primary' />
            <Typography variant='body2' color='text.secondary'>
              Pengembangan Kompetensi
            </Typography>
          </div>
        </div>
      </div>

      <img
        src='/images/apps/academy/9.png'
        alt=''
        aria-hidden='true'
        className={classnames(
          'absolute bottom-0 end-0 max-bs-[150px] max-is-[150px] max-md:hidden',
          {
            'scale-x-[-1]': theme.direction === 'rtl'
          }
        )}
      />
    </Card>
  )
}

export default TrainingHeader
