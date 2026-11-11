import { NextResponse } from 'next/server'

const API_URL =
  'https://wilayah.id/api/provinces.json'

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: 'application/json'
      },
      cache: 'force-cache'
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          message: 'Failed to fetch provinces'
        },
        {
          status: response.status
        }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(
      '[PROVINCES API ERROR]',
      error
    )

    return NextResponse.json(
      {
        message: 'Failed to fetch provinces'
      },
      {
        status: 500
      }
    )
  }
}
