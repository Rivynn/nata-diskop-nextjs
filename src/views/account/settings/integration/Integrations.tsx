'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomTextField from '@core/components/mui/TextField'

/* =========================================================
   TYPES
========================================================= */

type IntegrationId =
  | 'telegram'
  | 'whatsapp'
  | 'discord'

type Integration = {
  id: IntegrationId
  title: string
  logo: string
  subtitle: string
  checked: boolean
  isConnected: boolean
  accountName?: string
  accountUsername?: string
}

type Channel = {
  id: 'gmail' | 'browser'
  title: string
  logo?: string
  icon: string
  subtitle: string
  checked: boolean
}

/* =========================================================
   INITIAL DATA
========================================================= */

const initialIntegrations: Integration[] = [
  {
    id: 'telegram',
    title: 'Telegram',
    logo: '/images/logos/telegram.png',
    subtitle: 'Terima notifikasi melalui Telegram',
    checked: false,
    isConnected: false
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    logo: '/images/logos/whatsapp.png',
    subtitle: 'Terima notifikasi melalui WhatsApp',
    checked: false,
    isConnected: false
  },
  {
    id: 'discord',
    title: 'Discord',
    logo: '/images/logos/discord.png',
    subtitle: 'Terima notifikasi melalui Discord',
    checked: false,
    isConnected: false
  }
]

const initialChannels: Channel[] = [
  {
    id: 'gmail',
    title: 'Gmail',
    logo: '/images/logos/google.png',
    icon: 'tabler-mail',
    subtitle: 'Terima notifikasi melalui email akun',
    checked: true
  },
  {
    id: 'browser',
    title: 'Notifikasi Browser',
    icon: 'tabler-browser',
    subtitle: 'Tampilkan notifikasi langsung di browser',
    checked: false
  }
]

/* =========================================================
   HELPERS
========================================================= */

const generatePairingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  let result = ''

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(
      Math.floor(
        Math.random() * chars.length
      )
    )
  }

  return `DSKP-${result}`
}

/* =========================================================
   COMPONENT
========================================================= */

