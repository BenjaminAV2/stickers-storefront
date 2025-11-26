import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'

// TEMPORARY ROUTE - FOR DEBUGGING ONLY
// This route bypasses password authentication to diagnose auth issues

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find the user
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users.docs[0]

    // Generate a JWT token for this user
    const token = await payload.login({
      collection: 'users',
      data: {
        email: user.email,
        password: 'bypass', // This won't be checked
      },
      req: request as any,
      // @ts-ignore - Force login without password verification
      overrideAccess: true,
    }).catch(async () => {
      // If the above fails, generate token directly
      const secret = process.env.PAYLOAD_SECRET
      if (!secret) {
        throw new Error('PAYLOAD_SECRET is not defined')
      }

      const jwt = require('jsonwebtoken')
      const tokenData = {
        id: user.id,
        email: user.email,
        collection: 'users',
      }

      const generatedToken = jwt.sign(tokenData, secret, {
        expiresIn: '7d',
      })

      return { token: generatedToken, user }
    })

    console.log('🔓 BYPASS LOGIN SUCCESS for:', email)

    return NextResponse.json({
      message: 'Login successful (bypassed)',
      token: token.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('❌ Bypass login error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
