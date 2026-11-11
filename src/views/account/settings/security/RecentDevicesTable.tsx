// React Imports
import type { ReactElement } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type RecentDeviceData = {
  browserIcon: ReactElement
  browserName: string
  device: string
  location: string
  activity: string
}

const recentDeviceData: RecentDeviceData[] = [
  {
    browserName: 'Chrome di Windows',
    browserIcon: (
      <i className='tabler-brand-windows text-[22px] text-info' />
    ),
    device: 'Acer Nitro 5',
    location: 'Banjarmasin',
    activity: 'Hari ini, 18:02'
  },
  {
    browserName: 'Chrome di Android',
    browserIcon: (
      <i className='tabler-brand-android text-[22px] text-success' />
    ),
    device: 'Samsung Galaxy',
    location: 'Banjarmasin',
    activity: 'Kemarin, 21:14'
  },
  {
    browserName: 'Safari di iPhone',
    browserIcon: (
      <i className='tabler-device-mobile text-[22px] text-error' />
    ),
    device: 'iPhone',
    location: 'Banjarbaru',
    activity: '28 Sep 2026, 10:32'
  },
  {
    browserName: 'Chrome di macOS',
    browserIcon: (
      <i className='tabler-brand-apple text-[22px] text-secondary' />
    ),
    device: 'MacBook',
    location: 'Banjarbaru',
    activity: '25 Sep 2026, 19:48'
  },
  {
    browserName: 'Chrome di Android',
    browserIcon: (
      <i className='tabler-brand-android text-[22px] text-success' />
    ),
    device: 'Google Pixel',
    location: 'Banjarmasin',
    activity: '22 Sep 2026, 08:17'
  }
]

const RecentDevicesTable = () => {
  return (
    <Card>
      <CardHeader
        title='Perangkat Terbaru'
        subheader='Perangkat yang baru-baru ini digunakan untuk mengakses akun Anda.'
      />

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
          <tr>
            <th>Browser</th>
            <th>Perangkat</th>
            <th>Lokasi</th>
            <th>Aktivitas Terakhir</th>
          </tr>
          </thead>

          <tbody>
          {recentDeviceData.map(
            (device, index) => (
              <tr key={index}>
                <td>
                  <div className='flex items-center gap-2.5'>
                    {device.browserIcon}

                    <Typography
                      className='font-medium'
                      color='text.primary'
                    >
                      {device.browserName}
                    </Typography>
                  </div>
                </td>

                <td>
                  <Typography>
                    {device.device}
                  </Typography>
                </td>

                <td>
                  <Typography>
                    {device.location}
                  </Typography>
                </td>

                <td>
                  <Typography>
                    {device.activity}
                  </Typography>
                </td>
              </tr>
            )
          )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default RecentDevicesTable
