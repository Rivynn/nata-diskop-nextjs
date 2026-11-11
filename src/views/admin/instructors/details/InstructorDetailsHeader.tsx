'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'

import Link from 'next/link'

import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

type Props = {
  instructorId: string
}

const InstructorDetailsHeader = ({
                                   instructorId
                                 }: Props) => {
  /*
   * Prototype data.
   *
   * Nanti status dan nama diambil dari
   * server / Prisma berdasarkan instructorId.
   */
  const instructor = {
    id: instructorId,
    name: 'Ahmad Fauzan',
    status: 'active' as const
  }

  const isActive =
    instructor.status === 'active'

  const [menuAnchorEl, setMenuAnchorEl] =
    useState<null | HTMLElement>(null)

  const menuOpen =
    Boolean(menuAnchorEl)

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  return (
    <div className='flex flex-wrap items-center justify-between gap-4'>

      {/* =====================================================
          LEFT
      ====================================================== */}

      <div className='flex min-w-0 items-center gap-3'>

        {/* Back */}

        <Tooltip title='Kembali ke SDM Pelatih'>
          <IconButton
            component={Link}
            href='/admin/instructors'
            size='small'
            className='border border-divider hover:bg-action-hover'
          >
            <i className='tabler-arrow-left' />
          </IconButton>
        </Tooltip>

        {/* Context */}

        <div className='flex min-w-0 flex-col gap-0.5'>

          <div className='flex flex-wrap items-center gap-2'>
            <Typography
              variant='h5'
              className='font-semibold'
            >
              Profil Pelatih
            </Typography>

            <Chip
              size='small'
              variant='tonal'
              color={
                isActive
                  ? 'success'
                  : 'secondary'
              }
              icon={
                <i
                  className={
                    isActive
                      ? 'tabler-circle-check'
                      : 'tabler-circle-off'
                  }
                />
              }
              label={
                isActive
                  ? 'Aktif'
                  : 'Tidak Aktif'
              }
            />
          </div>

          <Typography
            variant='body2'
            color='text.secondary'
          >
            Kelola informasi, kompetensi, dan aktivitas pelatih
          </Typography>
        </div>
      </div>

      {/* =====================================================
          RIGHT ACTIONS
      ====================================================== */}

      <div className='flex items-center gap-2'>

        {/* =================================================
            KARTU PELATIH
        ================================================== */}

        <Tooltip title='Lihat kartu pelatih'>
          <Button
            component={Link}
            href={`/admin/instructors/${instructorId}/card`}
            variant='tonal'
            color='secondary'
            startIcon={
              <i className='tabler-id-badge-2' />
            }
          >
            Kartu Pelatih
          </Button>
        </Tooltip>

        {/* =================================================
            EDIT
        ================================================== */}

        <Button
          component={Link}
          href={`/admin/instructors/${instructorId}/edit`}
          variant='contained'
          color='primary'
          startIcon={
            <i className='tabler-edit' />
          }
        >
          Edit Pelatih
        </Button>

        {/* =================================================
            MORE
        ================================================== */}

        <Tooltip title='Lainnya'>
          <IconButton
            size='small'
            onClick={handleMenuOpen}
            className='border border-divider'
            aria-label='Aksi lainnya'
            aria-controls={
              menuOpen
                ? 'instructor-actions-menu'
                : undefined
            }
            aria-haspopup='true'
            aria-expanded={
              menuOpen
                ? 'true'
                : undefined
            }
          >
            <i className='tabler-dots-vertical' />
          </IconButton>
        </Tooltip>

        <Menu
          id='instructor-actions-menu'
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
                minWidth: 220,
                mt: 1,
                border: theme =>
                  `1px solid ${theme.palette.divider}`,
                boxShadow:
                  '0 12px 30px rgba(0,0,0,0.10)'
              }
            }
          }}
        >

          {/* ===============================================
              STATUS
          ================================================ */}

          <OpenDialogOnElementClick
            element={MenuItem}
            elementProps={{
              onClick: () =>
                setMenuAnchorEl(null),
              children: (
                <>
                  <ListItemIcon>
                    <i
                      className={
                        isActive
                          ? 'tabler-user-off'
                          : 'tabler-user-check'
                      }
                    />
                  </ListItemIcon>

                  <Typography
                    variant='body2'
                    color={
                      isActive
                        ? 'warning.main'
                        : 'success.main'
                    }
                  >
                    {isActive
                      ? 'Nonaktifkan Pelatih'
                      : 'Aktifkan Pelatih'}
                  </Typography>
                </>
              )
            }}
            dialog={ConfirmationDialog}
            dialogProps={{
              type: isActive
                ? 'deactivate-instructor'
                : 'activate-instructor'
            }}
          />

          {/* ===============================================
              DIVIDER
          ================================================ */}

          <Divider className='my-1' />

          {/* ===============================================
              DELETE
          ================================================ */}

          <OpenDialogOnElementClick
            element={MenuItem}
            elementProps={{
              onClick: () =>
                setMenuAnchorEl(null),
              children: (
                <>
                  <ListItemIcon>
                    <i className='tabler-trash text-error' />
                  </ListItemIcon>

                  <Typography
                    variant='body2'
                    color='error.main'
                  >
                    Hapus Pelatih
                  </Typography>
                </>
              )
            }}
            dialog={ConfirmationDialog}
            dialogProps={{
              type: 'delete-instructor'
            }}
          />

        </Menu>
      </div>
    </div>
  )
}

export default InstructorDetailsHeader
