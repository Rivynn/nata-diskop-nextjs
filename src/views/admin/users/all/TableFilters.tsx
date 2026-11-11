// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({
                        setData,
                        tableData
                      }: {
  setData: (data: UsersType[]) => void
  tableData?: UsersType[]
}) => {
  // States
  const [role, setRole] = useState<UsersType['role']>('')
  const [status, setStatus] = useState<UsersType['status']>('')

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (role && user.role !== role) return false
      if (status && user.status !== status) return false

      return true
    })

    setData(filteredData || [])
  }, [role, status, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Role */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={role}
            onChange={e =>
              setRole(
                e.target.value as UsersType['role']
              )
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              Semua Role
            </MenuItem>

            <MenuItem value='admin'>
              Administrator
            </MenuItem>

            <MenuItem value='pegawai'>
              Pegawai
            </MenuItem>

            <MenuItem value='pelatih'>
              Pelatih
            </MenuItem>

            <MenuItem value='peserta'>
              Peserta
            </MenuItem>

            <MenuItem value='mitra'>
              Mitra
            </MenuItem>
          </CustomTextField>
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            onChange={e =>
              setStatus(
                e.target.value as UsersType['status']
              )
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>
              Semua Status
            </MenuItem>

            <MenuItem value='active'>
              Aktif
            </MenuItem>

            <MenuItem value='pending'>
              Menunggu
            </MenuItem>

            <MenuItem value='inactive'>
              Nonaktif
            </MenuItem>

            <MenuItem value='banned'>
              Diblokir
            </MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
