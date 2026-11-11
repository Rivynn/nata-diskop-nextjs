'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'

// Component Imports
import Logo from '@components/layout/shared/Logo'

const popularSearches = [
  'Digital Marketing',
  'Kewirausahaan',
  'Microsoft Office',
  'Kompetensi Digital',
  'UMKM'
]

const trainings = [
  {
    title: 'Digital Marketing untuk UMKM',
    category: 'Digital',
    slug: 'digital-marketing-untuk-umkm'
  },
  {
    title: 'Pengembangan Kewirausahaan',
    category: 'Kewirausahaan',
    slug: 'pengembangan-kewirausahaan'
  },
  {
    title: 'Kompetensi Digital Tenaga Kerja',
    category: 'Kompetensi',
    slug: 'kompetensi-digital-tenaga-kerja'
  },
  {
    title: 'Microsoft Office untuk Dunia Kerja',
    category: 'Teknologi',
    slug: 'microsoft-office-untuk-dunia-kerja'
  },
  {
    title: 'Manajemen dan Kepemimpinan',
    category: 'Manajemen',
    slug: 'manajemen-dan-kepemimpinan'
  }
]

const TrainingNavbar = () => {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const suggestions = search.trim()
    ? trainings.filter(training =>
      training.title.toLowerCase().includes(search.toLowerCase()) ||
      training.category.toLowerCase().includes(search.toLowerCase())
    )
    : []

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = search.trim()

    if (!value) {
      router.push('/trainings')

      return
    }

    setSearchFocused(false)

    router.push(`/trainings?search=${encodeURIComponent(value)}`)
  }

  const handleSuggestionClick = (value: string) => {
    setSearch(value)
    setSearchFocused(false)

    router.push(`/trainings?search=${encodeURIComponent(value)}`)
  }

  const handleFilter = () => {
    window.dispatchEvent(new Event('open-training-filter'))
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <AppBar
      position='sticky'
      color='default'
      elevation={0}
      className='border-be bg-backgroundPaper'
    >
      <Toolbar
        disableGutters
        className='min-bs-[72px] px-4 sm:px-6 lg:px-8'
      >
        <div className='flex items-center is-full gap-4'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center shrink-0'
            aria-label='DISKOP'
          >
            <Logo />
          </Link>

          {/* Search + Filter */}
          <div className='flex flex-1 items-center justify-center min-is-0'>
            <div className='flex items-center gap-2 w-full max-w-[720px]'>
              {/* Search */}
              <div
                ref={searchRef}
                className='relative flex-1 min-is-0'
              >
                <form onSubmit={handleSearch}>
                  <div
                    className='group flex items-center bs-[46px] w-full rounded-[11px] border border-divider bg-backgroundDefault transition-all duration-200 hover:border-primary/40 focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--mui-palette-primary-main)_9%,transparent)]'
                  >
                    <div className='flex items-center justify-center shrink-0 ps-3.5 text-textSecondary transition-colors group-focus-within:text-primary'>
                      <i className='tabler-search text-[20px]' />
                    </div>

                    <InputBase
                      value={search}
                      onChange={event => setSearch(event.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      placeholder='Cari pelatihan, keterampilan, atau topik...'
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '0 10px',
                          fontSize: '0.875rem',
                          lineHeight: '1.5rem'
                        }
                      }}
                      inputProps={{
                        'aria-label': 'Cari pelatihan'
                      }}
                    />

                    {search && (
                      <Tooltip title='Hapus pencarian'>
                        <IconButton
                          type='button'
                          size='small'
                          onClick={() => setSearch('')}
                          className='bs-[32px] is-[32px] me-1 text-textSecondary hover:bg-actionHover'
                        >
                          <i className='tabler-x text-[17px]' />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title='Cari'>
                      <IconButton
                        type='submit'
                        className='bs-[36px] is-[36px] me-1 rounded-[8px] bg-primary text-primary-contrastText transition-all duration-200 hover:bg-primary/90'
                        aria-label='Cari pelatihan'
                      >
                        <i className='tabler-search text-[19px]' />
                      </IconButton>
                    </Tooltip>
                  </div>
                </form>

                {/* Search Suggestions */}
                {searchFocused && (
                  <Paper
                    elevation={0}
                    className='absolute z-[1200] block-start-[58px] inset-inline-0 overflow-hidden rounded-[16px] border border-divider bg-backgroundPaper shadow-[0_20px_60px_rgba(0,0,0,0.12)]'
                  >
                    {search.trim() ? (
                      <>
                        {/* =====================================================
            SEARCH RESULTS
        ===================================================== */}
                        <div className='px-5 pt-5 pb-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div className='flex items-center justify-center bs-[34px] is-[34px] rounded-[9px] bg-primary/10 text-primary'>
                                <i className='tabler-search text-[18px]' />
                              </div>

                              <div>
                                <p className='text-[12px] font-semibold leading-[16px] text-textPrimary'>
                                  Hasil pelatihan
                                </p>

                                <p className='mt-0.5 text-[11px] text-textSecondary'>
                                  {suggestions.length > 0
                                    ? `${suggestions.length} pelatihan ditemukan`
                                    : 'Tidak menemukan pelatihan yang sesuai'}
                                </p>
                              </div>
                            </div>

                            <button
                              type='button'
                              onClick={() => setSearchFocused(false)}
                              className='flex items-center justify-center bs-[30px] is-[30px] rounded-full text-textSecondary transition-colors hover:bg-actionHover hover:text-textPrimary'
                              aria-label='Tutup pencarian'
                            >
                              <i className='tabler-x text-[17px]' />
                            </button>
                          </div>
                        </div>

                        {suggestions.length > 0 ? (
                          <div className='px-3 pb-3'>
                            {suggestions.map(training => (
                              <button
                                key={training.slug}
                                type='button'
                                onMouseDown={event => event.preventDefault()}
                                onClick={() => handleSuggestionClick(training.title)}
                                className='group flex items-center is-full gap-3 rounded-[11px] px-3 py-3 text-start transition-all duration-150 hover:bg-actionHover'
                              >
                                {/* Icon */}
                                <div className='flex items-center justify-center bs-[40px] is-[40px] shrink-0 rounded-[10px] bg-backgroundDefault text-textSecondary transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary'>
                                  <i className='tabler-book-2 text-[19px]' />
                                </div>

                                {/* Content */}
                                <div className='min-is-0 flex-1'>
                                  <p className='truncate text-[13px] font-semibold text-textPrimary'>
                                    {training.title}
                                  </p>

                                  <div className='mt-1 flex items-center gap-1.5'>
                    <span className='text-[11px] text-textSecondary'>
                      {training.category}
                    </span>

                                    <span className='bs-[3px] is-[3px] rounded-full bg-textDisabled' />

                                    <span className='text-[11px] text-textSecondary'>
                      Pelatihan
                    </span>
                                  </div>
                                </div>

                                {/* Action */}
                                <div className='flex items-center justify-center bs-[32px] is-[32px] shrink-0 rounded-full text-textDisabled transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary'>
                                  <i className='tabler-arrow-up-right text-[17px]' />
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          /* Empty State */
                          <div className='px-6 pb-7 pt-4 text-center'>
                            <div className='mx-auto flex items-center justify-center bs-[60px] is-[60px] rounded-[16px] bg-primary/5'>
                              <div className='flex items-center justify-center bs-[42px] is-[42px] rounded-[12px] bg-backgroundDefault text-textSecondary'>
                                <i className='tabler-search-off text-[21px]' />
                              </div>
                            </div>

                            <p className='mt-4 text-[13px] font-semibold text-textPrimary'>
                              Pelatihan tidak ditemukan
                            </p>

                            <p className='mx-auto mt-1.5 max-is-[340px] text-[11px] leading-[18px] text-textSecondary'>
                              Coba gunakan kata kunci lain atau cari berdasarkan kategori
                              dan keterampilan.
                            </p>
                          </div>
                        )}

                        {/* Popular Searches */}
                        <div className='border-bs border-divider px-5 py-4'>
                          <div className='mb-3 flex items-center gap-2'>
                            <i className='tabler-trending-up text-[16px] text-primary' />

                            <span className='text-[10px] font-semibold uppercase tracking-[0.07em] text-textSecondary'>
              Pencarian populer
            </span>
                          </div>

                          <div className='grid grid-cols-2 gap-1'>
                            {popularSearches.slice(0, 4).map(item => (
                              <button
                                key={item}
                                type='button'
                                onMouseDown={event => event.preventDefault()}
                                onClick={() => handleSuggestionClick(item)}
                                className='group flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-start transition-colors hover:bg-actionHover'
                              >
                                <i className='tabler-search text-[15px] text-textDisabled transition-colors group-hover:text-primary' />

                                <span className='truncate text-[11px] font-medium text-textSecondary transition-colors group-hover:text-primary'>
                  {item}
                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* View All */}
                        <div className='border-bs border-divider bg-backgroundDefault px-4 py-2.5'>
                          <button
                            type='button'
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => {
                              const value = search.trim()

                              if (!value) return

                              setSearchFocused(false)

                              router.push(
                                `/trainings?search=${encodeURIComponent(value)}`
                              )
                            }}
                            className='group flex items-center is-full gap-3 rounded-[9px] px-2.5 py-2 text-start transition-colors hover:bg-actionHover'
                          >
                            <div className='flex items-center justify-center bs-[32px] is-[32px] rounded-[8px] bg-primary/10 text-primary'>
                              <i className='tabler-search text-[16px]' />
                            </div>

                            <div className='min-is-0 flex-1'>
                              <p className='truncate text-[12px] font-semibold text-textPrimary'>
                                Lihat semua hasil
                              </p>

                              <p className='mt-0.5 truncate text-[10px] text-textSecondary'>
                                Tampilkan semua hasil untuk "{search}"
                              </p>
                            </div>

                            <i className='tabler-arrow-right text-[17px] text-textDisabled transition-transform group-hover:translate-x-0.5 group-hover:text-primary' />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* =====================================================
            EMPTY SEARCH / DISCOVERY
        ===================================================== */}

                        {/* Header */}
                        <div className='px-5 pt-5 pb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='flex items-center justify-center bs-[38px] is-[38px] rounded-[10px] bg-primary/10 text-primary'>
                              <i className='tabler-sparkles text-[19px]' />
                            </div>

                            <div>
                              <p className='text-[12px] font-semibold leading-[16px] text-textPrimary'>
                                Mulai pencarian
                              </p>

                              <p className='mt-0.5 text-[11px] text-textSecondary'>
                                Temukan pelatihan yang sesuai kebutuhan Anda
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Popular */}
                        <div className='px-4 pb-4'>
                          <div className='mb-3 px-1'>
            <span className='text-[10px] font-semibold uppercase tracking-[0.07em] text-textSecondary'>
              Pencarian populer
            </span>
                          </div>

                          <div className='grid grid-cols-2 gap-1'>
                            {popularSearches.map((item, index) => (
                              <button
                                key={item}
                                type='button'
                                onMouseDown={event => event.preventDefault()}
                                onClick={() => handleSuggestionClick(item)}
                                className='group flex items-center gap-3 rounded-[10px] px-3 py-3 text-start transition-all duration-150 hover:bg-actionHover'
                              >
                                {/* Icon */}
                                <div className='flex items-center justify-center bs-[34px] is-[34px] shrink-0 rounded-[9px] bg-backgroundDefault text-textSecondary transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary'>
                                  <i className='tabler-trending-up text-[17px]' />
                                </div>

                                {/* Text */}
                                <div className='min-is-0 flex-1'>
                                  <p className='truncate text-[12px] font-medium text-textPrimary'>
                                    {item}
                                  </p>

                                  <p className='mt-0.5 text-[10px] text-textDisabled'>
                                    Pencarian populer
                                  </p>
                                </div>

                                {/* Ranking */}
                                <span className='text-[10px] font-medium tabular-nums text-textDisabled'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Categories */}
                        <div className='border-bs border-divider px-5 py-4'>
                          <div className='mb-3 flex items-center gap-2'>
                            <i className='tabler-category text-[16px] text-primary' />

                            <span className='text-[10px] font-semibold uppercase tracking-[0.07em] text-textSecondary'>
              Jelajahi kategori
            </span>
                          </div>

                          <div className='flex flex-wrap gap-2'>
                            {[
                              'Digital',
                              'Kewirausahaan',
                              'Manajemen',
                              'Industri'
                            ].map(category => (
                              <button
                                key={category}
                                type='button'
                                onMouseDown={event => event.preventDefault()}
                                onClick={() => handleSuggestionClick(category)}
                                className='rounded-[8px] border border-divider bg-backgroundDefault px-3 py-1.5 text-[11px] font-medium text-textSecondary transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Helper */}
                        <div className='bg-backgroundDefault px-5 py-3'>
                          <div className='flex items-center gap-2 text-[10px] text-textSecondary'>
                            <i className='tabler-info-circle text-[14px]' />

                            <span>
              Cari berdasarkan nama pelatihan, kategori, atau keterampilan.
            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </Paper>
                )}
              </div>

              {/* Filter */}
              <Tooltip title='Filter pelatihan'>
                <IconButton
                  onClick={handleFilter}
                  aria-label='Filter pelatihan'
                  className='bs-[46px] is-[46px] shrink-0 rounded-[11px] border border-divider bg-backgroundDefault text-textSecondary transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
                >
                  <i className='tabler-adjustments-horizontal text-[21px]' />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Account */}
          <div className='flex items-center shrink-0'>
            <Button
              variant='text'
              color='inherit'
              onClick={event => setAnchorEl(event.currentTarget)}
              className='min-is-0 min-bs-0 rounded-[11px] p-1.5 sm:px-2.5 hover:bg-actionHover'
              aria-label='Menu akun'
            >
              <Avatar
                className='bs-[38px] is-[38px] shrink-0'
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              >
                <i className='tabler-user text-[19px]' />
              </Avatar>

              <div className='hidden md:flex flex-col items-start ms-2'>
                <span className='text-[13px] font-semibold leading-[16px] text-textPrimary'>
                  Masuk
                </span>

                <span className='text-[10px] leading-[13px] text-textSecondary'>
                  Akun peserta
                </span>
              </div>

              <i className='hidden md:block tabler-chevron-down text-[17px] ms-1.5 text-textSecondary' />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseMenu()
                  router.push('/login')
                }}
              >
                <i className='tabler-login me-2 text-[20px]' />
                Masuk
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseMenu()
                  router.push('/register')
                }}
              >
                <i className='tabler-user-plus me-2 text-[20px]' />
                Daftar
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => {
                  handleCloseMenu()
                  router.push('/')
                }}
              >
                <i className='tabler-home me-2 text-[20px]' />
                Beranda DISKOP
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default TrainingNavbar
