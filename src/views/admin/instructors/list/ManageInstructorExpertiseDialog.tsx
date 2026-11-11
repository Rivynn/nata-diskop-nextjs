'use client'

import { useEffect, useMemo, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import type { InstructorCardType } from './InstructorCards'

type Props = {
  open: boolean
  instructor: InstructorCardType | null
  onClose: () => void
}

const expertiseOptions = [
  'Programming',
  'Web Development',
  'Digital Marketing',
  'Kewirausahaan',
  'UMKM',
  'Keuangan',
  'Administrasi Perkantoran',
  'Microsoft Office',
  'K3',
  'Manajemen Bisnis',
  'Industri & Manufaktur',
  'Desain Grafis'
]

const ManageInstructorExpertiseDialog = ({
                                           open,
                                           instructor,
                                           onClose
                                         }: Props) => {
  const [expertises, setExpertises] = useState<string[]>([])

  useEffect(() => {
    if (!instructor) return

    setExpertises(
      instructor.expertise.map(item => item.title)
    )
  }, [instructor])

  const availableOptions = useMemo(() => {
    return expertiseOptions.filter(
      expertise => !expertises.includes(expertise)
    )
  }, [expertises])

  const handleExpertiseChange = (
    index: number,
    value: string | null
  ) => {
    setExpertises(current => {
      const next = [...current]

      if (value) {
        next[index] = value
      } else {
        next.splice(index, 1)
      }

      return next
    })
  }

  const handleAddExpertise = () => {
    if (availableOptions.length === 0) return

    setExpertises(current => [
      ...current,
      availableOptions[0]
    ])
  }

  const handleRemoveExpertise = (index: number) => {
    setExpertises(current =>
      current.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  const handleSubmit = () => {
    console.log('Instructor:', instructor?.id)
    console.log('Expertise:', expertises)

    // TODO:
    // Server Action / API / Prisma
    //
    // await updateInstructorExpertises({
    //   instructorId: instructor.id,
    //   expertiseIds: ...
    // })

    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h5' className='font-semibold'>
            Kelola Keahlian
          </Typography>

          {instructor && (
            <Typography variant='body2' color='text.secondary'>
              Atur keahlian yang dimiliki {instructor.name}.
            </Typography>
          )}
        </div>

        <IconButton
          onClick={onClose}
          size='small'
          aria-label='Tutup'
        >
          <i className='tabler-x' />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent className='flex flex-col gap-5'>
        <div className='rounded-lg bg-primaryLight p-4'>
          <div className='flex items-start gap-3'>
            <div className='flex bs-10 is-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
              <i className='tabler-sparkles text-primary text-xl' />
            </div>

            <div className='flex flex-col gap-1'>
              <Typography
                variant='body2'
                className='font-medium'
              >
                Keahlian Pelatih
              </Typography>

              <Typography
                variant='caption'
                color='text.secondary'
              >
                Pilih satu atau beberapa keahlian yang sesuai
                dengan kompetensi pelatih.
              </Typography>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          {expertises.map((expertise, index) => {
            const currentValue = expertise || null

            const options = [
              ...(currentValue ? [currentValue] : []),
              ...availableOptions.filter(
                option => option !== currentValue
              )
            ]

            return (
              <div
                key={`${index}-${expertise}`}
                className='flex items-start gap-2'
              >
                <Autocomplete
                  fullWidth
                  options={options}
                  value={currentValue}
                  onChange={(_, value) =>
                    handleExpertiseChange(index, value)
                  }
                  getOptionLabel={option => option}
                  isOptionEqualToValue={(option, value) =>
                    option === value
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={`Keahlian ${index + 1}`}
                      placeholder='Cari keahlian...'
                    />
                  )}
                />

                <IconButton
                  color='error'
                  onClick={() =>
                    handleRemoveExpertise(index)
                  }
                  disabled={expertises.length === 1}
                  aria-label='Hapus keahlian'
                  className='mt-1'
                >
                  <i className='tabler-trash' />
                </IconButton>
              </div>
            )
          })}
        </div>

        <Button
          variant='tonal'
          color='primary'
          startIcon={<i className='tabler-plus' />}
          onClick={handleAddExpertise}
          disabled={availableOptions.length === 0}
        >
          Tambah Keahlian
        </Button>

        {expertises.length === 0 && (
          <Typography
            variant='body2'
            color='text.secondary'
            className='text-center py-4'
          >
            Belum ada keahlian yang dipilih.
          </Typography>
        )}
      </DialogContent>

      <Divider />

      <DialogActions className='px-6 py-4'>
        <Button
          variant='tonal'
          color='secondary'
          onClick={onClose}
        >
          Batal
        </Button>

        <Button
          variant='contained'
          startIcon={<i className='tabler-check' />}
          onClick={handleSubmit}
        >
          Simpan Keahlian
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ManageInstructorExpertiseDialog
