// React Imports
import { useEffect, useState, forwardRef, useCallback } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type {
  AddEventSidebarType,
  AddEventType
} from '@/types/apps/calendarTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Slice Imports
import {
  addEvent,
  deleteEvent,
  updateEvent,
  selectedEvent,
  filterEvents
} from '@/redux-store/slices/calendar'

interface PickerProps {
  label?: string
  error?: boolean
  registername?: string
}

interface DefaultStateType {
  title: string
  allDay: boolean
  calendar: string
  instructor: string
  location: string
  room: string
  capacity: number
  description: string
  endDate: Date
  startDate: Date
}

// Default State
const defaultState: DefaultStateType = {
  title: '',
  allDay: false,
  calendar: 'Pelatihan',
  instructor: '',
  location: '',
  room: '',
  capacity: 30,
  description: '',
  endDate: new Date(),
  startDate: new Date()
}

const AddEventSidebar = (props: AddEventSidebarType) => {
  // Props
  const {
    calendarStore,
    dispatch,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // States
  const [values, setValues] =
    useState<DefaultStateType>(defaultState)

  // Refs
  const PickersComponent = forwardRef(
    ({ ...props }: PickerProps, ref) => {
      return (
        <CustomTextField
          inputRef={ref}
          fullWidth
          {...props}
          label={props.label || ''}
          className='is-full'
          error={props.error}
        />
      )
    }
  )

  // Hooks
  const isBelowSmScreen = useMediaQuery(
    (theme: Theme) => theme.breakpoints.down('sm')
  )

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: ''
    }
  })

  // Reset form from selected event
  const resetToStoredValues = useCallback(() => {
    if (calendarStore.selectedEvent !== null) {
      const event = calendarStore.selectedEvent

      setValue('title', event.title || '')

      setValues({
        title: event.title || '',
        allDay: event.allDay ?? false,

        calendar:
          event.extendedProps?.calendar ||
          'Pelatihan',

        instructor:
          event.extendedProps?.instructor ||
          '',

        location:
          event.extendedProps?.location ||
          '',

        room:
          event.extendedProps?.room ||
          '',

        capacity:
          event.extendedProps?.capacity ||
          30,

        description:
          event.extendedProps?.description ||
          '',

        endDate:
          event.end !== null
            ? new Date(event.end)
            : event.start !== null
              ? new Date(event.start)
              : new Date(),

        startDate:
          event.start !== null
            ? new Date(event.start)
            : new Date()
      })
    }
  }, [
    setValue,
    calendarStore.selectedEvent
  ])

  // Reset form
  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  // Close sidebar
  const handleSidebarClose = () => {
    setValues(defaultState)
    clearErrors()

    dispatch(selectedEvent(null))

    handleAddEventSidebarToggle()
  }

  // Submit
  const onSubmit = (data: { title: string }) => {
    const modifiedEvent: AddEventType = {
      display: 'block',

      title: data.title,

      start: values.startDate,

      end: values.endDate,

      allDay: values.allDay,

      extendedProps: {
        calendar: values.calendar,

        instructor: values.instructor,

        location: values.location,

        room: values.room,

        capacity: values.capacity,

        description:
          values.description.length
            ? values.description
            : undefined
      }
    }

    // Add new event
    if (
      calendarStore.selectedEvent === null ||
      (
        calendarStore.selectedEvent !== null &&
        !calendarStore.selectedEvent.title.length
      )
    ) {
      dispatch(addEvent(modifiedEvent))
    }

    // Update existing event
    else {
      dispatch(
        updateEvent({
          ...modifiedEvent,
          id: calendarStore.selectedEvent.id
        })
      )
    }

    dispatch(filterEvents())

    handleSidebarClose()
  }

  // Delete event
  const handleDeleteButtonClick = () => {
    if (calendarStore.selectedEvent) {
      dispatch(
        deleteEvent(calendarStore.selectedEvent.id)
      )

      dispatch(filterEvents())
    }

    handleSidebarClose()
  }

  // Handle start date
  const handleStartDate = (date: Date | null) => {
    if (date && date > values.endDate) {
      setValues({
        ...values,
        startDate: new Date(date),
        endDate: new Date(date)
      })
    }
  }

  // Footer
  const RenderSidebarFooter = () => {
    const isEditing =
      calendarStore.selectedEvent !== null &&
      calendarStore.selectedEvent.title.length

    if (!isEditing) {
      return (
        <div className='flex gap-4'>
          <Button
            type='submit'
            variant='contained'
          >
            Simpan Jadwal
          </Button>

          <Button
            variant='outlined'
            color='secondary'
            onClick={resetToEmptyValues}
          >
            Reset
          </Button>
        </div>
      )
    }

    return (
      <div className='flex gap-4'>
        <Button
          type='submit'
          variant='contained'
        >
          Simpan Perubahan
        </Button>

        <Button
          variant='outlined'
          color='secondary'
          onClick={resetToStoredValues}
        >
          Reset
        </Button>
      </div>
    )
  }

  // Scroll wrapper
  const ScrollWrapper = isBelowSmScreen
    ? 'div'
    : PerfectScrollbar

  // Sync selected event
  useEffect(() => {
    if (calendarStore.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [
    addEventSidebarOpen,
    resetToStoredValues,
    resetToEmptyValues,
    calendarStore.selectedEvent
  ])

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: ['100%', 400]
        }
      }}
    >
      {/* Header */}
      <Box className='flex justify-between items-center sidebar-header plb-5 pli-6 border-be'>
        <Box>
          <Typography variant='h5'>
            {calendarStore.selectedEvent &&
            calendarStore.selectedEvent.title.length
              ? 'Edit Jadwal'
              : 'Tambah Jadwal'}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
          >
            Atur jadwal pelatihan
          </Typography>
        </Box>

        {calendarStore.selectedEvent &&
        calendarStore.selectedEvent.title.length ? (
          <Box className='flex items-center gap-1'>
            <IconButton
              size='small'
              onClick={handleDeleteButtonClick}
            >
              <i className='tabler-trash text-2xl text-textPrimary' />
            </IconButton>

            <IconButton
              size='small'
              onClick={handleSidebarClose}
            >
              <i className='tabler-x text-2xl text-textPrimary' />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            size='small'
            onClick={handleSidebarClose}
          >
            <i className='tabler-x text-2xl text-textPrimary' />
          </IconButton>
        )}
      </Box>

      {/* Body */}
      <ScrollWrapper
        {...(isBelowSmScreen
          ? {
            className:
              'bs-full overflow-y-auto overflow-x-hidden'
          }
          : {
            options: {
              wheelPropagation: false,
              suppressScrollX: true
            }
          })}
      >
        <Box className='sidebar-body plb-5 pli-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete='off'
            className='flex flex-col gap-6'
          >
            {/* Pelatihan */}
            <Controller
              name='title'
              control={control}
              rules={{
                required: true
              }}
              render={({
                         field: {
                           value,
                           onChange
                         }
                       }) => (
                <CustomTextField
                  fullWidth
                  select
                  label='Pelatihan'
                  value={value}
                  onChange={onChange}
                  {...(errors.title && {
                    error: true,
                    helperText:
                      'Pelatihan wajib dipilih'
                  })}
                >
                  <MenuItem value='Pelatihan Digital Marketing untuk UMKM'>
                    Digital Marketing untuk UMKM
                  </MenuItem>

                  <MenuItem value='Pelatihan Administrasi Perkantoran'>
                    Administrasi Perkantoran
                  </MenuItem>

                  <MenuItem value='Pelatihan Kewirausahaan Pemula'>
                    Kewirausahaan Pemula
                  </MenuItem>
                </CustomTextField>
              )}
            />

            {/* Jenis Jadwal */}
            <CustomTextField
              select
              fullWidth
              label='Jenis Jadwal'
              value={values.calendar}
              onChange={e =>
                setValues({
                  ...values,
                  calendar: e.target.value
                })
              }
            >
              <MenuItem value='Pelatihan'>
                Pelatihan
              </MenuItem>

              <MenuItem value='Pendaftaran'>
                Pendaftaran
              </MenuItem>

              <MenuItem value='Penilaian'>
                Penilaian
              </MenuItem>

              <MenuItem value='Sertifikasi'>
                Sertifikasi
              </MenuItem>

              <MenuItem value='Dibatalkan'>
                Dibatalkan
              </MenuItem>
            </CustomTextField>

            {/* Pelatih */}
            <CustomTextField
              select
              fullWidth
              label='Pelatih'
              value={values.instructor}
              onChange={e =>
                setValues({
                  ...values,
                  instructor: e.target.value
                })
              }
            >
              <MenuItem value='Budi Santoso'>
                Budi Santoso
              </MenuItem>

              <MenuItem value='Siti Rahma'>
                Siti Rahma
              </MenuItem>

              <MenuItem value='Fajar Hidayat'>
                Fajar Hidayat
              </MenuItem>
            </CustomTextField>

            {/* Start Date */}
            <AppReactDatepicker
              selectsStart
              id='training-start-date'
              endDate={values.endDate}
              selected={values.startDate}
              startDate={values.startDate}
              showTimeSelect={!values.allDay}
              dateFormat={
                !values.allDay
                  ? 'yyyy-MM-dd HH:mm'
                  : 'yyyy-MM-dd'
              }
              customInput={
                <PickersComponent
                  label='Tanggal Mulai'
                  registername='startDate'
                />
              }
              onChange={(
                date: Date | null
              ) =>
                date !== null &&
                setValues({
                  ...values,
                  startDate: new Date(date)
                })
              }
              onSelect={handleStartDate}
            />

            {/* End Date */}
            <AppReactDatepicker
              selectsEnd
              id='training-end-date'
              endDate={values.endDate}
              selected={values.endDate}
              minDate={values.startDate}
              startDate={values.startDate}
              showTimeSelect={!values.allDay}
              dateFormat={
                !values.allDay
                  ? 'yyyy-MM-dd HH:mm'
                  : 'yyyy-MM-dd'
              }
              customInput={
                <PickersComponent
                  label='Tanggal Selesai'
                  registername='endDate'
                />
              }
              onChange={(
                date: Date | null
              ) =>
                date !== null &&
                setValues({
                  ...values,
                  endDate: new Date(date)
                })
              }
            />

            {/* All Day */}
            <FormControl>
              <FormControlLabel
                label='Jadwal Sepanjang Hari'
                control={
                  <Switch
                    checked={values.allDay}
                    onChange={e =>
                      setValues({
                        ...values,
                        allDay:
                        e.target.checked
                      })
                    }
                  />
                }
              />
            </FormControl>

            {/* Lokasi */}
            <CustomTextField
              fullWidth
              label='Lokasi'
              placeholder='Contoh: Balai Pelatihan Diskop'
              value={values.location}
              onChange={e =>
                setValues({
                  ...values,
                  location: e.target.value
                })
              }
            />

            {/* Ruangan */}
            <CustomTextField
              fullWidth
              label='Ruangan'
              placeholder='Contoh: Ruang Pelatihan A'
              value={values.room}
              onChange={e =>
                setValues({
                  ...values,
                  room: e.target.value
                })
              }
            />

            {/* Kapasitas */}
            <CustomTextField
              fullWidth
              type='number'
              label='Kapasitas Peserta'
              value={values.capacity}
              onChange={e =>
                setValues({
                  ...values,
                  capacity: Number(e.target.value)
                })
              }
              inputProps={{
                min: 1
              }}
            />

            {/* Description */}
            <CustomTextField
              rows={4}
              multiline
              fullWidth
              label='Deskripsi'
              id='training-description'
              placeholder='Tambahkan keterangan jadwal...'
              value={values.description}
              onChange={e =>
                setValues({
                  ...values,
                  description:
                  e.target.value
                })
              }
            />

            {/* Footer */}
            <div className='flex items-center'>
              <RenderSidebarFooter />
            </div>
          </form>
        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default AddEventSidebar
