import Link from 'next/link'
import { getServerMode } from '@core/utils/serverHelpers'
import LandingPageWrapper from '@views/front-pages/landing-page/LandingPageWrapper'

const LandingPage = async  () => {
  const mode = await getServerMode();


  return (
    <LandingPageWrapper mode={mode}/>
  )
}

export default LandingPage
