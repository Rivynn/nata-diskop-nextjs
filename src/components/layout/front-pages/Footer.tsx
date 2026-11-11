'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Hooks Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Footer = ({ mode }: { mode: Mode }) => {
  // Vars
  const footerImageLight = '/images/front-pages/footer-bg-light.png'
  const footerImageDark = '/images/front-pages/footer-bg-dark.png'

  // Hooks
  const dashboardImage = useImageVariant(mode, footerImageLight, footerImageDark)

  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative'>
        <img
          src={dashboardImage}
          alt='background footer'
          className='absolute inset-0 is-full bs-full object-cover -z-[1]'
        />

        <div className={classnames('plb-10 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={8} columnSpacing={10}>
            {/* Brand */}
            <Grid size={{ xs: 12, md: 5 }}>
              <div className='flex flex-col items-start gap-4'>
                <Link href='/' className='flex items-center'>
                  <Logo color='var(--mui-palette-common-white)' />

                  <Typography
                    component='span'
                    className='ms-3 text-2xl font-semibold text-white'
                  >

                  </Typography>
                </Link>

                <Typography color='white' className='max-w-[420px] opacity-[0.78] leading-7'>
                  Platform pelatihan dan pengembangan kompetensi masyarakat
                  yang dikelola oleh Pemerintah Kota Banjarbaru.
                </Typography>

                <Typography color='white' variant='body2' className='opacity-[0.65]'>
                  Membangun kompetensi, membuka peluang, dan mendukung
                  pengembangan sumber daya manusia.
                </Typography>
              </div>
            </Grid>

            {/* Navigasi */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography color='white' className='font-medium mbe-5 opacity-[0.92]'>
                Navigasi
              </Typography>

              <div className='flex flex-col gap-3'>
                <Link href='/' className='text-white opacity-[0.78] hover:opacity-100'>
                  Beranda
                </Link>

                <Link href='/pelatihan' className='text-white opacity-[0.78] hover:opacity-100'>
                  Pelatihan
                </Link>

                <Link href='/berita' className='text-white opacity-[0.78] hover:opacity-100'>
                  Berita
                </Link>

                <Link href='/tentang' className='text-white opacity-[0.78] hover:opacity-100'>
                  Tentang
                </Link>
              </div>
            </Grid>

            {/* Informasi */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography color='white' className='font-medium mbe-5 opacity-[0.92]'>
                Informasi
              </Typography>

              <div className='flex flex-col gap-3'>
                <Link href='/pengumuman' className='text-white opacity-[0.78] hover:opacity-100'>
                  Pengumuman
                </Link>

                <Link href='/sertifikat' className='text-white opacity-[0.78] hover:opacity-100'>
                  Verifikasi Sertifikat
                </Link>

                <Link href='/bantuan' className='text-white opacity-[0.78] hover:opacity-100'>
                  Pusat Bantuan
                </Link>

                <Link href='/kontak' className='text-white opacity-[0.78] hover:opacity-100'>
                  Hubungi Kami
                </Link>
              </div>
            </Grid>

            {/* Pemerintah */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography color='white' className='font-medium mbe-5 opacity-[0.92]'>
                Pemerintah Kota Banjarbaru
              </Typography>

              <Typography color='white' variant='body2' className='max-w-[300px] leading-6 opacity-[0.78]'>
                Layanan digital resmi untuk mendukung pelatihan,
                pengembangan kompetensi, dan peningkatan kualitas
                sumber daya manusia di Kota Banjarbaru.
              </Typography>

              <div className='mt-4'>
                <Link
                  href='/tentang'
                  className='text-white text-sm font-medium opacity-[0.9] hover:opacity-100'
                >
                  Selengkapnya →
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='bg-[#211B2C]'>
        <div
          className={classnames(
            'flex flex-wrap items-center justify-center sm:justify-between gap-4 plb-[15px]',
            frontCommonStyles.layoutSpacing
          )}
        >
          <Typography className='text-white' variant='body2'>
            © {new Date().getFullYear()} DISKOP · Pemerintah Kota Banjarbaru
          </Typography>

          <div className='flex items-center gap-5'>
            <Link
              href='/kebijakan-privasi'
              className='text-white text-sm opacity-[0.72] hover:opacity-100'
            >
              Kebijakan Privasi
            </Link>

            <Link
              href='/ketentuan-layanan'
              className='text-white text-sm opacity-[0.72] hover:opacity-100'
            >
              Ketentuan Layanan
            </Link>

            <Link
              href='/bantuan'
              className='text-white text-sm opacity-[0.72] hover:opacity-100'
            >
              Bantuan
            </Link>
          </div>

          <div className='flex gap-1.5 items-center'>
            <IconButton
              component={Link}
              size='small'
              href='#'
              aria-label='Facebook'
            >
              <i className='tabler-brand-facebook-filled text-white text-lg' />
            </IconButton>

            <IconButton
              component={Link}
              size='small'
              href='#'
              aria-label='Instagram'
            >
              <i className='tabler-brand-instagram text-white text-lg' />
            </IconButton>

            <IconButton
              component={Link}
              size='small'
              href='#'
              aria-label='YouTube'
            >
              <i className='tabler-brand-youtube-filled text-white text-lg' />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
