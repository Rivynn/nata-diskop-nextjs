'use client'

// React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import Swal from 'sweetalert2'

import { rankItem } from '@tanstack/match-sorter-utils'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import type {
  ColumnDef,
  FilterFn
} from '@tanstack/react-table'

import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import AddUserDrawer from '../all/AddUserDrawer'
import ChangeRoleDialog from '../all/ChangeRoleDialog'
import ChangePasswordDialog from '../all/ChangePasswordDialog'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// ---------------------------------------------------------
// TanStack Types
// ---------------------------------------------------------

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

type AdminTypeWithAction = UsersType & {
  action?: string
}

type AdminAction = {
  text: string
  icon: string
  menuItemProps?: {
    className?: string
    onClick?: () => void
  }
}

// ---------------------------------------------------------
// Styled Components
// ---------------------------------------------------------

const Icon = styled('i')({})

// ---------------------------------------------------------
// Primary Administrator
// ---------------------------------------------------------

/**
 * ID administrator utama.
 *
 * Administrator dengan ID ini tidak boleh:
 * - dihapus
 * - dinonaktifkan
 * - diubah role-nya
 *
 * Password dan detail tetap dapat dikelola
 * sesuai permission administrator yang sedang login.
 */
const PRIMARY_ADMIN_ID = 1

// ---------------------------------------------------------
// Fuzzy Filter
// ---------------------------------------------------------

