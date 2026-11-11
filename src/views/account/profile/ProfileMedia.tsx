'use client'

import { useState } from 'react'
import type { MouseEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

/* =========================================================
   TYPES
========================================================= */

type DocumentType = 'image' | 'pdf' | 'document'

type DocumentCategory =
  | 'photo'
  | 'identity'
  | 'education'
  | 'certificate'
  | 'administration'
  | 'other'

type DocumentItem = {
  id: number
  name: string
  description: string
  type: DocumentType
  category: DocumentCategory
  fileType: 'JPG' | 'JPEG' | 'PNG' | 'WEBP' | 'PDF' | 'DOCX'
  size: string
  updatedAt: string
  preview?: string
  verified?: boolean
}

/* =========================================================
   MOCK DATA
========================================================= */

const documents: DocumentItem[] = [
  {
    id: 1,
    name: 'Pas Foto',
    description: 'Pas foto resmi peserta',
    type: 'image',
    category: 'photo',
    fileType: 'JPG',
    size: '1.2 MB',
    updatedAt: '12 September 2026',
    preview: '/images/avatars/1.png',
    verified: true
  },
  {
    id: 2,
    name: 'Kartu Tanda Penduduk',
    description: 'Dokumen identitas pribadi',
    type: 'image',
    category: 'identity',
    fileType: 'JPG',
    size: '2.1 MB',
    updatedAt: '12 September 2026',
    preview: '/images/avatars/1.png',
    verified: true
  },
  {
    id: 3,
    name: 'Kartu Keluarga',
    description: 'Dokumen data keluarga',
    type: 'pdf',
    category: 'identity',
    fileType: 'PDF',
    size: '1.4 MB',
    updatedAt: '12 September 2026',
    verified: true
  },
  {
    id: 4,
    name: 'Ijazah S1',
    description: 'Dokumen pendidikan terakhir',
    type: 'image',
    category: 'education',
    fileType: 'JPG',
    size: '2.8 MB',
    updatedAt: '20 Agustus 2026',
    preview: '/images/avatars/1.png',
    verified: true
  },
  {
    id: 5,
    name: 'Sertifikat Web Development',
    description: 'Sertifikat penyelesaian pelatihan',
    type: 'pdf',
    category: 'certificate',
    fileType: 'PDF',
    size: '1.8 MB',
    updatedAt: '12 September 2026',
    verified: true
  },
  {
    id: 6,
    name: 'Sertifikat Digital Marketing',
    description: 'Sertifikat penyelesaian pelatihan',
    type: 'pdf',
    category: 'certificate',
    fileType: 'PDF',
    size: '1.5 MB',
    updatedAt: '28 Agustus 2026',
    verified: true
  },
  {
    id: 7,
    name: 'Kartu Peserta DISKOP',
    description: 'Kartu identitas peserta pelatihan',
    type: 'pdf',
    category: 'administration',
    fileType: 'PDF',
    size: '820 KB',
    updatedAt: '15 Agustus 2026'
  },
  {
    id: 8,
    name: 'Dokumen Pendukung',
    description: 'Dokumen administrasi peserta',
    type: 'document',
    category: 'other',
    fileType: 'DOCX',
    size: '950 KB',
    updatedAt: '5 Agustus 2026'
  }
]

/* =========================================================
   CATEGORY LABEL
========================================================= */

const categoryLabels: Record<DocumentCategory, string> = {
  photo: 'Pas Foto',
  identity: 'Identitas',
  education: 'Pendidikan',
  certificate: 'Sertifikat',
  administration: 'Administrasi',
  other: 'Lainnya'
}

/* =========================================================
   DOCUMENT PREVIEW
========================================================= */

const DocumentPreview = ({
                           document
                         }: {
  document: DocumentItem
}) => {
  /* -------------------------------------------------------
     IMAGE
  ------------------------------------------------------- */

  if (document.type === 'image' && document.preview) {
    return (
      <div className='relative overflow-hidden rounded-xl border border-divider bs-[190px]'>
        <img
          src={document.preview}
          alt='Pratinjau dokumen'
          className='absolute inset-0 w-full h-full object-cover scale-110 blur-[16px]'
        />

        <div className='absolute inset-0 bg-black/20' />

        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center bs-12 is-12 rounded-full bg-white/90 shadow-lg'>
            <i className='tabler-lock text-[22px] text-textPrimary' />
          </div>

          <Typography
            variant='caption'
            className='font-semibold text-white mt-2'
          >
            Dokumen Terlindungi
          </Typography>

          <Typography
            variant='caption'
            className='text-white/80'
          >
            Klik untuk melihat
          </Typography>
        </div>
      </div>
    )
  }

  /* -------------------------------------------------------
     PDF
  ------------------------------------------------------- */

  if (document.type === 'pdf') {
    return (
      <div className='relative overflow-hidden rounded-xl border border-divider bg-background bs-[190px]'>
        <div className='absolute inset-5 rounded-lg border border-divider bg-paper shadow-sm overflow-hidden'>
          <div className='absolute inset-5 flex flex-col gap-3'>
            <div className='h-3 w-32 rounded bg-error/20' />

            <div className='h-2 w-4/5 rounded bg-textSecondary/10' />
            <div className='h-2 w-full rounded bg-textSecondary/10' />
            <div className='h-2 w-11/12 rounded bg-textSecondary/10' />

            <div className='mt-2 flex flex-col gap-2'>
              <div className='h-2 w-full rounded bg-textSecondary/10' />
              <div className='h-2 w-10/12 rounded bg-textSecondary/10' />
              <div className='h-2 w-9/12 rounded bg-textSecondary/10' />
              <div className='h-2 w-full rounded bg-textSecondary/10' />
            </div>

            <div className='mt-auto flex justify-between'>
              <div className='h-10 w-20 rounded bg-textSecondary/10' />
              <div className='h-8 w-24 rounded bg-error/10' />
            </div>
          </div>

          <div className='absolute inset-0 backdrop-blur-[7px] bg-background/30' />
        </div>

        <div className='absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/45 via-black/5 to-transparent'>
          <div className='flex items-center justify-center bs-12 is-12 rounded-full bg-white/90 shadow-lg'>
            <i className='tabler-file-lock text-[22px] text-textPrimary' />
          </div>

          <Typography
            variant='caption'
            className='font-semibold text-white mt-2'
          >
            Dokumen Terlindungi
          </Typography>

          <Typography
            variant='caption'
            className='text-white/80'
          >
            Klik untuk melihat
          </Typography>
        </div>
      </div>
    )
  }

  /* -------------------------------------------------------
     DOC / DOCX
  ------------------------------------------------------- */

  return (
    <div className='relative overflow-hidden rounded-xl border border-divider bg-background bs-[190px]'>
      <div className='absolute inset-5 rounded-lg border border-divider bg-background overflow-hidden'>
        <div className='absolute inset-5 flex flex-col gap-3'>
          <div className='h-3 w-36 rounded bg-info/20' />

          <div className='h-2 w-full rounded bg-textSecondary/10' />
          <div className='h-2 w-11/12 rounded bg-textSecondary/10' />
          <div className='h-2 w-4/5 rounded bg-textSecondary/10' />

          <div className='mt-3 h-16 rounded bg-textSecondary/5' />

          <div className='h-2 w-full rounded bg-textSecondary/10' />
          <div className='h-2 w-9/12 rounded bg-textSecondary/10' />
        </div>

        <div className='absolute inset-0 backdrop-blur-[7px] bg-background/30' />
      </div>

      <div className='absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/45 via-black/5 to-transparent'>
        <div className='flex items-center justify-center bs-12 is-12 rounded-full bg-white/90 shadow-lg'>
          <i className='tabler-file-lock text-[22px] text-textPrimary' />
        </div>

        <Typography
          variant='caption'
          className='font-semibold text-white mt-2'
        >
          Dokumen Terlindungi
        </Typography>

        <Typography
          variant='caption'
          className='text-white/80'
        >
          Klik untuk melihat
        </Typography>
      </div>
    </div>
  )
}

/* =========================================================
   DOCUMENT CARD
========================================================= */

const DocumentCard = ({
                        document,
                        onView,
                        onDetail,
                        onDownload
                      }: {
  document: DocumentItem
  onView: () => void
  onDetail: () => void
  onDownload: () => void
}) => {
  const [menuAnchor, setMenuAnchor] =
    useState<null | HTMLElement>(null)

  const menuOpen = Boolean(menuAnchor)

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleView = () => {
    handleMenuClose()
    onView()
  }

  const handleDetail = () => {
    handleMenuClose()
    onDetail()
  }

  const handleDownload = () => {
    handleMenuClose()
    onDownload()
  }

  return (
    <>
      <Card
        variant='outlined'
        onClick={onView}
        sx={{
          height: '100%',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.25s ease',

          '&:hover': {
            borderColor: 'var(--mui-palette-primary-main)',
            boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
            transform: 'translateY(-3px)'
          }
        }}
      >
        <DocumentPreview document={document} />

        <CardContent className='flex flex-col gap-2.5'>
          <div className='flex items-start justify-between gap-2'>
            <div className='min-is-0'>
              <Typography
                className='font-medium truncate'
                title={document.name}
              >
                {document.name}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='truncate'
                title={document.description}
              >
                {document.description}
              </Typography>
            </div>

            {/* Dropdown */}
            <IconButton
              size='small'
              className='shrink-0'
              onClick={handleMenuOpen}
              aria-label={`Menu ${document.name}`}
              aria-controls={
                menuOpen
                  ? `document-menu-${document.id}`
                  : undefined
              }
              aria-haspopup='true'
              aria-expanded={
                menuOpen ? 'true' : undefined
              }
            >
              <i className='tabler-dots-vertical' />
            </IconButton>
          </div>

          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 flex-wrap'>
              <Chip
                size='small'
                variant='tonal'
                label={categoryLabels[document.category]}
              />

              {document.verified && (
                <Chip
                  size='small'
                  color='success'
                  variant='tonal'
                  label='Terverifikasi'
                  icon={
                    <i className='tabler-circle-check text-[13px]' />
                  }
                />
              )}
            </div>

            <Typography
              variant='caption'
              color='text.disabled'
            >
              {document.fileType}
            </Typography>
          </div>

          <Typography
            variant='caption'
            color='text.disabled'
          >
            {document.size} • Diperbarui {document.updatedAt}
          </Typography>
        </CardContent>
      </Card>

      {/* ===================================================
          DROPDOWN
      ==================================================== */}

      <Menu
        id={`document-menu-${document.id}`}
        anchorEl={menuAnchor}
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
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <i className='tabler-eye text-[20px]' />
          </ListItemIcon>

          <ListItemText primary='Lihat Dokumen' />
        </MenuItem>

        <MenuItem onClick={handleDetail}>
          <ListItemIcon>
            <i className='tabler-info-circle text-[20px]' />
          </ListItemIcon>

          <ListItemText primary='Detail Dokumen' />
        </MenuItem>

        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <i className='tabler-download text-[20px]' />
          </ListItemIcon>

          <ListItemText primary='Unduh Dokumen' />
        </MenuItem>
      </Menu>
    </>
  )
}

/* =========================================================
   DOCUMENT SECTION
========================================================= */

const DocumentSection = ({
                           title,
                           items,
                           onView,
                           onDetail,
                           onDownload
                         }: {
  title: string
  items: DocumentItem[]
  onView: (document: DocumentItem) => void
  onDetail: (document: DocumentItem) => void
  onDownload: (document: DocumentItem) => void
}) => {
  if (!items.length) return null

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <Typography
          variant='body2'
          color='text.disabled'
          className='uppercase font-semibold'
        >
          {title}
        </Typography>

        <Typography
          variant='caption'
          color='text.disabled'
        >
          {items.length} dokumen
        </Typography>
      </div>

      <Grid container spacing={4}>
        {items.map(item => (
          <Grid
            key={item.id}
            size={{
              xs: 12,
              sm: 6,
              lg: 4
            }}
          >
            <DocumentCard
              document={item}
              onView={() => onView(item)}
              onDetail={() => onDetail(item)}
              onDownload={() => onDownload(item)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

/* =========================================================
   SECURITY DIALOG
========================================================= */

const DocumentSecurityDialog = ({
                                  document,
                                  open,
                                  onClose,
                                  onView
                                }: {
  document: DocumentItem | null
  open: boolean
  onClose: () => void
  onView: () => void
}) => {
  if (!document) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle className='flex items-center justify-between'>
        <div className='flex flex-col'>
          <Typography
            variant='h6'
            className='font-semibold'
          >
            {document.name}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
          >
            Dokumen terlindungi
          </Typography>
        </div>

        <IconButton onClick={onClose}>
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className='flex flex-col items-center justify-center py-10 gap-5'>
          <div className='relative'>
            <div className='absolute inset-0 rounded-full bg-primary/10 blur-xl' />

            <div className='relative flex items-center justify-center bs-20 is-20 rounded-full bg-primary/10'>
              <i className='tabler-shield-lock text-[42px] text-primary' />
            </div>
          </div>

          <div className='flex flex-col items-center text-center gap-1'>
            <Typography
              variant='h6'
              className='font-semibold'
            >
              Dokumen Terlindungi
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              className='max-is-[440px]'
            >
              Dokumen ini berisi informasi pribadi dan
              tidak ditampilkan secara langsung untuk
              menjaga keamanan data Anda.
            </Typography>
          </div>

          <div className='flex items-center justify-center gap-2 flex-wrap'>
            <Chip
              size='small'
              variant='tonal'
              label={categoryLabels[document.category]}
            />

            <Chip
              size='small'
              variant='tonal'
              label={document.fileType}
            />

            <Chip
              size='small'
              variant='tonal'
              label={document.size}
            />

            {document.verified && (
              <Chip
                size='small'
                color='success'
                variant='tonal'
                label='Terverifikasi'
                icon={
                  <i className='tabler-circle-check text-[13px]' />
                }
              />
            )}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant='tonal'
          onClick={onClose}
        >
          Batal
        </Button>

        <Button
          variant='contained'
          startIcon={<i className='tabler-eye' />}
          onClick={onView}
        >
          Lihat Dokumen
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* =========================================================
   DOCUMENT VIEWER
========================================================= */

const DocumentViewer = ({
                          document,
                          open,
                          onClose,
                          onDownload
                        }: {
  document: DocumentItem | null
  open: boolean
  onClose: () => void
  onDownload: () => void
}) => {
  if (!document) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
    >
      {/* ===================================================
          VIEWER HEADER
      ==================================================== */}

      <DialogTitle className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3 min-is-0'>
          <div className='flex items-center justify-center bs-10 is-10 rounded bg-primary/10 shrink-0'>
            <i className='tabler-file text-[20px] text-primary' />
          </div>

          <div className='min-is-0'>
            <Typography
              variant='h6'
              className='font-semibold truncate'
              title={document.name}
            >
              {document.name}
            </Typography>

            <Typography
              variant='caption'
              color='text.secondary'
            >
              {document.fileType} • {document.size}
            </Typography>
          </div>
        </div>

        <IconButton onClick={onClose}>
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>

      {/* ===================================================
          VIEWER CONTENT
      ==================================================== */}

      <DialogContent
        dividers
        sx={{
          minHeight: 620,
          backgroundColor:
            'var(--mui-palette-background-default)'
        }}
      >
        {/* =================================================
            IMAGE
        ================================================== */}

        {document.type === 'image' &&
        document.preview ? (
          <div className='flex items-center justify-center min-h-[580px] w-full p-8'>
            <div className='relative flex items-center justify-center w-full max-w-[420px] aspect-[3/4] rounded-xl overflow-hidden bg-actionHover border border-divider shadow-xl'>
              <img
                src={document.preview}
                alt={document.name}
                className='w-full h-full object-cover'
              />

              <div className='absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-xl' />
            </div>
          </div>
        ) : document.type === 'pdf' ? (
          /* =================================================
             PDF
          ================================================== */

          <div className='flex items-center justify-center min-h-[580px] p-8'>
            <div className='relative w-full max-w-[720px] min-h-[500px] rounded-xl bg-white border border-divider shadow-lg overflow-hidden'>
              <div className='flex items-center gap-3 px-6 py-4 border-b border-divider'>
                <div className='flex items-center justify-center bs-9 is-9 rounded bg-error/10'>
                  <i className='tabler-file-type-pdf text-[20px] text-error' />
                </div>

                <div className='flex flex-col'>
                  <Typography className='font-medium'>
                    {document.name}
                  </Typography>

                  <Typography
                    variant='caption'
                    color='text.secondary'
                  >
                    PDF Document
                  </Typography>
                </div>
              </div>

              <div className='p-10'>
                <div className='mx-auto max-w-[560px] min-h-[380px] border border-divider rounded-lg p-10 flex flex-col gap-5'>
                  <div className='flex justify-center'>
                    <div className='bs-20 is-20 rounded-full bg-error/10 flex items-center justify-center'>
                      <i className='tabler-file-type-pdf text-[42px] text-error' />
                    </div>
                  </div>

                  <div className='flex flex-col items-center gap-3'>
                    <div className='h-3 w-64 rounded bg-textSecondary/15' />
                    <div className='h-2 w-80 max-is-full rounded bg-textSecondary/10' />
                  </div>

                  <div className='flex flex-col gap-3 mt-5'>
                    <div className='h-2 w-full rounded bg-textSecondary/10' />
                    <div className='h-2 w-11/12 rounded bg-textSecondary/10' />
                    <div className='h-2 w-10/12 rounded bg-textSecondary/10' />
                    <div className='h-2 w-full rounded bg-textSecondary/10' />
                    <div className='h-2 w-9/12 rounded bg-textSecondary/10' />
                    <div className='h-2 w-10/12 rounded bg-textSecondary/10' />
                  </div>

                  <div className='flex justify-between mt-auto pt-8'>
                    <div className='h-9 w-28 rounded bg-textSecondary/10' />
                    <div className='h-9 w-32 rounded bg-error/10' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================
             DOC / DOCX
          ================================================== */

          <div className='flex items-center justify-center min-h-[580px]'>
            <div className='flex flex-col items-center gap-4 text-center'>
              <div className='flex items-center justify-center bs-24 is-24 rounded-2xl bg-info/10'>
                <i className='tabler-file-description text-[54px] text-info' />
              </div>

              <Typography
                variant='h6'
                className='font-semibold'
              >
                {document.name}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Pratinjau dokumen akan tersedia setelah
                file terhubung dengan penyimpanan.
              </Typography>
            </div>
          </div>
        )}
      </DialogContent>

      {/* ===================================================
          VIEWER ACTIONS
      ==================================================== */}

      <DialogActions>
        <Button
          variant='tonal'
          onClick={onClose}
        >
          Tutup
        </Button>

        <Button
          variant='contained'
          startIcon={
            <i className='tabler-download' />
          }
          onClick={onDownload}
        >
          Unduh
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* =========================================================
   DOCUMENT DETAIL
========================================================= */

const DocumentDetailDialog = ({
                                document,
                                open,
                                onClose
                              }: {
  document: DocumentItem | null
  open: boolean
  onClose: () => void
}) => {
  if (!document) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle className='flex items-center justify-between'>
        <Typography
          variant='h6'
          className='font-semibold'
        >
          Detail Dokumen
        </Typography>

        <IconButton onClick={onClose}>
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div className='flex flex-col gap-5 py-2'>
          {/* Identity */}
          <div className='flex items-center gap-4'>
            <div className='flex items-center justify-center bs-14 is-14 rounded-xl bg-primary/10 shrink-0'>
              <i className='tabler-file-description text-[28px] text-primary' />
            </div>

            <div className='min-is-0'>
              <Typography className='font-semibold'>
                {document.name}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                {document.description}
              </Typography>
            </div>
          </div>

          <Divider />

          {/* Metadata */}
          <div className='grid grid-cols-2 gap-y-5 gap-x-6'>
            <div>
              <Typography
                variant='caption'
                color='text.disabled'
              >
                Kategori
              </Typography>

              <Typography className='font-medium'>
                {categoryLabels[document.category]}
              </Typography>
            </div>

            <div>
              <Typography
                variant='caption'
                color='text.disabled'
              >
                Format
              </Typography>

              <Typography className='font-medium'>
                {document.fileType}
              </Typography>
            </div>

            <div>
              <Typography
                variant='caption'
                color='text.disabled'
              >
                Ukuran
              </Typography>

              <Typography className='font-medium'>
                {document.size}
              </Typography>
            </div>

            <div>
              <Typography
                variant='caption'
                color='text.disabled'
              >
                Diperbarui
              </Typography>

              <Typography className='font-medium'>
                {document.updatedAt}
              </Typography>
            </div>

            <div>
              <Typography
                variant='caption'
                color='text.disabled'
              >
                Status
              </Typography>

              {document.verified ? (
                <Chip
                  size='small'
                  color='success'
                  variant='tonal'
                  label='Terverifikasi'
                  icon={
                    <i className='tabler-circle-check text-[13px]' />
                  }
                />
              ) : (
                <Chip
                  size='small'
                  variant='tonal'
                  label='Belum diverifikasi'
                />
              )}
            </div>

            <div>
              <Typography
                variant='caption'
                color='text.disabled'
              >
                Keamanan
              </Typography>

              <Typography className='font-medium flex items-center gap-1'>
                <i className='tabler-lock text-[16px]' />
                Terlindungi
              </Typography>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant='tonal'
          onClick={onClose}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* =========================================================
   PROFILE MEDIA
========================================================= */

const ProfileMedia = () => {
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentItem | null>(null)

  const [isSecurityDialogOpen, setIsSecurityDialogOpen] =
    useState(false)

  const [isViewerOpen, setIsViewerOpen] =
    useState(false)

  const [isDetailOpen, setIsDetailOpen] =
    useState(false)

  /* -------------------------------------------------------
     VIEW
  ------------------------------------------------------- */

  const handleViewDocument = (
    document: DocumentItem
  ) => {
    setSelectedDocument(document)
    setIsSecurityDialogOpen(true)
  }

  /* -------------------------------------------------------
     OPEN VIEWER
  ------------------------------------------------------- */

  const handleOpenViewer = () => {
    setIsSecurityDialogOpen(false)
    setIsViewerOpen(true)
  }

  /* -------------------------------------------------------
     DETAIL
  ------------------------------------------------------- */

  const handleDetailDocument = (
    document: DocumentItem
  ) => {
    setSelectedDocument(document)
    setIsDetailOpen(true)
  }

  /* -------------------------------------------------------
     DOWNLOAD
  ------------------------------------------------------- */

  const handleDownloadDocument = (
    document: DocumentItem
  ) => {
    // TODO:
    // Sambungkan ke secure download endpoint
    // setelah backend tersedia.

    console.log(
      'Download document:',
      document.id,
      document.name
    )
  }

  /* -------------------------------------------------------
     CURRENT DOWNLOAD
  ------------------------------------------------------- */

  const handleDownloadSelectedDocument = () => {
    if (!selectedDocument) return

    handleDownloadDocument(selectedDocument)
  }

  /* -------------------------------------------------------
     FILTERS
  ------------------------------------------------------- */

  const photoDocuments = documents.filter(
    item => item.category === 'photo'
  )

  const identityDocuments = documents.filter(
    item => item.category === 'identity'
  )

  const educationDocuments = documents.filter(
    item => item.category === 'education'
  )

  const certificateDocuments = documents.filter(
    item => item.category === 'certificate'
  )

  const administrationDocuments = documents.filter(
    item => item.category === 'administration'
  )

  const otherDocuments = documents.filter(
    item => item.category === 'other'
  )

  return (
    <>
      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <Card>
        <CardHeader
          avatar={
            <div className='flex items-center justify-center bs-10 is-10 rounded bg-primary text-primary-contrastText'>
              <i className='tabler-shield-lock text-[20px]' />
            </div>
          }
          title='Media & Dokumen'
          subheader='Dokumen penting tersimpan secara aman dan terlindungi'
          titleTypographyProps={{
            variant: 'h5',
            className: 'font-semibold'
          }}
        />

        <Divider />

        <CardContent>
          <div className='flex flex-col gap-7'>
            {/* =================================================
                SECURITY NOTICE
            ================================================== */}

            <div className='relative overflow-hidden flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10'>
              <div className='absolute -end-10 -top-10 bs-28 is-28 rounded-full bg-primary/5' />

              <div className='relative flex items-center justify-center bs-11 is-11 rounded-full bg-primary/10 shrink-0'>
                <i className='tabler-shield-lock text-[22px] text-primary' />
              </div>

              <div className='relative flex flex-col gap-0.5'>
                <Typography className='font-medium'>
                  Dokumen Anda terlindungi
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Pratinjau dokumen disamarkan untuk menjaga
                  keamanan informasi pribadi.
                </Typography>
              </div>
            </div>

            {/* =================================================
                PAS FOTO
            ================================================== */}

            <DocumentSection
              title='Pas Foto'
              items={photoDocuments}
              onView={handleViewDocument}
              onDetail={handleDetailDocument}
              onDownload={handleDownloadDocument}
            />

            {identityDocuments.length > 0 && (
              <Divider />
            )}

            {/* =================================================
                IDENTITAS
            ================================================== */}

            <DocumentSection
              title='Identitas'
              items={identityDocuments}
              onView={handleViewDocument}
              onDetail={handleDetailDocument}
              onDownload={handleDownloadDocument}
            />

            {educationDocuments.length > 0 && (
              <Divider />
            )}

            {/* =================================================
                PENDIDIKAN
            ================================================== */}

            <DocumentSection
              title='Pendidikan'
              items={educationDocuments}
              onView={handleViewDocument}
              onDetail={handleDetailDocument}
              onDownload={handleDownloadDocument}
            />

            {certificateDocuments.length > 0 && (
              <Divider />
            )}

            {/* =================================================
                SERTIFIKAT
            ================================================== */}

            <DocumentSection
              title='Sertifikat'
              items={certificateDocuments}
              onView={handleViewDocument}
              onDetail={handleDetailDocument}
              onDownload={handleDownloadDocument}
            />

            {administrationDocuments.length > 0 && (
              <Divider />
            )}

            {/* =================================================
                ADMINISTRASI
            ================================================== */}

            <DocumentSection
              title='Administrasi'
              items={administrationDocuments}
              onView={handleViewDocument}
              onDetail={handleDetailDocument}
              onDownload={handleDownloadDocument}
            />

            {otherDocuments.length > 0 && (
              <Divider />
            )}

            {/* =================================================
                LAINNYA
            ================================================== */}

            <DocumentSection
              title='Lainnya'
              items={otherDocuments}
              onView={handleViewDocument}
              onDetail={handleDetailDocument}
              onDownload={handleDownloadDocument}
            />
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          SECURITY DIALOG
      ====================================================== */}

      <DocumentSecurityDialog
        document={selectedDocument}
        open={isSecurityDialogOpen}
        onClose={() => setIsSecurityDialogOpen(false)}
        onView={handleOpenViewer}
      />

      {/* =====================================================
          DOCUMENT VIEWER
      ====================================================== */}

      <DocumentViewer
        document={selectedDocument}
        open={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onDownload={handleDownloadSelectedDocument}
      />

      {/* =====================================================
          DETAIL DIALOG
      ====================================================== */}

      <DocumentDetailDialog
        document={selectedDocument}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  )
}

export default ProfileMedia
