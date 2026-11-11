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
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import type {
  ColumnDef,
  FilterFn
} from '@tanstack/react-table'

import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
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

type UsersTypeWithAction = UsersType & {
  action?: string
}

type UserRoleType = {
  [key: string]: {
    icon: string
    color: ThemeColor
    label: string
  }
}

type UserStatusType = {
  [key: string]: ThemeColor
}

type UserAction = {
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
// Fuzzy Filter
// ---------------------------------------------------------

const fuzzyFilter: FilterFn<UsersTypeWithAction> = (
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

  const user = row.original

  const searchableText = [
    user.id,
    `USR-${String(user.id).padStart(6, '0')}`,
    `#USR-${String(user.id).padStart(6, '0')}`,
    user.fullName,
    user.username,
    user.email,
    user.phone
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
      onChange={e =>
        setValue(e.target.value)
      }
    />
  )
}

// ---------------------------------------------------------
// User Roles
// ---------------------------------------------------------

const userRoleObj: UserRoleType = {
  admin: {
    icon: 'tabler-shield',
    color: 'error',
    label: 'Administrator'
  },

  pegawai: {
    icon: 'tabler-briefcase',
    color: 'info',
    label: 'Pegawai'
  },

  pelatih: {
    icon: 'tabler-chalkboard',
    color: 'success',
    label: 'Pelatih'
  },

  peserta: {
    icon: 'tabler-user',
    color: 'primary',
    label: 'Peserta'
  },

  mitra: {
    icon: 'tabler-building-community',
    color: 'warning',
    label: 'Mitra'
  }
}

// ---------------------------------------------------------
// User Status
// ---------------------------------------------------------

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning'
}

const userStatusLabel: Record<
  string,
  string
> = {
  active: 'Aktif',
  pending: 'Menunggu'
}

// ---------------------------------------------------------
// Format User ID
// ---------------------------------------------------------

const formatUserId = (id: number) => {
  return `#USR-${String(id).padStart(6, '0')}`
}

// ---------------------------------------------------------
// Avatar
// ---------------------------------------------------------

