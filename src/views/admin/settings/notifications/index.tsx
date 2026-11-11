'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import Form from '@components/Form'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import styles from './Notifications.module.css'

type NotificationChannel =
  | 'email'
  | 'browser'
  | 'telegram'
  | 'whatsapp'

type NotificationData = {
  type: string
  description: string
  icon: string
  email: boolean
  browser: boolean
  telegram: boolean
  whatsapp: boolean
}

type NotificationSettings = {
  notifications: NotificationData[]
  delivery: 'online' | 'anytime'
}

const initialSettings: NotificationSettings = {
  notifications: [
    {
      type: 'Pendaftaran Pelatihan',
      description:
        'Dapatkan pemberitahuan ketika terdapat pendaftaran peserta baru.',
      icon: 'tabler-user-plus',
      email: true,
      browser: true,
      telegram: true,
      whatsapp: true
    },
    {
      type: 'Perubahan Jadwal',
      description:
        'Dapatkan pemberitahuan ketika jadwal pelatihan mengalami perubahan.',
      icon: 'tabler-calendar-event',
      email: true,
      browser: true,
      telegram: true,
      whatsapp: true
    },
    {
      type: 'Kehadiran Peserta',
      description:
        'Informasi terkait kehadiran dan absensi peserta pelatihan.',
      icon: 'tabler-calendar-check',
      email: false,
      browser: true,
      telegram: true,
      whatsapp: true
    },
    {
      type: 'Penilaian & Sertifikat',
      description:
        'Pembaruan ketika penilaian atau sertifikat peserta tersedia.',
      icon: 'tabler-certificate',
      email: true,
      browser: true,
      telegram: true,
      whatsapp: true
    },
    {
      type: 'Kemitraan',
      description:
        'Informasi mengenai kerja sama dan aktivitas mitra.',
      icon: 'tabler-building-community',
      email: true,
      browser: true,
      telegram: true,
      whatsapp: true
    }
  ],
  delivery: 'online'
}

const channelConfig: {
  key: NotificationChannel
  label: string
  icon: string
}[] = [
  {
    key: 'email',
    label: 'Email',
    icon: 'tabler-mail'
  },
  {
    key: 'browser',
    label: 'Browser',
    icon: 'tabler-world'
  },
  {
    key: 'telegram',
    label: 'Telegram',
    icon: 'tabler-brand-telegram'
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: 'tabler-brand-whatsapp'
  }
]

