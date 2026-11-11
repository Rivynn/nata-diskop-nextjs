// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { EventInput } from '@fullcalendar/core'

// Type Imports
import type {
  CalendarFiltersType,
  CalendarType
} from '@/types/apps/calendarTypes'

// Data Imports
import { events } from '@/fake-db/apps/calendar'

const initialState: CalendarType = {
  events: events,
  filteredEvents: events,
  selectedEvent: null,

  selectedCalendars: [
    'Pelatihan',
    'Pendaftaran',
    'Penilaian',
    'Sertifikasi',
    'Dibatalkan'
  ]
}

// Filter events berdasarkan kategori jadwal
const filterEventsUsingCheckbox = (
  events: EventInput[],
  selectedCalendars: CalendarFiltersType[]
) => {
  return events.filter(event =>
    selectedCalendars.includes(
      event.extendedProps?.calendar as CalendarFiltersType
    )
  )
}

export const calendarSlice = createSlice({
  name: 'calendar',

  initialState,

  reducers: {
    // Filter ulang event berdasarkan checkbox
    filterEvents: state => {
      state.events = filterEventsUsingCheckbox(
        state.filteredEvents,
        state.selectedCalendars
      )
    },

    // Add new schedule
    addEvent: (
      state,
      action: PayloadAction<EventInput>
    ) => {
      const lastEvent = state.filteredEvents[
      state.filteredEvents.length - 1
        ]

      const lastId = Number(lastEvent?.id ?? 0)

      const newEvent: EventInput = {
        ...action.payload,
        id: `${lastId + 1}`
      }

      state.filteredEvents.push(newEvent)

      state.events = filterEventsUsingCheckbox(
        state.filteredEvents,
        state.selectedCalendars
      )
    },

    // Update schedule
    updateEvent: (
      state,
      action: PayloadAction<EventInput>
    ) => {
      state.filteredEvents = state.filteredEvents.map(
        event => {
          // Event dari FullCalendar setelah drag / resize
          if (
            action.payload._def &&
            event.id ===
            action.payload._def.publicId
          ) {
            return {
              id: event.id,

              url: action.payload._def.url,

              title: action.payload._def.title,

              allDay:
              action.payload._def.allDay,

              end:
              action.payload._instance
                ?.range.end,

              start:
              action.payload._instance
                ?.range.start,

              extendedProps:
              action.payload._def.extendedProps
            }
          }

          // Update event biasa dari sidebar
          if (
            event.id === action.payload.id
          ) {
            return action.payload
          }

          return event
        }
      )

      state.events = filterEventsUsingCheckbox(
        state.filteredEvents,
        state.selectedCalendars
      )
    },

    // Delete schedule
    deleteEvent: (
      state,
      action: PayloadAction<string | number>
    ) => {
      state.filteredEvents =
        state.filteredEvents.filter(
          event =>
            event.id !== action.payload
        )

      state.events = filterEventsUsingCheckbox(
        state.filteredEvents,
        state.selectedCalendars
      )
    },

    // Select schedule
    selectedEvent: (
      state,
      action: PayloadAction<EventInput | null>
    ) => {
      state.selectedEvent = action.payload
    },

    // Toggle schedule category
    filterCalendarLabel: (
      state,
      action: PayloadAction<CalendarFiltersType>
    ) => {
      const index =
        state.selectedCalendars.indexOf(
          action.payload
        )

      if (index !== -1) {
        state.selectedCalendars.splice(
          index,
          1
        )
      } else {
        state.selectedCalendars.push(
          action.payload
        )
      }

      state.events = filterEventsUsingCheckbox(
        state.filteredEvents,
        state.selectedCalendars
      )
    },

    // Select / deselect all categories
    filterAllCalendarLabels: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.selectedCalendars = action.payload
        ? [
          'Pelatihan',
          'Pendaftaran',
          'Penilaian',
          'Sertifikasi',
          'Dibatalkan'
        ]
        : []

      state.events = filterEventsUsingCheckbox(
        state.filteredEvents,
        state.selectedCalendars
      )
    }
  }
})

export const {
  filterEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  selectedEvent,
  filterCalendarLabel,
  filterAllCalendarLabels
} = calendarSlice.actions

export default calendarSlice.reducer
