// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import DocumentCard from './DocumentCard'

const Documents = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h5'>
              Dokumen Pelatih
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Kelola dokumen identitas, pendidikan, sertifikasi,
              dan lampiran pendukung pelatih.
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
        <DocumentCard />
      </Grid>
    </Grid>
  )
}

export default Documents
