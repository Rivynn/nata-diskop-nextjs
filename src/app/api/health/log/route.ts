import { NextResponse } from 'next/server'



export async function GET() {

  try {
    throw new Error('Example logging error')
  } catch (error) {

  }

  return NextResponse.json({
    success: true,
    message: 'Logging test successful'
  })
}
