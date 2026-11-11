'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Swal from 'sweetalert2'

import SessionCards from './SessionCards'
import SessionsTable from './SessionsTable'
import { sessionDb } from './fakeDb'

import type { SessionType } from './types'

const Sessions = () => {
  const [sessions, setSessions] =
    useState<SessionType[]>(
      sessionDb
    )

  const handleTerminate = (
    session: SessionType
  ) => {
    Swal.fire({
      title: 'Putuskan sesi ini?',
      html: `
        <div style="font-size:14px;line-height:1.6">
          Sesi <strong>${session.user.name}</strong>
          akan dikeluarkan dari perangkat tersebut.
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText:
        'Putuskan Sesi',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then(result => {
      if (!result.isConfirmed) return

      setSessions(current =>
        current.filter(
          item =>
            item.id !== session.id
        )
      )

      Swal.fire({
        title: 'Sesi Diputuskan',
        text: `Sesi ${session.user.name} berhasil diputuskan.`,
        icon: 'success',
        confirmButtonText:
          'Mengerti'
      })
    })
  }

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Typography
          variant='h4'
          className='mbe-1'
        >
          Sesi Pengguna
        </Typography>

        <Typography
          color='text.secondary'
        >
          Pantau perangkat dan sesi login
          pengguna yang sedang terhubung
          ke sistem DISKOP.
        </Typography>
      </Grid>

      {/* Summary */}
      <Grid size={{ xs: 12 }}>
        <SessionCards
          sessions={sessions}
        />
      </Grid>

      {/* Table */}
      <Grid size={{ xs: 12 }}>
        <SessionsTable
          data={sessions}
          onDataChange={
            setSessions
          }
          onTerminate={
            handleTerminate
          }
        />
      </Grid>
    </Grid>
  )
}

export default Sessions
