// Third-party Imports
import type { Dispatch } from '@reduxjs/toolkit'
import type { EventInput } from '@fullcalendar/core'

// Type Imports
import type { ThemeColor } from '@core/types'

// Calendar Filters
export type CalendarFiltersType =
  | 'Pelatihan'
  | 'Pendaftaran'
  | 'Penilaian'
  | 'Sertifikasi'
  | 'Dibatalkan'

// Calendar Colors
export type CalendarColors = {
  Pelatihan: ThemeColor
  Pendaftaran: ThemeColor
  Penilaian: ThemeColor
  Sertifikasi: ThemeColor
  Dibatalkan: ThemeColor
}

// Calendar Store
export type CalendarType = {
  events: EventInput[]
  filteredEvents: EventInput[]
  selectedEvent: null | any
  selectedCalendars: CalendarFiltersType[]
}

// Add Event
export type AddEventType = Omit<EventInput, 'id'>

// Sidebar Left
export type SidebarLeftProps = {
  mdAbove: boolean
  calendarApi: any
  calendarStore: CalendarType
  leftSidebarOpen: boolean
  dispatch: Dispatch
  calendarsColor: CalendarColors
  handleLeftSidebarToggle: () => void
  handleAddEventSidebarToggle: () => void
}

// Add Event Sidebar
export type AddEventSidebarType = {
  calendarStore: CalendarType
  calendarApi: any
  dispatch: Dispatch
  addEventSidebarOpen: boolean
  handleAddEventSidebarToggle: () => void
}
