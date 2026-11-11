'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import type { ActivityType } from './types'

import styles from './ActivityCards.module.css'

type Props = {
  activities: ActivityType[]
}

const ActivityCards = ({
                         activities
                       }: Props) => {
  const totalActivities =
    activities.length

  const todayActivities =
    activities.filter(activity =>
      activity.createdAt.includes(
        '04 Oktober 2026'
      )
    ).length

  const successfulActivities =
    activities.filter(
      activity =>
        activity.status === 'success'
    ).length

  const failedActivities =
    activities.filter(
      activity =>
        activity.status === 'failed'
    ).length

  const cards = [
    {
      title: 'Total Aktivitas',
      value: totalActivities,
      description: 'Seluruh aktivitas tercatat',
      icon: 'tabler-activity',
      color: 'primary',
      label: 'ALL ACTIVITY'
    },
    {
      title: 'Hari Ini',
      value: todayActivities,
      description: 'Aktivitas pada hari ini',
      icon: 'tabler-calendar-event',
      color: 'info',
      label: 'TODAY'
    },
    {
      title: 'Berhasil',
      value: successfulActivities,
      description: 'Aktivitas berhasil',
      icon: 'tabler-circle-check',
      color: 'success',
      label: 'SUCCESS'
    },
    {
      title: 'Gagal',
      value: failedActivities,
      description: 'Perlu diperhatikan',
      icon: 'tabler-alert-circle',
      color: 'error',
      label: 'FAILED'
    }
  ]

  return (
    <Grid container spacing={6}>
      {cards.map(card => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >
          <Card
            className={`${styles.card} h-full`}
          >
            <span
              className={`${styles.accent} ${styles[`accent-${card.color}`]}`}
            />

            <CardContent
              className={styles.content}
            >
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

              <div className={styles.info}>
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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ActivityCards
