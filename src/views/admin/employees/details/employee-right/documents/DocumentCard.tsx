'use client'

import { useMemo, useState } from 'react'

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

import Swal from 'sweetalert2'

import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

type EmployeeDocument = {
  id: number
  employeeId: string
  name: string
  type: 'Identitas' | 'Pendidikan' | 'Kepegawaian' | 'Sertifikasi' | 'Lainnya'
  fileName: string
  fileSize: string
  uploadedAt: string
  status: 'verified' | 'pending' | 'rejected'
  sensitive?: boolean
}

type Props = {
  employeeId: string
}

const documentData: EmployeeDocument[] = [
  {
    id: 1,
    employeeId: '1',
    name: 'Kartu Tanda Penduduk',
    type: 'Identitas',
    fileName: 'KTP_Pegawai.pdf',
    fileSize: '1.8 MB',
    uploadedAt: '2026-01-12',
    status: 'verified',
    sensitive: true
  },
  {
    id: 2,
    employeeId: '1',
    name: 'Ijazah Pendidikan Terakhir',
    type: 'Pendidikan',
    fileName: 'Ijazah_Pendidikan.pdf',
    fileSize: '2.4 MB',
    uploadedAt: '2026-01-12',
    status: 'verified'
  },
  {
    id: 3,
    employeeId: '1',
    name: 'Surat Keputusan Pengangkatan',
    type: 'Kepegawaian',
    fileName: 'SK_Pengangkatan.pdf',
    fileSize: '1.2 MB',
    uploadedAt: '2026-02-14',
    status: 'verified'
  },
  {
    id: 4,
    employeeId: '1',
    name: 'Sertifikat Kompetensi',
    type: 'Sertifikasi',
    fileName: 'Sertifikat_Kompetensi.pdf',
    fileSize: '980 KB',
    uploadedAt: '2026-01-15',
    status: 'pending'
  },
  {
    id: 5,
    employeeId: '1',
    name: 'Dokumen Pendukung',
    type: 'Lainnya',
    fileName: 'Dokumen_Pendukung.pdf',
    fileSize: '3.1 MB',
    uploadedAt: '2026-03-02',
    status: 'rejected'
  }
]

