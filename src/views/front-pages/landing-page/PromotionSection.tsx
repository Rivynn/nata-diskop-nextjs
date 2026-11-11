// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// Third-party Imports
import { useKeenSlider } from 'keen-slider/react'
import classnames from 'classnames'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

const trainings = [
  {
    id: 1,
    title: 'Digital Marketing untuk UMKM',
    category: 'Digital',
    date: '12 Okt 2026',
    time: '09.00–15.00 WITA',
    description:
      'Pelatihan praktis untuk membantu pelaku UMKM memahami strategi pemasaran digital dan meningkatkan jangkauan bisnis.',
    trainer: 'Andi Pratama, S.E.',
    trainerAvatar: '/images/avatars/1.png',
    organizer: 'DISKOP Kota Banjarbaru',
    image: '/images/front-pages/landing-page/training-1.jpg',
    slug: 'digital-marketing-untuk-umkm',
    registration: 'Pendaftaran Dibuka'
  },
  {
    id: 2,
    title: 'Pengembangan Kewirausahaan',
    category: 'Kewirausahaan',
    date: '18 Okt 2026',
    time: '08.30–16.00 WITA',
    description:
      'Membangun kemampuan dasar kewirausahaan mulai dari pengembangan ide, pengelolaan usaha, hingga strategi pengembangan bisnis.',
    trainer: 'Siti Rahmawati, M.M.',
    trainerAvatar: '/images/avatars/2.png',
    organizer: 'DISKOP Kota Banjarbaru',
    image: '/images/front-pages/landing-page/training-2.jpg',
    slug: 'pengembangan-kewirausahaan',
    registration: 'Segera Dibuka'
  },
  {
    id: 3,
    title: 'Manajemen dan Kepemimpinan',
    category: 'Manajemen',
    date: '24 Okt 2026',
    time: '09.00–15.30 WITA',
    description:
      'Mengembangkan kemampuan kepemimpinan, komunikasi, pengambilan keputusan, dan pengelolaan tim secara efektif.',
    trainer: 'Budi Santoso, M.P.A.',
    trainerAvatar: '/images/avatars/3.png',
    organizer: 'DISKOP Kota Banjarbaru',
    image: '/images/front-pages/landing-page/training-3.jpg',
    slug: 'manajemen-dan-kepemimpinan',
    registration: 'Pendaftaran Dibuka'
  },
  {
    id: 4,
    title: 'Kompetensi Digital Tenaga Kerja',
    category: 'Kompetensi',
    date: '30 Okt 2026',
    time: '08.30–16.00 WITA',
    description:
      'Meningkatkan kemampuan digital tenaga kerja agar lebih siap menghadapi kebutuhan dunia kerja yang terus berkembang.',
    trainer: 'Rizky Maulana, S.Kom.',
    trainerAvatar: '/images/avatars/4.png',
    organizer: 'DISKOP Kota Banjarbaru',
    image: '/images/front-pages/landing-page/training-4.jpg',
    slug: 'kompetensi-digital-tenaga-kerja',
    registration: 'Pendaftaran Dibuka'
  },
  {
    id: 5,
    title: 'Produktivitas dan Budaya Kerja',
    category: 'Industri',
    date: '5 Nov 2026',
    time: '09.00–15.00 WITA',
    description:
      'Membangun budaya kerja yang produktif melalui pengelolaan waktu, kolaborasi, disiplin, dan peningkatan kualitas kerja.',
    trainer: 'Dewi Lestari, M.M.',
    trainerAvatar: '/images/avatars/5.png',
    organizer: 'DISKOP Kota Banjarbaru',
    image: '',
    slug: 'produktivitas-dan-budaya-kerja',
    registration: 'Segera Dibuka'
  },
  {
    id: 6,
    title: 'Pengelolaan Usaha Berkelanjutan',
    category: 'Kewirausahaan',
    date: '12 Nov 2026',
    time: '08.30–15.30 WITA',
    description:
      'Mengenalkan strategi pengelolaan usaha yang berkelanjutan dengan memperhatikan efisiensi, inovasi, dan peluang pengembangan.',
    trainer: 'Fajar Nugraha, S.E.',
    trainerAvatar: '/images/avatars/6.png',
    organizer: 'DISKOP Kota Banjarbaru',
    image: '/images/front-pages/landing-page/training-6.jpg',
    slug: 'pengelolaan-usaha-berkelanjutan',
    registration: 'Pendaftaran Dibuka'
  }
]

