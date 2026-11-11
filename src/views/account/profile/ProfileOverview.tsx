'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

/* =========================================================
   PROFILE DATA
========================================================= */

const profile = {
  about: [
    {
      icon: 'tabler-user',
      property: 'Username',
      value: '@rizkifirdaus'
    },
    {
      icon: 'tabler-mail',
      property: 'Email',
      value: 'rizki@example.com'
    },
    {
      icon: 'tabler-phone',
      property: 'Nomor HP',
      value: '+62 851 3637 3842'
    }
  ],

  personal: [
    {
      icon: 'tabler-user',
      property: 'Nama Lengkap',
      value: 'Muhammad Rizki Firdaus'
    },
    {
      icon: 'tabler-id',
      property: 'NIK',
      value: '6371 •••••••• 7890'
    },
    {
      icon: 'tabler-map-pin',
      property: 'Tempat Lahir',
      value: 'Banjarmasin'
    },
    {
      icon: 'tabler-calendar',
      property: 'Tanggal Lahir',
      value: '1 Januari 2005'
    },
    {
      icon: 'tabler-gender-male',
      property: 'Jenis Kelamin',
      value: 'Laki-laki'
    }
  ],

  domicile: [
    {
      icon: 'tabler-map-2',
      property: 'Provinsi',
      value: 'Kalimantan Selatan'
    },
    {
      icon: 'tabler-building',
      property: 'Kabupaten/Kota',
      value: 'Kota Banjarmasin'
    },
    {
      icon: 'tabler-map-pin',
      property: 'Kecamatan',
      value: 'Banjarmasin Selatan'
    },
    {
      icon: 'tabler-home',
      property: 'Kelurahan',
      value: 'Banjarmasin'
    },
    {
      icon: 'tabler-map',
      property: 'Kode Pos',
      value: '702xx'
    }
  ],

  education: [
    {
      icon: 'tabler-school',
      property: 'Pendidikan',
      value: 'S1'
    },
    {
      icon: 'tabler-building-university',
      property: 'Institusi',
      value: 'Universitas'
    },
    {
      icon: 'tabler-calendar',
      property: 'Tahun Lulus',
      value: '2027'
    }
  ],

  employment: [
    {
      icon: 'tabler-briefcase',
      property: 'Status',
      value: 'Pegawai'
    },
    {
      icon: 'tabler-building',
      property: 'Instansi',
      value: 'DISKOP Banjarbaru'
    },
    {
      icon: 'tabler-id-badge',
      property: 'Jabatan',
      value: 'Administrator'
    }
  ]
}

/* =========================================================
   TYPES
========================================================= */

type ProfileItem = {
  icon: string
  property: string
  value: string
}

type ProfileSectionProps = {
  title: string
  items: ProfileItem[]
}

/* =========================================================
   PROFILE ITEM
========================================================= */

const ProfileItem = ({
                       icon,
                       property,
                       value
                     }: ProfileItem) => {
  return (
    <div className='flex items-start gap-3'>
      {/* Icon */}
      <div className='flex items-center justify-center bs-9 is-9 rounded bg-actionHover shrink-0'>
        <i
          className={`${icon} text-[18px] text-textSecondary`}
        />
      </div>

      {/* Information */}
      <div className='flex flex-col gap-0.5 min-is-0'>
        <Typography
          variant='body2'
          color='text.secondary'
        >
          {property}
        </Typography>

        <Typography
          variant='body2'
          className='font-medium'
          sx={{
            wordBreak: 'break-word'
          }}
        >
          {value}
        </Typography>
      </div>
    </div>
  )
}

/* =========================================================
   PROFILE SECTION
========================================================= */

const ProfileSection = ({
                          title,
                          items
                        }: ProfileSectionProps) => {
  return (
    <div className='flex flex-col gap-4'>
      {/* Section Title */}
      <Typography
        variant='caption'
        color='text.disabled'
        className='uppercase font-semibold'
      >
        {title}
      </Typography>

      {/* Items */}
      <div className='flex flex-col gap-4'>
        {items.map((item, index) => (
          <ProfileItem
            key={index}
            icon={item.icon}
            property={item.property}
            value={item.value}
          />
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   PROFILE OVERVIEW
========================================================= */

const ProfileOverview = () => {
  return (
    <Card
      sx={{
        height: 725,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <CardHeader
        avatar={
          <div className='flex items-center justify-center bs-9 is-9 rounded bg-primary text-primary-contrastText'>
            <i className='tabler-user-circle text-[18px] text-white' />
          </div>
        }
        title='Informasi Profil'
        subheader='Informasi akun dan data pengguna'
        titleTypographyProps={{
          variant: 'h6',
          className: 'font-semibold'
        }}
        subheaderTypographyProps={{
          variant: 'caption'
        }}
      />

      <Divider />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <CardContent
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 4,

          '&::-webkit-scrollbar': {
            width: 5
          },

          '&::-webkit-scrollbar-thumb': {
            borderRadius: 10,
            backgroundColor: 'var(--mui-palette-divider)'
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent'
          },

          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--mui-palette-divider) transparent'
        }}
      >
        <div className='flex flex-col gap-5'>

          {/* =================================================
              TENTANG SAYA
          ================================================== */}

          <ProfileSection
            title='Tentang Saya'
            items={profile.about}
          />

          <Divider />

          {/* =================================================
              DATA PRIBADI
          ================================================== */}

          <ProfileSection
            title='Data Pribadi'
            items={profile.personal}
          />

          <Divider />

          {/* =================================================
              DOMISILI
          ================================================== */}

          <ProfileSection
            title='Domisili'
            items={profile.domicile}
          />

          <Divider />

          {/* =================================================
              PENDIDIKAN
          ================================================== */}

          <ProfileSection
            title='Pendidikan'
            items={profile.education}
          />

          <Divider />

          {/* =================================================
              PEKERJAAN
          ================================================== */}

          <ProfileSection
            title='Pekerjaan'
            items={profile.employment}
          />

        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileOverview
