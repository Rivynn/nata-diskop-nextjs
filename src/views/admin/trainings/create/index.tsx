'use client'

import { useCallback, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'

import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step as MuiStep,
  StepLabel,
  Typography
} from '@mui/material'

import classnames from 'classnames'

import CustomAvatar from '@core/components/mui/Avatar'
import StepperWrapper from '@core/styles/stepper'

import StepTrainingInfo from './steps/StepTrainingInfo'
import StepMedia from './steps/StepMedia'
import StepScheduleRegistration from './steps/StepScheduleRegistration'
import StepAssessment from './steps/StepAssessment'
import StepReview from './steps/StepReview'

type StepItem = {
  icon: string
  title: string
  subtitle: string
}

type StepData = Record<string, unknown>

export type TrainingWizardData = {
  trainingInfo: StepData
  media: StepData
  scheduleRegistration: StepData
  assessment: StepData
}

const steps: StepItem[] = [
  {
    icon: 'tabler-file-text',
    title: 'Informasi Program',
    subtitle: 'Identitas, kategori, dan deskripsi'
  },
  {
    icon: 'tabler-photo',
    title: 'Cover & Promosi',
    subtitle: 'Visual dan konten promosi'
  },
  {
    icon: 'tabler-calendar-event',
    title: 'Jadwal & Pendaftaran',
    subtitle: 'Jadwal sesi, kuota, dan seleksi'
  },
  {
    icon: 'tabler-chart-bar',
    title: 'Penilaian & Sertifikat',
    subtitle: 'Rentang nilai dan kelulusan'
  },
  {
    icon: 'tabler-clipboard-check',
    title: 'Ringkasan Program',
    subtitle: 'Periksa sebelum menyimpan'
  }
]

const TrainingInfoStep = StepTrainingInfo as ComponentType<any>
const MediaStep = StepMedia as ComponentType<any>
const ScheduleRegistrationStep =
  StepScheduleRegistration as ComponentType<any>
const AssessmentStep = StepAssessment as ComponentType<any>

const createInitialWizardData = (): TrainingWizardData => ({
  trainingInfo: {},
  media: {},
  scheduleRegistration: {},
  assessment: {}
})

const CreateTraining = () => {
  const [activeStep, setActiveStep] = useState(0)

  const [wizardData, setWizardData] =
    useState<TrainingWizardData>(createInitialWizardData)

  /**
   * Simpan data dari setiap langkah.
   * Callback stabil agar tidak menyebabkan useEffect pada child
   * berjalan berulang akibat perubahan identitas fungsi.
   */
  const handleDataChange = useCallback(
    (key: keyof TrainingWizardData, data: StepData) => {
      setWizardData(previous => {
        if (previous[key] === data) {
          return previous
        }

        return {
          ...previous,
          [key]: data
        }
      })
    },
    []
  )

  const handleTrainingInfoChange = useCallback(
    (data: StepData) => {
      handleDataChange('trainingInfo', data)
    },
    [handleDataChange]
  )

  const handleMediaChange = useCallback(
    (data: StepData) => {
      handleDataChange('media', data)
    },
    [handleDataChange]
  )

  const handleScheduleDataChange = useCallback(
    (data: StepData) => {
      handleDataChange('scheduleRegistration', data)
    },
    [handleDataChange]
  )

  const handleAssessmentChange = useCallback(
    (data: StepData) => {
      handleDataChange('assessment', data)
    },
    [handleDataChange]
  )

  const handleNext = useCallback(() => {
    setActiveStep(previous => Math.min(previous + 1, steps.length - 1))
  }, [])

  const handlePrev = useCallback(() => {
    setActiveStep(previous => Math.max(previous - 1, 0))
  }, [])

  const handleGoToStep = useCallback((step: number) => {
    setActiveStep(Math.max(0, Math.min(step, steps.length - 1)))
  }, [])

  const getStepContent = (step: number): ReactNode => {
    switch (step) {
      case 0:
        return (
          <TrainingInfoStep
            activeStep={step}
            handleNext={handleNext}
            handlePrev={handlePrev}
            steps={steps}
            initialData={wizardData.trainingInfo}
            onDataChange={handleTrainingInfoChange}
          />
        )

      case 1:
        return (
          <MediaStep
            activeStep={step}
            handleNext={handleNext}
            handlePrev={handlePrev}
            steps={steps}
            initialData={wizardData.media}
            onDataChange={handleMediaChange}
            trainingDescription={String(
              wizardData.trainingInfo.description ??
              wizardData.trainingInfo.shortDescription ??
              ''
            )}
          />
        )

      case 2:
        return (
          <ScheduleRegistrationStep
            activeStep={step}
            handleNext={handleNext}
            handlePrev={handlePrev}
            steps={steps}
            trainingStartDate={String(
              wizardData.trainingInfo.startDate ?? ''
            )}
            trainingEndDate={String(
              wizardData.trainingInfo.endDate ?? ''
            )}
            initialData={wizardData.scheduleRegistration}
            onDataChange={handleScheduleDataChange}
          />
        )

      case 3:
        return (
          <AssessmentStep
            activeStep={step}
            handleNext={handleNext}
            handlePrev={handlePrev}
            steps={steps}
            initialData={wizardData.assessment}
            onDataChange={handleAssessmentChange}
          />
        )

      case 4:
        return (
          <StepReview
            activeStep={step}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleGoToStep={handleGoToStep}
            steps={steps}
            data={wizardData}
          />
        )

      default:
        return null
    }
  }

  return (
    <Card
      className='flex flex-col md:flex-row'
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        minWidth: 0
      }}
    >
      {/* Wizard Navigation */}
      <CardContent
        className='max-md:border-be md:min-is-[300px] md:border-ie'
        sx={{
          width: { xs: '100%', md: 320 },
          flexShrink: 0,
          p: { xs: 3, md: 4 },
          borderColor: 'divider'
        }}
      >
        <StepperWrapper>
          <Stepper
            activeStep={activeStep}
            orientation='vertical'
            connector={<></>}
            className='flex flex-col gap-4 min-is-[220px]'
          >
            {steps.map((item, index) => (
              <MuiStep
                key={item.title}
                completed={activeStep > index}
              >
                <StepLabel
                  icon={<></>}
                  onClick={() => handleGoToStep(index)}
                  className='cursor-pointer p-1'
                >
                  <div className='step-label'>
                    <CustomAvatar
                      variant='rounded'
                      skin={activeStep === index ? 'filled' : 'light'}
                      {...(activeStep >= index && {
                        color: 'primary'
                      })}
                      {...(activeStep === index && {
                        className: 'shadow-primarySm'
                      })}
                      size={38}
                    >
                      <i
                        className={classnames(
                          item.icon,
                          '!text-[22px]'
                        )}
                      />
                    </CustomAvatar>

                    <Box className='flex flex-col' sx={{ minWidth: 0 }}>
                      <Typography
                        color='text.primary'
                        className='step-title'
                        fontWeight={activeStep === index ? 700 : 500}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        className='step-subtitle'
                        variant='caption'
                        color='text.secondary'
                        sx={{ overflowWrap: 'anywhere' }}
                      >
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </div>
                </StepLabel>
              </MuiStep>
            ))}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      {/* Active Step Content */}
      <CardContent
        className='min-w-0 flex-1 pbs-6'
        sx={{
          p: { xs: 3, md: 4 },
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        {getStepContent(activeStep)}
      </CardContent>
    </Card>
  )
}

export default CreateTraining
