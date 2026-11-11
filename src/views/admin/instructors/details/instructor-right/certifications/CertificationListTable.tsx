'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'

// SweetAlert
import Swal from 'sweetalert2'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type CertificationType = {
  id: number
  name: string
  issuer: string
  certificateNumber: string
  issuedAt: string
  expiresAt: string | null
  status: 'active' | 'expired'
  evidence: {
    fileName: string
    fileSize: string
    fileType: 'pdf' | 'image'
    uploadedAt: string
  } | null
}

const certificationData: CertificationType[] = [
  {
    id: 1,
    name: 'Junior Web Developer',
    issuer: 'BNSP',
    certificateNumber: 'BNSP/JWD/2026/00124',
    issuedAt: '2026-02-12',
    expiresAt: '2029-02-12',
    status: 'active',
    evidence: {
      fileName: 'Sertifikat_Junior_Web_Developer.pdf',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      uploadedAt: '2026-02-12'
    }
  },
  {
    id: 2,
    name: 'Digital Marketing',
    issuer: 'LSP Teknologi Digital',
    certificateNumber: 'LSP-DM-2025-00872',
    issuedAt: '2025-08-20',
    expiresAt: '2028-08-20',
    status: 'active',
    evidence: {
      fileName: 'Sertifikat_Digital_Marketing.pdf',
      fileSize: '2.1 MB',
      fileType: 'pdf',
      uploadedAt: '2025-08-20'
    }
  },
  {
    id: 3,
    name: 'Kompetensi Pelatih',
    issuer: 'LSP Pelatihan Indonesia',
    certificateNumber: 'LSP-PI-2024-00341',
    issuedAt: '2024-06-15',
    expiresAt: '2027-06-15',
    status: 'active',
    evidence: {
      fileName: 'Sertifikat_Kompetensi_Pelatih.pdf',
      fileSize: '1.4 MB',
      fileType: 'pdf',
      uploadedAt: '2024-06-15'
    }
  },
  {
    id: 4,
    name: 'Microsoft Office Specialist',
    issuer: 'Microsoft',
    certificateNumber: 'MOS-2023-00891',
    issuedAt: '2023-04-10',
    expiresAt: null,
    status: 'active',
    evidence: {
      fileName: 'Microsoft_Office_Specialist.pdf',
      fileSize: '1.1 MB',
      fileType: 'pdf',
      uploadedAt: '2023-04-10'
    }
  }
]

