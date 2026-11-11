import { NextResponse } from 'next/server'

const API_URL =
  'https://wilayah.id/api/villages'

type RouteContext = {
  params: Promise<{
    code: string
  }>
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { code } = await context.params

    const response = await fetch(
      `${API_URL}/${code}.json`,
      {
        headers: {
          Accept: 'application/json'
        },
        cache: 'force-cache'
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            'Failed to fetch villages'
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
      '[VILLAGES API ERROR]',
      error
    )

    return NextResponse.json(
      {
        message:
          'Failed to fetch villages'
      },
      {
        status: 500
      }
    )
  }
}
