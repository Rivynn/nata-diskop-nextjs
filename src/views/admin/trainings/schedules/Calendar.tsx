// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party imports
import type { Dispatch } from '@reduxjs/toolkit'
import 'bootstrap-icons/font/bootstrap-icons.css'

import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions } from '@fullcalendar/core'

// Type Imports
import type {
  AddEventType,
  CalendarColors,
  CalendarType
} from '@/types/apps/calendarTypes'

// Slice Imports
import {
  filterEvents,
  selectedEvent,
  updateEvent
} from '@/redux-store/slices/calendar'

type CalendarProps = {
  calendarStore: CalendarType
  calendarApi: any
  setCalendarApi: (val: any) => void
  calendarsColor: CalendarColors
  dispatch: Dispatch
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
}

// Blank Event
const blankEvent: AddEventType = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    description: ''
  }
}

const Calendar = (props: CalendarProps) => {
  // Props
  const {
    calendarStore,
    calendarApi,
    setCalendarApi,
    calendarsColor,
    dispatch,
    handleAddEventSidebarToggle,
    handleLeftSidebarToggle
  } = props

  // Refs
  const calendarRef = useRef<any>(null)

  // Hooks
  const theme = useTheme()

  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current?.getApi())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calendar Options
  const calendarOptions: CalendarOptions = {
    // Data jadwal sementara berasal dari fake-db/apps/calendar
    events: calendarStore.events,

    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin
    ],

    initialView: 'dayGridMonth',

    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },

    views: {
      week: {
        titleFormat: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }
      }
    },

    // Enable dragging and resizing event
    editable: true,

    // Enable resizing event from start
    eventResizableFromStart: true,

    // Automatically scroll during event drag/drop
    dragScroll: true,

    // Maximum number of events displayed per day
    dayMaxEvents: 2,

    // Make day names clickable
    navLinks: true,

    // Event color berdasarkan kategori jadwal
    eventClassNames({ event: calendarEvent }: any) {
      const calendarType =
        calendarEvent.extendedProps?.calendar as keyof CalendarColors

      const colorName = calendarsColor[calendarType]

      return [
        `event-bg-${colorName || 'primary'}`
      ]
    },

    // Click event
    eventClick({
                 event: clickedEvent,
                 jsEvent
               }: any) {
      jsEvent.preventDefault()

      dispatch(selectedEvent(clickedEvent))

      handleAddEventSidebarToggle()

      if (clickedEvent.url) {
        window.open(
          clickedEvent.url,
          '_blank'
        )
      }
    },

    // Sidebar toggle
    customButtons: {
      sidebarToggle: {
        icon: 'tabler tabler-menu-2',

        click() {
          handleLeftSidebarToggle()
        }
      }
    },

    // Click empty date
    dateClick(info: any) {
      const ev = {
        ...blankEvent,

        start: info.date,
        end: info.date,

        allDay: true,

        extendedProps: {
          ...blankEvent.extendedProps,

          // Default kategori ketika membuat
          // jadwal baru dari kalender
          calendar: 'Pelatihan'
        }
      }

      dispatch(selectedEvent(ev))

      handleAddEventSidebarToggle()
    },

    // Handle event drop
    eventDrop({
                event: droppedEvent
              }: any) {
      dispatch(
        updateEvent(droppedEvent)
      )

      dispatch(
        filterEvents()
      )
    },

    // Handle event resize
    eventResize({
                  event: resizedEvent
                }: any) {
      dispatch(
        updateEvent(resizedEvent)
      )

      dispatch(
        filterEvents()
      )
    },

    ref: calendarRef,

    direction: theme.direction
  }

  return (
    <FullCalendar
      {...calendarOptions}
    />
  )
}

export default Calendar
