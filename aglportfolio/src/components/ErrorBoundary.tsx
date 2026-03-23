import { Component, type ErrorInfo, type ReactNode } from 'react'
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi'
import { Button } from '../sharedcomponents'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  errorMessage?: string
}

function isIgnorableBrowserError(message: string): boolean {
  return (
    message.includes('ResizeObserver loop completed with undelivered notifications') ||
    message.includes('ResizeObserver loop limit exceeded')
  )
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: undefined,
  }

  private handleWindowError = (event: ErrorEvent) => {
    const message = event.error instanceof Error ? event.error.message : event.message
    if (isIgnorableBrowserError(message ?? '')) {
      // This browser warning is noisy but non-fatal; keep the app running.
      return
    }

    this.setState({
      hasError: true,
      errorMessage: message,
    })
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason
    const message = reason instanceof Error ? reason.message : String(reason)
    if (isIgnorableBrowserError(message)) {
      return
    }

    this.setState({
      hasError: true,
      errorMessage: message,
    })
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error:', error, errorInfo)
  }

  componentDidMount() {
    window.addEventListener('error', this.handleWindowError)
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError)
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  private reloadPage = () => {
    window.location.reload()
  }

  private goHome = () => {
    window.location.assign('/')
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 py-10">
        <div className="w-full max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 shadow-xl shadow-emerald-900/10 md:p-10">
          <div className="inline-flex rounded-2xl bg-rose-100 p-3 text-rose-700">
            <FiAlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-emerald-950 md:text-4xl">Something went wrong</h1>
          <p className="mt-3 text-sm leading-6 text-emerald-800 md:text-base">
            The page hit an unexpected error. You can reload the page or go back to the homepage.
          </p>
          {this.state.errorMessage && (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {this.state.errorMessage}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={this.reloadPage} className="inline-flex items-center gap-2">
              <FiRefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
            <Button variant="outline" onClick={this.goHome} className="inline-flex items-center gap-2">
              <FiHome className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }
}