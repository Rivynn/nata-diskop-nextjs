'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import WhatsAppConfig from './WhatsAppConfig'
import TelegramConfig from './TelegramConfig'
import DiscordConfig from './DiscordConfig'
import EmailConfig from './EmailConfig'
import BrowserConfig from './BrowserConfig'
import WebhookConfig from './WebhookConfig'

type IntegrationId =
  | 'whatsapp'
  | 'telegram'
  | 'discord'
  | 'email'
  | 'browser'
  | 'webhook'

type Integration = {
  id: IntegrationId
  title: string
  logo: string
  subtitle: string
  connected: boolean
}

type Props = {
  integration: Integration | null
  open: boolean
  onClose: () => void
  onSave: () => void
}

const IntegrationConfigDialog = ({
                                   integration,
                                   open,
                                   onClose,
                                   onSave
                                 }: Props) => {
  if (!integration) return null

  const renderConfig = (): ReactNode => {
    switch (integration.id) {
      case 'whatsapp':
        return <WhatsAppConfig />

      case 'telegram':
        return <TelegramConfig />

      case 'discord':
        return <DiscordConfig />

      case 'email':
        return <EmailConfig />

      case 'browser':
        return <BrowserConfig />

      case 'webhook':
        return <WebhookConfig />

      default:
        return null
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      PaperProps={{
        className: 'overflow-hidden'
      }}
    >
      <DialogTitle className='px-6 pt-6 pb-5'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-divider bg-backgroundPaper'>
            <img
              src={integration.logo}
              alt={integration.title}
              width={28}
              height={28}
              className='object-contain'
            />
          </div>

          <div className='min-w-0'>
            <Typography
              variant='h5'
              className='text-textPrimary font-semibold'
            >
              {integration.connected
                ? `Pengaturan ${integration.title}`
                : `Hubungkan ${integration.title}`}
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              className='mt-0.5'
            >
              {integration.connected
                ? 'Kelola konfigurasi integrasi layanan.'
                : 'Masukkan informasi untuk menghubungkan layanan.'}
            </Typography>
          </div>
        </div>
      </DialogTitle>

      <Divider />

      <DialogContent className='px-6 py-6'>
        {renderConfig()}
      </DialogContent>

      <Divider />

      <DialogActions className='gap-2 px-6 py-4'>
        <Button
          variant='tonal'
          color='secondary'
          onClick={onClose}
        >
          Batal
        </Button>

        <Button
          variant='contained'
          onClick={onSave}
        >
          Simpan Perubahan
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IntegrationConfigDialog
