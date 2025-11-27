import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Vérifier si l'email existe déjà
    const existingCustomers = await payload.find({
      collection: 'customers' as any,
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingCustomers.docs.length > 0) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer le client
    const customer = await payload.create({
      collection: 'customers' as any,
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    })

    return NextResponse.json(
      {
        message: 'Compte créé avec succès',
        customerId: customer.id
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