const fuzzyFilter: FilterFn<AdminTypeWithAction> = (
  row,
  _columnId,
  value,
  addMeta
) => {
  const searchValue = String(value ?? '')
    .trim()
    .toLowerCase()

  if (!searchValue) {
    return true
  }

  const admin = row.original

  const searchableText = [
    admin.id,
    `ADM-${String(admin.id).padStart(4, '0')}`,
    `#ADM-${String(admin.id).padStart(4, '0')}`,
    admin.fullName,
    admin.username,
    admin.email,
    admin.phone
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const itemRank = rankItem(
    searchableText,
    searchValue
  )

  addMeta({
    itemRank
  })

  return itemRank.passed
}

// ---------------------------------------------------------
// Debounced Input
// ---------------------------------------------------------

const DebouncedInput = ({
                          value: initialValue,
                          onChange,
                          debounce = 500,
                          ...props
                        }: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return (
    <CustomTextField
      {...props}
      value={value}
      onChange={event =>
        setValue(event.target.value)
      }
    />
  )
}

// ---------------------------------------------------------
// Format Admin ID
// ---------------------------------------------------------

const formatAdminId = (id: number) => {
  return `#ADM-${String(id).padStart(4, '0')}`
}

// ---------------------------------------------------------
// Avatar
// ---------------------------------------------------------

const getAvatar = ({
                     avatar,
                     fullName
                   }: Pick<UsersType, 'avatar' | 'fullName'>) => {
  if (avatar) {
    return (
      <CustomAvatar
        src={avatar}
        size={38}
      />
    )
  }

  return (
    <CustomAvatar
      size={38}
      color='primary'
    >
      {getInitials(fullName)}
    </CustomAvatar>
  )
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const AdminListTable = ({
                          adminData
                        }: {
  adminData?: UsersType[]
}) => {
  // -------------------------------------------------------
  // States
  // -------------------------------------------------------

  const [addUserOpen, setAddUserOpen] =
    useState(false)

  const [editingUser, setEditingUser] =
    useState<UsersType | null>(null)

  const [roleDialogOpen, setRoleDialogOpen] =
    useState(false)

  const [roleUser, setRoleUser] =
    useState<UsersType | null>(null)

  const [selectedRole, setSelectedRole] =
    useState('admin')

  const [passwordDialogOpen, setPasswordDialogOpen] =
    useState(false)

  const [passwordUser, setPasswordUser] =
    useState<UsersType | null>(null)

  const [rowSelection, setRowSelection] =
    useState({})

  const [data, setData] =
    useState<UsersType[]>(
      adminData ?? []
    )

  const [globalFilter, setGlobalFilter] =
    useState('')

  // -------------------------------------------------------
  // Sync Data
  // -------------------------------------------------------

  useEffect(() => {
    setData(adminData ?? [])
  }, [adminData])

  // -------------------------------------------------------
  // SweetAlert Helpers
  // -------------------------------------------------------

  const showSuccessAlert = useCallback(
    async (
      title: string,
      text: string
    ) => {
      await Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#16805A'
      })
    },
    []
  )

  const confirmAction = useCallback(
    async ({
             title,
             html,
             confirmButtonText,
             confirmButtonColor = '#16805A'
           }: {
      title: string
      html: string
      confirmButtonText: string
      confirmButtonColor?: string
    }) => {
      const result = await Swal.fire({
        title,
        html,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Batal',
        reverseButtons: true,
        focusCancel: true,
        confirmButtonColor,
        cancelButtonColor: '#6c757d'
      })

      return result.isConfirmed
    },
    []
  )

  // -------------------------------------------------------
  // Add Administrator
  // -------------------------------------------------------

  const handleAddAdmin = useCallback(() => {
    setEditingUser(null)
    setAddUserOpen(true)
  }, [])

  const handleEditAdmin = useCallback(
    (user: UsersType) => {
      setEditingUser(user)
      setAddUserOpen(true)
    },
    []
  )

  const handleCloseUserDrawer =
    useCallback(() => {
      setAddUserOpen(false)
      setEditingUser(null)
    }, [])

  // -------------------------------------------------------
  // Change Role
  // -------------------------------------------------------

  const handleOpenRoleDialog = useCallback(
    (user: UsersType) => {
      // Primary administrator tidak boleh
      // diubah role-nya oleh admin lain.
      if (user.id === PRIMARY_ADMIN_ID) {
        return
      }

      setRoleUser(user)
      setSelectedRole(user.role)
      setRoleDialogOpen(true)
    },
    []
  )

  const handleCloseRoleDialog = useCallback(() => {
    setRoleDialogOpen(false)
    setRoleUser(null)
    setSelectedRole('admin')
  }, [])

  const handleSaveRole = useCallback(
    async () => {
      if (!roleUser || !selectedRole) {
        return
      }

      if (
        roleUser.id === PRIMARY_ADMIN_ID
      ) {
        handleCloseRoleDialog()

        return
      }

      if (
        selectedRole === roleUser.role
      ) {
        handleCloseRoleDialog()

        return
      }

      const roleOptions = {
        admin: 'Administrator',
        pegawai: 'Pegawai',
        pelatih: 'Pelatih',
        peserta: 'Peserta',
        mitra: 'Mitra'
      }

      const roleLabel =
        roleOptions[
          selectedRole as keyof typeof roleOptions
          ]

      const confirmed =
        await confirmAction({
          title: 'Simpan perubahan role?',
          html: `
            Role pengguna
            <strong>${roleUser.fullName}</strong>
            akan diubah menjadi
            <strong>${roleLabel}</strong>.
          `,
          confirmButtonText: 'Ya, ubah role'
        })

      if (!confirmed) {
        return
      }

      const updatedData =
        data.map(item =>
          item.id === roleUser.id
            ? {
              ...item,
              role: selectedRole
            }
            : item
        )

      setData(updatedData)

      handleCloseRoleDialog()

      await showSuccessAlert(
        'Role berhasil diubah',
        `${roleUser.fullName} sekarang memiliki role ${roleLabel}.`
      )
    },
    [
      roleUser,
      selectedRole,
      data,
      confirmAction,
      showSuccessAlert,
      handleCloseRoleDialog
    ]
  )

  // -------------------------------------------------------
  // Change Password
  // -------------------------------------------------------

  const handleOpenPasswordDialog =
    useCallback(
      (user: UsersType) => {
        setPasswordUser(user)
        setPasswordDialogOpen(true)
      },
      []
    )

  const handleClosePasswordDialog =
    useCallback(() => {
      setPasswordDialogOpen(false)
      setPasswordUser(null)
    }, [])

  const handleSavePassword =
    useCallback(
      async (password: string) => {
        if (!passwordUser) {
          return
        }

        const confirmed =
          await confirmAction({
            title: 'Ubah password?',
            html: `
              Password akun
              <strong>${passwordUser.fullName}</strong>
              akan diubah.
              <br /><br />
              Password baru akan digunakan
              pada login berikutnya.
            `,
            confirmButtonText:
              'Ya, ubah password'
          })

        if (!confirmed) {
          return
        }

        // TODO:
        // Ganti dengan Server Action / API Prisma.

        console.info(
          'Password update requested',
          {
            userId: passwordUser.id,
            passwordLength:
            password.length
          }
        )

        const userName =
          passwordUser.fullName

        handleClosePasswordDialog()

        await showSuccessAlert(
          'Password berhasil diubah',
          `Password akun ${userName} berhasil diperbarui.`
        )
      },
      [
        passwordUser,
        confirmAction,
        handleClosePasswordDialog,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Activate Administrator
  // -------------------------------------------------------

  const handleActivateAdmin =
    useCallback(
      async (user: UsersType) => {
        const confirmed =
          await confirmAction({
            title: 'Aktifkan administrator?',
            html: `
              Akun administrator
              <strong>${user.fullName}</strong>
              akan diaktifkan kembali.
            `,
            confirmButtonText:
              'Ya, aktifkan'
          })

        if (!confirmed) {
          return
        }

        const updatedData =
          data.map(item =>
            item.id === user.id
              ? {
                ...item,
                status: 'active'
              }
              : item
          )

        setData(updatedData)

        await showSuccessAlert(
          'Administrator diaktifkan',
          `${user.fullName} sekarang aktif.`
        )
      },
      [
        data,
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Deactivate Administrator
  // -------------------------------------------------------

  const handleDeactivateAdmin =
    useCallback(
      async (user: UsersType) => {
        // Primary administrator tidak bisa
        // dinonaktifkan.
        if (user.id === PRIMARY_ADMIN_ID) {
          return
        }

        const confirmed =
          await confirmAction({
            title:
              'Nonaktifkan administrator?',
            html: `
              Administrator
              <strong>${user.fullName}</strong>
              akan dinonaktifkan.
              <br /><br />
              Akun akan berstatus
              <strong>Menunggu Aktivasi</strong>.
            `,
            confirmButtonText:
              'Ya, nonaktifkan',
            confirmButtonColor:
              '#ed6c02'
          })

        if (!confirmed) {
          return
        }

        const updatedData =
          data.map(item =>
            item.id === user.id
              ? {
                ...item,
                status: 'pending'
              }
              : item
          )

        setData(updatedData)

        await showSuccessAlert(
          'Administrator dinonaktifkan',
          `${user.fullName} sekarang berstatus menunggu aktivasi.`
        )
      },
      [
        data,
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Delete Administrator
  // -------------------------------------------------------

  const handleDeleteAdmin =
    useCallback(
      async (user: UsersType) => {
        // Primary administrator tidak bisa
        // dihapus.
        if (user.id === PRIMARY_ADMIN_ID) {
          return
        }

        const confirmed =
          await confirmAction({
            title:
              'Hapus administrator?',
            html: `
              Akun administrator
              <strong>${user.fullName}</strong>
              akan dihapus.
              <br /><br />
              <strong>
                Tindakan ini tidak dapat dibatalkan.
              </strong>
            `,
            confirmButtonText:
              'Ya, hapus administrator',
            confirmButtonColor:
              '#d32f2f'
          })

        if (!confirmed) {
          return
        }

        setData(current =>
          current.filter(
            item =>
              item.id !== user.id
          )
        )

        await showSuccessAlert(
          'Administrator dihapus',
          `Akun ${user.fullName} berhasil dihapus.`
        )
      },
      [
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Administrator Actions
  // -------------------------------------------------------

  const getAdminActions =
    useCallback(
      (
        user: UsersType
      ): AdminAction[] => {
        const isPrimary =
          user.id === PRIMARY_ADMIN_ID

        const actions: AdminAction[] = [
          {
            text: 'Edit Administrator',
            icon: 'tabler-edit',
            menuItemProps: {
              onClick: () =>
                handleEditAdmin(user)
            }
          },

          {
            text: 'Ubah Password',
            icon: 'tabler-lock-password',
            menuItemProps: {
              onClick: () =>
                handleOpenPasswordDialog(
                  user
                )
            }
          },

          // Primary administrator
          // tidak boleh diubah role.
          ...(!isPrimary
            ? [
              {
                text: 'Ubah Role',
                icon: 'tabler-user-cog',
                menuItemProps: {
                  onClick: () =>
                    handleOpenRoleDialog(
                      user
                    )
                }
              }
            ]
            : [])
        ]

        // Primary administrator:
        // tidak ada deactivate/delete.
        if (!isPrimary) {
          if (user.status === 'active') {
            actions.push({
              text: 'Nonaktifkan Administrator',
              icon: 'tabler-user-off',
              menuItemProps: {
                className:
                  'flex items-center gap-2 text-warning',
                onClick: () =>
                  handleDeactivateAdmin(
                    user
                  )
              }
            })
          }

          if (user.status === 'pending') {
            actions.push({
              text: 'Aktifkan Administrator',
              icon: 'tabler-user-check',
              menuItemProps: {
                className:
                  'flex items-center gap-2 text-success',
                onClick: () =>
                  handleActivateAdmin(
                    user
                  )
              }
            })
          }

          actions.push({
            text: 'Hapus Administrator',
            icon: 'tabler-trash',
            menuItemProps: {
              className:
                'flex items-center gap-2 text-error',
              onClick: () =>
                handleDeleteAdmin(
                  user
                )
            }
          })
        }

        return actions
      },
      [
        handleEditAdmin,
        handleOpenPasswordDialog,
        handleOpenRoleDialog,
        handleActivateAdmin,
        handleDeactivateAdmin,
        handleDeleteAdmin
      ]
    )

  // -------------------------------------------------------
  // Column Definitions
  // -------------------------------------------------------

  const columnHelper =
    createColumnHelper<AdminTypeWithAction>()

  const columns = useMemo<
    ColumnDef<
      AdminTypeWithAction,
      any
    >[]
  >(
    () => [
      // ---------------------------------------------------
      // Checkbox
      // ---------------------------------------------------

      {
        id: 'select',

        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllRowsSelected()
            }
            indeterminate={
              table.getIsSomeRowsSelected()
            }
            onChange={
              table.getToggleAllRowsSelectedHandler()
            }
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={
              !row.getCanSelect()
            }
            indeterminate={
              row.getIsSomeSelected()
            }
            onChange={
              row.getToggleSelectedHandler()
            }
          />
        ),

        enableSorting: false
      },

      // ---------------------------------------------------
      // Admin ID
      // ---------------------------------------------------

      columnHelper.accessor('id', {
        header: 'Admin ID',

        cell: ({ row }) => (
          <Typography
            variant='body2'
            color='text.secondary'
            className='font-medium whitespace-nowrap'
          >
            {formatAdminId(
              row.original.id
            )}
          </Typography>
        )
      }),

      // ---------------------------------------------------
      // Administrator
      // ---------------------------------------------------

      columnHelper.accessor(
        'fullName',
        {
          header: 'Administrator',

          cell: ({ row }) => {
            const isPrimary =
              row.original.id ===
              PRIMARY_ADMIN_ID

            return (
              <div className='flex items-center gap-4 min-is-[250px]'>
                {getAvatar({
                  avatar:
                  row.original
                    .avatar,
                  fullName:
                  row.original
                    .fullName
                })}

                <div className='flex min-w-0 flex-col'>
                  <div className='flex items-center gap-2'>
                    <Typography
                      color='text.primary'
                      className='font-medium'
                    >
                      {
                        row.original
                          .fullName
                      }
                    </Typography>

                    {isPrimary && (
                      <Tooltip title='Administrator Utama'>
                        <Chip
                          size='small'
                          variant='tonal'
                          color='error'
                          icon={
                            <i className='tabler-shield-lock' />
                          }
                          label='Utama'
                        />
                      </Tooltip>
                    )}
                  </div>

                  <Typography variant='body2'>
                    @{row.original.username}
                  </Typography>
                </div>
              </div>
            )
          }
        }
      ),

      // ---------------------------------------------------
      // Kontak
      // ---------------------------------------------------

      columnHelper.accessor(
        'email',
        {
          header: 'Kontak',

          cell: ({ row }) => (
            <div className='flex flex-col min-is-[220px]'>
              <Typography
                color='text.primary'
                className='font-medium truncate max-is-[260px]'
                title={
                  row.original.email
                }
              >
                {
                  row.original.email
                }
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                {
                  row.original.phone
                }
              </Typography>
            </div>
          )
        }
      ),

      // ---------------------------------------------------
      // Status Akun
      // ---------------------------------------------------

      columnHelper.accessor(
        'status',
        {
          header: 'Status Akun',

          cell: ({ row }) => {
            const isActive =
              row.original.status ===
              'active'

            return (
              <Chip
                variant='tonal'
                size='small'
                color={
                  isActive
                    ? 'success'
                    : 'warning'
                }
                icon={
                  <i
                    className={
                      isActive
                        ? 'tabler-circle-check'
                        : 'tabler-clock'
                    }
                  />
                }
                label={
                  isActive
                    ? 'Aktif'
                    : 'Menunggu Aktivasi'
                }
              />
            )
          }
        }
      ),

      // ---------------------------------------------------
      // Verifikasi
      // ---------------------------------------------------

      columnHelper.accessor(
        'emailVerifiedAt',
        {
          header: 'Email',

          cell: ({ row }) => {
            const verified =
              Boolean(
                row.original
                  .emailVerifiedAt
              )

            return (
              <Chip
                variant='tonal'
                size='small'
                color={
                  verified
                    ? 'success'
                    : 'secondary'
                }
                icon={
                  <i
                    className={
                      verified
                        ? 'tabler-mail-check'
                        : 'tabler-mail-off'
                    }
                  />
                }
                label={
                  verified
                    ? 'Terverifikasi'
                    : 'Belum'
                }
              />
            )
          }
        }
      ),

      // ---------------------------------------------------
      // Terdaftar
      // ---------------------------------------------------

      columnHelper.accessor(
        'createdAt',
        {
          header: 'Terdaftar',

          cell: ({ row }) => (
            <Typography
              variant='body2'
              className='whitespace-nowrap'
            >
              {new Date(
                row.original
                  .createdAt
              ).toLocaleDateString(
                'id-ID',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }
              )}
            </Typography>
          )
        }
      ),

      // ---------------------------------------------------
      // Action
      // ---------------------------------------------------

      columnHelper.display({
        id: 'action',

        header: 'Aksi',

        cell: ({ row }) => {
          const user =
            row.original

          const isPrimary =
            user.id ===
            PRIMARY_ADMIN_ID

          return (
            <div className='flex items-center justify-end gap-1'>
              {/* Detail */}

              <Tooltip title='Lihat detail'>
                <IconButton
                  size='small'
                  component={Link}
                  href={`/admin/users/${user.id}`}
                >
                  <i className='tabler-eye text-textSecondary' />
                </IconButton>
              </Tooltip>

              {/* Primary indicator */}

              {isPrimary && (
                <Tooltip title='Administrator utama dilindungi'>
                  <IconButton
                    size='small'
                    color='error'
                  >
                    <i className='tabler-shield-lock' />
                  </IconButton>
                </Tooltip>
              )}

              {/* Actions */}

              <OptionMenu
                iconButtonProps={{
                  size: 'small'
                }}
                iconClassName='text-textSecondary'
                options={getAdminActions(
                  user
                )}
              />
            </div>
          )
        },

        enableSorting: false
      })
    ],
    [getAdminActions]
  )

  // -------------------------------------------------------
  // Table
  // -------------------------------------------------------

  const table = useReactTable({
    data,

    columns,

    filterFns: {
      fuzzy: fuzzyFilter
    },

    state: {
      rowSelection,
      globalFilter
    },

    initialState: {
      pagination: {
        pageSize: 10
      }
    },

    enableRowSelection: true,

    globalFilterFn: fuzzyFilter,

    onRowSelectionChange:
    setRowSelection,

    onGlobalFilterChange:
    setGlobalFilter,

    getCoreRowModel:
      getCoreRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getSortedRowModel:
      getSortedRowModel(),

    getPaginationRowModel:
      getPaginationRowModel()
  })

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <>
      <Card>
        {/* ================================================
            HEADER
        ================================================= */}

        <CardHeader
          title='Daftar Administrator'
          subheader='Kelola akun administrator dan hak akses pengelolaan sistem DISKOP.'
          action={
            <Button
              variant='contained'
              startIcon={
                <i className='tabler-plus' />
              }
              onClick={
                handleAddAdmin
              }
            >
              Tambah Administrator
            </Button>
          }
        />

        {/* ================================================
            TOOLBAR
        ================================================= */}

        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          {/* Page Size */}

          <CustomTextField
            select
            value={
              table.getState()
                .pagination
                .pageSize
            }
            onChange={event => {
              table.setPageSize(
                Number(
                  event.target.value
                )
              )
            }}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>
              10
            </MenuItem>

            <MenuItem value='25'>
              25
            </MenuItem>

            <MenuItem value='50'>
              50
            </MenuItem>
          </CustomTextField>

          {/* Actions */}

          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={
                globalFilter ?? ''
              }
              onChange={value => {
                setGlobalFilter(
                  String(value)
                )
              }}
              placeholder='Cari administrator, username, email, no. HP, atau ID...'
              className='max-sm:is-full'
            />

            <Button
              color='secondary'
              variant='tonal'
              startIcon={
                <i className='tabler-upload' />
              }
              className='max-sm:is-full'
            >
              Export
            </Button>
          </div>
        </div>

        {/* ================================================
            TABLE
        ================================================= */}

        <div className='overflow-x-auto'>
          <table
            className={
              tableStyles.table
            }
          >
            <thead>
            {table
              .getHeaderGroups()
              .map(headerGroup => (
                <tr
                  key={
                    headerGroup.id
                  }
                >
                  {headerGroup.headers.map(
                    header => (
                      <th
                        key={
                          header.id
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : (
                            <div
                              className={classnames(
                                {
                                  'flex items-center':
                                    header.column.getIsSorted(),

                                  'cursor-pointer select-none':
                                    header.column.getCanSort()
                                }
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header
                                  .column
                                  .columnDef
                                  .header,
                                header.getContext()
                              )}

                              {{
                                asc: (
                                  <i className='tabler-chevron-up text-xl' />
                                ),

                                desc: (
                                  <i className='tabler-chevron-down text-xl' />
                                )
                              }[
                                header.column.getIsSorted() as
                                  | 'asc'
                                  | 'desc'
                                ] ?? null}
                            </div>
                          )}
                      </th>
                    )
                  )}
                </tr>
              ))}
            </thead>

            {table
              .getFilteredRowModel()
              .rows.length === 0 ? (
              <tbody>
              <tr>
                <td
                  colSpan={
                    table.getVisibleFlatColumns()
                      .length
                  }
                  className='text-center'
                >
                  <div className='flex flex-col items-center justify-center gap-2 py-8'>
                    <i className='tabler-shield-off text-3xl text-textSecondary' />

                    <Typography
                      color='text.primary'
                      className='font-medium'
                    >
                      Belum ada administrator
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                    >
                      Administrator yang terdaftar
                      akan muncul di sini.
                    </Typography>
                  </div>
                </td>
              </tr>
              </tbody>
            ) : (
              <tbody>
              {table
                .getRowModel()
                .rows.map(row => (
                  <tr
                    key={row.id}
                    className={classnames({
                      selected:
                        row.getIsSelected()
                    })}
                  >
                    {row
                      .getVisibleCells()
                      .map(cell => (
                        <td
                          key={
                            cell.id
                          }
                        >
                          {flexRender(
                            cell
                              .column
                              .columnDef
                              .cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* ================================================
            PAGINATION
        ================================================= */}

        <TablePagination
          component={() => (
            <TablePaginationComponent
              table={table}
            />
          )}
          count={
            table
              .getFilteredRowModel()
              .rows.length
          }
          rowsPerPage={
            table.getState()
              .pagination
              .pageSize
          }
          page={
            table.getState()
              .pagination
              .pageIndex
          }
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>

      {/* ================================================
          ADD / EDIT ADMINISTRATOR
      ================================================= */}

      <AddUserDrawer
        open={addUserOpen}
        handleClose={
          handleCloseUserDrawer
        }
        userData={data}
        setData={setData}
        user={editingUser}
      />

      {/* ================================================
          CHANGE ROLE
      ================================================= */}

      <ChangeRoleDialog
        open={roleDialogOpen}
        user={roleUser}
        selectedRole={selectedRole}
        onRoleChange={
          setSelectedRole
        }
        onClose={
          handleCloseRoleDialog
        }
        onSubmit={
          handleSaveRole
        }
      />

      {/* ================================================
          CHANGE PASSWORD
      ================================================= */}

      <ChangePasswordDialog
        open={
          passwordDialogOpen
        }
        user={passwordUser}
        onClose={
          handleClosePasswordDialog
        }
        onSubmit={
          handleSavePassword
        }
      />
    </>
  )
}

export default AdminListTable
