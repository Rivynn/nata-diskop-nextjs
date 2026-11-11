import type { ReactNode } from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import type { TrainingStepProps } from './types'

type Props = TrainingStepProps & {
  description: string
  children: ReactNode
  nextLabel?: string
}

const StepLayout = ({
                      activeStep,
                      handleNext,
                      handlePrev,
                      steps,
                      description,
                      children,
                      nextLabel
                    }: Props) => {
  const isLastStep = activeStep === steps.length - 1

  return (
    <div className='flex flex-col'>
      <div className='mb-6'>
        <Typography variant='h5' className='mb-1'>
          {steps[activeStep].title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {description}
        </Typography>
      </div>

      <div className='flex-1'>{children}</div>

      <Divider className='my-6' />

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <Typography variant='body2' color='text.secondary'>
          Langkah {activeStep + 1} dari {steps.length}
        </Typography>

        <div className='flex gap-3'>
          <Button
            variant='tonal'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<i className='tabler-arrow-left' />}
          >
            Kembali
          </Button>

          <Button
            variant='contained'
            onClick={handleNext}
            endIcon={<i className={isLastStep ? 'tabler-check' : 'tabler-arrow-right'} />}
          >
            {nextLabel ?? (isLastStep ? 'Selesaikan' : 'Lanjutkan')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StepLayout
