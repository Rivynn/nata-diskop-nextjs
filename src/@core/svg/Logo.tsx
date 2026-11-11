// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      width='36'
      height='28'
      viewBox='0 0 36 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      {/* Main DISKOP mark */}
      <path
        d='M2 4.5C2 3.11929 3.11929 2 4.5 2H15.5C18.5376 2 21 4.46243 21 7.5V21.5C21 23.9853 18.9853 26 16.5 26H10.5C5.80558 26 2 22.1944 2 17.5V4.5Z'
        fill='currentColor'
      />

      <path
        d='M21 7.5C21 4.46243 23.4624 2 26.5 2H31.5C32.8807 2 34 3.11929 34 4.5V17.5C34 22.1944 30.1944 26 25.5 26H21V7.5Z'
        fill='currentColor'
        opacity='0.78'
      />

      {/* Inner negative space */}
      <path
        d='M8 8H15V17.5C15 18.8807 13.8807 20 12.5 20H8V8Z'
        fill='white'
      />

      <path
        d='M21 8H28V17.5C28 18.8807 26.8807 20 25.5 20H21V8Z'
        fill='white'
      />

      {/* Connection / learning symbol */}
      <path
        d='M15 14H21'
        stroke='white'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

export default Logo
