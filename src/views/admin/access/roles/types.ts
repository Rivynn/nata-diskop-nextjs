export type RoleType = {
  id: number
  key: SystemRole
  label: string
  description: string
  icon: string
  color: string
  userCount: number
  permissions: RolePermission[]
  isSystem: true
  canEditPermission: false
  canDelete: false
}
