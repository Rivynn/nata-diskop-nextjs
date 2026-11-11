// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import type { ChipProps } from '@mui/material/Chip'

// Type Imports
import type {
  VerticalMenuDataType,
  VerticalSectionDataType,
  VerticalSubMenuDataType,
  VerticalMenuItemDataType,
  HorizontalMenuDataType,
  HorizontalSubMenuDataType,
  HorizontalMenuItemDataType
} from '@/types/menuTypes'

// Component Imports
import {
  SubMenu as HorizontalSubMenu,
  MenuItem as HorizontalMenuItem
} from '@menu/horizontal-menu'

import {
  SubMenu as VerticalSubMenu,
  MenuItem as VerticalMenuItem,
  MenuSection
} from '@menu/vertical-menu'

import CustomChip from '@core/components/mui/Chip'

// Generate Vertical Menu
export const GenerateVerticalMenu = ({
                                       menuData
                                     }: {
  menuData: VerticalMenuDataType[]
}) => {
  const renderMenuItems = (
    data: VerticalMenuDataType[]
  ) => {
    return data.map(
      (
        item: VerticalMenuDataType,
        index
      ) => {
        const menuSectionItem =
          item as VerticalSectionDataType

        const subMenuItem =
          item as VerticalSubMenuDataType

        const menuItem =
          item as VerticalMenuItemDataType

        // Section
        if (menuSectionItem.isSection) {
          const {
            children,
            isSection,
            ...rest
          } = menuSectionItem

          return (
            <MenuSection
              key={index}
              {...rest}
            >
              {children &&
                renderMenuItems(children)}
            </MenuSection>
          )
        }

        // Sub Menu
        if (subMenuItem.children) {
          const {
            children,
            icon,
            prefix,
            suffix,
            ...rest
          } = subMenuItem

          const Icon = icon ? (
            <i className={icon} />
          ) : null

          const subMenuPrefix: ReactNode =
            prefix &&
            (prefix as ChipProps).label ? (
              <CustomChip
                size='small'
                round='true'
                {...(prefix as ChipProps)}
              />
            ) : (
              (prefix as ReactNode)
            )

          const subMenuSuffix: ReactNode =
            suffix &&
            (suffix as ChipProps).label ? (
              <CustomChip
                size='small'
                round='true'
                {...(suffix as ChipProps)}
              />
            ) : (
              (suffix as ReactNode)
            )

          return (
            <VerticalSubMenu
              key={index}
              prefix={subMenuPrefix}
              suffix={subMenuSuffix}
              {...rest}
              {...(Icon && {
                icon: Icon
              })}
            >
              {children &&
                renderMenuItems(children)}
            </VerticalSubMenu>
          )
        }

        // Menu Item
        const {
          label,
          icon,
          prefix,
          suffix,
          ...rest
        } = menuItem

        const Icon = icon ? (
          <i className={icon} />
        ) : null

        const menuItemPrefix: ReactNode =
          prefix &&
          (prefix as ChipProps).label ? (
            <CustomChip
              size='small'
              round='true'
              {...(prefix as ChipProps)}
            />
          ) : (
            (prefix as ReactNode)
          )

        const menuItemSuffix: ReactNode =
          suffix &&
          (suffix as ChipProps).label ? (
            <CustomChip
              size='small'
              round='true'
              {...(suffix as ChipProps)}
            />
          ) : (
            (suffix as ReactNode)
          )

        return (
          <VerticalMenuItem
            key={index}
            prefix={menuItemPrefix}
            suffix={menuItemSuffix}
            {...rest}
            {...(rest.href && {
              href: rest.href
            })}
            {...(Icon && {
              icon: Icon
            })}
          >
            {label}
          </VerticalMenuItem>
        )
      }
    )
  }

  return <>{renderMenuItems(menuData)}</>
}

// Generate Horizontal Menu
export const GenerateHorizontalMenu = ({
                                         menuData
                                       }: {
  menuData: HorizontalMenuDataType[]
}) => {
  const renderMenuItems = (
    data: HorizontalMenuDataType[]
  ) => {
    return data.map(
      (
        item: HorizontalMenuDataType,
        index
      ) => {
        const subMenuItem =
          item as HorizontalSubMenuDataType

        const menuItem =
          item as HorizontalMenuItemDataType

        // Sub Menu
        if (subMenuItem.children) {
          const {
            children,
            icon,
            prefix,
            suffix,
            ...rest
          } = subMenuItem

          const Icon = icon ? (
            <i className={icon} />
          ) : null

          const subMenuPrefix: ReactNode =
            prefix &&
            (prefix as ChipProps).label ? (
              <CustomChip
                size='small'
                round='true'
                {...(prefix as ChipProps)}
              />
            ) : (
              (prefix as ReactNode)
            )

          const subMenuSuffix: ReactNode =
            suffix &&
            (suffix as ChipProps).label ? (
              <CustomChip
                size='small'
                round='true'
                {...(suffix as ChipProps)}
              />
            ) : (
              (suffix as ReactNode)
            )

          return (
            <HorizontalSubMenu
              key={index}
              prefix={subMenuPrefix}
              suffix={subMenuSuffix}
              {...rest}
              {...(Icon && {
                icon: Icon
              })}
            >
              {children &&
                renderMenuItems(children)}
            </HorizontalSubMenu>
          )
        }

        // Menu Item
        const {
          label,
          icon,
          prefix,
          suffix,
          ...rest
        } = menuItem

        const Icon = icon ? (
          <i className={icon} />
        ) : null

        const menuItemPrefix: ReactNode =
          prefix &&
          (prefix as ChipProps).label ? (
            <CustomChip
              size='small'
              round='true'
              {...(prefix as ChipProps)}
            />
          ) : (
            (prefix as ReactNode)
          )

        const menuItemSuffix: ReactNode =
          suffix &&
          (suffix as ChipProps).label ? (
            <CustomChip
              size='small'
              round='true'
              {...(suffix as ChipProps)}
            />
          ) : (
            (suffix as ReactNode)
          )

        return (
          <HorizontalMenuItem
            key={index}
            prefix={menuItemPrefix}
            suffix={menuItemSuffix}
            {...rest}
            {...(rest.href && {
              href: rest.href
            })}
            {...(Icon && {
              icon: Icon
            })}
          >
            {label}
          </HorizontalMenuItem>
        )
      }
    )
  }

  return <>{renderMenuItems(menuData)}</>
}
