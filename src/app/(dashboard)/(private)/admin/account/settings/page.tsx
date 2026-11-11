// Component Imports
import AccountSettings from '@views/account/settings'
import Profile from '@views/account/settings/profile/Profile'
import Security from '@views/account/settings/security/Security'
import Integrations from '@views/account/settings/integration/Integrations'
import Signature from '@views/account/settings/signature/Signature'

const AdminAccountPage = () => {
  return (
    <AccountSettings
      tabContentList={{
        profile: <Profile />,
        security: <Security />,
        integrations: <Integrations />,
        signature: <Signature />
      }}
    />
  )
}

export default AdminAccountPage
