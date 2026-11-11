// 'use client'

'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

// Dynamic Imports
const OverviewTab = dynamic(() => import('./overview'))
const PersonalTab = dynamic(() => import('./personal'))
const DocumentsTab = dynamic(() => import('./documents'))
const CertificationsTab = dynamic(() => import('./certifications'))
const ActivityTab = dynamic(() => import('./activity'))

type Props = {
  instructorId: string
}

const InstructorRight = ({ instructorId }: Props) => {
  // States
  const [activeTab, setActiveTab] = useState('overview')

  const handleChange = (
    event: SyntheticEvent,
    value: string
  ) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        {/* Tabs */}
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
              icon={<i className='tabler-file-description' />}
              value='documents'
              label='Dokumen'
              iconPosition='start'
            />

            <Tab
              icon={<i className='tabler-certificate' />}
              value='certifications'
              label='Sertifikasi'
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

        {/* Tab Content */}
        <Grid size={{ xs: 12 }}>
          <TabPanel
            value={activeTab}
            className='p-0'
          >
            {activeTab === 'overview' && <OverviewTab />}

            {activeTab === 'personal' && <PersonalTab />}

            {activeTab === 'documents' && <DocumentsTab />}

            {activeTab === 'certifications' && (
              <CertificationsTab />
            )}

            {activeTab === 'activity' && <ActivityTab />}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default InstructorRight
