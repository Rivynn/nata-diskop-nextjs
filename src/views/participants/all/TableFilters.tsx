
'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { ParticipantsType } from '@/types/apps/participantTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const TableFilters = ({
                        setData,
                        tableData
                      }: {
  setData: (data: ParticipantsType[]) => void
  tableData?: ParticipantsType[]
}) => {
  // -------------------------------------------------------
  // States
  // -------------------------------------------------------

  const [verificationStatus, setVerificationStatus] = useState<
    ParticipantsType['verificationStatus'] | ''
  >('')

  const [accountStatus, setAccountStatus] = useState<
    ParticipantsType['accountStatus'] | ''
  >('')

  // -------------------------------------------------------
  // Filter Data
  // -------------------------------------------------------

  useEffect(() => {
    const filteredData = (tableData ?? []).filter(participant => {
      // Verification Status
      if (
        verificationStatus &&
        participant.verificationStatus !== verificationStatus
      ) {
        return false
      }

      // Account Status
      if (
        accountStatus &&
        participant.accountStatus !== accountStatus
      ) {
        return false
      }

      return true
    })

    setData(filteredData)
  }, [verificationStatus, accountStatus, tableData, setData])

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <CardContent>
      <Grid container spacing={6}>
        {/* Verification Status */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomTextField
            select
            fullWidth
            id='select-verification-status'
            label='Status Verifikasi'
            value={verificationStatus}
            onChange={e =>
              setVerificationStatus(
                e.target.value as ParticipantsType['verificationStatus'] | ''
              )
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>Semua Status</MenuItem>

            <MenuItem value='pending'>Menunggu Verifikasi</MenuItem>

            <MenuItem value='verified'>Terverifikasi</MenuItem>

            <MenuItem value='rejected'>Ditolak</MenuItem>
          </CustomTextField>
        </Grid>

        {/* Account Status */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomTextField
            select
            fullWidth
            id='select-account-status'
            label='Status Akun'
            value={accountStatus}
            onChange={e =>
              setAccountStatus(
                e.target.value as ParticipantsType['accountStatus'] | ''
              )
            }
            slotProps={{
              select: {
                displayEmpty: true
              }
            }}
          >
            <MenuItem value=''>Semua Status</MenuItem>

            <MenuItem value='active'>Aktif</MenuItem>

            <MenuItem value='inactive'>Nonaktif</MenuItem>

            <MenuItem value='suspended'>Ditangguhkan</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
