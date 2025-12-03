import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // TODO: Send error to monitoring service (Sentry, etc.)
    // logErrorToService(error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/tr';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Bir şeyler yanlış gitti
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                Sayfayı Yenile
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </button>
            </div>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Hata Detayları (Geliştirici)
                </summary>
                <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
                  <p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
