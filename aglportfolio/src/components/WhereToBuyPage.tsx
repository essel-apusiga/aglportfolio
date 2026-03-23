import { useEffect } from 'react'
import { setJsonLd, setSeoMeta } from '../utils/seo'
import { WhatsAppFloatButton } from './WhatsAppFloatButton'

const BRANCHES = [
  {
    id: 'tamale',
    city: 'Tamale',
    address: 'Tamale Headquarters, Northern Region, Ghana',
    phone: '+233 20 000 1234',
    coords: '9.4075,-0.8533',
  },
  {
    id: 'accra',
    city: 'Accra',
    address: 'Accra Branch, Greater Accra Region, Ghana',
    phone: '+233 20 000 5678',
    coords: '5.6037,-0.1870',
  },
]

function getMapEmbedUrl(coords: string) {
  const [latRaw, lngRaw] = coords.split(',')
  const lat = Number(latRaw)
  const lng = Number(lngRaw)

  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}&z=14&output=embed`
}

export function WhereToBuyPage() {
  useEffect(() => {
    setSeoMeta({
      title: 'Where to Buy Apsonic in Ghana | AGL Business (Apusiga GH)',
      description:
        'Find AGL Business (Apusiga Ghana Limited / Apusiga GH) branches in Tamale and Accra for Apsonic tricycles, delivery motorbikes, tires, and spare parts. We assist with DVLA registration and insurance.',
      keywords:
        'AGL business, agl.business, Apusiga Ghana Limited, Apusiga GH, Apusia GH, Apsonic Motors Ghana, Apsnoce Motors, Apsonic dealer Ghana, tricycles for sale in Kumasi, buy motorbikes in Accra, Apsonic Tamale, Apsonic products Ghana',
      canonicalPath: '/where-to-buy',
    })

    setJsonLd('where-to-buy-localbusiness', {
      '@context': 'https://schema.org',
      '@type': 'AutoDealer',
      name: 'AGL Business',
      legalName: 'Apusiga Ghana Limited',
      alternateName: ['Apusiga GH', 'Apusia GH', 'Apsnoce Motors'],
      url: 'https://www.agl.business',
      email: 'sales@apusigaghana.com',
      telephone: '+233537139760',
      areaServed: 'Ghana',
      makesOffer: [
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Apsonic Cargo Tricycles' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Apsonic Passenger Tricycles' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Apsonic Tires and Spare Parts' } },
      ],
    })
  }, [])

  return (
    <main className="min-h-screen bg-white text-emerald-950">
      <section className="w-full bg-[linear-gradient(160deg,#ecfdf5_0%,#ffffff_55%,#e8fff4_100%)] px-6 py-16 md:px-12">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <a
            href="/"
            className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 transition hover:bg-emerald-50"
          >
            Back to Main Site
          </a>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-600">Where To Buy</p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Apsonic Tricycles and Motorbikes in Ghana
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-emerald-800 md:text-base">
              Looking for heavy-duty cargo models, passenger tricycles, or genuine Apsonic tires and spare parts?
              Apusiga Ghana Ltd (AGL) is your trusted source with branch support in Tamale and Accra.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
          {BRANCHES.map((branch) => (
            <article key={branch.id} className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black text-emerald-950">{branch.city} Branch</h2>
              <p className="mt-2 text-sm text-emerald-800">{branch.address}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-900">Phone: {branch.phone}</p>
              <p className="text-sm font-semibold text-emerald-900">Email: sales@apusigaghana.com</p>
              <p className="mt-2 text-xs text-emerald-700">GPS Coordinates: {branch.coords}</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-emerald-200">
                <iframe
                  title={`${branch.city} branch map`}
                  src={getMapEmbedUrl(branch.coords)}
                  className="h-64 w-full border-0"
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-2xl font-black text-emerald-950">Registration and Purchase Support</h2>
          <ul className="mt-3 grid gap-2 text-sm text-emerald-800 md:grid-cols-2">
            <li>DVLA registration assistance for new tricycles and motorbikes</li>
            <li>Insurance onboarding support for commercial and personal use</li>
            <li>Fleet procurement advice for logistics and agriculture businesses</li>
            <li>After-sales guidance on maintenance and genuine spare parts</li>
          </ul>
        </div>
      </section>

      <WhatsAppFloatButton message="Hello AGL, I want to buy an Apsonic tricycle in Ghana. Please assist." />
    </main>
  )
}
