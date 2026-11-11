'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

type Props = {
  mode: 'create' | 'edit'
  instructorId?: string
}

type DocumentKey =
  | 'ktp'
  | 'ijazah'
  | 'kompetensi'
  | 'pelatihan'

type DocumentStatus =
  | 'new'
  | 'verified'
  | 'rejected'

type InstructorDocument = {
  id: string
  key: DocumentKey
  title: string
  description: string
  file: File | null
  fileName: string
  fileSize: number
  fileType: string
  status: DocumentStatus
  existing: boolean
}

type AdditionalDocument = {
  id: string
  title: string
  file: File
  fileName: string
  fileSize: number
  fileType: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
}

const DOCUMENT_CONFIG: {
  key: DocumentKey
  title: string
  description: string
  icon: string
  color: 'primary' | 'info' | 'success' | 'warning'
}[] = [
  {
    key: 'ktp',
    title: 'KTP',
    description: 'Dokumen identitas resmi pelatih.',
    icon: 'tabler-id',
    color: 'primary'
  },
  {
    key: 'ijazah',
    title: 'Ijazah Terakhir',
    description: 'Bukti pendidikan terakhir yang dimiliki.',
    icon: 'tabler-school',
    color: 'info'
  },
  {
    key: 'kompetensi',
    title: 'Sertifikat Kompetensi',
    description: 'Bukti kompetensi atau sertifikasi profesi.',
    icon: 'tabler-certificate',
    color: 'success'
  },
  {
    key: 'pelatihan',
    title: 'Sertifikat Pelatihan',
    description: 'Sertifikat pelatihan yang relevan.',
    icon: 'tabler-certificate-2',
    color: 'warning'
  }
]

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const getFileExtension = (fileName: string) => {
  const extension = fileName.split('.').pop()

  return extension?.toUpperCase() || 'FILE'
}

const getStatusConfig = (status: DocumentStatus) => {
  switch (status) {
    case 'verified':
      return {
        label: 'Terverifikasi',
        color: 'success' as const,
        icon: 'tabler-circle-check'
      }

    case 'rejected':
      return {
        label: 'Ditolak',
        color: 'error' as const,
        icon: 'tabler-circle-x'
      }

    default:
      return {
        label: 'Dokumen Baru',
        color: 'primary' as const,
        icon: 'tabler-file'
      }
  }
}

/* ============================================================
   DOCUMENT DROPZONE
============================================================ */

