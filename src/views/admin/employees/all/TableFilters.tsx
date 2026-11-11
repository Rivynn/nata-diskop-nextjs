'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { EmployeeRecord } from './types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

type TableFiltersProps = {
  setData: (data: EmployeeRecord[]) => void
  tableData?: EmployeeRecord[]
}

const TableFilters = ({ setData, tableData = [] }: TableFiltersProps) => {
  // States
  const [employeeType, setEmployeeType] = useState<EmployeeRecord['employeeType'] | ''>('')
  const [status, setStatus] = useState<EmployeeRecord['status'] | ''>('')
  const [education, setEducation] = useState('')

  // Options pendidikan diambil dari data yang tersedia.
  const educationOptions = Array.from(
    new Set(
      tableData
        .map(employee => employee.education?.trim())
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b, 'id'))

  useEffect(() => {
    const filteredData = tableData.filter(employee => {
      if (employeeType && employee.employeeType !== employeeType) return false
      if (status && employee.status !== status) return false
      if (education && employee.education !== education) return false

      return true
    })

    setData(filteredData)
  }, [employeeType, status, education, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-employee-type'
            label='Tipe Pegawai'
            value={employeeType}
            onChange={e =>
              setEmployeeType(e.target.value as EmployeeRecord['employeeType'] | '')
            }
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Semua Tipe</MenuItem>
            <MenuItem value='internal'>Internal</MenuItem>
            <MenuItem value='contract'>Kontrak</MenuItem>
            <MenuItem value='internship'>Magang</MenuItem>
          </CustomTextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-employee-status'
            label='Status Pegawai'
            value={status}
            onChange={e =>
              setStatus(e.target.value as EmployeeRecord['status'] | '')
            }
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Semua Status</MenuItem>
            <MenuItem value='Aktif'>Aktif</MenuItem>
            <MenuItem value='Nonaktif'>Nonaktif</MenuItem>
            <MenuItem value='Menunggu Aktivasi'>Menunggu Aktivasi</MenuItem>
          </CustomTextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-employee-education'
            label='Pendidikan'
            value={education}
            onChange={e => setEducation(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Semua Pendidikan</MenuItem>

            {educationOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters;
