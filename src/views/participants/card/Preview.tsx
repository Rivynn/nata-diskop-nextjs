'use client'

import Grid from '@mui/material/Grid2'

import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'

type PreviewProps = {
  participantId?: string
}

const Preview = ({ participantId }: PreviewProps) => {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    console.log('Download participant card:', participantId)
  }

  return (
    <Grid container spacing={6}>
      {/* Participant Card */}
      <Grid size={{ xs: 12, md: 9 }}>
        <PreviewCard participantId={participantId} />
      </Grid>

      {/* Actions */}
      <Grid size={{ xs: 12, md: 3 }}>
        <PreviewActions
          participantId={participantId}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      </Grid>
    </Grid>
  )
}

export default Preview