const DocumentDropzone = ({
                            title,
                            description,
                            icon,
                            color,
                            existingDocument,
                            onFileSelected,
                            onRemove,
                            onPreview
                          }: {
  title: string
  description: string
  icon: string
  color: 'primary' | 'info' | 'success' | 'warning'
  existingDocument?: InstructorDocument
  onFileSelected: (file: File) => void
  onRemove: () => void
  onPreview: () => void
}) => {
  const [error, setError] = useState('')

  const handleDrop = (files: File[]) => {
    setError('')

    if (!files.length) {
      return
    }

    const file = files[0]

    if (file.size > MAX_FILE_SIZE) {
      setError('Ukuran file maksimal 5 MB.')

      return
    }

    onFileSelected(file)
  }

  const handleRejected = () => {
    setError('Format file harus PDF, JPG, JPEG, atau PNG.')
  }

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      multiple: false,
      maxSize: MAX_FILE_SIZE,
      accept: ACCEPTED_FILE_TYPES,
      onDrop: handleDrop,
      onDropRejected: handleRejected
    })

  const isImage =
    existingDocument?.file?.type.startsWith('image/') ||
    false

  return (
    <div className='rounded-lg border overflow-hidden'>

      {/* Document Header */}
      <div className='flex items-start gap-3 p-3 bg-actionHover/40'>
        <CustomAvatar
          variant='rounded'
          skin='light'
          color={color}
          size={36}
        >
          <i className={`${icon} text-lg`} />
        </CustomAvatar>

        <div className='min-is-0 flex-1'>
          <div className='flex items-center justify-between gap-2'>
            <Typography
              variant='body2'
              className='font-semibold'
            >
              {title}
            </Typography>

            <Typography
              variant='caption'
              color='text.disabled'
              className='whitespace-nowrap'
            >
              optional
            </Typography>
          </div>

          <Typography
            variant='caption'
            color='text.secondary'
          >
            {description}
          </Typography>
        </div>
      </div>

      <Divider />

      {/* Existing / Uploaded File */}
      {existingDocument ? (
        <div className='p-3'>

          <div className='flex items-center gap-3'>

            {/* Preview */}
            <div
              className='relative shrink-0 cursor-pointer'
              onClick={onPreview}
            >
              {isImage ? (
                <img
                  src={URL.createObjectURL(
                    existingDocument.file!
                  )}
                  alt={existingDocument.fileName}
                  className='bs-12 is-12 object-cover rounded'
                />
              ) : (
                <CustomAvatar
                  variant='rounded'
                  skin='light'
                  color='error'
                  size={48}
                >
                  <i className='tabler-file-type-pdf text-xl' />
                </CustomAvatar>
              )}
            </div>

            {/* File Information */}
            <div className='min-is-0 flex-1'>
              <Typography
                variant='body2'
                className='font-medium truncate'
                title={existingDocument.fileName}
              >
                {existingDocument.fileName}
              </Typography>

              <div className='flex items-center gap-1.5 mt-0.5'>
                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {formatFileSize(
                    existingDocument.fileSize
                  )}
                </Typography>

                <span className='text-textDisabled'>•</span>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {getFileExtension(
                    existingDocument.fileName
                  )}
                </Typography>
              </div>

              <Chip
                size='small'
                variant='tonal'
                color={
                  getStatusConfig(
                    existingDocument.status
                  ).color
                }
                icon={
                  <i
                    className={
                      getStatusConfig(
                        existingDocument.status
                      ).icon
                    }
                  />
                }
                label={
                  getStatusConfig(
                    existingDocument.status
                  ).label
                }
                className='mt-1'
              />
            </div>

            {/* Actions */}
            <div className='flex items-center shrink-0'>
              <Tooltip title='Lihat dokumen'>
                <IconButton
                  size='small'
                  onClick={onPreview}
                >
                  <i className='tabler-eye text-lg' />
                </IconButton>
              </Tooltip>

              <Tooltip title='Ganti dokumen'>
                <div>
                  <IconButton
                    size='small'
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />

                    <i className='tabler-replace text-lg' />
                  </IconButton>
                </div>
              </Tooltip>

              <Tooltip title='Hapus dokumen'>
                <IconButton
                  size='small'
                  color='error'
                  onClick={onRemove}
                >
                  <i className='tabler-trash text-lg' />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {error && (
            <Typography
              variant='caption'
              color='error'
              className='block mt-2'
            >
              {error}
            </Typography>
          )}
        </div>
      ) : (
        /* Dropzone */
        <div className='p-3'>
          <div
            {...getRootProps({
              className: `
                flex flex-col items-center justify-center
                text-center rounded-lg border border-dashed
                cursor-pointer
                transition-all duration-200
                px-3 py-5
                ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-divider hover:border-primary hover:bg-primary/5'
              }
              `
            })}
          >
            <input {...getInputProps()} />

            <CustomAvatar
              variant='rounded'
              skin='light'
              color={color}
              size={38}
            >
              <i className='tabler-cloud-upload text-lg' />
            </CustomAvatar>

            <Typography
              variant='body2'
              className='font-medium mt-2'
            >
              {isDragActive
                ? 'Lepaskan file di sini'
                : 'Unggah dokumen'}
            </Typography>

            <Typography
              variant='caption'
              color='text.secondary'
              className='mt-0.5'
            >
              Klik atau tarik file ke sini
            </Typography>

            <Typography
              variant='caption'
              color='text.disabled'
              className='mt-1'
            >
              PDF, JPG, PNG · Maks. 5 MB
            </Typography>
          </div>

          {error && (
            <Typography
              variant='caption'
              color='error'
              className='block mt-2'
            >
              {error}
            </Typography>
          )}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

const InstructorDocuments = ({ mode }: Props) => {
  const [documents, setDocuments] = useState<
    Partial<Record<DocumentKey, InstructorDocument>>
  >({})

  const [additionalDocuments, setAdditionalDocuments] =
    useState<AdditionalDocument[]>([])

  const [previewDocument, setPreviewDocument] =
    useState<InstructorDocument | AdditionalDocument | null>(
      null
    )

  const [additionalError, setAdditionalError] =
    useState('')

  const documentConfig = useMemo(
    () => DOCUMENT_CONFIG,
    []
  )

  const handleFileSelected = (
    key: DocumentKey,
    file: File
  ) => {
    const config = documentConfig.find(
      item => item.key === key
    )

    if (!config) {
      return
    }

    const document: InstructorDocument = {
      id: `${key}-${Date.now()}`,
      key,
      title: config.title,
      description: config.description,
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      status: 'new',
      existing: false
    }

    setDocuments(prev => ({
      ...prev,
      [key]: document
    }))
  }

  const handleRemoveDocument = (key: DocumentKey) => {
    setDocuments(prev => {
      const next = { ...prev }

      delete next[key]

      return next
    })
  }

  const handleAdditionalFiles = (files: File[]) => {
    setAdditionalError('')

    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        return false
      }

      return true
    })

    if (!validFiles.length && files.length) {
      setAdditionalError(
        'File tidak dapat ditambahkan. Pastikan format PDF/JPG/PNG dan ukuran maksimal 5 MB.'
      )

      return
    }

    const newFiles = validFiles.map(file => ({
      id: `additional-${Date.now()}-${Math.random()}`,
      title: 'Dokumen Pendukung',
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }))

    setAdditionalDocuments(prev => [
      ...prev,
      ...newFiles
    ])
  }

  const handleRemoveAdditional = (id: string) => {
    setAdditionalDocuments(prev =>
      prev.filter(document => document.id !== id)
    )
  }

  const {
    getRootProps: getAdditionalRootProps,
    getInputProps: getAdditionalInputProps,
    isDragActive: isAdditionalDragActive
  } = useDropzone({
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    accept: ACCEPTED_FILE_TYPES,
    onDrop: handleAdditionalFiles,
    onDropRejected: () => {
      setAdditionalError(
        'Format file harus PDF, JPG, JPEG, atau PNG dengan ukuran maksimal 5 MB.'
      )
    }
  })

  const totalDocuments =
    Object.keys(documents).length +
    additionalDocuments.length

  return (
    <>
      <Card>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <CardHeader
          avatar={
            <CustomAvatar
              variant='rounded'
              skin='light'
              color='primary'
            >
              <i className='tabler-files text-xl' />
            </CustomAvatar>
          }
          title='Dokumen Pelatih'
          subheader={
            mode === 'edit'
              ? 'Kelola dokumen pendukung pelatih.'
              : 'Lengkapi dokumen pendukung pelatih.'
          }
        />

        <CardContent>

          {/* Summary */}
          <div className='flex items-center justify-between gap-3 p-3 rounded-lg bg-actionHover/50 border mbe-4'>
            <div className='flex items-center gap-2'>
              <i className='tabler-folder-check text-textSecondary' />

              <div>
                <Typography
                  variant='body2'
                  className='font-medium'
                >
                  Dokumen pendukung
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  {totalDocuments} dokumen ditambahkan
                </Typography>
              </div>
            </div>

            <Chip
              size='small'
              label={`${totalDocuments} File`}
              variant='tonal'
              color='primary'
            />
          </div>

          {/* =====================================================
              DOCUMENT SLOTS
          ====================================================== */}

          <div className='flex flex-col gap-3'>

            {documentConfig.map(document => (
              <DocumentDropzone
                key={document.key}
                title={document.title}
                description={document.description}
                icon={document.icon}
                color={document.color}
                existingDocument={
                  documents[document.key]
                }
                onFileSelected={file =>
                  handleFileSelected(
                    document.key,
                    file
                  )
                }
                onRemove={() =>
                  handleRemoveDocument(
                    document.key
                  )
                }
                onPreview={() => {
                  const selected =
                    documents[document.key]

                  if (selected) {
                    setPreviewDocument(selected)
                  }
                }}
              />
            ))}

          </div>

          {/* =====================================================
              ADDITIONAL DOCUMENTS
          ====================================================== */}

          <div className='mt-4'>
            <div className='flex items-center gap-2 mbe-2'>
              <i className='tabler-paperclip text-textSecondary' />

              <Typography
                variant='body2'
                className='font-semibold'
              >
                Dokumen Pendukung Lainnya
              </Typography>

              <Typography
                variant='caption'
                color='text.disabled'
              >
                (optional)
              </Typography>
            </div>

            <Typography
              variant='caption'
              color='text.secondary'
              className='block mbe-2'
            >
              Tambahkan dokumen lain yang relevan dengan
              kompetensi atau pengalaman pelatih.
            </Typography>

            <div
              {...getAdditionalRootProps({
                className: `
                  flex items-center gap-3
                  rounded-lg border border-dashed
                  px-3 py-3 cursor-pointer
                  transition-all duration-200
                  ${
                  isAdditionalDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-divider hover:border-primary hover:bg-primary/5'
                }
                `
              })}
            >
              <input
                {...getAdditionalInputProps()}
              />

              <CustomAvatar
                variant='rounded'
                skin='light'
                color='secondary'
                size={40}
              >
                <i className='tabler-plus text-lg' />
              </CustomAvatar>

              <div className='min-is-0 flex-1'>
                <Typography
                  variant='body2'
                  className='font-medium'
                >
                  Tambahkan dokumen
                </Typography>

                <Typography
                  variant='caption'
                  color='text.secondary'
                >
                  Klik atau tarik satu atau beberapa file
                </Typography>
              </div>

              <Button
                variant='tonal'
                size='small'
                type='button'
              >
                Pilih File
              </Button>
            </div>

            {additionalError && (
              <Typography
                variant='caption'
                color='error'
                className='block mt-2'
              >
                {additionalError}
              </Typography>
            )}

            {/* Additional File List */}
            {additionalDocuments.length > 0 && (
              <div className='flex flex-col gap-2 mt-3'>
                {additionalDocuments.map(document => (
                  <div
                    key={document.id}
                    className='flex items-center gap-3 p-2.5 rounded-lg border'
                  >
                    <CustomAvatar
                      variant='rounded'
                      skin='light'
                      color='error'
                      size={36}
                    >
                      <i className='tabler-file-type-pdf' />
                    </CustomAvatar>

                    <div className='min-is-0 flex-1'>
                      <Typography
                        variant='body2'
                        className='font-medium truncate'
                      >
                        {document.fileName}
                      </Typography>

                      <Typography
                        variant='caption'
                        color='text.secondary'
                      >
                        {formatFileSize(
                          document.fileSize
                        )}
                      </Typography>
                    </div>

                    <Tooltip title='Lihat'>
                      <IconButton
                        size='small'
                        onClick={() =>
                          setPreviewDocument(
                            document
                          )
                        }
                      >
                        <i className='tabler-eye' />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Hapus'>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() =>
                          handleRemoveAdditional(
                            document.id
                          )
                        }
                      >
                        <i className='tabler-trash' />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </div>


        </CardContent>
      </Card>

      {/* =======================================================
          DOCUMENT PREVIEW
      ======================================================== */}

      <Dialog
        open={Boolean(previewDocument)}
        onClose={() => setPreviewDocument(null)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle className='flex items-center justify-between gap-3'>
          <div className='min-is-0'>
            <Typography
              variant='h6'
              className='truncate'
            >
              {previewDocument?.fileName}
            </Typography>

            {previewDocument && (
              <Typography
                variant='caption'
                color='text.secondary'
              >
                {formatFileSize(
                  previewDocument.fileSize
                )}
              </Typography>
            )}
          </div>

          <IconButton
            size='small'
            onClick={() =>
              setPreviewDocument(null)
            }
          >
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {previewDocument?.file &&
          previewDocument.file.type.startsWith(
            'image/'
          ) ? (
            <div className='flex justify-center'>
              <img
                src={URL.createObjectURL(
                  previewDocument.file
                )}
                alt={previewDocument.fileName}
                className='max-bs-[70vh] max-is-full object-contain rounded'
              />
            </div>
          ) : previewDocument?.file ? (
            <iframe
              src={URL.createObjectURL(
                previewDocument.file
              )}
              title={previewDocument.fileName}
              className='w-full bs-[70vh] rounded border'
            />
          ) : (
            <div className='flex flex-col items-center justify-center bs-[300px]'>
              <CustomAvatar
                variant='rounded'
                skin='light'
                color='error'
                size={64}
              >
                <i className='tabler-file-type-pdf text-3xl' />
              </CustomAvatar>

              <Typography className='mt-3 font-medium'>
                Preview tidak tersedia
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
              >
                Dokumen tersimpan dapat dibuka melalui
                aksi lihat dokumen.
              </Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InstructorDocuments
