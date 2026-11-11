'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

type SortType =
  | 'trainings'
  | 'participants'
  | 'rating'
  | 'completion'

type DataType = {
  name: string
  specialization: string
  totalTrainings: number
  totalParticipants: number
  rating: number
  completionRate: number
  avatar: string
}

// Vars
const data: DataType[] = [
  {
    name: 'Ahmad Fauzan',
    specialization: 'Web Development',
    totalTrainings: 18,
    totalParticipants: 342,
    rating: 4.9,
    completionRate: 94,
    avatar: '/images/avatars/1.png'
  },
  {
    name: 'Siti Rahma',
    specialization: 'Digital Marketing',
    totalTrainings: 15,
    totalParticipants: 286,
    rating: 4.8,
    completionRate: 91,
    avatar: '/images/avatars/2.png'
  },
  {
    name: 'Budi Santoso',
    specialization: 'Networking',
    totalTrainings: 12,
    totalParticipants: 241,
    rating: 4.7,
    completionRate: 88,
    avatar: '/images/avatars/3.png'
  },
  {
    name: 'Dewi Lestari',
    specialization: 'Desain Grafis',
    totalTrainings: 9,
    totalParticipants: 198,
    rating: 4.9,
    completionRate: 96,
    avatar: '/images/avatars/4.png'
  },
  {
    name: 'Casandra',
    specialization: 'Desain Grafis',
    totalTrainings: 9,
    totalParticipants: 176,
    rating: 4.6,
    completionRate: 86,
    avatar: '/images/avatars/5.png'
  }
]

const PopularInstructors = () => {
  const [sortBy, setSortBy] = useState<SortType>('trainings')

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'participants':
          return b.totalParticipants - a.totalParticipants

        case 'rating':
          return b.rating - a.rating

        case 'completion':
          return b.completionRate - a.completionRate

        case 'trainings':
        default:
          return b.totalTrainings - a.totalTrainings
      }
    })
  }, [sortBy])

  const menuOptions = [
    'Pelatihan Terbanyak',
    'Peserta Terbanyak',
    'Rating Tertinggi',
    'Kelulusan Tertinggi'
  ]

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case 'Peserta Terbanyak':
        setSortBy('participants')
        break

      case 'Rating Tertinggi':
        setSortBy('rating')
        break

      case 'Kelulusan Tertinggi':
        setSortBy('completion')
        break

      case 'Pelatihan Terbanyak':
      default:
        setSortBy('trainings')
        break
    }
  }

  const getMetricValue = (item: DataType) => {
    switch (sortBy) {
      case 'participants':
        return item.totalParticipants

      case 'rating':
        return item.rating.toFixed(1)

      case 'completion':
        return `${item.completionRate}%`

      case 'trainings':
      default:
        return item.totalTrainings
    }
  }

  const getMetricLabel = () => {
    switch (sortBy) {
      case 'participants':
        return 'peserta'

      case 'rating':
        return 'rating'

      case 'completion':
        return 'lulus'

      case 'trainings':
      default:
        return 'pelatihan'
    }
  }

  return (
    <Card className='bs-full'>
      <CardHeader
        title='Pelatih Populer'
        action={
          <OptionMenu
            options={menuOptions}
            onOptionClick={handleMenuSelect}
          />
        }
      />

      <Divider />

      <div className='flex justify-between plb-4 pli-6'>
        <Typography className='uppercase'>
          pelatih
        </Typography>

        <Typography className='uppercase'>
          {getMetricLabel()}
        </Typography>
      </div>

      <Divider />

      <CardContent className='flex flex-col gap-4'>
        {sortedData.map((item, i) => (
          <div
            key={i}
            className='flex items-center gap-4'
          >
            <CustomAvatar
              size={34}
              src={item.avatar}
            />

            <div className='flex justify-between items-center is-full gap-4'>
              <div>
                <Typography
                  className='font-medium'
                  color='text.primary'
                >
                  {item.name}
                </Typography>

                <Typography variant='body2'>
                  {item.specialization}
                </Typography>
              </div>

              <Typography
                className='font-medium'
                color='text.primary'
              >
                {getMetricValue(item)}
              </Typography>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PopularInstructors
