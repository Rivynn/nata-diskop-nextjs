// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import Search from '@assets/svg/front-pages/landing-page/Search'
import User from '@assets/svg/front-pages/landing-page/User'
import Book from '@assets/svg/front-pages/landing-page/Book'
import Check from '@assets/svg/front-pages/landing-page/Check'
import Certificate from '@assets/svg/front-pages/landing-page/Certificate'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Temukan',
    description: 'Temukan pelatihan yang sesuai dengan minat dan kebutuhan kompetensi Anda.'
  },
  {
    number: '02',
    icon: User,
    title: 'Daftar',
    description: 'Pilih program dan lakukan pendaftaran melalui platform DISKOP.'
  },
  {
    number: '03',
    icon: Book,
    title: 'Belajar',
    description: 'Ikuti materi, jadwal, dan seluruh rangkaian kegiatan pelatihan.'
  },
  {
    number: '04',
    icon: Check,
    title: 'Tuntaskan',
    description: 'Selesaikan seluruh materi dan evaluasi sesuai ketentuan program.'
  },
  {
    number: '05',
    icon: Certificate,
    title: 'Bersertifikat',
    description: 'Dapatkan sertifikat sebagai bukti penyelesaian dan kompetensi Anda.'
  }
]

const HowItWorks = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='how-it-works' ref={ref} className='bg-backgroundPaper'>
      <div
        className={classnames(
          'flex flex-col gap-12 pbs-12 pbe-[100px]',
          frontCommonStyles.layoutSpacing
        )}
      >
        {/* Heading */}
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip
            size='small'
            variant='tonal'
            color='primary'
            label='Perjalanan Kompetensi'
          />

          <div className='flex flex-col items-center gap-y-1 justify-center'>
            <Typography
              color='text.primary'
              variant='h4'
              className='text-center'
            >
              <span className='relative z-[1] font-extrabold'>
                Temukan peluang,
                <img
                  src='/images/front-pages/landing-page/bg-shape.png'
                  alt='bg-shape'
                  className='absolute block-end-0 z-[1] bs-[40%] is-[125%] sm:is-[132%] -inline-start-[13%] sm:inline-start-[-19%] block-start-[17px]'
                />
              </span>{' '}
              kembangkan kompetensi
            </Typography>

            <Typography
              color='text.secondary'
              className='text-center max-is-[650px]'
            >
              Dari memilih pelatihan hingga memperoleh sertifikat,
              setiap langkah dirancang agar perjalanan belajar Anda lebih mudah.
            </Typography>
          </div>
        </div>

        {/* Journey */}
        <div className={styles.journey}>
          <div className={styles.journeyLine} />

          {steps.map(item => {
            const Icon = item.icon

            return (
              <div className={styles.step} key={item.number}>
                <div className={styles.stepTop}>
                  <span className={styles.number}>{item.number}</span>
                  <span className={styles.dot} />
                </div>

                <div className={styles.icon}>
                  <Icon color='var(--mui-palette-primary-main)' />
                </div>

                <Typography
                  variant='h6'
                  color='text.primary'
                  className='font-semibold mbs-4'
                >
                  {item.title}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  className='text-center max-is-[190px] mbs-1'
                >
                  {item.description}
                </Typography>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
