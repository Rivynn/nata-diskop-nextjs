'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// SweetAlert
import Swal from 'sweetalert2'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

type InstructorDocument = {
  id: number
  name: string
  type: 'Identitas' | 'Pendidikan' | 'Sertifikasi' | 'Profil' | 'Lainnya'
  fileName: string
  fileSize: string
  uploadedAt: string
  status: 'verified' | 'pending' | 'rejected'
  sensitive?: boolean
}

const documentData: InstructorDocument[] = [
  {
    id: 1,
    name: 'Kartu Tanda Penduduk',
    type: 'Identitas',
    fileName: 'KTP_Ahmad_Fauzan.pdf',
    fileSize: '1.8 MB',
    uploadedAt: '2026-01-12',
    status: 'verified',
    sensitive: true
  },
  {
    id: 2,
    name: 'Ijazah Pendidikan Terakhir',
    type: 'Pendidikan',
    fileName: 'Ijazah_S1_Ahmad_Fauzan.pdf',
    fileSize: '2.4 MB',
    uploadedAt: '2026-01-12',
    status: 'verified'
  },
  {
    id: 3,
    name: 'Sertifikat Kompetensi',
    type: 'Sertifikasi',
    fileName: 'Sertifikat_JWD.pdf',
    fileSize: '1.2 MB',
    uploadedAt: '2026-02-14',
    status: 'verified'
  },
  {
    id: 4,
    name: 'Curriculum Vitae',
    type: 'Profil',
    fileName: 'CV_Ahmad_Fauzan.pdf',
    fileSize: '980 KB',
    uploadedAt: '2026-01-15',
    status: 'verified'
  },
  {
    id: 5,
    name: 'Dokumen Pendukung',
    type: 'Lainnya',
    fileName: 'Dokumen_Pendukung.pdf',
    fileSize: '3.1 MB',
    uploadedAt: '2026-03-02',
    status: 'pending'
  }
]

