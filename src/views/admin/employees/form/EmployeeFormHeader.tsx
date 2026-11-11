// MUI Imports
import Link from 'next/link'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = {
  mode: 'create' | 'edit'
  employeeId?: string
}

const EmployeeFormHeader = ({ mode, employeeId }: Props) => {
  const isEdit = mode === 'edit'

  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          {isEdit ? 'Edit Pegawai' : 'Tambah Pegawai'}
        </Typography>

        <Typography>
          {isEdit
            ? 'Perbarui data dan informasi pegawai.'
            : 'Tambahkan data pegawai baru ke dalam sistem DISKOP.'}
        </Typography>
      </div>

      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        <Button
          component={Link}
          href={isEdit && employeeId ? `/admin/employees/${employeeId}` : '/admin/employees'}
          variant='tonal'
          color='secondary'
        >
          Kembali
        </Button>

        <Button variant='contained'>
          {isEdit ? 'Simpan Perubahan' : 'Simpan Pegawai'}
        </Button>
      </div>
    </div>
  )
}

export default EmployeeFormHeader