const CertificationListTable = () => {
  const [data, setData] = useState(certificationData)
  const [preview, setPreview] = useState<CertificationType | null>(null)

  const certificationList = useMemo(() => data, [data])

  const activeCount = certificationList.filter(
    item => item.status === 'active'
  ).length

  const expiredCount = certificationList.filter(
    item => item.status === 'expired'
  ).length

  const handleDelete = async (item: CertificationType) => {
    const result = await Swal.fire({
      title: 'Hapus Sertifikasi?',
      html: `
        <div style="text-align:center">
          <div style="font-weight:600;margin-bottom:6px">
            ${item.name}
          </div>

          <div style="font-size:13px;color:#6b7280">
            Data sertifikasi dan keterkaitan bukti dokumennya
            akan dihapus dari profil pelatih.
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

    setData(current =>
      current.filter(certification => certification.id !== item.id)
    )

    await Swal.fire({
      title: 'Sertifikasi Dihapus',
      text: `${item.name} berhasil dihapus.`,
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const handleReplaceEvidence = async (item: CertificationType) => {
    const result = await Swal.fire({
      title: 'Ganti Bukti Sertifikat',
      text: `Pilih file baru untuk ${item.name}.`,
      input: 'file',
      inputAttributes: {
        accept: '.pdf,.jpg,.jpeg,.png'
      },
      showCancelButton: true,
      confirmButtonText: 'Ganti Bukti',
      cancelButtonText: 'Batal',
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    await Swal.fire({
      title: 'Bukti Diperbarui',
      text: 'Bukti sertifikat berhasil diperbarui.',
      icon: 'success',
      confirmButtonText: 'Selesai'
    })
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Tidak memiliki masa berlaku'

    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <Card>
        {/* Header */}
        <CardContent className='flex flex-col gap-6'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='warning'
                size={48}
              >
                <i className='tabler-certificate text-[1.5rem]' />
              </CustomAvatar>

              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <Typography variant='h5'>
                    Sertifikasi
                  </Typography>

                  <Chip
                    label={`${certificationList.length} Sertifikasi`}
                    size='small'
                    color='primary'
                    variant='tonal'
                  />
                </div>

                <Typography
                  variant='body2'
                  color='text.secondary'
                >
                  Sertifikasi dan kompetensi yang dimiliki oleh pelatih
                  beserta bukti dokumen pendukungnya.
                </Typography>
              </div>
            </div>

            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
            >
              Tambah Sertifikasi
            </Button>
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
                <i className='tabler-certificate' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Total Sertifikasi
                </Typography>

                <Typography
                  variant='h6'
                  className='leading-tight'
                >
                  {certificationList.length}
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
                  Masih Berlaku
                </Typography>

                <Typography
                  variant='h6'
                  className='leading-tight'
                >
                  {activeCount}
                </Typography>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border border-divider p-3'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='error'
                size={38}
              >
                <i className='tabler-clock-x' />
              </CustomAvatar>

              <div className='flex flex-col'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Kedaluwarsa
                </Typography>

                <Typography
                  variant='h6'
                  className='leading-tight'
                >
                  {expiredCount}
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>

        <Divider />

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
            <tr>
              <th>Sertifikasi</th>
              <th>Lembaga Penerbit</th>
              <th>Nomor Sertifikat</th>
              <th>Diterbitkan</th>
              <th>Berlaku Sampai</th>
              <th>Bukti</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
            </thead>

            <tbody>
            {certificationList.map(item => (
              <tr key={item.id}>
                {/* Certification */}
                <td>
                  <div className='flex items-center gap-3'>
                    <CustomAvatar
                      variant='rounded'
                      skin='light'
                      color='warning'
                      size={40}
                    >
                      <i className='tabler-award' />
                    </CustomAvatar>

                    <div className='flex flex-col gap-0.5'>
                      <Typography className='font-medium'>
                        {item.name}
                      </Typography>

                      <Typography
                        variant='caption'
                        color='text.secondary'
                      >
                        Sertifikasi kompetensi
                      </Typography>
                    </div>
                  </div>
                </td>

                {/* Issuer */}
                <td>
                  <Typography variant='body2'>
                    {item.issuer}
                  </Typography>
                </td>

                {/* Number */}
                <td>
                  <Typography
                    variant='body2'
                    className='font-medium'
                  >
                    {item.certificateNumber}
                  </Typography>
                </td>

                {/* Issued */}
                <td>
                  <Typography variant='body2'>
                    {formatDate(item.issuedAt)}
                  </Typography>
                </td>

                {/* Expiry */}
                <td>
                  <Typography
                    variant='body2'
                    color={
                      item.status === 'expired'
                        ? 'error.main'
                        : 'text.primary'
                    }
                  >
                    {formatDate(item.expiresAt)}
                  </Typography>
                </td>

                {/* Evidence */}
                <td>
                  {item.evidence ? (
                    <div className='flex items-center gap-2 min-w-[220px]'>
                      <CustomAvatar
                        variant='rounded'
                        skin='light'
                        color='error'
                        size={34}
                      >
                        <i className='tabler-file-type-pdf' />
                      </CustomAvatar>

                      <div className='flex flex-col min-w-0'>
                        <Typography
                          variant='body2'
                          className='font-medium truncate max-w-[170px]'
                          title={item.evidence.fileName}
                        >
                          {item.evidence.fileName}
                        </Typography>

                        <Typography
                          variant='caption'
                          color='text.secondary'
                        >
                          {item.evidence.fileSize}
                        </Typography>
                      </div>

                      <Tooltip title='Lihat Bukti'>
                        <IconButton
                          size='small'
                          onClick={() => setPreview(item)}
                        >
                          <i className='tabler-eye' />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : (
                    <Chip
                      label='Belum Ada Bukti'
                      size='small'
                      color='warning'
                      variant='tonal'
                    />
                  )}
                </td>

                {/* Status */}
                <td>
                  <Chip
                    label={
                      item.status === 'active'
                        ? 'Aktif'
                        : 'Kedaluwarsa'
                    }
                    color={
                      item.status === 'active'
                        ? 'success'
                        : 'error'
                    }
                    variant='tonal'
                    size='small'
                    icon={
                      <i
                        className={
                          item.status === 'active'
                            ? 'tabler-circle-check'
                            : 'tabler-clock-x'
                        }
                      />
                    }
                  />
                </td>

                {/* Actions */}
                <td>
                  <div className='flex items-center gap-1'>
                    <Tooltip title='Lihat Bukti'>
                      <IconButton
                        size='small'
                        disabled={!item.evidence}
                        onClick={() => setPreview(item)}
                      >
                        <i className='tabler-eye' />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Unduh Bukti'>
                      <IconButton
                        size='small'
                        disabled={!item.evidence}
                      >
                        <i className='tabler-download' />
                      </IconButton>
                    </Tooltip>

                    <OptionMenu
                      iconButtonProps={{
                        size: 'small'
                      }}
                      options={[
                        {
                          text: 'Lihat Bukti',
                          icon: 'tabler-file-search',
                          menuItemProps: {
                            disabled: !item.evidence,
                            onClick: () =>
                              setPreview(item)
                          }
                        },
                        {
                          text: 'Unduh Bukti',
                          icon: 'tabler-download',
                          menuItemProps: {
                            disabled: !item.evidence
                          }
                        },
                        {
                          text: 'Ganti Bukti',
                          icon: 'tabler-upload',
                          menuItemProps: {
                            onClick: () =>
                              handleReplaceEvidence(item)
                          }
                        },
                        {
                          text: 'Edit Sertifikasi',
                          icon: 'tabler-edit',
                          menuItemProps: {
                            onClick: () => {
                              // TODO: buka EditCertificationDialog
                            }
                          }
                        },
                        {
                          text: 'Hapus Sertifikasi',
                          icon: 'tabler-trash',
                          menuItemProps: {
                            onClick: () =>
                              handleDelete(item)
                          }
                        }
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {certificationList.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-3 p-12'>
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='secondary'
              size={56}
            >
              <i className='tabler-certificate text-2xl' />
            </CustomAvatar>

            <Typography variant='h6'>
              Belum Ada Sertifikasi
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              className='text-center'
            >
              Belum ada sertifikasi yang ditambahkan
              ke profil pelatih.
            </Typography>

            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
            >
              Tambah Sertifikasi
            </Button>
          </div>
        )}
      </Card>

      {/* Evidence Preview */}
      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h5'>
              Bukti Sertifikasi
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
            >
              {preview?.name}
            </Typography>
          </div>

          <IconButton
            onClick={() => setPreview(null)}
          >
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div className='relative overflow-hidden rounded-xl border border-divider bg-actionHover min-h-[520px]'>
            {/* Fake certificate */}
            <div className='absolute inset-8 rounded-lg bg-background shadow-sm p-8'>
              <div className='flex flex-col items-center gap-5'>
                <div className='h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center'>
                  <i className='tabler-certificate text-warning text-2xl' />
                </div>

                <div className='h-4 w-64 rounded bg-textDisabled/20' />

                <div className='h-2 w-48 rounded bg-textDisabled/15' />

                <div className='mt-5 h-3 w-72 rounded bg-textDisabled/15' />
                <div className='h-3 w-60 rounded bg-textDisabled/15' />

                <div className='mt-6 h-24 w-full rounded border border-divider bg-actionHover' />

                <div className='flex w-full justify-between mt-8'>
                  <div className='h-2 w-24 rounded bg-textDisabled/15' />
                  <div className='h-2 w-24 rounded bg-textDisabled/15' />
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

            {/* Protected Overlay */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='flex flex-col items-center text-center gap-3 max-is-[340px]'>
                <CustomAvatar
                  variant='rounded'
                  skin='light'
                  color='warning'
                  size={56}
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
                  Dokumen sertifikasi mengandung data
                  pribadi dan ditampilkan dalam mode
                  pratinjau terbatas.
                </Typography>

                <Chip
                  label={preview?.evidence?.fileName ?? 'Dokumen'}
                  size='small'
                  variant='tonal'
                  color='error'
                  icon={<i className='tabler-file-type-pdf' />}
                />
              </div>
            </div>
          </div>

          {/* File Information */}
          {preview?.evidence && (
            <div className='mt-4 rounded-lg border border-divider p-4'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <CustomAvatar
                    variant='rounded'
                    skin='light'
                    color='error'
                  >
                    <i className='tabler-file-type-pdf' />
                  </CustomAvatar>

                  <div className='flex flex-col'>
                    <Typography className='font-medium'>
                      {preview.evidence.fileName}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                    >
                      {preview.evidence.fileSize} •
                      Diunggah{' '}
                      {formatDate(
                        preview.evidence.uploadedAt
                      )}
                    </Typography>
                  </div>
                </div>

                <Button
                  variant='outlined'
                  startIcon={
                    <i className='tabler-download' />
                  }
                >
                  Unduh
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CertificationListTable