const PromotionSection = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: 'snap',
      rubberband: true,
      slides: {
        perView: 4,
        spacing: 16
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 3,
            spacing: 16
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 2,
            spacing: 14
          }
        },
        '(max-width: 600px)': {
          slides: {
            perView: 1,
            spacing: 14,
            origin: 'center'
          }
        }
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        let mouseOver = false

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)

          if (mouseOver) return

          timeout = setTimeout(() => {
            slider.next()
          }, 5000)
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseenter', () => {
            mouseOver = true
            clearNextTimeout()
          })

          slider.container.addEventListener('mouseleave', () => {
            mouseOver = false
            nextTimeout()
          })

          nextTimeout()
        })

        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({
          [entry.target.id]: entry.isIntersecting
        })
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
    <section
      id='promotion'
      ref={ref}
      className={classnames(
        'flex flex-col gap-10 plb-[100px] bg-backgroundDefault',
        styles.sectionStartRadius
      )}
    >
      <div
        className={classnames(
          'flex flex-col gap-10 is-full',
          frontCommonStyles.layoutSpacing
        )}
      >
        {/* Section Heading */}
        <div className='flex flex-col items-center justify-center text-center'>
          <Chip
            label='Pelatihan Pilihan'
            variant='tonal'
            color='primary'
            size='small'
            className='mbe-4'
          />

          <Typography color='text.primary' variant='h4'>
            <span className='relative z-[1] font-extrabold'>
              Kembangkan
              <img
                src='/images/front-pages/landing-page/bg-shape.png'
                alt='bg-shape'
                className='absolute block-end-0 z-[-1] bs-[40%] is-[132%] inline-start-[-8%] block-start-[17px]'
              />
            </span>{' '}
            kompetensimu
          </Typography>

          <Typography
            color='text.secondary'
            className='max-is-[680px] mbs-2'
          >
            Temukan pelatihan pilihan yang sedang dibuka dan pilih program
            yang sesuai dengan kebutuhan pengembangan kompetensi Anda.
          </Typography>
        </div>

        {/* Carousel */}
        <div className={styles.carouselWrapper}>
          {/* Previous */}
          <div className={styles.carouselArrowLeft}>
            <CustomIconButton
              color='primary'
              variant='tonal'
              onClick={() => instanceRef.current?.prev()}
              aria-label='Pelatihan sebelumnya'
              className={styles.navButton}
            >
              <i className='tabler-chevron-left' />
            </CustomIconButton>
          </div>

          {/* Slider */}
          <div className={styles.sliderContainer}>
            <AppKeenSlider>
              <div ref={sliderRef} className='keen-slider'>
                {trainings.map(training => (
                  <div
                    key={training.id}
                    className='keen-slider__slide flex p-1'
                  >
                    <Card
                      elevation={0}
                      className={classnames(
                        'flex flex-col is-full overflow-hidden',
                        styles.trainingCard
                      )}
                    >
                      {/* Training Image */}
                      <div className={styles.imageWrapper}>
                        {training.image ? (
                          <img
                            src={training.image}
                            alt={training.title}
                            className={styles.trainingImage}
                          />
                        ) : (
                          <div className={styles.imageFallback}>
                            <div className={styles.fallbackPattern} />

                            <div className={styles.fallbackIcon}>
                              <i className='tabler-book-2' />
                            </div>

                            <Typography
                              variant='body2'
                              color='text.secondary'
                              className='font-medium'
                            >
                              {training.category}
                            </Typography>
                          </div>
                        )}

                        {/* Registration Status */}
                        <Chip
                          size='small'
                          label={training.registration}
                          color={
                            training.registration === 'Pendaftaran Dibuka'
                              ? 'success'
                              : 'warning'
                          }
                          variant='filled'
                          className={styles.status}
                        />

                        {/* Category */}
                        <Chip
                          size='small'
                          label={training.category}
                          color='primary'
                          variant='filled'
                          className={styles.category}
                        />
                      </div>

                      {/* Content */}
                      <CardContent className='flex flex-col gap-3 p-5 grow'>
                        {/* Date & Time */}
                        <div className='flex items-center gap-3'>
                          <div className='flex items-center gap-1.5'>
                            <i className='tabler-calendar-event text-[16px] text-textSecondary' />

                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              {training.date}
                            </Typography>
                          </div>

                          <span className='text-divider'>•</span>

                          <div className='flex items-center gap-1.5 min-is-0'>
                            <i className='tabler-clock text-[16px] text-textSecondary' />

                            <Typography
                              variant='caption'
                              color='text.secondary'
                              className='truncate'
                            >
                              {training.time}
                            </Typography>
                          </div>
                        </div>

                        {/* Title */}
                        <Typography
                          variant='h6'
                          color='text.primary'
                          className='font-semibold line-clamp-2 min-bs-[48px]'
                        >
                          {training.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          className='line-clamp-2 min-bs-[40px]'
                        >
                          {training.description}
                        </Typography>

                        {/* Trainer */}
                        <div className='flex items-center gap-2'>
                          <CustomAvatar
                            size={30}
                            src={training.trainerAvatar}
                            alt={training.trainer}
                          >
                            <i className='tabler-user text-[15px]' />
                          </CustomAvatar>

                          <div className='min-is-0'>
                            <Typography
                              variant='caption'
                              color='text.primary'
                              className='font-medium truncate block'
                            >
                              {training.trainer}
                            </Typography>

                            <Typography
                              variant='caption'
                              color='text.secondary'
                              className='truncate block'
                            >
                              Pelatih
                            </Typography>
                          </div>
                        </div>

                        {/* Organizer */}
                        <div className='flex items-center gap-2'>
                          <div className='flex items-center justify-center bs-[30px] is-[30px] rounded bg-primary/10 text-primary'>
                            <i className='tabler-building-community text-[16px]' />
                          </div>

                          <div className='min-is-0'>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Diselenggarakan oleh
                            </Typography>

                            <Typography
                              variant='caption'
                              color='text.primary'
                              className='font-medium truncate block'
                            >
                              {training.organizer}
                            </Typography>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className='flex flex-col gap-2 is-full mbs-1'>
                          <Button
                            href={`/trainings/${training.slug}`}
                            variant='outlined'
                            color='primary'
                            size='small'
                            fullWidth
                            endIcon={
                              <i className='tabler-arrow-up-right' />
                            }
                          >
                            Lihat Pelatihan
                          </Button>

                          <Button
                            href={`/training/${training.slug}/register`}
                            variant='contained'
                            color='primary'
                            size='small'
                            fullWidth
                            endIcon={
                              <i className='tabler-user-plus' />
                            }
                          >
                            Daftar Sekarang
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </AppKeenSlider>
          </div>

          {/* Next */}
          <div className={styles.carouselArrowRight}>
            <CustomIconButton
              color='primary'
              variant='tonal'
              onClick={() => instanceRef.current?.next()}
              aria-label='Pelatihan berikutnya'
              className={styles.navButton}
            >
              <i className='tabler-chevron-right' />
            </CustomIconButton>
          </div>
        </div>

        {/* View All */}
        <div className='flex justify-center'>
          <Button
            href='/trainings'
            variant='contained'
            color='primary'
            endIcon={<i className='tabler-arrow-up-right' />}
            className={styles.viewAllButton}
          >
            Lihat Semua Pelatihan
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PromotionSection
