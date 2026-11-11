import type { ThemeColor } from '@core/types'

export type InstructorStatsType = {
  title: string
  avatarIcon: string
  color?: ThemeColor
  description: string
} & (
  | {
  stats?: string
  content?: string
  chipLabel?: never
}
  | {
  chipLabel?: string
  stats?: never
  content?: never
}
  )
