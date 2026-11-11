'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import './print.css'

type PreviewCardProps = {
  instructorId?: string
}

const PreviewCard = ({ instructorId }: PreviewCardProps) => {
  const trainingSession = {
    // ============================================================
    // PELATIH
    // ============================================================

    instructorId: instructorId || 'PLT-2026-001284',

    instructorName: 'Natasya Deviana',

    avatar: '/images/avatars/tasya-pp.png',

    role: 'Pelatih Utama',

    // ============================================================
    // PELATIHAN
    // ============================================================

    trainingName: 'Digital Marketing untuk UMKM',

    trainingType: 'Pelatihan Kompetensi Digital',

    trainingCode: 'TRN-DM-2026-03',

    batch: 'Batch 03',

    // ============================================================
    // JADWAL
    // ============================================================

    startDate: '12 Oktober 2026',

    endDate: '28 Oktober 2026',

    sessionCount: '8 Sesi',

    // ============================================================
    // LOKASI
    // ============================================================

    location: 'Balai Latihan Kerja Banjarbaru',

    room: 'Ruang Pelatihan Digital 02',

    // ============================================================
    // PENYELENGGARA
    // ============================================================

    organizer: 'Pemerintah Kota Banjarbaru',

    department: 'Dinas Koperasi dan Usaha Mikro',

    // ============================================================
    // STATUS
    // ============================================================

    status: 'Aktif',

    // ============================================================
    // VERIFIKASI
    // ============================================================

    verificationCode: 'TRN-7F4K-92XM'
  }

  return (
    <Card className='instructorCardPreview'>
      <CardContent className='!p-0'>
        <div className='instructorCard'>

          {/* =====================================================
              HEADER
          ====================================================== */}

          <header className='instructorCardHeader'>

            <div className='instructorHeaderGrid' />

            <div className='instructorHeaderGlow instructorHeaderGlowOne' />

            <div className='instructorHeaderGlow instructorHeaderGlowTwo' />

            {/* HEADER TOP */}

            <div className='instructorHeaderTop'>

              {/* Institution */}

              <div className='instructorInstitution'>

                <div className='instructorInstitutionLogo'>
                  <img
                    src='/images/logos/logo-diskop.png'
                    alt='Pemerintah Kota Banjarbaru'
                  />
                </div>

                <div className='instructorInstitutionInfo'>

                  <Typography className='instructorInstitutionName'>
                    PEMERINTAH KOTA BANJARBARU
                  </Typography>

                  <Typography className='instructorInstitutionDepartment'>
                    {trainingSession.department}
                  </Typography>

                </div>

              </div>

              {/* DISKOP */}

              <div className='instructorBrand'>

                <img
                  src='/images/logos/logo-diskop.png'
                  alt='DISKOP'
                  className='instructorBrandLogo'
                />

                <span className='instructorBrandCaption'>
                  TRAINING PLATFORM
                </span>

              </div>

            </div>

            <div className='instructorHeaderLine' />

            {/* HEADER BOTTOM */}

            <div className='instructorHeaderBottom'>

              <div>

                <Typography className='instructorEyebrow'>
                  KARTU PELATIHAN
                </Typography>

                <Typography className='instructorTitle'>
                  Pelatih Sesi Pelatihan
                </Typography>

              </div>

              <div className='instructorCardId'>

                <span>
                  ID PELATIH
                </span>

                <strong>
                  {trainingSession.instructorId}
                </strong>

              </div>

            </div>

          </header>

          {/* =====================================================
              BODY
          ====================================================== */}

          <main className='instructorCardBody'>

            {/* ===================================================
                MAIN
            ==================================================== */}

            <section className='instructorMain'>

              {/* Pelatih */}

              <div className='instructorIdentity'>

                <div className='instructorAvatar'>
                  <img
                    src={trainingSession.avatar}
                    alt={trainingSession.instructorName}
                  />
                </div>

                <div className='instructorIdentityInfo'>

                  <span className='instructorLabel'>
                    NAMA PELATIH
                  </span>

                  <Typography className='instructorName'>
                    {trainingSession.instructorName}
                  </Typography>

                  <div className='instructorActive'>

                    <span />

                    {trainingSession.role}

                  </div>

                </div>

              </div>

              {/* =================================================
                  TRAINING
              ================================================== */}

              <div className='instructorExpertise'>

                <div className='instructorExpertiseIcon'>
                  <i className='tabler-school' />
                </div>

                <div className='instructorExpertiseInfo'>

                  <span className='instructorLabel'>
                    PELATIHAN
                  </span>

                  <Typography className='instructorExpertiseName'>
                    {trainingSession.trainingName}
                  </Typography>

                  <Typography className='instructorExpertiseType'>
                    {trainingSession.trainingType}
                  </Typography>

                </div>

              </div>

              {/* =================================================
                  SESSION META
              ================================================== */}

              <div className='instructorMeta'>

                <div className='instructorMetaItem'>

                  <span>
                    BATCH
                  </span>

                  <strong>
                    {trainingSession.batch}
                  </strong>

                </div>

                <div className='instructorMetaItem'>

                  <span>
                    SESI
                  </span>

                  <strong>
                    {trainingSession.sessionCount}
                  </strong>

                </div>

                <div className='instructorMetaItem'>

                  <span>
                    STATUS
                  </span>

                  <strong>
                    {trainingSession.status}
                  </strong>

                </div>

              </div>

            </section>

            {/* ===================================================
                VERIFICATION
            ==================================================== */}

            <aside className='instructorVerification'>

              <span className='instructorVerificationTitle'>
                VERIFIKASI KARTU
              </span>

              <div className='instructorQrWrapper'>
                <DummyQRCode />
              </div>

              <span className='instructorVerificationText'>
                Scan untuk memverifikasi
                <br />
                penugasan pelatih
              </span>

              <div className='instructorVerificationCode'>

                <span>
                  KODE VERIFIKASI
                </span>

                <strong>
                  {trainingSession.verificationCode}
                </strong>

              </div>

            </aside>

          </main>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <footer className='instructorCardFooter'>

            {/* Jadwal */}

            <div className='instructorOrganizer'>

              <span>
                PERIODE PELATIHAN
              </span>

              <strong>
                {trainingSession.startDate} — {trainingSession.endDate}
              </strong>

            </div>

            {/* Lokasi */}

            <div className='instructorCertification'>

              <span>
                LOKASI
              </span>

              <strong>
                {trainingSession.location}
              </strong>

            </div>

            {/* Training Code */}

            <div className='instructorFooterStatus'>

              <span className='instructorStatusDot' />

              <span>
                {trainingSession.trainingCode}
              </span>

            </div>

            {/* Seal */}

            <div className='instructorSeal'>
              <i className='tabler-chalkboard' />
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
      className='instructorQr'
      style={{
        gridTemplateColumns:
          `repeat(${rows[0].length}, 1fr)`,

        gridTemplateRows:
          `repeat(${rows.length}, 1fr)`
      }}
    >
      {rows.flatMap((row, rowIndex) =>
        [...row].map((cell, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={
              cell === '1'
                ? 'instructorQrDark'
                : 'instructorQrLight'
            }
          />
        ))
      )}
    </div>
  )
}

export default PreviewCard
