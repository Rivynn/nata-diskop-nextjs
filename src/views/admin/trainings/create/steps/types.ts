export type TrainingStepItem = {
  icon: string
  title: string
  subtitle: string
}

export type TrainingStepProps = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: TrainingStepItem[]
}
