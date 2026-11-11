export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

const primaryColorConfig: PrimaryColorConfig[] = [
  // 01 — Professional Teal
  {
    name: 'professional-teal',
    light: '#67C8C0',
    main: '#269C95',
    dark: '#1D7C76'
  },

  // 02 — Fresh Teal
  {
    name: 'fresh-teal',
    light: '#72D0C5',
    main: '#2BA89D',
    dark: '#21857D'
  },

  // 03 — Calm Green
  {
    name: 'calm-green',
    light: '#75C9A1',
    main: '#3A9B70',
    dark: '#2D7D5A'
  },

  // 04 — Sage
  {
    name: 'sage',
    light: '#A8CDB7',
    main: '#6A9F7B',
    dark: '#527E61'
  },

  // 05 — Deep Cyan
  {
    name: 'deep-cyan',
    light: '#64C4D1',
    main: '#2899A8',
    dark: '#207B87'
  },

  // 06 — Soft Blue
  {
    name: 'soft-blue',
    light: '#79B7E8',
    main: '#428FC4',
    dark: '#3473A0'
  },

  // 07 — Indigo Blue
  {
    name: 'indigo-blue',
    light: '#8299D9',
    main: '#536DB5',
    dark: '#435890'
  }
]

export default primaryColorConfig
