'use client'

import type { CSSProperties } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

import type { UsersType } from '@/types/apps/userTypes'

import styles from './ChangeRoleDialog.module.css'

type Props = {
  open: boolean
  user: UsersType | null
  selectedRole: string
  onRoleChange: (role: string) => void
  onClose: () => void
  onSubmit: () => void
}

type RoleOption = {
  value: string
  label: string
  description: string
  icon: string
  accent: string
}

const roleOptions: RoleOption[] = [
  {
    value: 'admin',
    label: 'Administrator',
    description:
      'Mengelola sistem, pengguna, dan seluruh fitur DISKOP.',
    icon: 'tabler-shield-check',
    accent: 'var(--mui-palette-error-main)'
  },
  {
    value: 'pegawai',
    label: 'Pegawai',
    description:
      'Mengelola operasional dan program pelatihan.',
    icon: 'tabler-briefcase-2',
    accent: 'var(--mui-palette-info-main)'
  },
  {
    value: 'pelatih',
    label: 'Pelatih',
    description:
      'Mengelola kelas, materi, dan peserta pelatihan.',
    icon: 'tabler-chalkboard',
    accent: 'var(--mui-palette-success-main)'
  },
  {
    value: 'peserta',
    label: 'Peserta',
    description:
      'Mengikuti pelatihan dan mengakses pembelajaran.',
    icon: 'tabler-user',
    accent: 'var(--mui-palette-primary-main)'
  },
  {
    value: 'mitra',
    label: 'Mitra',
    description:
      'Mengelola kerja sama dan kebutuhan tenaga kerja.',
    icon: 'tabler-building-community',
    accent: 'var(--mui-palette-warning-main)'
  }
]

