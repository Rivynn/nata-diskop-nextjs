'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import HeroSection from './HeroSection'
import { useSettings } from '@core/hooks/useSettings'
import TrustSection from '@views/front-pages/landing-page/TrustSection'
import FeaturedTrainingSection from '@views/front-pages/landing-page/FeaturedTraining'
import HowItWorks from '@views/front-pages/landing-page/HowItWorks'
import PlatformStats from '@views/front-pages/landing-page/PlatformStats'
import Faqs from '@views/front-pages/landing-page/Faqs'
import ContactUs from '@views/front-pages/landing-page/ContactUs'
import PromotionSection from '@views/front-pages/landing-page/PromotionSection'

const LandingPageWrapper = ({ mode }: { mode: SystemMode }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='bg-backgroundPaper'>
      <HeroSection mode={mode} />
      <TrustSection/>
      <FeaturedTrainingSection/>
      <PromotionSection/>
      <HowItWorks/>
      <PlatformStats/>
      <Faqs/>
      <ContactUs/>
    </div>
  )
}

export default LandingPageWrapper