const DocumentCard = () => {
  const [documents, setDocuments] = useState(documentData)
  const [previewDocument, setPreviewDocument] =
    useState<InstructorDocument | null>(null)

  const documentList = useMemo(() => documents, [documents])

  const getStatus = (
    status: InstructorDocument['status']
  ) => {
    switch (status) {
      case 'verified':
        return {
          label: 'Terverifikasi',
          color: 'success' as const,
          icon: 'tabler-circle-check'
        }

      case 'pending':
        return {
          label: 'Menunggu Verifikasi',
          color: 'warning' as const,
          icon: 'tabler-clock'
        }

      case 'rejected':
        return {
          label: 'Ditolak',
          color: 'error' as const,
          icon: 'tabler-circle-x'
        }
    }
  }

  const verifiedCount = documentList.filter(
    document => document.status === 'verified'
  ).length

  const pendingCount = documentList.filter(
    document => document.status === 'pending'
  ).length

  const rejectedCount = documentList.filter(
    document => document.status === 'rejected'
  ).length

  const handleVerify = async (
    document: InstructorDocument
  ) => {
    const result = await Swal.fire({
      title: 'Verifikasi Dokumen?',
      html: `
        <div style="text-align:center">
          <div style="font-weight:600;margin-bottom:6px">
            ${document.name}
          </div>
          <div style="font-size:13px;color:#6b7280">
            Dokumen akan ditandai sebagai terverifikasi.
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Verifikasi',
      cancelButtonText: 'Batal',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    setDocuments(current =>
      current.map(item =>
        item.id === document.id
          ? {
            ...item,
            status: 'verified'
          }
          : item
      )
    )

    await Swal.fire({
      title: 'Dokumen Terverifikasi',
      text: `${document.name} berhasil diverifikasi.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const handleReject = async (
    document: InstructorDocument
  ) => {
    const result = await Swal.fire({
      title: 'Tolak Dokumen?',
      html: `
        <div style="text-align:center">
          <div style="font-weight:600;margin-bottom:6px">
            ${document.name}
          </div>
          <div style="font-size:13px;color:#6b7280">
            Dokumen akan ditandai sebagai ditolak.
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    setDocuments(current =>
      current.map(item =>
        item.id === document.id
          ? {
            ...item,
            status: 'rejected'
          }
          : item
      )
    )

    await Swal.fire({
      title: 'Dokumen Ditolak',
      text: `${document.name} ditandai sebagai ditolak.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const handleDelete = async (
    document: InstructorDocument
  ) => {
    const result = await Swal.fire({
      title: 'Hapus Dokumen?',
      html: `
        <div style="text-align:center">
          <div style="font-weight:600;margin-bottom:6px">
            ${document.name}
          </div>
          <div style="font-size:13px;color:#6b7280">
            Dokumen yang dihapus tidak dapat dikembalikan.
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      confirmButtonColor: '#d32f2f'
    })

    if (!result.isConfirmed) return

    setDocuments(current =>
      current.filter(item => item.id !== document.id)
    )

    setPreviewDocument(current =>
      current?.id === document.id ? null : current
    )

    await Swal.fire({
      title: 'Dokumen Dihapus',
      text: `${document.name} berhasil dihapus.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const handleReplace = async (
    document: InstructorDocument
  ) => {
    const result = await Swal.fire({
      title: 'Ganti Dokumen',
      html: `
        <div style="text-align:left">
          <div style="font-weight:600;margin-bottom:12px">
            ${document.name}
          </div>

          <div style="
            border:1px dashed #d1d5db;
            border-radius:10px;
            padding:24px;
            text-align:center;
            color:#6b7280;
          ">
            <div style="font-size:28px;margin-bottom:8px">
              ↑
            </div>
            Pilih file baru untuk mengganti dokumen.
          </div>
        </div>
      `,
      input: 'file',
      inputAttributes: {
        accept: '.pdf,.jpg,.jpeg,.png',
        'aria-label': 'Upload dokumen'
      },
      showCancelButton: true,
      confirmButtonText: 'Ganti Dokumen',
      cancelButtonText: 'Batal',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    // Prototype:
    // file sebenarnya nanti dikirim ke backend/storage.
    await Swal.fire({
      title: 'Dokumen Diperbarui',
      text: `${document.name} berhasil diganti.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-7'>

          {/* Header */}
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='error'
                size={50}
              >
                <i className='tabler-files text-[1.5rem]' />
              </CustomAvatar>

              <div className='flex flex-col gap-1'>
                <Typography variant='h5'>
                  Dokumen Pelatih
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Kelola dokumen identitas, pendidikan,
                  sertifikasi, dan dokumen pendukung.
                </Typography>
              </div>
            </div>

            <Chip
              label={`${documentList.length} Dokumen`}
              size='small'
              variant='tonal'
              color='primary'
            />
          </div>

          {/* Summary */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <div className='flex items-center gap-3 rounded-lg border border-divider p-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='primary'
                size={38}
              >
                <i className='tabler-files' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Total Dokumen
                </Typography>

                <Typography
                  variant='h6'
                  className='leading-tight'
                >
                  {documentList.length}
                </Typography>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border border-divider p-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='success'
                size={38}
              >
                <i className='tabler-circle-check' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Terverifikasi
                </Typography>

                <Typography
                  variant='h6'
                  className='leading-tight'
                >
                  {verifiedCount}
                </Typography>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border border-divider p-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color={
                  rejectedCount > 0
                    ? 'error'
                    : 'warning'
                }
                size={38}
              >
                <i
                  className={
                    rejectedCount > 0
                      ? 'tabler-circle-x'
                      : 'tabler-clock'
                  }
                />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Perlu Tindakan
                </Typography>

                <Typography
                  variant='h6'
                  className='leading-tight'
                >
                  {pendingCount + rejectedCount}
                </Typography>
              </div>
            </div>
          </div>

          <Divider />

          {/* Document List */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {documentList.map(document => {
              const status = getStatus(document.status)

              return (
                <div
                  key={document.id}
                  className='group rounded-xl border border-divider p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-sm'
                >
                  <div className='flex items-start gap-4'>

                    {/* Preview */}
                    <button
                      type='button'
                      onClick={() =>
                        setPreviewDocument(document)
                      }
                      className='relative shrink-0 overflow-hidden rounded-lg border border-divider bg-actionHover cursor-pointer'
                      style={{
                        width: 76,
                        height: 92
                      }}
                    >
                      {/* Fake PDF */}
                      <div className='absolute inset-0 bg-background p-2'>
                        <div className='flex flex-col gap-1'>
                          <div className='h-1.5 w-8 rounded bg-textDisabled/30' />
                          <div className='h-1 w-full rounded bg-textDisabled/20' />
                          <div className='h-1 w-10/12 rounded bg-textDisabled/20' />

                          <div className='mt-2 h-5 w-full rounded bg-textDisabled/10' />

                          <div className='mt-1 flex gap-1'>
                            <div className='h-8 w-6 rounded bg-textDisabled/15' />

                            <div className='flex flex-1 flex-col gap-1'>
                              <div className='h-1 rounded bg-textDisabled/20' />
                              <div className='h-1 rounded bg-textDisabled/20' />
                              <div className='h-1 w-2/3 rounded bg-textDisabled/20' />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Blur */}
                      <div
                        className='absolute inset-0 bg-background/30'
                        style={{
                          backdropFilter: 'blur(5px)'
                        }}
                      />

                      {/* PDF */}
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='flex bs-9 is-9 items-center justify-center rounded-full bg-error/90 shadow-sm'>
                          <i className='tabler-file-type-pdf text-white' />
                        </div>
                      </div>

                      {/* Hover */}
                      <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                        <i className='tabler-eye text-white text-lg' />
                      </div>
                    </button>

                    {/* Content */}
                    <div className='flex flex-1 min-is-0 flex-col gap-2'>

                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex flex-col gap-0.5 min-is-0'>
                          <Typography
                            variant='body1'
                            className='font-medium truncate'
                          >
                            {document.name}
                          </Typography>

                          <Typography
                            variant='caption'
                            color='text.secondary'
                          >
                            {document.type}
                          </Typography>
                        </div>

                        <Chip
                          label={status.label}
                          color={status.color}
                          variant='tonal'
                          size='small'
                          icon={
                            <i className={status.icon} />
                          }
                        />
                      </div>

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        noWrap
                        title={document.fileName}
                      >
                        {document.fileName}
                      </Typography>

                      <div className='flex flex-wrap items-center gap-x-2'>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                        >
                          {document.fileSize}
                        </Typography>

                        <span className='text-textDisabled'>
                          •
                        </span>

                        <Typography
                          variant='caption'
                          color='text.secondary'
                        >
                          {new Date(
                            document.uploadedAt
                          ).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center shrink-0'>

                      {/* View */}
                      <Tooltip title='Lihat Dokumen'>
                        <IconButton
                          size='small'
                          onClick={() =>
                            setPreviewDocument(document)
                          }
                        >
                          <i className='tabler-eye' />
                        </IconButton>
                      </Tooltip>

                      {/* Download */}
                      <Tooltip title='Unduh Dokumen'>
                        <IconButton size='small'>
                          <i className='tabler-download' />
                        </IconButton>
                      </Tooltip>

                      {/* Admin Actions */}
                      <OptionMenu
                        iconButtonProps={{
                          size: 'small'
                        }}
                        options={[
                          {
                            text: 'Ganti Dokumen',
                            icon: 'tabler-upload',
                            menuItemProps: {
                              onClick: () =>
                                handleReplace(document)
                            }
                          },

                          ...(document.status === 'pending'
                            ? [
                              {
                                text: 'Verifikasi Dokumen',
                                icon: 'tabler-circle-check',
                                menuItemProps: {
                                  onClick: () =>
                                    handleVerify(document)
                                }
                              },
                              {
                                text: 'Tolak Dokumen',
                                icon: 'tabler-circle-x',
                                menuItemProps: {
                                  onClick: () =>
                                    handleReject(document)
                                }
                              }
                            ]
                            : []),

                          ...(document.status === 'rejected'
                            ? [
                              {
                                text: 'Verifikasi Ulang',
                                icon: 'tabler-refresh',
                                menuItemProps: {
                                  onClick: () =>
                                    handleVerify(document)
                                }
                              }
                            ]
                            : []),

                          {
                            text: 'Hapus Dokumen',
                            icon: 'tabler-trash',
                            menuItemProps: {
                              onClick: () =>
                                handleDelete(document)
                            }
                          }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Security Notice */}
          <div className='rounded-lg border border-divider bg-actionHover p-4'>
            <div className='flex items-start gap-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='warning'
                size={38}
              >
                <i className='tabler-shield-lock' />
              </CustomAvatar>

              <div className='flex flex-col gap-1'>
                <Typography
                  variant='body2'
                  className='font-medium'
                >
                  Dokumen dilindungi
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Dokumen identitas dan berkas pribadi
                  hanya dapat diakses oleh pengguna dengan
                  hak akses yang sesuai. Setiap tindakan
                  pengelolaan dokumen dapat dicatat pada
                  log aktivitas.
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-1 min-is-0'>
            <Typography variant='h5'>
              {previewDocument?.name}
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              {previewDocument?.fileName}
            </Typography>
          </div>

          <IconButton
            onClick={() => setPreviewDocument(null)}
          >
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div className='relative min-h-[520px] overflow-hidden rounded-xl border border-divider bg-actionHover'>

            {/* Fake PDF Page */}
            <div className='absolute inset-6 rounded-lg bg-background p-8 shadow-sm'>
              <div className='flex flex-col gap-4'>
                <div className='h-5 w-48 rounded bg-textDisabled/20' />

                <div className='h-2 w-full rounded bg-textDisabled/10' />
                <div className='h-2 w-11/12 rounded bg-textDisabled/10' />

                <div className='grid grid-cols-3 gap-4 mt-4'>
                  <div className='h-28 rounded bg-textDisabled/10' />

                  <div className='col-span-2 flex flex-col gap-3'>
                    <div className='h-3 rounded bg-textDisabled/15' />
                    <div className='h-3 rounded bg-textDisabled/10' />
                    <div className='h-3 w-10/12 rounded bg-textDisabled/10' />
                    <div className='h-3 w-8/12 rounded bg-textDisabled/10' />
                  </div>
                </div>

                <div className='flex flex-col gap-3 mt-4'>
                  <div className='h-3 rounded bg-textDisabled/10' />
                  <div className='h-3 rounded bg-textDisabled/10' />
                  <div className='h-3 w-9/12 rounded bg-textDisabled/10' />
                  <div className='h-3 rounded bg-textDisabled/10' />
                  <div className='h-3 w-10/12 rounded bg-textDisabled/10' />
                </div>
              </div>
            </div>

            {/* Blur */}
            <div
              className='absolute inset-0 bg-background/35'
              style={{
                backdropFilter: 'blur(8px)'
              }}
            />

            {/* Protected Preview */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='flex flex-col items-center text-center gap-3 max-is-[320px]'>
                <CustomAvatar
                  variant='rounded'
                  skin='light'
                  color='warning'
                  size={54}
                >
                  <i className='tabler-lock text-2xl' />
                </CustomAvatar>

                <Typography variant='h6'>
                  Preview Dilindungi
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Preview dokumen disamarkan untuk
                  melindungi informasi sensitif.
                </Typography>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DocumentCard