const getAvatar = ({
                     avatar,
                     fullName
                   }: Pick<
  UsersType,
  'avatar' | 'fullName'
>) => {
  if (avatar) {
    return (
      <CustomAvatar
        src={avatar}
        size={34}
      />
    )
  }

  return (
    <CustomAvatar size={34}>
      {getInitials(fullName)}
    </CustomAvatar>
  )
}

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const UserListTable = ({
                         tableData
                       }: {
  tableData?: UsersType[]
}) => {
  // -------------------------------------------------------
  // States
  // -------------------------------------------------------

  const [addUserOpen, setAddUserOpen] =
    useState(false)

  const [editingUser, setEditingUser] =
    useState<UsersType | null>(null)

  const [rowSelection, setRowSelection] =
    useState({})

  const [data, setData] =
    useState<UsersType[]>(
      tableData ?? []
    )

  const [filteredData, setFilteredData] =
    useState<UsersType[]>(
      tableData ?? []
    )

  const [globalFilter, setGlobalFilter] =
    useState('')

  // -------------------------------------------------------
  // Sync Local Data
  // -------------------------------------------------------

  useEffect(() => {
    const nextData = tableData ?? []

    setData(nextData)
    setFilteredData(nextData)
  }, [tableData])

  // -------------------------------------------------------
  // Drawer
  // -------------------------------------------------------

  const handleAddUser = useCallback(() => {
    setEditingUser(null)
    setAddUserOpen(true)
  }, [])

  const handleEditUser = useCallback(
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
        confirmButtonColor:
          '#16805A'
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
      const result =
        await Swal.fire({
          title,
          html,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText,
          cancelButtonText: 'Batal',
          reverseButtons: true,
          focusCancel: true,
          confirmButtonColor,
          cancelButtonColor:
            '#6c757d'
        })

      return result.isConfirmed
    },
    []
  )

  // -------------------------------------------------------
  // Change Role
  // -------------------------------------------------------

  const handleChangeRole =
    useCallback(
      async (user: UsersType) => {
        const roleOptions = {
          admin: 'Administrator',
          pegawai: 'Pegawai',
          pelatih: 'Pelatih',
          peserta: 'Peserta',
          mitra: 'Mitra'
        }

        const result =
          await Swal.fire({
            title: 'Ubah Role Pengguna',

            html: `
              <div style="text-align:left">
                <div style="margin-bottom:12px">
                  Pengguna:
                  <strong>${user.fullName}</strong>
                </div>

                <select
                  id="swal-role"
                  class="swal2-select"
                  style="
                    width:100%;
                    margin:0;
                    padding:10px 14px;
                  "
                >
                  ${Object.entries(
              roleOptions
            )
              .map(
                ([value, label]) => `
                        <option
                          value="${value}"
                          ${
                  user.role ===
                  value
                    ? 'selected'
                    : ''
                }
                        >
                          ${label}
                        </option>
                      `
              )
              .join('')}
                </select>
              </div>
            `,

            icon: 'info',

            showCancelButton: true,

            confirmButtonText:
              'Lanjutkan',

            cancelButtonText:
              'Batal',

            reverseButtons: true,

            confirmButtonColor:
              '#16805A',

            cancelButtonColor:
              '#6c757d',

            preConfirm: () => {
              const select =
                document.getElementById(
                  'swal-role'
                ) as
                  | HTMLSelectElement
                  | null

              return select?.value
            }
          })

        if (
          !result.isConfirmed ||
          !result.value
        ) {
          return
        }

        const newRole =
          result.value as string

        if (
          newRole === user.role
        ) {
          return
        }

        const roleLabel =
          roleOptions[
            newRole as keyof typeof roleOptions
            ]

        const confirmed =
          await confirmAction({
            title:
              'Simpan perubahan role?',
            html: `
              Role pengguna
              <strong>${user.fullName}</strong>
              akan diubah menjadi
              <strong>${roleLabel}</strong>.
            `,
            confirmButtonText:
              'Ya, ubah role'
          })

        if (!confirmed) {
          return
        }

        const updatedData =
          data.map(item =>
            item.id === user.id
              ? {
                ...item,
                role: newRole
              }
              : item
          )

        setData(updatedData)

        await showSuccessAlert(
          'Role berhasil diubah',
          `${user.fullName} sekarang memiliki role ${roleLabel}.`
        )
      },
      [
        data,
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Verify User
  // -------------------------------------------------------

  const handleVerifyUser =
    useCallback(
      async (user: UsersType) => {
        const confirmed =
          await confirmAction({
            title:
              'Verifikasi akun?',
            html: `
              Akun
              <strong>${user.fullName}</strong>
              akan ditandai sebagai
              terverifikasi.
              <br /><br />
              <span style="font-size:13px">
                Verifikasi email tidak mengubah
                status aktif akun.
              </span>
            `,
            confirmButtonText:
              'Ya, verifikasi'
          })

        if (!confirmed) {
          return
        }

        const updatedData =
          data.map(item =>
            item.id === user.id
              ? {
                ...item,
                emailVerifiedAt:
                  new Date().toISOString()
              }
              : item
          )

        setData(updatedData)

        await showSuccessAlert(
          'Berhasil diverifikasi',
          `Akun ${user.fullName} telah diverifikasi.`
        )
      },
      [
        data,
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Activate User
  // -------------------------------------------------------

  const handleActivateUser =
    useCallback(
      async (user: UsersType) => {
        const confirmed =
          await confirmAction({
            title:
              'Aktifkan akun?',
            html: `
              Akun
              <strong>${user.fullName}</strong>
              akan diubah menjadi
              <strong>Aktif</strong>.
            `,
            confirmButtonText:
              'Ya, aktifkan',
            confirmButtonColor:
              '#16805A'
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
          'Akun diaktifkan',
          `Akun ${user.fullName} sekarang aktif.`
        )
      },
      [
        data,
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Deactivate User
  // -------------------------------------------------------

  const handleDeactivateUser =
    useCallback(
      async (user: UsersType) => {
        const confirmed =
          await confirmAction({
            title:
              'Nonaktifkan akun?',
            html: `
              Anda yakin ingin
              menonaktifkan akun
              <strong>${user.fullName}</strong>?
              <br /><br />

              Akun akan berubah menjadi
              <strong>Menunggu</strong>.
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
          'Akun dinonaktifkan',
          `Akun ${user.fullName} sekarang berstatus menunggu.`
        )
      },
      [
        data,
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // Delete User
  // -------------------------------------------------------

  const handleDeleteUser =
    useCallback(
      async (user: UsersType) => {
        const confirmed =
          await confirmAction({
            title:
              'Hapus akun?',
            html: `
              Akun
              <strong>${user.fullName}</strong>
              akan dihapus dari daftar pengguna.
              <br /><br />

              <strong>
                Tindakan ini tidak dapat dibatalkan.
              </strong>
            `,
            confirmButtonText:
              'Ya, hapus akun',
            confirmButtonColor:
              '#d32f2f'
          })

        if (!confirmed) {
          return
        }

        const updatedData =
          data.filter(
            item =>
              item.id !== user.id
          )

        setData(updatedData)

        await showSuccessAlert(
          'Akun dihapus',
          `Akun ${user.fullName} berhasil dihapus.`
        )
      },
      [
        data,
        confirmAction,
        showSuccessAlert
      ]
    )

  // -------------------------------------------------------
  // User Actions
  // -------------------------------------------------------

  const getUserActions =
    useCallback(
      (
        user: UsersType
      ): UserAction[] => {
        const actions: UserAction[] =
          [
            {
              text: 'Edit Pengguna',
              icon: 'tabler-edit',
              menuItemProps: {
                onClick: () =>
                  handleEditUser(user)
              }
            },

            {
              text: 'Ubah Password',
              icon: 'tabler-lock-password'
            },

            {
              text: 'Ubah Role',
              icon: 'tabler-user-cog',
              menuItemProps: {
                onClick: () =>
                  handleChangeRole(
                    user
                  )
              }
            }
          ]

        // Verifikasi email hanya
        // jika belum terverifikasi.
        if (
          !user.emailVerifiedAt
        ) {
          actions.push({
            text: 'Verifikasi Akun',
            icon: 'tabler-user-check',
            menuItemProps: {
              className:
                'flex items-center gap-2 text-success',
              onClick: () =>
                handleVerifyUser(
                  user
                )
            }
          })
        }

        // Status aktif
        if (
          user.status === 'active'
        ) {
          actions.push({
            text: 'Nonaktifkan Akun',
            icon: 'tabler-user-off',
            menuItemProps: {
              className:
                'flex items-center gap-2 text-warning',
              onClick: () =>
                handleDeactivateUser(
                  user
                )
            }
          })
        }

        // Status menunggu
        if (
          user.status === 'pending'
        ) {
          actions.push({
            text: 'Aktifkan Akun',
            icon: 'tabler-user-check',
            menuItemProps: {
              className:
                'flex items-center gap-2 text-success',
              onClick: () =>
                handleActivateUser(
                  user
                )
            }
          })
        }

        // Delete selalu tersedia
        actions.push({
          text: 'Hapus Akun',
          icon: 'tabler-trash',
          menuItemProps: {
            className:
              'flex items-center gap-2 text-error',
            onClick: () =>
              handleDeleteUser(
                user
              )
          }
        })

        return actions
      },
      [
        handleEditUser,
        handleChangeRole,
        handleVerifyUser,
        handleActivateUser,
        handleDeactivateUser,
        handleDeleteUser
      ]
    )

  // -------------------------------------------------------
  // Column Definitions
  // -------------------------------------------------------

  const columnHelper =
    createColumnHelper<UsersTypeWithAction>()

  const columns = useMemo<
    ColumnDef<
      UsersTypeWithAction,
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
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={
              !row.getCanSelect()
            }
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),

        enableSorting: false
      },

      // ---------------------------------------------------
      // ID
      // ---------------------------------------------------

      columnHelper.accessor('id', {
        header: 'ID',

        cell: ({ row }) => (
          <Typography
            variant='body2'
            color='text.secondary'
            className='font-medium whitespace-nowrap'
          >
            {formatUserId(
              row.original.id
            )}
          </Typography>
        )
      }),

      // ---------------------------------------------------
      // Pengguna
      // ---------------------------------------------------

      columnHelper.accessor(
        'fullName',
        {
          header: 'Pengguna',

          cell: ({ row }) => (
            <div className='flex items-center gap-4 min-is-[220px]'>
              {getAvatar({
                avatar:
                row.original.avatar,
                fullName:
                row.original.fullName
              })}

              <div className='flex flex-col'>
                <Typography
                  color='text.primary'
                  className='font-medium'
                >
                  {
                    row.original
                      .fullName
                  }
                </Typography>

                <Typography variant='body2'>
                  @{row.original.username}
                </Typography>
              </div>
            </div>
          )
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

              <Typography variant='body2'>
                {
                  row.original
                    .phone
                }
              </Typography>
            </div>
          )
        }
      ),

      // ---------------------------------------------------
      // Role
      // ---------------------------------------------------

      columnHelper.accessor(
        'role',
        {
          header: 'Role',

          cell: ({ row }) => {
            const role =
              userRoleObj[
                row.original
                  .role
                ]

            return (
              <div className='flex items-center gap-2 whitespace-nowrap'>
                <Icon
                  className={
                    role?.icon ??
                    'tabler-user'
                  }
                  sx={{
                    color: `var(--mui-palette-${role?.color ?? 'primary'}-main)`
                  }}
                />

                <Typography color='text.primary'>
                  {role?.label ??
                    row.original
                      .role}
                </Typography>
              </div>
            )
          }
        }
      ),

      // ---------------------------------------------------
      // Status
      // ---------------------------------------------------

      columnHelper.accessor(
        'status',
        {
          header: 'Status',

          cell: ({ row }) => (
            <Chip
              variant='tonal'
              label={
                userStatusLabel[
                  row.original
                    .status
                  ] ??
                row.original
                  .status
              }
              size='small'
              color={
                userStatusObj[
                  row.original
                    .status
                  ] ??
                'secondary'
              }
            />
          )
        }
      ),

      // ---------------------------------------------------
      // Verifikasi
      // ---------------------------------------------------

      columnHelper.accessor(
        'emailVerifiedAt',
        {
          header: 'Verifikasi',

          cell: ({ row }) => {
            const isVerified =
              Boolean(
                row.original
                  .emailVerifiedAt
              )

            return (
              <Chip
                variant='tonal'
                size='small'
                color={
                  isVerified
                    ? 'success'
                    : 'warning'
                }
                icon={
                  <i
                    className={
                      isVerified
                        ? 'tabler-circle-check'
                        : 'tabler-clock'
                    }
                  />
                }
                label={
                  isVerified
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
      // Aksi
      // ---------------------------------------------------

      columnHelper.display({
        id: 'action',

        header: 'Aksi',

        cell: ({ row }) => {
          const user =
            row.original

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

              {/* Context-aware actions */}
              <OptionMenu
                iconButtonProps={{
                  size: 'small'
                }}
                iconClassName='text-textSecondary'
                options={getUserActions(
                  user
                )}
              />
            </div>
          )
        },

        enableSorting: false
      })
    ],
    [getUserActions]
  )

  // -------------------------------------------------------
  // Table
  // -------------------------------------------------------

  const table = useReactTable({
    data: filteredData,

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
      getPaginationRowModel(),

    getFacetedRowModel:
      getFacetedRowModel(),

    getFacetedUniqueValues:
      getFacetedUniqueValues(),

    getFacetedMinMaxValues:
      getFacetedMinMaxValues()
  })

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <>
      <Card>
        {/* ================================================
            FILTER
        ================================================= */}

        <CardHeader
          title='Filter Pengguna'
          className='pbe-4'
        />

        <TableFilters
          setData={
            setFilteredData
          }
          tableData={data}
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
            onChange={e => {
              table.setPageSize(
                Number(
                  e.target.value
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
            {/* Search */}
            <DebouncedInput
              value={
                globalFilter ?? ''
              }
              onChange={value => {
                setGlobalFilter(
                  String(value)
                )
              }}
              placeholder='Cari nama, username, email, no. HP, atau ID...'
              className='max-sm:is-full'
            />

            {/* Export */}
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

            {/* Add */}
            <Button
              variant='contained'
              startIcon={
                <i className='tabler-plus' />
              }
              onClick={
                handleAddUser
              }
              className='max-sm:is-full'
            >
              Tambah Pengguna
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
              .map(
                headerGroup => (
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
                          {header.isPlaceholder ? null : (
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
                                  ] ??
                                null}
                            </div>
                          )}
                        </th>
                      )
                    )}
                  </tr>
                )
              )}
            </thead>

            {table.getFilteredRowModel()
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
                  Belum ada data pengguna
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
                    className={classnames(
                      {
                        selected:
                          row.getIsSelected()
                      }
                    )}
                  >
                    {row
                      .getVisibleCells()
                      .map(
                        cell => (
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
                        )
                      )}
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
            table.getFilteredRowModel()
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
          ADD / EDIT USER DRAWER
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
    </>
  )
}

export default UserListTable
