// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/admin/settings'

const GeneralTab = dynamic(() => import('@views/admin/settings/general'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  general: <GeneralTab />
})

const GeneralSettingsPage = () => {
  return <Settings tabContentList={tabContentList()} />
}

export default GeneralSettingsPage
