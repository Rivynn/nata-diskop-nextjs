// React Imports
import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

type EvaluationReview = {
  id: number
  participant: string
  avatar: string
  training: string
  rating: number
  review: string
  date: string
}

const reviewData: EvaluationReview[] = [
  {
    id: 1,
    participant: 'Rina Wulandari',
    avatar: '/images/avatars/1.png',
    training: 'Digital Marketing',
    rating: 5,
    review:
      'Materi sangat jelas dan penyampaian pelatih mudah dipahami. Banyak contoh praktis yang membantu.',
    date: '2026-10-02'
  },
  {
    id: 2,
    participant: 'Fajar Hidayat',
    avatar: '/images/avatars/2.png',
    training: 'Digital Marketing',
    rating: 5,
    review:
      'Pelatih interaktif dan sangat terbuka ketika menjawab pertanyaan peserta.',
    date: '2026-09-28'
  },
  {
    id: 3,
    participant: 'Dewi Lestari',
    avatar: '/images/avatars/3.png',
    training: 'Administrasi Digital',
    rating: 4,
    review:
      'Materinya bagus dan sesuai kebutuhan. Akan lebih baik jika waktu praktik ditambah.',
    date: '2026-09-20'
  }
]

const EvaluationReviews = () => {
  const reviews = useMemo(() => reviewData, [])

  return (
    <Card>
      <CardContent className='flex flex-col gap-1'>
        <Typography variant='h5'>Review Peserta</Typography>

        <Typography variant='body2' color='text.secondary'>
          Feedback dan pengalaman peserta setelah mengikuti pelatihan.
        </Typography>
      </CardContent>

      <div className='flex flex-col'>
        {reviews.map((item, index) => (
          <div key={item.id}>
            <div className='flex gap-4 p-6'>
              <CustomAvatar
                src={item.avatar}
                alt={item.participant}
                size={40}
                variant='rounded'
              />

              <div className='flex flex-col gap-2 flex-1'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex flex-col'>
                    <Typography className='font-medium'>
                      {item.participant}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      {item.training}
                    </Typography>
                  </div>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Typography>
                </div>

                <div className='flex items-center gap-1'>
                  {[1, 2, 3, 4, 5].map(star => (
                    <i
                      key={star}
                      className={
                        star <= item.rating
                          ? 'tabler-star-filled text-warning'
                          : 'tabler-star text-textDisabled'
                      }
                    />
                  ))}

                  <Chip
                    label={`${item.rating}.0`}
                    size='small'
                    variant='tonal'
                    color='warning'
                    className='ms-1'
                  />
                </div>

                <Typography variant='body2' color='text.secondary'>
                  {item.review}
                </Typography>
              </div>
            </div>

            {index < reviews.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default EvaluationReviews
