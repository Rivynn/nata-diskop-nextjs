'use client'

import { useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'

import CustomIconButton from '@core/components/mui/IconButton'

import IntegrationConfigDialog from './dialogs/IntegrationConfigDialog'

type IntegrationId =
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'email'
  | 'browser'
  | 'webhook'

type IntegrationType = {
  id: IntegrationId
  title: string
  logo: string
  subtitle: string
  connected: boolean
}

const messagingIntegrations: IntegrationType[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    logo: '/images/logos/whatsapp.png',
    subtitle: 'WhatsApp Business',
    connected: true
  },
  {
    id: 'telegram',
    title: 'Telegram',
    logo: '/images/logos/telegram.png',
    subtitle: 'Bot Notifikasi DISKOP',
    connected: true
  },
  {
    id: 'discord',
    title: 'Discord',
    logo: '/images/logos/discord.png',
    subtitle: 'Bot Notifikasi',
    connected: false
  }
]

const notificationIntegrations: IntegrationType[] = [
  {
    id: 'email',
    title: 'Email',
    logo: '/images/logos/gmail.png',
    subtitle: 'diskop@banjarbarukota.go.id',
    connected: true
  },
  {
    id: 'browser',
    title: 'Browser',
    logo: '/images/logos/browser.png',
    subtitle: 'Notifikasi Browser',
    connected: true
  },
  {
    id: 'webhook',
    title: 'Webhook',
    logo: '/images/logos/webhook.png',
    subtitle: 'Layanan Notifikasi Eksternal',
    connected: false
  }
]

const Integrations = () => {
  const [messaging, setMessaging] = useState(
    messagingIntegrations
  )

  const [notifications, setNotifications] = useState(
    notificationIntegrations
  )

  const [selectedIntegration, setSelectedIntegration] =
    useState<IntegrationType | null>(null)

  const handleToggle = (
    type: 'messaging' | 'notification',
    id: IntegrationId
  ) => {
    const setter =
      type === 'messaging'
        ? setMessaging
        : setNotifications

    setter(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            connected: !item.connected
          }
          : item
      )
    )
  }

  const handleOpenDialog = (
    integration: IntegrationType
  ) => {
    setSelectedIntegration(integration)
  }

  const handleCloseDialog = () => {
    setSelectedIntegration(null)
  }

  const handleSave = () => {
    if (!selectedIntegration) return

    const update = (items: IntegrationType[]) =>
      items.map(item =>
        item.id === selectedIntegration.id
          ? {
            ...item,
            connected: true
          }
          : item
      )

    setMessaging(update)
    setNotifications(update)

    handleCloseDialog()
  }

  const renderIntegration = (
    item: IntegrationType,
    type: 'messaging' | 'notification'
  ) => (
    <div
      key={item.id}
      className='flex items-center justify-between gap-4'
    >
      <div className='flex min-w-0 flex-grow items-center gap-4'>
        <img
          src={item.logo}
          alt={item.title}
          width={32}
          height={32}
          className='shrink-0 object-contain'
        />

        <div className='min-w-0 flex-grow'>
          <Typography className='text-textPrimary font-medium'>
            {item.title}
          </Typography>

          <Typography
            variant='body2'
            color={
              item.connected
                ? 'text.secondary'
                : 'text.disabled'
            }
          >
            {item.connected
              ? item.subtitle
              : 'Belum terhubung'}
          </Typography>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        <Switch
          checked={item.connected}
          onChange={() =>
            handleToggle(type, item.id)
          }
        />

        <CustomIconButton
          variant='tonal'
          color='secondary'
          onClick={() =>
            handleOpenDialog(item)
          }
        >
          <i
            className={
              item.connected
                ? 'tabler-settings'
                : 'tabler-link'
            }
          />
        </CustomIconButton>
      </div>
    </div>
  )

  return (
    <>
      <Card>
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <CardHeader
              title='Pesan & Bot'
              subheader='Kelola layanan pesan untuk mengirim notifikasi otomatis.'
            />

            <CardContent className='flex flex-col gap-4'>
              {messaging.map(item =>
                renderIntegration(
                  item,
                  'messaging'
                )
              )}
            </CardContent>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CardHeader
              title='Layanan Notifikasi'
              subheader='Kelola layanan yang digunakan untuk mengirim pemberitahuan.'
            />

            <CardContent className='flex flex-col gap-4'>
              {notifications.map(item =>
                renderIntegration(
                  item,
                  'notification'
                )
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <IntegrationConfigDialog
        integration={selectedIntegration}
        open={Boolean(selectedIntegration)}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </>
  )
}

export default Integrations
