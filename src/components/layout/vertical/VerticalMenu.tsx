'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Component Imports
import CustomChip from '@core/components/mui/Chip'

type MenuItemData = {
  label: string
  href?: string
  icon?: string | ReactNode
  badge?: string | number
  badgeColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  children?: MenuItemData[]
}

type MenuSectionData = {
  type: 'section'
  label: string
  children: MenuItemData[]
}

type MenuData = MenuSectionData[]

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
  menuData: MenuData
}

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({
                            open,
                            transitionDuration
                          }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const renderIcon = (icon?: string | ReactNode) => {
  if (!icon) return null

  if (typeof icon === 'string') {
    return <i className={icon} />
  }

  return icon
}

const renderBadge = (
  badge?: string | number,
  badgeColor: MenuItemData['badgeColor'] = 'error'
) => {
  if (badge === undefined) return null

  return (
    <CustomChip
      size='small'
      label={badge}
      color={badgeColor}
      round='true'
    />
  )
}

const renderMenuItems = (items: MenuItemData[]): ReactNode =>
  items.map((item, index) => {
    const key = `${item.label}-${item.href ?? index}`

    if (item.children?.length) {
      return (
        <SubMenu
          key={key}
          label={item.label}
          icon={renderIcon(item.icon)}
        >
          {renderMenuItems(item.children)}
        </SubMenu>
      )
    }

    return (
      <MenuItem
        key={key}
        href={item.href}
        icon={renderIcon(item.icon)}
        suffix={renderBadge(item.badge, item.badgeColor)}
      >
        {item.label}
      </MenuItem>
    )
  })

const VerticalMenu = ({ scrollMenu, menuData }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const {
    isBreakpointReached,
    transitionDuration
  } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached
    ? 'div'
    : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(
        isBreakpointReached
          ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: (container: any) =>
              scrollMenu(container, false)
          }
          : {
            options: {
              wheelPropagation: false,
              suppressScrollX: true
            },
            onScrollY: (container: any) =>
              scrollMenu(container, true)
          }
      )}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(
          verticalNavOptions,
          theme
        )}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{
          icon: <i className='tabler-circle text-xs' />
        }}
        menuSectionStyles={menuSectionStyles(
          verticalNavOptions,
          theme
        )}
      >
        {menuData.map(section => (
          <MenuSection
            key={section.label}
            label={section.label}
          >
            {renderMenuItems(section.children)}
          </MenuSection>
        ))}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
