'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import './print.css'

type PreviewCardProps = {
  participantId?: string
}

const PreviewCard = ({ participantId }: PreviewCardProps) => {
  const participant = {
    // ============================================================
    // IDENTITAS PESERTA
    // ============================================================

    id: participantId || 'PST-2026-001284',

    name: 'Natasya Deviana',

    avatar: '/images/avatars/tasya-pp.png',

    // ============================================================
    // IDENTITAS PROGRAM
    // ============================================================

    training: 'Web Development',

    trainingType: 'Pelatihan Kompetensi Digital',

    trainingCode: 'TRN-WEB-2026-03',

    // ============================================================
    // INFORMASI PELAKSANAAN
    // ============================================================

    schedule: '12 — 28 Oktober 2026',

    location: 'Balai Latihan Kerja Banjarbaru',

    // ============================================================
    // PENYELENGGARA
    // ============================================================

    organizer: 'Pemerintah Kota Banjarbaru',

    department: 'Dinas Koperasi dan Usaha Mikro',

    // ============================================================
    // VERIFIKASI
    // ============================================================

    verificationCode: 'DSKP-7F4K-92XM'
  }

  return (
    <Card className='participantCardPreview'>
      <CardContent className='!p-0'>
        <div className='participantCard'>
          {/* =====================================================
              HEADER
          ====================================================== */}

          <header className='participantCardHeader'>
            <div className='participantHeaderGrid' />

            <div className='participantHeaderGlow participantHeaderGlowOne' />

            <div className='participantHeaderGlow participantHeaderGlowTwo' />

            {/* Header top */}

            <div className='participantHeaderTop'>
              {/* Institution */}

              <div className='participantInstitution'>
                <div className='participantInstitutionLogo'>
                  <img
                    src='/images/logos/logo-diskop.png'
                    alt='Logo Pemerintah Kota Banjarbaru'
                  />
                </div>

                <div className='participantInstitutionInfo'>
                  <Typography className='participantInstitutionName'>
                    PEMERINTAH KOTA BANJARBARU
                  </Typography>

                  <Typography className='participantInstitutionDepartment'>
                    {participant.department}
                  </Typography>
                </div>
              </div>

              {/* DISKOP */}

              <div className='participantBrand'>
                <img
                  src='/images/logos/logo-diskop.png'
                  alt='DISKOP'
                  className='participantBrandLogo'
                />

                <span className='participantBrandCaption'>
                  TRAINING PLATFORM
                </span>
              </div>
            </div>

            <div className='participantHeaderLine' />

            {/* Header bottom */}

            <div className='participantHeaderBottom'>
              <div>
                <Typography className='participantEyebrow'>
                  KARTU KEPESERTAAN
                </Typography>

                <Typography className='participantTitle'>
                  Peserta Pelatihan
                </Typography>
              </div>

              {/* ID Peserta */}

              <div className='participantCardId'>
                <span>ID PESERTA</span>

                <strong>
                  {participant.id}
                </strong>
              </div>
            </div>
          </header>

          {/* =====================================================
              BODY
          ====================================================== */}

          <main className='participantCardBody'>
            {/* ===================================================
                MAIN INFORMATION
            ==================================================== */}

            <section className='participantMain'>
              {/* Identity */}

              <div className='participantIdentity'>
                <div className='participantAvatar'>
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                  />
                </div>

                <div className='participantIdentityInfo'>
                  <span className='participantLabel'>
                    NAMA PESERTA
                  </span>

                  <Typography className='participantName'>
                    {participant.name}
                  </Typography>

                  <div className='participantActive'>
                    <span />

                    PESERTA TERDAFTAR
                  </div>
                </div>
              </div>

              {/* =================================================
                  TRAINING
              ================================================== */}

              <div className='participantTraining'>
                <div className='participantTrainingIcon'>
                  <i className='tabler-school' />
                </div>

                <div className='participantTrainingInfo'>
                  <span className='participantLabel'>
                    PROGRAM PELATIHAN
                  </span>

                  <Typography className='participantTrainingName'>
                    {participant.training}
                  </Typography>

                  <Typography className='participantTrainingType'>
                    {participant.trainingType}
                  </Typography>
                </div>
              </div>

              {/* =================================================
                  PROGRAM INFORMATION
              ================================================== */}

              <div className='participantMeta'>
                <div className='participantMetaItem'>
                  <span>
                    JADWAL PELATIHAN
                  </span>

                  <strong>
                    {participant.schedule}
                  </strong>
                </div>

                <div className='participantMetaItem'>
                  <span>
                    LOKASI PELATIHAN
                  </span>

                  <strong>
                    {participant.location}
                  </strong>
                </div>
              </div>
            </section>

            {/* ===================================================
                VERIFICATION
            ==================================================== */}

            <aside className='participantVerification'>
              <span className='participantVerificationTitle'>
                VERIFIKASI PESERTA
              </span>

              <div className='participantQrWrapper'>
                <DummyQRCode />
              </div>

              <span className='participantVerificationText'>
                Scan untuk memverifikasi
                <br />
                kepesertaan pelatihan
              </span>

              <div className='participantVerificationCode'>
                <span>KODE VERIFIKASI</span>

                <strong>
                  {participant.verificationCode}
                </strong>
              </div>
            </aside>
          </main>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <footer className='participantCardFooter'>
            {/* Organizer */}

            <div className='participantOrganizer'>
              <span>
                PENYELENGGARA
              </span>

              <strong>
                {participant.organizer}
              </strong>
            </div>

            {/* Training code */}

            <div className='participantTrainingCode'>
              <span>
                KODE PROGRAM
              </span>

              <strong>
                {participant.trainingCode}
              </strong>
            </div>

            {/* Status */}

            <div className='participantFooterStatus'>
              <span className='participantStatusDot' />

              <span>
                TERDAFTAR
              </span>
            </div>

            {/* Verification seal */}

            <div className='participantSeal'>
              <i className='tabler-shield-check' />
            </div>
          </footer>
        </div>
      </CardContent>
    </Card>
  )
}

/* ================================================================
   DUMMY QR
================================================================ */

const DummyQRCode = () => {
  const rows = [
    '111111101010101111111',
    '100000101110101000001',
    '101110101000101011101',
    '101110100111101011101',
    '101110101101101011101',
    '100000101011101000001',
    '111111101010101111111',
    '000000001101100000000',
    '110101111011101011010',
    '001110001101011100101',
    '101011101110101111000',
    '110100010011010001101',
    '011101111100111010010',
    '000000101011001110111',
    '111111101101111010001',
    '100000100011101100110',
    '101110101101011011101',
    '101110100110110100010',
    '101110101011011101100',
    '100000101100100010011',
    '111111101011101101110'
  ]

  return (
    <div
      className='participantQr'
      style={{
        gridTemplateColumns: `repeat(${rows[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${rows.length}, 1fr)`
      }}
    >
      {rows.flatMap((row, rowIndex) =>
        [...row].map((cell, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={
              cell === '1'
                ? 'participantQrDark'
                : 'participantQrLight'
            }
          />
        ))
      )}
    </div>
  )
}

export default PreviewCard
