// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import styles from './styles.module.css'

type FaqsDataTypes = {
  id: string
  question: string
  active?: boolean
  answer: string
}

const FaqsData: FaqsDataTypes[] = [
  {
    id: 'panel1',
    question: 'Siapa saja yang dapat mengikuti pelatihan?',
    answer:
      'Program pelatihan DISKOP dapat diikuti oleh masyarakat sesuai dengan persyaratan dan ketentuan yang ditetapkan pada masing-masing program pelatihan.'
  },
  {
    id: 'panel2',
    question: 'Bagaimana cara mendaftar pelatihan?',
    active: true,
    answer:
      'Pilih program pelatihan yang tersedia, kemudian lakukan pendaftaran melalui platform DISKOP. Pastikan data yang Anda masukkan sudah benar dan memenuhi persyaratan program.'
  },
  {
    id: 'panel3',
    question: 'Apakah semua pelatihan gratis?',
    answer:
      'Ketentuan biaya berbeda pada setiap program. Informasi mengenai biaya atau program pelatihan tanpa biaya akan dicantumkan pada detail masing-masing pelatihan.'
  },
  {
    id: 'panel4',
    question: 'Bagaimana cara mendapatkan sertifikat?',
    answer:
      'Peserta yang telah menyelesaikan seluruh rangkaian pelatihan dan memenuhi persyaratan yang ditentukan dapat memperoleh sertifikat melalui platform DISKOP.'
  },
  {
    id: 'panel5',
    question: 'Bagaimana jika saya tidak dapat mengikuti pelatihan?',
    answer:
      'Ketentuan kehadiran dan pembatalan mengikuti kebijakan masing-masing program. Silakan periksa informasi pelatihan atau pengumuman terkait sebelum melakukan pendaftaran.'
  }
]

const Faqs = () => {
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

    ref.current && observer.observe(ref.current)

    return () => observer.disconnect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      id='faq'
      ref={ref}
      className={classnames(
        'plb-[100px] bg-backgroundDefault',
        styles.sectionStartRadius
      )}
    >
      <div
        className={classnames(
          'flex flex-col gap-16',
          frontCommonStyles.layoutSpacing
        )}
      >
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <Chip
            size='small'
            variant='tonal'
            color='primary'
            label='Pertanyaan Umum'
          />

          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography color='text.primary' variant='h4'>
                Punya pertanyaan?
                <span className='relative z-[1] font-extrabold'>
                  <img
                    src='/images/front-pages/landing-page/bg-shape.png'
                    alt='bg-shape'
                    className='absolute block-end-0 z-[1] bs-[40%] is-[132%] -inline-start-[8%] block-start-[17px]'
                  />{' '}
                  Kami bantu jawab
                </span>
              </Typography>
            </div>

            <Typography className='text-center'>
              Temukan jawaban atas pertanyaan yang sering ditanyakan
              seputar pelatihan dan layanan DISKOP.
            </Typography>
          </div>
        </div>

        <div>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 5 }} className='text-center'>
              <img
                src='/images/front-pages/landing-page/illustration-faq-diskop.png'
                alt='Peserta menggunakan platform DISKOP'
                className='is-[100%] max-is-[520px]'
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <div>
                {FaqsData.map((data, index) => {
                  return (
                    <Accordion key={index} defaultExpanded={data.active}>
                      <AccordionSummary
                        aria-controls={data.id + '-content'}
                        id={data.id + '-header'}
                        className='font-medium'
                        color='text.primary'
                      >
                        {data.question}
                      </AccordionSummary>

                      <AccordionDetails className='text-textSecondary'>
                        {data.answer}
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default Faqs
