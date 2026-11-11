'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import dynamic from 'next/dynamic'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'

import CustomTabList from '@core/components/mui/TabList'

const OverviewTab = dynamic(() => import('./overview'))
const PersonalTab = dynamic(() => import('./personal'))
const DocumentsTab = dynamic(() => import('./documents'))
const ActivityTab = dynamic(() => import('./activity'))

type Props = {
  employeeId: string
}

const EmployeeRight = ({ employeeId }: Props) => {
  const [activeTab, setActiveTab] = useState('overview')

  const handleChange = (_event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList
            onChange={handleChange}
            variant='scrollable'
            pill='true'
          >
            <Tab
              icon={<i className='tabler-layout-dashboard' />}
              value='overview'
              label='Overview'
              iconPosition='start'
            />

            <Tab
              icon={<i className='tabler-user' />}
              value='personal'
              label='Data Pribadi'
              iconPosition='start'
            />

            <Tab
              icon={<i className='tabler-files' />}
              value='documents'
              label='Dokumen'
              iconPosition='start'
            />

            <Tab
              icon={<i className='tabler-history' />}
              value='activity'
              label='Aktivitas'
              iconPosition='start'
            />
          </CustomTabList>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TabPanel value={activeTab} className='p-0'>
            {activeTab === 'overview' && (
              <OverviewTab employeeId={employeeId} />
            )}

            {activeTab === 'personal' && (
              <PersonalTab employeeId={employeeId} />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab employeeId={employeeId} />
            )}

            {activeTab === 'activity' && (
              <ActivityTab employeeId={employeeId} />
            )}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default EmployeeRight
