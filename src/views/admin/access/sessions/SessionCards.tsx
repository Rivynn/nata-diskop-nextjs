'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Styles
import styles from './SessionCards.module.css'

type Props = {
  sessions: {
    status: 'active' | 'idle'
    device: 'desktop' | 'mobile' | 'tablet'
  }[]
}

const SessionCards = ({ sessions }: Props) => {
  const activeSessions = sessions.filter(
    session => session.status === 'active'
  ).length

  const desktopSessions = sessions.filter(
    session => session.device === 'desktop'
  ).length

  const mobileSessions = sessions.filter(
    session => session.device === 'mobile'
  ).length

  const totalSessions = sessions.length

  const cards = [
    {
      title: 'Sesi Aktif',
      value: activeSessions,
      description: 'Sedang digunakan',
      icon: 'tabler-shield-check',
      color: 'success',
      label: 'ACTIVE'
    },
    {
      title: 'Perangkat Desktop',
      value: desktopSessions,
      description: 'Windows / macOS',
      icon: 'tabler-device-desktop',
      color: 'primary',
      label: 'DESKTOP'
    },
    {
      title: 'Perangkat Mobile',
      value: mobileSessions,
      description: 'Android / iOS',
      icon: 'tabler-device-mobile',
      color: 'info',
      label: 'MOBILE'
    },
    {
      title: 'Total Sesi',
      value: totalSessions,
      description: 'Terdaftar saat ini',
      icon: 'tabler-device-analytics',
      color: 'warning',
      label: 'ALL SESSIONS'
    }
  ]

  return (
    <Grid container spacing={6}>
      {cards.map(card => (
        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
          key={card.title}
        >
          <Card
            className={`${styles.card} h-full`}
          >
            {/* Accent */}
            <span
              className={`${styles.accent} ${styles[`accent-${card.color}`]}`}
            />

            <CardContent className={styles.content}>
              {/* Top */}
              <div className={styles.top}>
                <div
                  className={`${styles.iconWrapper} ${styles[`icon-${card.color}`]}`}
                >
                  <i
                    className={card.icon}
                  />
                </div>

                <span
                  className={`${styles.label} ${styles[`label-${card.color}`]}`}
                >
                  {card.label}
                </span>
              </div>

              {/* Information */}
              <div className={styles.info}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  className={styles.title}
                >
                  {card.title}
                </Typography>

                <div className={styles.valueRow}>
                  <Typography
                    variant='h4'
                    className={styles.value}
                  >
                    {card.value}
                  </Typography>

                  {card.color === 'success' && (
                    <span
                      className={
                        styles.liveIndicator
                      }
                    >
                      <span
                        className={
                          styles.liveDot
                        }
                      />

                      Live
                    </span>
                  )}
                </div>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className={
                    styles.description
                  }
                >
                  {card.description}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default SessionCards
