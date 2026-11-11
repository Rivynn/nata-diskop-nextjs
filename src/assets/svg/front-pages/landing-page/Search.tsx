// React Imports
import type { SVGAttributes } from 'react'

const Search = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <circle
        cx='10.8'
        cy='10.8'
        r='6.8'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <path
        d='M16 16L21 21'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

export default Search
