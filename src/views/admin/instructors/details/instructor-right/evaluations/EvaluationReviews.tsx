// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'

const EvaluationSummary = () => {
  const ratingBreakdown = [
    { rating: 5, count: 96, percentage: 75 },
    { rating: 4, count: 24, percentage: 19 },
    { rating: 3, count: 5, percentage: 4 },
    { rating: 2, count: 2, percentage: 2 },
    { rating: 1, count: 1, percentage: 1 }
  ]

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div>
          <Typography variant='h5'>Evaluasi Pelatih</Typography>

          <Typography variant='body2' color='text.secondary'>
            Ringkasan penilaian peserta terhadap performa pelatih.
          </Typography>
        </div>

        <Divider />

        <div className='flex flex-col md:flex-row gap-8'>
          <div className='flex flex-col items-center justify-center min-is-[180px]'>
            <Typography variant='h1' color='primary'>
              4.8
            </Typography>

            <div className='flex items-center gap-1'>
              {[1, 2, 3, 4, 5].map(index => (
                <i
                  key={index}
                  className='tabler-star-filled text-warning text-xl'
                />
              ))}
            </div>

            <Typography
              variant='body2'
              color='text.secondary'
              className='mt-2'
            >
              128 Evaluasi
            </Typography>
          </div>

          <Divider orientation='vertical' flexItem className='hidden md:block' />

          <div className='flex flex-col gap-3 flex-1'>
            {ratingBreakdown.map(item => (
              <div
                key={item.rating}
                className='flex items-center gap-3'
              >
                <Typography
                  variant='body2'
                  className='min-is-8'
                >
                  {item.rating}
                  <i className='tabler-star-filled text-warning text-sm ms-1' />
                </Typography>

                <LinearProgress
                  variant='determinate'
                  value={item.percentage}
                  className='flex-1'
                  sx={{ height: 8, borderRadius: 999 }}
                />

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className='min-is-10 text-end'
                >
                  {item.count}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EvaluationSummary
