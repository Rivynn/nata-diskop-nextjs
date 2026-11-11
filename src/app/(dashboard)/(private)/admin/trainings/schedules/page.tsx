// MUI Imports
import Card from '@mui/material/Card'

// Component Imports
import ScheduleWrapper from '@views/admin/trainings/schedules/ScheduleWrapper'

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

const CalendarApp = () => {
  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <ScheduleWrapper />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
