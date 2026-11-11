'use client'

// React Imports
import type { ReactNode } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { lighten, darken, useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type DataType = {
  title: string
  value: string
  color: ThemeColor
  icon: ReactNode
}

// Vars
const data: DataType[] = [
  {
    title: 'Total Pelatihan',
    value: '42',
    color: 'primary',
    icon: <i className='tabler-school text-[38px]' />
  },
  {
    title: 'Peserta Terdaftar',
    value: '1,284',
    color: 'info',
    icon: <i className='tabler-users text-[38px]' />
  },
  {
    title: 'Pelatih Aktif',
    value: '86',
    color: 'success',
    icon: <i className='tabler-chalkboard text-[38px]' />
  },
  {
    title: 'Mitra Aktif',
    value: '37',
    color: 'warning',
    icon: <i className='tabler-building-community text-[38px]' />
  }
]

const WelcomeCard = () => {
  // Hooks
  const theme = useTheme()
  const belowMdScreen = useMediaQuery(theme.breakpoints.down('md'))

  // Vars
  const options: ApexOptions = {
    chart: {
      sparkline: {
        enabled: true
      }
    },
    grid: {
      padding: {
        left: 20,
        right: 20
      }
    },
    colors: [
      darken(theme.palette.success.main, 0.15),
      darken(theme.palette.success.main, 0.05),
      'var(--mui-palette-success-main)',
      lighten(theme.palette.success.main, 0.2)
    ],
    stroke: {
      width: 0
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    dataLabels: {
      enabled: false
    },
    labels: [
      'Selesai',
      'Berjalan',
      'Akan Dimulai',
      'Draft'
    ],
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              offsetY: 20,
              fontSize: '0.875rem'
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              fontSize: '1.125rem',
              formatter: value => `${value}%`,
              color: 'var(--mui-palette-text-primary)'
            },
            total: {
              show: true,
              fontSize: '0.8125rem',
              label: 'Pelatihan',
              color: 'var(--mui-palette-text-disabled)',
              formatter: () => '42'
            }
          }
        }
      }
    }
  }

  return (
    <div className='flex max-md:flex-col md:items-center gap-6 plb-6'>
      {/* Left Content */}
      <div className='md:is-8/12'>
        <div className='flex items-baseline gap-1 mbe-2'>
          <Typography variant='h5'>
            Selamat datang,
          </Typography>

          <Typography variant='h4'>
            Admin DISKOP 👋
          </Typography>
        </div>

        <div className='mbe-6'>
          <Typography>
            Pantau dan kelola seluruh aktivitas pelatihan DISKOP
            melalui dashboard administrasi.
          </Typography>

          <Typography>
            Pastikan setiap program berjalan sesuai target.
          </Typography>
        </div>

        {/* Statistics */}
        <div className='flex flex-wrap max-md:flex-col justify-between gap-6'>
          {data.map((item, i) => (
            <div
              key={i}
              className='flex gap-4'
            >
              <CustomAvatar
                variant='rounded'
                skin='light'
                size={54}
                color={item.color}
              >
                {item.icon}
              </CustomAvatar>

              <div>
                <Typography className='font-medium'>
                  {item.title}
                </Typography>

                <Typography
                  variant='h4'
                  color={`${item.color}.main`}
                >
                  {item.value}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <Divider
        orientation={belowMdScreen ? 'horizontal' : 'vertical'}
        flexItem
      />

      {/* Training Status */}
      <div className='flex justify-between md:is-4/12'>
        <div className='flex flex-col justify-between gap-6'>
          <div>
            <Typography
              variant='h5'
              className='mbe-1'
            >
              Status Pelatihan
            </Typography>

            <Typography>
              Ringkasan program
            </Typography>
          </div>

          <div>
            <Typography
              variant='h4'
              className='mbe-2'
            >
              42
              <span className='text-textSecondary'>
                {' '}program
              </span>
            </Typography>

            <Chip
              label='+12.5%'
              variant='tonal'
              size='small'
              color='success'
            />
          </div>
        </div>

        <AppReactApexCharts
          type='donut'
          height={189}
          width={150}
          options={options}
          series={[50, 29, 12, 9]}
        />
      </div>
    </div>
  )
}

export default WelcomeCard
