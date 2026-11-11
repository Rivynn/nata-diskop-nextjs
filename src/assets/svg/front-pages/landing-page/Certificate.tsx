// React Imports
import type { SVGAttributes } from 'react'

const Certificate = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='64'
      height='65'
      viewBox='0 0 64 65'
      fill='none'
      {...props}
    >
      <path
        opacity='0.2'
        d='M10 10.6943H54V42.6943H10V10.6943Z'
        fill='currentColor'
      />

      <path
        d='M10 10.6943H54V42.6943H10V10.6943Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      <path
        d='M18 18.6943H46'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />

      <path
        d='M18 26.6943H36'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />

      <path
        d='M18 34.6943H30'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />

      <circle
        cx='46'
        cy='34.6943'
        r='6'
        stroke='currentColor'
        strokeWidth='2'
      />

      <path
        d='M42 40.6943V53.6943L46 50.6943L50 53.6943V40.6943'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Certificate
