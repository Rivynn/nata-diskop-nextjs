// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Style Imports
import styles from './EmployeeListCards.module.css'

type EmployeeListCardsProps = {
  data?: Array<{
    id: number
    name: string
    username: string
    email: string
    phone: string
    avatar: string
    nik?: string
    nip?: string
    position?: string
    education?: string
    institution?: string
    employeeType?: 'internal' | 'contract' | 'internship'
    status: 'Aktif' | 'Nonaktif'
  }>
}

const EmployeeListCards = ({
                             data = []
                           }: EmployeeListCardsProps) => {
  const total = data.length

  const active = data.filter(
    employee => employee.status === 'Aktif'
  ).length

  const registeredNip = data.filter(
    employee =>
      Boolean(employee.nip) &&
      employee.nip !== '-'
  ).length

  const activeAccounts = data.filter(
    employee =>
      employee.status === 'Aktif' &&
      Boolean(employee.username) &&
      Boolean(employee.email)
  ).length

  const cards = [
    {
      title: 'Total Pegawai',
      value: total,
      icon: 'tabler-users',
      color: 'primary',
      description: 'Seluruh pegawai terdaftar'
    },
    {
      title: 'Pegawai Aktif',
      value: active,
      icon: 'tabler-user-check',
      color: 'success',
      description: 'Pegawai yang masih aktif'
    },
    {
      title: 'NIP Terdaftar',
      value: registeredNip,
      icon: 'tabler-id-badge',
      color: 'info',
      description: 'Pegawai dengan NIP tersedia'
    },
    {
      title: 'Akun Aktif',
      value: activeAccounts,
      icon: 'tabler-shield-check',
      color: 'warning',
      description: 'Memiliki akses ke sistem'
    }
  ]

  return (
    <Grid container spacing={6}>
      {cards.map(card => (
        <Grid
          size={{ xs: 12, sm: 6, lg: 3 }}
          key={card.title}
        >
          <Card className={styles.card}>
            <span
              className={`${styles.accent} ${styles[`accent-${card.color}`]}`}
            />

            <CardContent className={styles.content}>
              <div className={styles.header}>
                <div
                  className={`${styles.iconWrapper} ${styles[`icon-${card.color}`]}`}
                >
                  <CustomAvatar
                    variant='rounded'
                    skin='light'
                    color={card.color as any}
                    size={46}
                    className={styles.avatar}
                  >
                    <i className={card.icon} />
                  </CustomAvatar>
                </div>

                <span
                  className={`${styles.iconArrow} ${styles[`arrow-${card.color}`]}`}
                >
                  <i className='tabler-arrow-up-right' />
                </span>
              </div>

              <div className={styles.body}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  className={styles.title}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant='h4'
                  className={styles.value}
                >
                  {card.value}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className={styles.description}
                >
                  {card.description}
                </Typography>
              </div>

              <div className={styles.footer}>
                <span
                  className={`${styles.dot} ${styles[`dot-${card.color}`]}`}
                />

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Data pegawai
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default EmployeeListCards
