'use client'

// React Imports
import { useState } from 'react'
import type {
  SyntheticEvent,
  ReactElement
} from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

type AccountSettingsProps = {
  tabContentList: {
    [key: string]: ReactElement
  }
}

const AccountSettings = ({
                           tabContentList
                         }: AccountSettingsProps) => {
  const [activeTab, setActiveTab] =
    useState('profile')

  const handleChange = (
    event: SyntheticEvent,
    value: string
  ) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid
        container
        spacing={6}
      >
        {/* =====================================================
            TABS
        ====================================================== */}

        <Grid size={{ xs: 12 }}>
          <CustomTabList
            onChange={handleChange}
            variant='scrollable'
            pill='true'
          >
            {/* PROFIL */}

            <Tab
              label='Profil'
              icon={
                <i className='tabler-user' />
              }
              iconPosition='start'
              value='profile'
            />

            {/* KEAMANAN */}

            <Tab
              label='Keamanan'
              icon={
                <i className='tabler-lock' />
              }
              iconPosition='start'
              value='security'
            />

            {/* INTEGRASI */}

            <Tab
              label='Integrasi'
              icon={
                <i className='tabler-plug-connected' />
              }
              iconPosition='start'
              value='integrations'
            />

            {/* TANDA TANGAN */}

            <Tab
              label='Tanda Tangan'
              icon={
                <i className='tabler-signature' />
              }
              iconPosition='start'
              value='signature'
            />
          </CustomTabList>
        </Grid>

        {/* =====================================================
            TAB CONTENT
        ====================================================== */}

        <Grid size={{ xs: 12 }}>
          <TabPanel
            value={activeTab}
            className='p-0'
          >
            {
              tabContentList[
                activeTab
                ]
            }
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AccountSettings