const Integrations = () => {
  const [integrations, setIntegrations] =
    useState<Integration[]>(
      initialIntegrations
    )

  const [channels, setChannels] =
    useState<Channel[]>(
      initialChannels
    )

  const [dialogOpen, setDialogOpen] =
    useState(false)

  const [activeIntegration, setActiveIntegration] =
    useState<Integration | null>(null)

  const [pairingCode, setPairingCode] =
    useState('')

  const [discordWebhook, setDiscordWebhook] =
    useState('')

  const [isConnecting, setIsConnecting] =
    useState(false)

  /* =======================================================
     OPEN CONNECT DIALOG
  ======================================================= */

  const handleConnect = (
    integration: Integration
  ) => {
    setActiveIntegration(
      integration
    )

    setPairingCode('')

    setDiscordWebhook('')

    setDialogOpen(true)
  }

  /* =======================================================
     CLOSE DIALOG
  ======================================================= */

  const handleCloseDialog = () => {
    if (isConnecting) return

    setDialogOpen(false)

    setActiveIntegration(null)

    setPairingCode('')

    setDiscordWebhook('')
  }

  /* =======================================================
     MOCK CONNECT
  ======================================================= */

  const handleMockConnect = () => {
    if (!activeIntegration) {
      return
    }

    setIsConnecting(true)

    /*
     * MOCK ONLY
     *
     * Telegram / WhatsApp:
     * generate pairing code seolah-olah
     * dibuat backend.
     *
     * Discord:
     * menggunakan webhook dummy.
     */

    if (
      activeIntegration.id ===
      'telegram' ||
      activeIntegration.id ===
      'whatsapp'
    ) {
      const code =
        generatePairingCode()

      setPairingCode(code)

      /*
       * Simulasi bot sudah menerima
       * pairing code.
       */
      setTimeout(() => {
        setIntegrations(
          prev =>
            prev.map(item =>
              item.id ===
              activeIntegration.id
                ? {
                  ...item,
                  isConnected:
                    true,
                  checked: true,
                  accountName:
                    activeIntegration.id ===
                    'telegram'
                      ? 'Muhammad Rizki Firdaus'
                      : 'Muhammad Rizki Firdaus',
                  accountUsername:
                    activeIntegration.id ===
                    'telegram'
                      ? '@rizkifirdaus'
                      : '+62 851 3637 3842'
                }
                : item
            )
        )

        setIsConnecting(false)

        setTimeout(() => {
          setDialogOpen(false)
          setActiveIntegration(null)
          setPairingCode('')
        }, 700)
      }, 1200)

      return
    }

    /*
     * DISCORD MOCK
     */

    setTimeout(() => {
      setIntegrations(
        prev =>
          prev.map(item =>
            item.id ===
            activeIntegration.id
              ? {
                ...item,
                isConnected: true,
                checked: true,
                accountName:
                  'DISKOP Banjarbaru',
                accountUsername:
                  'General Notifications'
              }
              : item
          )
      )

      setIsConnecting(false)

      setTimeout(() => {
        setDialogOpen(false)
        setActiveIntegration(null)
        setDiscordWebhook('')
      }, 500)
    }, 1000)
  }

  /* =======================================================
     DISCONNECT
  ======================================================= */

  const handleDisconnect = (
    id: IntegrationId
  ) => {
    setIntegrations(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            checked: false,
            isConnected: false,
            accountName: undefined,
            accountUsername:
            undefined
          }
          : item
      )
    )
  }

  /* =======================================================
     TOGGLE INTEGRATION
  ======================================================= */

  const handleIntegrationToggle = (
    id: IntegrationId
  ) => {
    setIntegrations(prev =>
      prev.map(item =>
        item.id === id &&
        item.isConnected
          ? {
            ...item,
            checked: !item.checked
          }
          : item
      )
    )
  }

  /* =======================================================
     TOGGLE GMAIL / BROWSER
  ======================================================= */

  const handleChannelToggle = (
    id: Channel['id']
  ) => {
    setChannels(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            checked: !item.checked
          }
          : item
      )
    )
  }

  /* =======================================================
     DIALOG CONTENT
  ======================================================= */

  const renderDialogContent = () => {
    if (!activeIntegration) {
      return null
    }

    /* =====================================================
       TELEGRAM
    ====================================================== */

    if (
      activeIntegration.id ===
      'telegram'
    ) {
      return (
        <div className='flex flex-col gap-5'>
          <div className='flex items-start gap-4 rounded border p-4'>
            <div className='flex shrink-0 items-center justify-center rounded bg-primary/10 p-2'>
              <i className='tabler-brand-telegram text-2xl text-primary' />
            </div>

            <div>
              <Typography className='text-textPrimary font-medium'>
                Hubungkan Telegram
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                DISKOP akan membuat kode
                penghubung secara otomatis.
              </Typography>
            </div>
          </div>

          {!pairingCode ? (
            <div className='flex flex-col gap-3'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Saat Anda menekan tombol
                di bawah, DISKOP akan
                membuat pairing code dan
                membuka bot Telegram dengan
                pesan penghubung otomatis.
              </Typography>

              <div className='flex items-start gap-3 rounded border p-3'>
                <i className='tabler-info-circle mt-0.5 text-textSecondary' />

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Anda tidak perlu
                  memasukkan kode secara
                  manual.
                </Typography>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='rounded border p-5 text-center'>
                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Pairing Code
                </Typography>

                <Typography
                  variant='h4'
                  className='mt-2 font-semibold tracking-widest'
                >
                  {pairingCode}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className='mt-2 block'
                >
                  Membuka bot Telegram...
                </Typography>
              </div>

              <div className='flex items-center justify-center gap-2'>
                <i className='tabler-loader-2 animate-spin text-primary' />

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Menunggu koneksi bot...
                </Typography>
              </div>
            </div>
          )}
        </div>
      )
    }

    /* =====================================================
       WHATSAPP
    ====================================================== */

    if (
      activeIntegration.id ===
      'whatsapp'
    ) {
      return (
        <div className='flex flex-col gap-5'>
          <div className='flex items-start gap-4 rounded border p-4'>
            <div className='flex shrink-0 items-center justify-center rounded bg-success/10 p-2'>
              <i className='tabler-brand-whatsapp text-2xl text-success' />
            </div>

            <div>
              <Typography className='text-textPrimary font-medium'>
                Hubungkan WhatsApp
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                DISKOP akan membuat kode
                penghubung secara otomatis.
              </Typography>
            </div>
          </div>

          {!pairingCode ? (
            <div className='flex flex-col gap-3'>
              <Typography
                variant='body2'
                color='text.secondary'
              >
                Klik tombol hubungkan.
                DISKOP akan membuat pairing
                code dan membuka WhatsApp
                dengan pesan yang sudah
                disiapkan.
              </Typography>

              <div className='flex items-start gap-3 rounded border p-3'>
                <i className='tabler-info-circle mt-0.5 text-textSecondary' />

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Anda tidak perlu mengetik
                  kode secara manual.
                </Typography>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='rounded border p-5 text-center'>
                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Pairing Code
                </Typography>

                <Typography
                  variant='h4'
                  className='mt-2 font-semibold tracking-widest'
                >
                  {pairingCode}
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className='mt-2 block'
                >
                  Membuka WhatsApp...
                </Typography>
              </div>

              <div className='flex items-center justify-center gap-2'>
                <i className='tabler-loader-2 animate-spin text-success' />

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Menunggu koneksi bot...
                </Typography>
              </div>
            </div>
          )}
        </div>
      )
    }

    /* =====================================================
       DISCORD
    ====================================================== */

    return (
      <div className='flex flex-col gap-5'>
        <div className='flex items-start gap-4 rounded border p-4'>
          <div className='flex shrink-0 items-center justify-center rounded bg-primary/10 p-2'>
            <i className='tabler-brand-discord text-2xl text-primary' />
          </div>

          <div>
            <Typography className='text-textPrimary font-medium'>
              Hubungkan Discord
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              Hubungkan Discord menggunakan
              Webhook.
            </Typography>
          </div>
        </div>

        <CustomTextField
          fullWidth
          label='Discord Webhook URL'
          placeholder='https://discord.com/api/webhooks/...'
          value={discordWebhook}
          onChange={event =>
            setDiscordWebhook(
              event.target.value
            )
          }
          helperText='Masukkan webhook dari channel Discord yang ingin menerima notifikasi.'
        />

        <div className='flex items-start gap-3 rounded border p-3'>
          <i className='tabler-shield-check mt-0.5 text-textSecondary' />

          <Typography
            variant='body2'
            color='text.secondary'
          >
            DISKOP hanya membutuhkan
            Webhook URL dan tidak
            membutuhkan password Discord.
          </Typography>
        </div>
      </div>
    )
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Card>
        <Grid container>
          {/* =================================================
              LEFT
          ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 6
            }}
          >
            <CardHeader
              title='Connected Accounts'
              subheader='Pilih channel yang ingin digunakan untuk menerima notifikasi DISKOP.'
            />

            <CardContent className='flex flex-col gap-4'>
              {/* =================================================
                  TELEGRAM / WHATSAPP / DISCORD
              ================================================== */}

              {integrations.map(
                item => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between gap-4'
                  >
                    <div className='flex min-w-0 flex-grow items-center gap-4'>
                      <img
                        height={32}
                        width={32}
                        src={item.logo}
                        alt={
                          item.title
                        }
                        className='shrink-0 object-contain'
                      />

                      <div className='min-w-0 flex-grow'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <Typography className='text-textPrimary font-medium'>
                            {
                              item.title
                            }
                          </Typography>

                          {item.isConnected && (
                            <Chip
                              size='small'
                              label='Connected'
                              color='success'
                              variant='tonal'
                            />
                          )}
                        </div>

                        {item.isConnected ? (
                          <Typography
                            variant='body2'
                            className='truncate'
                          >
                            {
                              item.accountName
                            }

                            {item.accountUsername &&
                              ` · ${item.accountUsername}`}
                          </Typography>
                        ) : (
                          <Typography variant='body2'>
                            {
                              item.subtitle
                            }
                          </Typography>
                        )}
                      </div>
                    </div>

                    <Switch
                      checked={
                        item.isConnected &&
                        item.checked
                      }
                      disabled={
                        !item.isConnected
                      }
                      onChange={() =>
                        handleIntegrationToggle(
                          item.id
                        )
                      }
                    />
                  </div>
                )
              )}

              <Divider className='my-1' />

              {/* =================================================
                  GMAIL
              ================================================== */}

              <div className='flex items-center justify-between gap-4'>
                <div className='flex min-w-0 flex-grow items-center gap-4'>
                  <img
                    height={32}
                    width={32}
                    src='/images/logos/google.png'
                    alt='Gmail'
                    className='shrink-0 object-contain'
                  />

                  <div className='min-w-0 flex-grow'>
                    <Typography className='text-textPrimary font-medium'>
                      Gmail
                    </Typography>

                    <Typography
                      variant='body2'
                      className='truncate'
                    >
                      Terima notifikasi melalui email akun
                    </Typography>
                  </div>
                </div>

                <Switch
                  checked={
                    channels.find(
                      item =>
                        item.id ===
                        'gmail'
                    )?.checked ??
                    false
                  }
                  onChange={() =>
                    handleChannelToggle(
                      'gmail'
                    )
                  }
                />
              </div>

              {/* =================================================
                  BROWSER
              ================================================== */}

              <div className='flex items-center justify-between gap-4'>
                <div className='flex min-w-0 flex-grow items-center gap-4'>
                  <div className='flex h-8 w-8 shrink-0 items-center justify-center'>
                    <i className='tabler-browser text-2xl text-textSecondary' />
                  </div>

                  <div className='min-w-0 flex-grow'>
                    <Typography className='text-textPrimary font-medium'>
                      Notifikasi Browser
                    </Typography>

                    <Typography
                      variant='body2'
                      className='truncate'
                    >
                      Tampilkan notifikasi langsung di browser
                    </Typography>
                  </div>
                </div>

                <Switch
                  checked={
                    channels.find(
                      item =>
                        item.id ===
                        'browser'
                    )?.checked ??
                    false
                  }
                  onChange={() =>
                    handleChannelToggle(
                      'browser'
                    )
                  }
                />
              </div>
            </CardContent>
          </Grid>

          {/* =================================================
              RIGHT
          ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 6
            }}
          >
            <CardHeader
              title='Integration Settings'
              subheader='Kelola akun yang terhubung dengan DISKOP.'
            />

            <CardContent className='flex flex-col gap-4'>
              {integrations.map(
                item => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between gap-4'
                  >
                    <div className='flex min-w-0 flex-grow items-center gap-4'>
                      <img
                        height={32}
                        width={32}
                        src={item.logo}
                        alt={
                          item.title
                        }
                        className='shrink-0 object-contain'
                      />

                      <div className='min-w-0 flex-grow'>
                        <Typography className='text-textPrimary font-medium'>
                          {
                            item.title
                          }
                        </Typography>

                        <Typography
                          variant='body2'
                          className='truncate'
                        >
                          {item.isConnected
                            ? item.accountName
                            : 'Not Connected'}
                        </Typography>
                      </div>
                    </div>

                    {item.isConnected ? (
                      <CustomIconButton
                        variant='tonal'
                        color='error'
                        onClick={() =>
                          handleDisconnect(
                            item.id
                          )
                        }
                        aria-label={`Remove ${item.title}`}
                      >
                        <i className='tabler-trash' />
                      </CustomIconButton>
                    ) : (
                      <CustomIconButton
                        variant='tonal'
                        color='secondary'
                        onClick={() =>
                          handleConnect(
                            item
                          )
                        }
                        aria-label={`Connect ${item.title}`}
                      >
                        <i className='tabler-link' />
                      </CustomIconButton>
                    )}
                  </div>
                )
              )}
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* =====================================================
          DIALOG
      ====================================================== */}

      <Dialog
        open={dialogOpen}
        onClose={
          handleCloseDialog
        }
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle className='px-6 pb-4 pt-5'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex min-w-0 items-center gap-3'>
              {activeIntegration && (
                <img
                  src={
                    activeIntegration.logo
                  }
                  alt={
                    activeIntegration.title
                  }
                  width={40}
                  height={40}
                  className='shrink-0 object-contain'
                />
              )}

              <div className='min-w-0'>
                <Typography
                  variant='h5'
                  className='text-textPrimary'
                >
                  {activeIntegration
                    ? `Hubungkan ${activeIntegration.title}`
                    : 'Hubungkan Integrasi'}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className='mt-1'
                >
                  {activeIntegration?.id ===
                  'discord'
                    ? 'Hubungkan Discord menggunakan Webhook.'
                    : 'Hubungkan akun Anda untuk menerima notifikasi DISKOP.'}
                </Typography>
              </div>
            </div>

            <IconButton
              onClick={
                handleCloseDialog
              }
              size='small'
              disabled={isConnecting}
              className='shrink-0'
            >
              <i className='tabler-x' />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className='px-6 py-5'>
          {renderDialogContent()}
        </DialogContent>

        <DialogActions
          className='px-6 py-4'
          sx={{
            borderTop: theme =>
              `1px solid ${theme.palette.divider}`,
            gap: 2
          }}
        >
          <Button
            variant='tonal'
            color='secondary'
            onClick={
              handleCloseDialog
            }
            disabled={isConnecting}
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={
              handleMockConnect
            }
            disabled={isConnecting}
            startIcon={
              <i
                className={
                  activeIntegration?.id ===
                  'telegram'
                    ? 'tabler-brand-telegram'
                    : activeIntegration?.id ===
                    'whatsapp'
                      ? 'tabler-brand-whatsapp'
                      : 'tabler-brand-discord'
                }
              />
            }
          >
            {isConnecting
              ? 'Menghubungkan...'
              : activeIntegration?.id ===
              'telegram'
                ? 'Buka Telegram'
                : activeIntegration?.id ===
                'whatsapp'
                  ? 'Buka WhatsApp'
                  : 'Hubungkan Discord'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Integrations
