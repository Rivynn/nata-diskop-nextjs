// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/admin/settings'

const IntegrationsTab = dynamic(
  () => import('@views/admin/settings/integrations')
)

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  integrations: <IntegrationsTab />
})

const IntegrationsSettingsPage = () => {
  return <Settings tabContentList={tabContentList()} />
}

export default IntegrationsSettingsPage