const DocumentCard = ({ employeeId }: Props) => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>(
    documentData.filter(document => document.employeeId === employeeId)
  )
  const [previewDocument, setPreviewDocument] = useState<EmployeeDocument | null>(null)

  const documentList = useMemo(() => documents, [documents])

  const getStatus = (status: EmployeeDocument['status']) => {
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

  const verifiedCount = documentList.filter(document => document.status === 'verified').length
  const pendingCount = documentList.filter(document => document.status === 'pending').length
  const rejectedCount = documentList.filter(document => document.status === 'rejected').length

  const handleVerify = async (document: EmployeeDocument) => {
    const result = await Swal.fire({
      title: 'Verifikasi Dokumen?',
      text: `${document.name} akan ditandai sebagai terverifikasi.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Verifikasi',
      cancelButtonText: 'Batal',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    setDocuments(current =>
      current.map(item => (item.id === document.id ? { ...item, status: 'verified' } : item))
    )

    await Swal.fire({
      title: 'Dokumen Terverifikasi',
      text: `${document.name} berhasil diverifikasi.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const handleReject = async (document: EmployeeDocument) => {
    const result = await Swal.fire({
      title: 'Tolak Dokumen?',
      text: `${document.name} akan ditandai sebagai ditolak.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    setDocuments(current =>
      current.map(item => (item.id === document.id ? { ...item, status: 'rejected' } : item))
    )

    await Swal.fire({
      title: 'Dokumen Ditolak',
      text: `${document.name} berhasil ditandai sebagai ditolak.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const handleDelete = async (document: EmployeeDocument) => {
    const result = await Swal.fire({
      title: 'Hapus Dokumen?',
      text: `${document.name} akan dihapus dari daftar dokumen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      confirmButtonColor: '#d32f2f'
    })

    if (!result.isConfirmed) return

    setDocuments(current => current.filter(item => item.id !== document.id))
    setPreviewDocument(current => (current?.id === document.id ? null : current))

    await Swal.fire({
      title: 'Dokumen Dihapus',
      text: `${document.name} berhasil dihapus dari daftar.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const handleReplace = async (document: EmployeeDocument) => {
    const result = await Swal.fire({
      title: 'Ganti Dokumen',
      text: `Pilih file baru untuk mengganti ${document.name}.`,
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

    if (!result.isConfirmed || !result.value) return

    const file = result.value as File

    setDocuments(current =>
      current.map(item =>
        item.id === document.id
          ? {
            ...item,
            fileName: file.name,
            fileSize:
              file.size >= 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                : `${Math.max(1, Math.round(file.size / 1024))} KB`,
            uploadedAt: new Date().toISOString().slice(0, 10),
            status: 'pending'
          }
          : item
      )
    )

    await Swal.fire({
      title: 'File Dipilih',
      text: 'Tampilan dokumen diperbarui secara lokal. Integrasi penyimpanan server belum tersedia.',
      icon: 'info',
      confirmButtonText: 'Mengerti'
    })
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-7'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='error' size={50}>
                <i className='tabler-files text-[1.5rem]' />
              </CustomAvatar>

              <div className='flex flex-col gap-1'>
                <Typography variant='h5'>Dokumen Pegawai</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Kelola dokumen identitas, pendidikan, kepegawaian, sertifikasi, dan berkas pendukung.
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

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div className='flex items-center gap-3 rounded-lg border border-divider p-3'>
              <CustomAvatar variant='rounded' skin='light' color='primary' size={38}>
                <i className='tabler-files' />
              </CustomAvatar>
              <div className='flex flex-col'>
                <Typography variant='caption' color='text.secondary'>Total Dokumen</Typography>
                <Typography variant='h6' className='leading-tight'>{documentList.length}</Typography>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border border-divider p-3'>
              <CustomAvatar variant='rounded' skin='light' color='success' size={38}>
                <i className='tabler-circle-check' />
              </CustomAvatar>
              <div className='flex flex-col'>
                <Typography variant='caption' color='text.secondary'>Terverifikasi</Typography>
                <Typography variant='h6' className='leading-tight'>{verifiedCount}</Typography>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border border-divider p-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color={rejectedCount > 0 ? 'error' : 'warning'}
                size={38}
              >
                <i className={rejectedCount > 0 ? 'tabler-circle-x' : 'tabler-clock'} />
              </CustomAvatar>
              <div className='flex flex-col'>
                <Typography variant='caption' color='text.secondary'>Perlu Tindakan</Typography>
                <Typography variant='h6' className='leading-tight'>
                  {pendingCount + rejectedCount}
                </Typography>
              </div>
            </div>
          </div>

          <Divider />

          {documentList.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {documentList.map(document => {
                const status = getStatus(document.status)

                return (
                  <div
                    key={document.id}
                    className='group rounded-xl border border-divider p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-sm'
                  >
                    <div className='flex items-start gap-4'>
                      <button
                        type='button'
                        onClick={() => setPreviewDocument(document)}
                        className='relative shrink-0 cursor-pointer overflow-hidden rounded-lg border border-divider bg-actionHover'
                        style={{ width: 76, height: 92 }}
                        aria-label={`Lihat ${document.name}`}
                      >
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
                        <div
                          className='absolute inset-0 bg-background/30'
                          style={{ backdropFilter: 'blur(5px)' }}
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='flex bs-9 is-9 items-center justify-center rounded-full bg-error/90 shadow-sm'>
                            <i className='tabler-file-type-pdf text-white' />
                          </div>
                        </div>
                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                          <i className='tabler-eye text-lg text-white' />
                        </div>
                      </button>

                      <div className='flex min-is-0 flex-1 flex-col gap-2'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex min-is-0 flex-col gap-0.5'>
                            <Typography variant='body1' className='truncate font-medium'>
                              {document.name}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {document.type}
                            </Typography>
                          </div>

                          <Chip
                            label={status.label}
                            color={status.color}
                            variant='tonal'
                            size='small'
                            icon={<i className={status.icon} />}
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
                          <Typography variant='caption' color='text.secondary'>
                            {document.fileSize}
                          </Typography>
                          <span className='text-textDisabled'>•</span>
                          <Typography variant='caption' color='text.secondary'>
                            {new Date(`${document.uploadedAt}T00:00:00`).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </Typography>
                        </div>
                      </div>

                      <div className='flex shrink-0 items-center'>
                        <Tooltip title='Lihat Dokumen'>
                          <IconButton
                            size='small'
                            onClick={() => setPreviewDocument(document)}
                            aria-label='Lihat dokumen'
                          >
                            <i className='tabler-eye' />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title='Unduh Dokumen'>
                          <span>
                            <IconButton
                              size='small'
                              onClick={() =>
                                Swal.fire({
                                  title: 'File Belum Tersedia',
                                  text: 'File asli belum terhubung ke penyimpanan server.',
                                  icon: 'info'
                                })
                              }
                              aria-label='Unduh dokumen'
                            >
                              <i className='tabler-download' />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <OptionMenu
                          iconButtonProps={{ size: 'small' }}
                          options={[
                            {
                              text: 'Ganti Dokumen',
                              icon: 'tabler-upload',
                              menuItemProps: { onClick: () => handleReplace(document) }
                            },
                            ...(document.status === 'pending'
                              ? [
                                {
                                  text: 'Verifikasi Dokumen',
                                  icon: 'tabler-circle-check',
                                  menuItemProps: { onClick: () => handleVerify(document) }
                                },
                                {
                                  text: 'Tolak Dokumen',
                                  icon: 'tabler-circle-x',
                                  menuItemProps: { onClick: () => handleReject(document) }
                                }
                              ]
                              : []),
                            ...(document.status === 'rejected'
                              ? [
                                {
                                  text: 'Verifikasi Ulang',
                                  icon: 'tabler-refresh',
                                  menuItemProps: { onClick: () => handleVerify(document) }
                                }
                              ]
                              : []),
                            {
                              text: 'Hapus Dokumen',
                              icon: 'tabler-trash',
                              menuItemProps: { onClick: () => handleDelete(document) }
                            }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-divider px-6 py-12 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary' size={56}>
                <i className='tabler-file-off text-2xl' />
              </CustomAvatar>
              <Typography variant='h6'>Belum Ada Dokumen</Typography>
              <Typography variant='body2' color='text.secondary'>
                Dokumen untuk pegawai ini belum tersedia.
              </Typography>
            </div>
          )}

          <div className='rounded-lg border border-divider bg-actionHover p-4'>
            <div className='flex items-start gap-3'>
              <CustomAvatar variant='rounded' skin='light' color='warning' size={38}>
                <i className='tabler-shield-lock' />
              </CustomAvatar>
              <div className='flex flex-col gap-1'>
                <Typography variant='body2' className='font-medium'>
                  Dokumen Dilindungi
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Dokumen identitas dan berkas pribadi hanya boleh diakses oleh pengguna dengan hak akses yang sesuai. Pastikan file sensitif disimpan pada penyimpanan privat.
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle className='flex items-center justify-between gap-4'>
          <div className='flex min-is-0 flex-col gap-1'>
            <Typography variant='h5'>{previewDocument?.name}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {previewDocument?.fileName}
            </Typography>
          </div>
          <IconButton onClick={() => setPreviewDocument(null)} aria-label='Tutup preview'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div className='relative min-h-[520px] overflow-hidden rounded-xl border border-divider bg-actionHover'>
            <div className='absolute inset-6 rounded-lg bg-background p-8 shadow-sm'>
              <div className='flex flex-col gap-4'>
                <div className='h-5 w-48 rounded bg-textDisabled/20' />
                <div className='h-2 w-full rounded bg-textDisabled/10' />
                <div className='h-2 w-11/12 rounded bg-textDisabled/10' />
                <div className='mt-4 grid grid-cols-3 gap-4'>
                  <div className='h-28 rounded bg-textDisabled/10' />
                  <div className='col-span-2 flex flex-col gap-3'>
                    <div className='h-3 rounded bg-textDisabled/15' />
                    <div className='h-3 rounded bg-textDisabled/10' />
                    <div className='h-3 w-10/12 rounded bg-textDisabled/10' />
                    <div className='h-3 w-8/12 rounded bg-textDisabled/10' />
                  </div>
                </div>
                <div className='mt-4 flex flex-col gap-3'>
                  <div className='h-3 rounded bg-textDisabled/10' />
                  <div className='h-3 rounded bg-textDisabled/10' />
                  <div className='h-3 w-9/12 rounded bg-textDisabled/10' />
                  <div className='h-3 rounded bg-textDisabled/10' />
                  <div className='h-3 w-10/12 rounded bg-textDisabled/10' />
                </div>
              </div>
            </div>

            <div
              className='absolute inset-0 bg-background/35'
              style={{ backdropFilter: 'blur(8px)' }}
            />

            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='flex max-is-[320px] flex-col items-center gap-3 text-center'>
                <CustomAvatar variant='rounded' skin='light' color='warning' size={54}>
                  <i className='tabler-lock text-2xl' />
                </CustomAvatar>
                <Typography variant='h6'>Preview Dilindungi</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Preview ini masih berupa placeholder. File asli belum terhubung ke backend.
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
