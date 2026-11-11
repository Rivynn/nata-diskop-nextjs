// MUI Imports
import Link from 'next/link'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Next Imports

type Props = {
  mode: 'create' | 'edit'
  instructorId?: string
}

const InstructorFormHeader = ({ mode, instructorId }: Props) => {
  const isEdit = mode === 'edit'

  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          {isEdit ? 'Edit Pelatih' : 'Tambah Pelatih'}
        </Typography>

        <Typography>
          {isEdit
            ? 'Perbarui data dan informasi tenaga pelatih.'
            : 'Tambahkan data tenaga pelatih baru ke dalam sistem DISKOP.'}
        </Typography>
      </div>

      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        <Button
          component={Link}
          href={isEdit && instructorId ? `/admin/instructors/${instructorId}` : '/admin/instructors'}
          variant='tonal'
          color='secondary'
        >
          Kembali
        </Button>

        <Button variant='contained'>
          {isEdit ? 'Simpan Perubahan' : 'Simpan Pelatih'}
        </Button>
      </div>
    </div>
  )
}

export default InstructorFormHeader
