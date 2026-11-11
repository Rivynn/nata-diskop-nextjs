'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  const currentYear = new Date().getFullYear()

  return (
    <div
      className={classnames(
        verticalLayoutClasses.footerContent,
        'flex items-center justify-between flex-wrap gap-4'
      )}
    >
      {/* Copyright */}
      <p>
        <span className='text-textSecondary'>
          © {currentYear} DISKOP Kota Banjarbaru.{' '}
        </span>

        <span className='text-textSecondary'>
          Seluruh hak cipta dilindungi.
        </span>
      </p>

      {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link
            href='/admin'
            className='text-primary'
          >
            Dashboard
          </Link>

          <Link
            href='/admin/settings'
            className='text-primary'
          >
            Pengaturan
          </Link>

          <Link
            href='/admin/access/security'
            className='text-primary'
          >
            Keamanan
          </Link>

          <Link
            href='/'
            target='_blank'
            className='text-primary'
          >
            Situs Publik
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
