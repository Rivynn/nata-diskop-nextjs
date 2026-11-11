import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import ScrollToTop from '@core/components/scroll-to-top'
import TrainingNavbar from '@/components/layout/training-pages/TrainingNavbar'

const Layout = async ({ children }: ChildrenType) => {
  return (
    <Providers direction='ltr'>
      <BlankLayout children={undefined} systemMode={'light'}>
        {/* Training Navbar */}
        <TrainingNavbar />

        {/* Training Pages */}
        <main className='flex min-bs-full flex-auto flex-col'>{children}</main>

        <ScrollToTop className='mui-fixed'>
          <Button
            variant='contained'
            className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          >
            <i className='tabler-arrow-up' />
          </Button>
        </ScrollToTop>
      </BlankLayout>
    </Providers>
  )
}

export default Layout
