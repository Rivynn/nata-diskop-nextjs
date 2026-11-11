'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { styled, useColorScheme, useTheme } from '@mui/material/styles'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import VerticalNav, { NavHeader, NavCollapseIcons } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import SidebarProfile from '@components/layout/vertical/SidebarProfile'

type Props = {
  mode: Mode
  menuData: any[]
}

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-paper) ${
    theme.direction === 'rtl' ? '95%' : '5%'
  }, rgb(var(--mui-palette-background-paperChannel) / 0.85) 30%, rgb(var(--mui-palette-background-paperChannel) / 0.5) 65%, rgb(var(--mui-palette-background-paperChannel) / 0.3) 75%, transparent)`,

  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = (props: Props) => {
  const { mode, menuData } = props

  // Hooks
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()
  const { muiMode, muiSystemMode } = useColorScheme()
  const theme = useTheme()

  // Refs
  const shadowRef = useRef<HTMLDivElement>(null)

  // Vars
  const {
    isCollapsed,
    isHovered,
    collapseVerticalNav,
    isBreakpointReached
  } = verticalNavOptions

  const isSemiDark = settings.semiDark

  const currentMode =
    muiMode === 'system'
      ? muiSystemMode
      : muiMode || mode

  const isDark = currentMode === 'dark'

  const scrollMenu = (
    container: any,
    isPerfectScrollbar: boolean
  ) => {
    container =
      isBreakpointReached || !isPerfectScrollbar
        ? container.target
        : container

    if (shadowRef.current && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('scrolled')) {
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      shadowRef.current?.classList.remove('scrolled')
    }
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  return (
    <VerticalNav
      customStyles={navigationCustomStyles(verticalNavOptions, theme)}
      collapsedWidth={71}
      backgroundColor='var(--mui-palette-background-paper)'
      {...(isSemiDark &&
        !isDark && {
          'data-dark': ''
        })}
    >
      {/* Navigation Header */}
      <NavHeader>
        <Link href='/'>
          <Logo />
        </Link>

        {!(isCollapsed && !isHovered) && (
          <NavCollapseIcons
            lockedIcon={
              <i className='tabler-circle-dot text-xl' />
            }
            unlockedIcon={
              <i className='tabler-circle text-xl' />
            }
            closeIcon={
              <i className='tabler-x text-xl' />
            }
            onClick={() =>
              updateSettings({
                layout: !isCollapsed
                  ? 'collapsed'
                  : 'vertical'
              })
            }
          />
        )}
      </NavHeader>

      <StyledBoxForShadow ref={shadowRef} />
      <SidebarProfile />

      <VerticalMenu
        scrollMenu={scrollMenu}
        menuData={menuData}
      />
    </VerticalNav>
  )
}

export default Navigation
