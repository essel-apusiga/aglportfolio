import { FiArrowLeft, FiCompass, FiHome } from 'react-icons/fi'
import { Button } from '../sharedcomponents'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_30%),linear-gradient(135deg,#ecfdf5,#d1fae5)] px-4 py-10">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl shadow-emerald-900/10">
        <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-800">
              <FiCompass className="h-3.5 w-3.5" />
              404 Page Not Found
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight text-emerald-950 md:text-5xl">This page does not exist</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-800 md:text-base">
              The URL you opened is not available in this app. Use one of the actions below to return to a valid page.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => window.location.assign('/')} className="inline-flex items-center gap-2">
                <FiHome className="h-4 w-4" />
                Homepage
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="inline-flex items-center gap-2">
                <FiArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button variant="ghost" onClick={() => window.location.assign('/cms')} className="inline-flex items-center gap-2">
                <FiCompass className="h-4 w-4" />
                Open CMS
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-3xl bg-emerald-950 p-8 text-white">
            <div className="text-center">
              <p className="text-7xl font-black tracking-tight text-emerald-300">404</p>
              <p className="mt-3 text-sm uppercase tracking-[0.3em] text-emerald-100">Route Missing</p>
              <p className="mt-4 text-sm text-emerald-200">Valid routes currently include `/` and `/cms`.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}