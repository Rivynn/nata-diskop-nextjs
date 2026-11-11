'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

import UserProfileHeader from './UserProfileHeader'
import ProfileOverview from './ProfileOverview'
import ActivityTimeline from './ActivityTimeline'
import ProfileMedia from './ProfileMedia'

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const handleChange = (
    _event: SyntheticEvent,
    value: string
  ) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>

        {/* =================================================
            PROFILE HEADER
        ================================================== */}

        <Grid size={{ xs: 12 }}>
          <UserProfileHeader />
        </Grid>

        {/* =================================================
            TABS
        ================================================== */}

        <Grid size={{ xs: 12 }}>
          <CustomTabList
            onChange={handleChange}
            variant='scrollable'
            pill='true'
          >
            <Tab
              label='Profil'
              icon={<i className='tabler-user' />}
              iconPosition='start'
              value='profile'
            />

            <Tab
              label='Media & Dokumen'
              icon={<i className='tabler-photo' />}
              iconPosition='start'
              value='media'
            />
          </CustomTabList>
        </Grid>

        {/* =================================================
            TAB CONTENT
        ================================================== */}

        <Grid size={{ xs: 12 }}>

          {/* ===============================================
              PROFIL
          ================================================ */}

          <TabPanel
            value='profile'
            className='p-0'
          >
            <Grid
              container
              spacing={6}
              alignItems='stretch'
            >
              {/* Profile Overview */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <ProfileOverview />
              </Grid>

              {/* Activity Timeline */}
              <Grid size={{ xs: 12, lg: 8 }}>
                <ActivityTimeline />
              </Grid>
            </Grid>
          </TabPanel>

          {/* ===============================================
              MEDIA & DOKUMEN
          ================================================ */}

          <TabPanel
            value='media'
            className='p-0'
          >
            <ProfileMedia />
          </TabPanel>

        </Grid>

      </Grid>
    </TabContext>
  )
}

export default UserProfile
