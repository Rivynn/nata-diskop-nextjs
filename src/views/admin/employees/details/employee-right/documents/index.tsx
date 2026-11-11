import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import DocumentCard from './DocumentCard'

type Props = {
  employeeId: string
}

const Documents = ({ employeeId }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h5'>
              Dokumen Pegawai
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Kelola dokumen identitas, pendidikan, kontrak kerja,
              dan berkas administrasi pegawai.
            </Typography>
          </div>

          <Button
            variant='contained'
            startIcon={<i className='tabler-plus' />}
          >
            Tambah Dokumen
          </Button>
        </div>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DocumentCard employeeId={employeeId} />
      </Grid>
    </Grid>
  )
}

export default Documents