const Notifications = () => {
  const [settings, setSettings] =
    useState<NotificationSettings>(() =>
      structuredClone(initialSettings)
    )

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(initialSettings)

  /**
   * Total active notification channels.
   *
   * This is calculated directly from channelConfig so the
   * summary always follows the actual configured channels.
   */
  const enabledChannels = useMemo(() => {
    return settings.notifications.reduce((total, notification) => {
      const activeCount = channelConfig.reduce(
        (count, channel) =>
          count + Number(notification[channel.key]),
        0
      )

      return total + activeCount
    }, 0)
  }, [settings.notifications])

  /**
   * Total possible channel configurations.
   *
   * 5 notification types × 4 channels = 20.
   */
  const totalChannels =
    settings.notifications.length * channelConfig.length

  /**
   * Percentage of enabled notification configurations.
   */
  const enabledPercentage =
    totalChannels > 0
      ? Math.round((enabledChannels / totalChannels) * 100)
      : 0

  const handleNotificationChange = (
    index: number,
    channel: NotificationChannel
  ) => {
    setSettings(prev => ({
      ...prev,
      notifications: prev.notifications.map(
        (notification, currentIndex) =>
          currentIndex === index
            ? {
              ...notification,
              [channel]: !notification[channel]
            }
            : notification
      )
    }))

    setSaveSuccess(false)
    setSaveError('')
  }

  /**
   * Toggle every channel for one notification type.
   *
   * Uses channelConfig instead of hardcoding individual
   * channel names so the logic remains maintainable.
   */
  const handleToggleAll = (index: number) => {
    setSettings(prev => ({
      ...prev,
      notifications: prev.notifications.map(
        (notification, currentIndex) => {
          if (currentIndex !== index) return notification

          const allEnabled = channelConfig.every(
            channel => notification[channel.key]
          )

          const nextValue = !allEnabled

          return {
            ...notification,
            ...Object.fromEntries(
              channelConfig.map(channel => [
                channel.key,
                nextValue
              ])
            )
          }
        }
      )
    }))

    setSaveSuccess(false)
    setSaveError('')
  }

  const handleDeliveryChange = (
    value: 'online' | 'anytime'
  ) => {
    setSettings(prev => ({
      ...prev,
      delivery: value
    }))

    setSaveSuccess(false)
    setSaveError('')
  }

  const handleSubmit = async () => {
    setSaveSuccess(false)
    setSaveError('')

    try {
      setIsSaving(true)

      // TODO: Replace with API request
      await new Promise(resolve =>
        setTimeout(resolve, 800)
      )

      setSaveSuccess(true)
    } catch {
      setSaveError(
        'Pengaturan notifikasi gagal disimpan. Silakan coba lagi.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSettings(structuredClone(initialSettings))
    setSaveSuccess(false)
    setSaveError('')
  }

  return (
    <Card className={styles.card}>
      {/* Header */}
      <CardHeader
        className={styles.header}
        title={
          <div className={styles.titleWrapper}>
            <div className={styles.titleIcon}>
              <i className='tabler-bell' />
            </div>

            <div>
              <Typography
                variant='h5'
                className={styles.title}
              >
                Notifikasi
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Atur bagaimana platform DISKOP mengirimkan
                informasi dan pemberitahuan.
              </Typography>
            </div>
          </div>
        }
        action={
          <Chip
            size='small'
            variant='tonal'
            color={hasChanges ? 'warning' : 'success'}
            icon={
              <i
                className={
                  hasChanges
                    ? 'tabler-alert-circle'
                    : 'tabler-circle-check'
                }
              />
            }
            label={
              hasChanges
                ? 'Belum disimpan'
                : 'Tersimpan'
            }
          />
        }
      />

      <Divider />

      {/* Summary */}
      <CardContent className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <i className='tabler-bell-ringing' />
          </div>

          <div className={styles.summaryContent}>
            <Typography
              variant='body2'
              color='text.secondary'
            >
              Channel Aktif
            </Typography>

            <div className={styles.summaryValue}>
              <Typography
                variant='h4'
                className='font-medium'
              >
                {enabledChannels}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                / {totalChannels}
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <i className='tabler-chart-donut' />
          </div>

          <div className={styles.summaryContent}>
            <Typography
              variant='body2'
              color='text.secondary'
            >
              Konfigurasi Aktif
            </Typography>

            <div className={styles.summaryValue}>
              <Typography
                variant='h4'
                className='font-medium'
              >
                {enabledPercentage}%
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <i className='tabler-send' />
          </div>

          <div className={styles.summaryContent}>
            <Typography
              variant='body2'
              color='text.secondary'
            >
              Pengiriman
            </Typography>

            <Typography
              variant='body1'
              className='font-medium'
            >
              {settings.delivery === 'online'
                ? 'Saat Online'
                : 'Kapan Saja'}
            </Typography>
          </div>
        </div>
      </CardContent>

      <Divider />

      <Form
        onSubmit={event => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        {/* Feedback */}
        {(saveSuccess || saveError) && (
          <CardContent className='pbe-0'>
            {saveSuccess && (
              <Alert
                severity='success'
                icon={
                  <i className='tabler-circle-check' />
                }
              >
                Pengaturan notifikasi berhasil disimpan.
              </Alert>
            )}

            {saveError && (
              <Alert
                severity='error'
                icon={
                  <i className='tabler-alert-circle' />
                }
              >
                {saveError}
              </Alert>
            )}
          </CardContent>
        )}

        {/* Notification Channels */}
        <CardContent className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <div>
              <Typography
                variant='h6'
                className='font-medium'
              >
                Jenis Notifikasi
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Pilih channel yang ingin digunakan untuk
                setiap jenis pemberitahuan.
              </Typography>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table
              className={`${tableStyles.table} ${styles.table}`}
            >
              <thead>
              <tr>
                <th>Notifikasi</th>

                {channelConfig.map(channel => (
                  <th key={channel.key}>
                    <Tooltip title={channel.label}>
                      <div className={styles.channelHeader}>
                        <i className={channel.icon} />
                        <span>{channel.label}</span>
                      </div>
                    </Tooltip>
                  </th>
                ))}

                <th>
                    <span className={styles.enableAllHeader}>
                      Semua
                    </span>
                </th>
              </tr>
              </thead>

              <tbody>
              {settings.notifications.map(
                (notification, index) => {
                  /**
                   * Calculate active channels dynamically.
                   */
                  const activeCount =
                    channelConfig.reduce(
                      (count, channel) =>
                        count +
                        Number(
                          notification[channel.key]
                        ),
                      0
                    )

                  const allEnabled =
                    activeCount === channelConfig.length

                  return (
                    <tr
                      key={notification.type}
                      className={styles.notificationRow}
                    >
                      <td>
                        <div
                          className={
                            styles.notificationInfo
                          }
                        >
                          <div
                            className={
                              styles.notificationIcon
                            }
                          >
                            <i
                              className={
                                notification.icon
                              }
                            />
                          </div>

                          <div
                            className={
                              styles.notificationText
                            }
                          >
                            <Typography
                              color='text.primary'
                              className='font-medium'
                            >
                              {notification.type}
                            </Typography>

                            <Typography
                              variant='body2'
                              color='text.secondary'
                            >
                              {notification.description}
                            </Typography>

                            <span
                              className={
                                styles.activeCount
                              }
                            >
                                {activeCount} dari{' '}
                              {channelConfig.length}{' '}
                              channel aktif
                              </span>
                          </div>
                        </div>
                      </td>

                      {channelConfig.map(channel => (
                        <td
                          key={channel.key}
                          className={
                            styles.checkboxCell
                          }
                        >
                          <Tooltip
                            title={
                              notification[
                                channel.key
                                ]
                                ? `Nonaktifkan ${channel.label}`
                                : `Aktifkan ${channel.label}`
                            }
                          >
                            <Checkbox
                              checked={
                                notification[
                                  channel.key
                                  ]
                              }
                              onChange={() =>
                                handleNotificationChange(
                                  index,
                                  channel.key
                                )
                              }
                            />
                          </Tooltip>
                        </td>
                      ))}

                      <td
                        className={
                          styles.checkboxCell
                        }
                      >
                        <Tooltip
                          title={
                            allEnabled
                              ? 'Nonaktifkan semua channel'
                              : 'Aktifkan semua channel'
                          }
                        >
                          <Checkbox
                            checked={allEnabled}
                            indeterminate={
                              activeCount > 0 &&
                              !allEnabled
                            }
                            onChange={() =>
                              handleToggleAll(index)
                            }
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  )
                }
              )}
              </tbody>
            </table>
          </div>
        </CardContent>

        <Divider />

        {/* Delivery Preferences */}
        <CardContent className={styles.deliverySection}>
          <div className={styles.sectionHeader}>
            <div>
              <Typography
                variant='h6'
                className='font-medium'
              >
                Preferensi Pengiriman
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Tentukan kapan sistem dapat mengirimkan
                notifikasi kepada administrator.
              </Typography>
            </div>
          </div>

          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 5 }}>
              <CustomTextField
                select
                fullWidth
                label='Waktu Pengiriman'
                value={settings.delivery}
                onChange={event =>
                  handleDeliveryChange(
                    event.target.value as
                      | 'online'
                      | 'anytime'
                  )
                }
                slotProps={{
                  select: {
                    startAdornment: (
                      <i className='tabler-clock mr-2' />
                    )
                  }
                }}
              >
                <MenuItem value='online'>
                  Hanya saat saya online
                </MenuItem>

                <MenuItem value='anytime'>
                  Kapan saja
                </MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        {/* Actions */}
        <CardContent className={styles.actions}>
          <div>
            {hasChanges && (
              <div className={styles.unsavedState}>
                <span />

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Ada perubahan yang belum disimpan
                </Typography>
              </div>
            )}
          </div>

          <div className={styles.actionButtons}>
            <Button
              variant='tonal'
              color='secondary'
              type='button'
              disabled={isSaving || !hasChanges}
              onClick={handleReset}
              startIcon={
                <i className='tabler-rotate' />
              }
            >
              Reset
            </Button>

            <Button
              variant='contained'
              type='submit'
              disabled={isSaving || !hasChanges}
              startIcon={
                isSaving ? (
                  <i className='tabler-loader-2 animate-spin' />
                ) : (
                  <i className='tabler-device-floppy' />
                )
              }
            >
              {isSaving
                ? 'Menyimpan...'
                : 'Simpan Perubahan'}
            </Button>
          </div>
        </CardContent>
      </Form>
    </Card>
  )
}

export default Notifications
