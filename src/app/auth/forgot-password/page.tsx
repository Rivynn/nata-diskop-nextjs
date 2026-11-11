// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ForgotPassword from '@views/auth/forgot-password/ForgotPassword'


export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgotten Password to your account'
}

const ForgotPasswordPage = async () => {
  // Vars


  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
      <ForgotPassword />
    </div>
  )
}

export default ForgotPasswordPage
