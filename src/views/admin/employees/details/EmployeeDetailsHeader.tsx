'use client'

import { useState } from 'react'

import Link from 'next/link'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'

import type { EmployeeRecord } from '@/views/admin/employees/all/types'

type Props = {
  employeeId: string
  employeeData?: EmployeeRecord
}

const EmployeeDetailsHeader = ({ employeeId, employeeData }: Props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  const menuOpen = Boolean(menuAnchorEl)
  const status = employeeData?.status
  const isActive = status === 'Aktif'

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const employeeTypeLabel =
    employeeData?.employeeType === 'internal'
      ? 'Internal'
      : employeeData?.employeeType === 'contract'
        ? 'Kontrak'
        : employeeData?.employeeType === 'internship'
          ? 'Magang'
          : 'Belum diatur'

  const statusColor =
    status === 'Aktif'
      ? 'success'
      : status === 'Nonaktif'
        ? 'secondary'
        : 'warning'

  return (
    <div className='flex flex-wrap items-center justify-between gap-4'>
      <div className='flex min-w-0 items-center gap-3'>
        <Tooltip title='Kembali ke daftar pegawai'>
          <IconButton
            component={Link}
            href='/admin/employees'
            aria-label='Kembali ke daftar pegawai'
            className='border border-divider hover:bg-action-hover'
          >
            <i className='tabler-arrow-left' />
          </IconButton>
        </Tooltip>

        <div className='flex min-w-0 flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <Typography variant='h5' className='font-semibold'>
              Profil Pegawai
            </Typography>

            <Chip
              size='small'
              variant='tonal'
              color={statusColor}
              icon={
                <i
                  className={
                    isActive
                      ? 'tabler-circle-check'
                      : status === 'Nonaktif'
                        ? 'tabler-circle-off'
                        : 'tabler-clock'
                  }
                />
              }
              label={status || 'Belum diatur'}
            />

            <Chip
              size='small'
              variant='outlined'
              color='secondary'
              label={employeeTypeLabel}
            />
          </div>

          <Typography variant='body2' color='text.secondary'>
            Kelola informasi, identitas, dan akun pegawai
            {employeeData?.name ? ` · ${employeeData.name}` : ''}
          </Typography>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button
          component={Link}
          href={`/admin/employees/${employeeId}/edit`}
          variant='contained'
          color='primary'
          startIcon={<i className='tabler-edit' />}
        >
          Edit Pegawai
        </Button>

        <Tooltip title='Aksi lainnya'>
          <IconButton
            onClick={handleMenuOpen}
            className='border border-divider'
            aria-label='Aksi lainnya'
            aria-controls={menuOpen ? 'employee-actions-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <i className='tabler-dots-vertical' />
          </IconButton>
        </Tooltip>

        <Menu
          id='employee-actions-menu'
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                minWidth: 230,
                mt: 1,
                border: theme => `1px solid ${theme.palette.divider}`,
                boxShadow: '0 12px 30px rgba(0,0,0,0.10)'
              }
            }
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            component={Link}
            href={`/admin/employees/${employeeId}/account`}
          >
            <ListItemIcon>
              <i className='tabler-user-cog' />
            </ListItemIcon>
            <Typography variant='body2'>Kelola Akun</Typography>
          </MenuItem>

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <i className='tabler-lock-password' />
            </ListItemIcon>
            <Typography variant='body2'>Atur Ulang Kata Sandi</Typography>
          </MenuItem>

          <Divider className='my-1' />

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <i className={isActive ? 'tabler-user-off' : 'tabler-user-check'} />
            </ListItemIcon>

            <Typography
              variant='body2'
              color={isActive ? 'warning.main' : 'success.main'}
            >
              {isActive ? 'Nonaktifkan Pegawai' : 'Aktifkan Pegawai'}
            </Typography>
          </MenuItem>

          <Divider className='my-1' />

          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <i className='tabler-trash text-error' />
            </ListItemIcon>

            <Typography variant='body2' color='error.main'>
              Hapus Pegawai
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default EmployeeDetailsHeader
