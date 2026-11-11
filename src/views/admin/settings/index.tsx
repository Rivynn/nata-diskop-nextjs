'use client'

// Next Imports
import type { ReactElement } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// React Imports

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

type SettingsTab = {
  value: string
  label: string
  icon: string
  href: string
  content: ReactElement
}

const Settings = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  const pathname = usePathname()

  const tabs: SettingsTab[] = [
    {
      value: 'general',
      label: 'Umum',
      icon: 'tabler-settings',
      href: '/admin/settings/general',
      content: tabContentList.general
    },
    {
      value: 'notifications',
      label: 'Notifikasi',
      icon: 'tabler-bell',
      href: '/admin/settings/notifications',
      content: tabContentList.notifications
    },
    {
      value: 'integrations',
      label: 'Integrasi',
      icon: 'tabler-plug',
      href: '/admin/settings/integrations',
      content: tabContentList.integrations
    }
  ]

  const activeTab =
    tabs.find(tab => pathname === tab.href || pathname.startsWith(`${tab.href}/`))?.value ?? 'general'

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        {/* Settings Navigation */}
        <Grid size={{ xs: 12 }}>
          <CustomTabList variant='scrollable' pill='true'>
            {tabs.map(tab => (
              <Tab
                key={tab.value}
                label={tab.label}
                icon={<i className={tab.icon} />}
                iconPosition='start'
                value={tab.value}
                component={Link}
                href={tab.href}
              />
            ))}
          </CustomTabList>
        </Grid>

        {/* Settings Content */}
        <Grid size={{ xs: 12 }}>
          {tabs.map(tab => (
            <TabPanel
              key={tab.value}
              value={tab.value}
              className='p-0'
            >
              {tab.content}
            </TabPanel>
          ))}
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default Settings
