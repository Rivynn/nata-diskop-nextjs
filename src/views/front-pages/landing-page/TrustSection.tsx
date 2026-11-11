// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Styles Imports
import styles from './styles.module.css'

type TrustItem = {
  icon: string
  title: string
  description: string
}

const trustItems: TrustItem[] = [
  {
    icon: 'tabler-rosette',
    title: 'Program Terverifikasi',
    description: 'Program pelatihan resmi dan terkurasi untuk mendukung pengembangan kompetensi.'
  },
  {
    icon: 'tabler-user-star',
    title: 'Pelatih Berpengalaman',
    description: 'Belajar bersama pelatih dan instruktur yang memiliki pengalaman di bidangnya.'
  },
  {
    icon: 'tabler-certificate',
    title: 'Sertifikat Resmi',
    description: 'Dapatkan sertifikat sebagai bukti telah menyelesaikan program pelatihan.'
  },
  {
    icon: 'tabler-shield-check',
    title: 'Informasi Terpercaya',
    description: 'Informasi pelatihan dikelola melalui platform resmi Pemerintah Kota Banjarbaru.'
  }
]

const TrustSection = () => {
  return (
    <section id='trust' className='relative overflow-hidden'>
      <div className={classnames(frontCommonStyles.layoutSpacing, 'pbe-16 sm:pbe-20')}>
        <div className='text-center mbe-10'>
          <Typography
            variant='h4'
            className='font-bold mbe-3'
            color='text.primary'
          >
            Platform Pelatihan Pemerintah Kota Banjarbaru
          </Typography>

          <Typography
            color='text.secondary'
            className='max-w-[720px] mli-auto'
          >
            Akses program pelatihan yang terpercaya untuk meningkatkan keterampilan,
            kompetensi, dan kesiapan menghadapi dunia kerja.
          </Typography>
        </div>

        <div className={classnames(styles.trustGrid, 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')}>
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={classnames(
                styles.trustItem,
                'flex flex-col items-center text-center p-6'
              )}
            >
              <div className={styles.trustIcon}>
                <i className={classnames(item.icon, 'text-[28px]')} />
              </div>

              <Typography
                variant='h6'
                className='font-semibold mbe-2'
                color='text.primary'
              >
                {item.title}
              </Typography>

              <Typography
                variant='body2'
                color='text.secondary'
                className='max-w-[250px] leading-6'
              >
                {item.description}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
