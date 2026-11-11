// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/admin/settings'

const NotificationsTab = dynamic(
  () => import('@views/admin/settings/notifications')
)

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  notifications: <NotificationsTab />
})

const NotificationsSettingsPage = () => {
  return <Settings tabContentList={tabContentList()} />
}

export default NotificationsSettingsPage
