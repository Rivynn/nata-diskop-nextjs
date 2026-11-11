'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

type Props = {
  mode: 'create' | 'edit'
  employeeId?: string
}

const EmployeeDocuments = ({
                             mode
                           }: Props) => {
  return (
    <Card>
      <CardContent>
        <Typography variant='h6'>
          Dokumen
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
        >
          Dokumen pendukung pegawai.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default EmployeeDocuments