const ChangeRoleDialog = ({
                            open,
                            user,
                            selectedRole,
                            onRoleChange,
                            onClose,
                            onSubmit
                          }: Props) => {
  const currentRole = roleOptions.find(
    role => role.value === user?.role
  )

  const selectedRoleData = roleOptions.find(
    role => role.value === selectedRole
  )

  const hasChanged =
    Boolean(user) &&
    Boolean(selectedRole) &&
    selectedRole !== user?.role

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      className={styles.changeRoleDialog}
      slotProps={{
        paper: {
          className: styles.changeRolePaper
        }
      }}
    >
      {/* =====================================================
          TOP ACCENT
      ===================================================== */}

      <div className={styles.changeRoleAccent} />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <DialogTitle className={styles.changeRoleHeader}>
        <div className={styles.changeRoleHeaderContent}>
          <div className={styles.changeRoleHeaderLeft}>
            <div className={styles.changeRoleHeaderIcon}>
              <i className='tabler-user-cog' />
            </div>

            <div className={styles.changeRoleHeaderText}>
              <div className={styles.changeRoleEyebrow}>
                AKSES & KEAMANAN
              </div>

              <Typography
                variant='h5'
                className={styles.changeRoleTitle}
              >
                Ubah Peran Pengguna
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className={styles.changeRoleSubtitle}
              >
                Atur peran dan hak akses pengguna dalam
                sistem DISKOP.
              </Typography>
            </div>
          </div>

          <IconButton
            onClick={onClose}
            className={styles.changeRoleCloseButton}
            aria-label='Tutup'
          >
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <Divider />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <DialogContent className={styles.changeRoleContent}>
        {user && (
          <div className={styles.changeRoleContentInner}>
            {/* =================================================
                USER PROFILE
            ================================================= */}

            <div className={styles.changeRoleUserCard}>
              <div className={styles.changeRoleUserGlow} />

              <div className={styles.changeRoleUserAvatar}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                  />
                ) : (
                  <i className='tabler-user' />
                )}

                <span
                  className={
                    styles.changeRoleUserOnline
                  }
                />
              </div>

              <div className={styles.changeRoleUserInfo}>
                <Typography
                  variant='subtitle1'
                  className={styles.changeRoleUserName}
                >
                  {user.fullName}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className={styles.changeRoleUsername}
                >
                  @{user.username}
                </Typography>
              </div>

              <div className={styles.changeRoleCurrentRole}>
                <span>
                  PERAN SAAT INI
                </span>

                <div
                  className={
                    styles.changeRoleCurrentRoleValue
                  }
                  style={
                    {
                      '--role-accent':
                        currentRole?.accent ??
                        'var(--mui-palette-primary-main)'
                    } as CSSProperties
                  }
                >
                  <i
                    className={
                      currentRole?.icon ??
                      'tabler-user'
                    }
                  />

                  <strong>
                    {currentRole?.label ??
                      user.role}
                  </strong>
                </div>
              </div>
            </div>

            {/* =================================================
                ROLE HEADER
            ================================================= */}

            <div className={styles.changeRoleSectionHeader}>
              <div>
                <Typography
                  variant='h6'
                  className={
                    styles.changeRoleSectionTitle
                  }
                >
                  Pilih Peran Baru
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className={
                    styles.changeRoleSectionSubtitle
                  }
                >
                  Pilih peran berdasarkan tanggung jawab
                  pengguna di DISKOP.
                </Typography>
              </div>

              <div className={styles.changeRoleCount}>
                <span>5</span>
                <span>PERAN</span>
              </div>
            </div>

            {/* =================================================
                ROLE GRID
            ================================================= */}

            <div className={styles.changeRoleGrid}>
              {roleOptions.map(role => {
                const isSelected =
                  selectedRole === role.value

                return (
                  <button
                    key={role.value}
                    type='button'
                    className={`${styles.changeRoleOption} ${
                      isSelected
                        ? styles.changeRoleOptionSelected
                        : ''
                    }`}
                    style={
                      {
                        '--role-accent':
                        role.accent
                      } as CSSProperties
                    }
                    onClick={() =>
                      onRoleChange(role.value)
                    }
                  >
                    {/* Accent */}
                    <span
                      className={
                        styles.changeRoleOptionAccent
                      }
                    />

                    {/* Icon */}
                    <span
                      className={
                        styles.changeRoleOptionIcon
                      }
                    >
                      <i className={role.icon} />
                    </span>

                    {/* Content */}
                    <span
                      className={
                        styles.changeRoleOptionContent
                      }
                    >
                      <span
                        className={
                          styles.changeRoleOptionTitle
                        }
                      >
                        {role.label}
                      </span>

                      <span
                        className={
                          styles.changeRoleOptionDescription
                        }
                      >
                        {role.description}
                      </span>
                    </span>

                    {/* Radio */}
                    <span
                      className={
                        styles.changeRoleRadio
                      }
                    >
                      {isSelected && (
                        <i className='tabler-check' />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* =================================================
                CHANGE PREVIEW
            ================================================= */}

            {hasChanged && selectedRoleData && (
              <div
                className={
                  styles.changeRolePreview
                }
              >
                <div
                  className={
                    styles.changeRolePreviewIcon
                  }
                >
                  <i className='tabler-arrows-exchange' />
                </div>

                <div
                  className={
                    styles.changeRolePreviewContent
                  }
                >
                  <span
                    className={
                      styles.changeRolePreviewLabel
                    }
                  >
                    PERUBAHAN PERAN
                  </span>

                  <div
                    className={
                      styles.changeRolePreviewRoles
                    }
                  >
                    <span>
                      {currentRole?.label ??
                        user.role}
                    </span>

                    <i className='tabler-arrow-right' />

                    <strong>
                      {selectedRoleData.label}
                    </strong>
                  </div>
                </div>

                <i
                  className={
                    styles.changeRolePreviewCheck
                  }
                >
                  <i className='tabler-circle-check' />
                </i>
              </div>
            )}

            {/* =================================================
                INFO
            ================================================= */}

            <div className={styles.changeRoleInfo}>
              <div className={styles.changeRoleInfoIcon}>
                <i className='tabler-info-circle' />
              </div>

              <div className={styles.changeRoleInfoContent}>
                <Typography
                  variant='body2'
                  className={
                    styles.changeRoleInfoTitle
                  }
                >
                  Perubahan hak akses
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                  className={
                    styles.changeRoleInfoText
                  }
                >
                  Perubahan peran akan menentukan menu,
                  fitur, dan tindakan yang dapat diakses
                  oleh pengguna tersebut.
                </Typography>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Divider />

      <DialogActions
        className={styles.changeRoleFooter}
      >
        <div className={styles.changeRoleFooterHint}>
          <i className='tabler-shield-lock' />

          <span>
            Akses pengguna dilindungi oleh sistem
            otorisasi DISKOP.
          </span>
        </div>

        <div className={styles.changeRoleFooterActions}>
          <Button
            variant='tonal'
            color='secondary'
            onClick={onClose}
            className={
              styles.changeRoleCancelButton
            }
          >
            Batal
          </Button>

          <Button
            variant='contained'
            onClick={onSubmit}
            disabled={!hasChanged}
            className={
              styles.changeRoleSubmitButton
            }
            startIcon={
              <i className='tabler-device-floppy' />
            }
          >
            Simpan Perubahan
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ChangeRoleDialog
