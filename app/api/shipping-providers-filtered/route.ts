import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const country = searchParams.get('country')
    const postalCode = searchParams.get('postal_code')
    const locale = searchParams.get('locale') || 'fr'

    const payload = await getPayload({ config })

    // Build query
    const where: any = {
      active: { equals: true },
    }

    // Filter by country
    if (country) {
      where.countries = { contains: country }
    }

    // Fetch shipping providers
    const { docs: providers } = await payload.find({
      collection: 'shipping-providers' as any,
      where,
      sort: 'sortOrder',
      locale: locale as any,
    })

    // Filter by postal code if provided
    let filteredProviders = providers

    if (postalCode && country) {
      filteredProviders = providers.filter((provider: any) => {
        // Check if postal code rules are enabled
        if (!provider.postalCodeRules?.enabled) {
          return true // No postal code restriction
        }

        // Check if pattern exists
        if (!provider.postalCodeRules?.pattern) {
          return true
        }

        try {
          const regex = new RegExp(provider.postalCodeRules.pattern)
          return regex.test(postalCode)
        } catch (error) {
          console.error(`Invalid regex pattern for provider ${provider.id}:`, error)
          return true // Include if regex is invalid
        }
      })
    }

    // Transform data for frontend
    const transformedProviders = filteredProviders.map((provider: any) => ({
      id: provider.id,
      title: provider.title,
      subtitle: provider.subtitle,
      logo: provider.logo
        ? typeof provider.logo === 'object'
          ? provider.logo.url
          : provider.logo
        : null,
      price: provider.price,
      estimatedDelivery: provider.estimatedDelivery,
      isRelayService: provider.isRelayService,
      relayApi: provider.relayApi,
      trackingUrl: provider.trackingUrl,
      features: provider.features?.map((f: any) => f.feature) || [],
      postalCodeRestriction: provider.postalCodeRules?.enabled
        ? provider.postalCodeRules.description
        : null,
    }))

    return NextResponse.json({
      success: true,
      providers: transformedProviders,
      count: transformedProviders.length,
      filters: {
        country,
        postalCode,
      },
    })
  } catch (error) {
    console.error('[Shipping Providers API Error]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch shipping providers',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
