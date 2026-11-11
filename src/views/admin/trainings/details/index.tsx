'use client'

import { useState } from 'react'
import type { SyntheticEvent, ReactNode } from 'react'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import CustomTabList from '@core/components/mui/TabList'

import type { TrainingRecord } from '@/types/admin/trainingTypes'

import OverviewTab from './tabs/OverviewTab'
import ParticipantsTab from './tabs/ParticipantsTab'
import SessionsTab from './tabs/SessionsTab'
import InstructorsTab from './tabs/InstructorsTab'
import AttendanceTab from './tabs/AttendanceTab'
import AssessmentTab from './tabs/AssessmentTab'
import EvaluationTab from './tabs/EvaluationTab'
import CertificatesTab from './tabs/CertificatesTab'
import PostTrainingTab from './tabs/PostTrainingTab'
import HistoryTab from './tabs/HistoryTab'

import Sidebar from '@views/admin/trainings/details/Sidebar'

type Props = {
  data: TrainingRecord
}

const TrainingDetailsWorkspace = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState('overview')

  const handleChange = (_event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  const tabContentList: Record<string, ReactNode> = {
    overview: <OverviewTab />,
    participants: <ParticipantsTab />,
    sessions: <SessionsTab data={data} />,
    instructors: <InstructorsTab data={data} />,
    attendance: <AttendanceTab data={data} />,
    assessment: <AssessmentTab data={data} />,
    evaluation: <EvaluationTab data={data} />,
    certificates: <CertificatesTab data={data} />,
    postTraining: <PostTrainingTab data={data} />,
    history: <HistoryTab data={data} />
  }

  const tabDescriptions: Record<string, string> = {
    overview: 'Ringkasan dan progres seluruh rangkaian pelatihan.',
    participants: 'Kelola pendaftaran dan peserta pelatihan.',
    sessions: 'Atur jadwal dan sesi pelaksanaan pelatihan.',
    instructors: 'Kelola instruktur dan materi pelatihan.',
    attendance: 'Pantau kehadiran peserta pelatihan.',
    assessment: 'Kelola penilaian dan hasil belajar peserta.',
    evaluation: 'Tinjau evaluasi dan umpan balik peserta.',
    certificates: 'Kelola penerbitan sertifikat pelatihan.',
    postTraining: 'Kelola tindak lanjut, monitoring, dan dampak setelah pelatihan.',
    history: 'Lihat riwayat aktivitas dan laporan pelatihan.'
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={4} alignItems='flex-start'>
        {/* Sidebar program tetap di kiri */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Sidebar data={data} />
        </Grid>

        {/* Workspace di kanan */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <div className='px-4 pt-2'>
                <CustomTabList
                  onChange={handleChange}
                  variant='scrollable'
                  scrollButtons='auto'
                  pill='true'
                  aria-label='Navigasi workspace pelatihan'
                >
                  <Tab
                    icon={<i className='tabler-layout-dashboard' />}
                    value='overview'
                    label='Overview'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-users' />}
                    value='participants'
                    label='Pendaftaran & Peserta'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-calendar-event' />}
                    value='sessions'
                    label='Jadwal & Sesi'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-presentation' />}
                    value='instructors'
                    label='Instruktur & Materi'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-calendar-check' />}
                    value='attendance'
                    label='Absensi'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-clipboard-check' />}
                    value='assessment'
                    label='Penilaian'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-message-star' />}
                    value='evaluation'
                    label='Evaluasi'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-certificate' />}
                    value='certificates'
                    label='Sertifikat'
                    iconPosition='start'
                  />

                  {/* TAB BARU */}
                  <Tab
                    icon={<i className='tabler-trending-up' />}
                    value='postTraining'
                    label='Pasca Pelatihan'
                    iconPosition='start'
                  />

                  <Tab
                    icon={<i className='tabler-history' />}
                    value='history'
                    label='Riwayat & Laporan'
                    iconPosition='start'
                  />
                </CustomTabList>
              </div>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TabPanel value={activeTab} className='p-0'>
                <div className='min-w-0 p-4 sm:p-5'>
                  {tabContentList[activeTab]}
                </div>
              </TabPanel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default TrainingDetailsWorkspace
