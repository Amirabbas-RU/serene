import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, ShoppingBag, SearchX } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface ErrorPageProps {
  status?: number;
  statusText?: string;
  message?: string;
}

export function ErrorPage({ status, statusText, message }: ErrorPageProps) {
  const unknown = !status && !message;

  const title = status === 404
    ? 'Page Not Found'
    : status === 400
      ? 'Bad Request'
      : status === 401 || status === 403
        ? 'Access Denied'
        : status === 500
          ? 'Something Went Wrong'
          : 'Unexpected Error';

  const description = status === 404
    ? 'The page you\'re looking for doesn\'t exist or has been moved.'
    : status === 400
      ? 'The request couldn\'t be processed. This might be a temporary issue.'
      : status === 401
        ? 'You need to sign in to access this page.'
        : status === 500
          ? 'Our server encountered an error. Please try again shortly.'
          : message || 'An unexpected error occurred. Our team has been notified.';

  const icon = status === 404
    ? <SearchX className="w-16 h-16" />
    : <AlertTriangle className="w-16 h-16" />;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Status code */}
        {status && (
          <span className="inline-block text-[8rem] font-heading font-bold text-forest/5 leading-none select-none -mb-12">
            {status}
          </span>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-clay/10 flex items-center justify-center">
            {status === 404 ? (
              <SearchX className="w-12 h-12 text-clay" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-clay" />
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-4xl text-forest mb-3">
          {title}
        </h1>

        {/* Description */}
        <p className="text-forest/60 leading-relaxed mb-8">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button variant="secondary" size="sm" as="a" href="/">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
          <Button variant="outline" size="sm" as="a" href="/collections/all">
            <ShoppingBag className="w-4 h-4" />
            Shop
          </Button>
        </div>

        {/* Technical details (for logged errors) */}
        {statusText && (
          <p className="mt-8 text-xs text-forest/20 font-mono">
            {status} {statusText}
          </p>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Root error boundary — catches unhandled route loader/action errors.
 * Wrap this in root.tsx or route-level ErrorBoundary.
 */
export function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <ErrorPage
          status={error.status}
          statusText={error.statusText}
          message={error.data?.message || error.data}
        />
      </div>
    );
  }

  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <ErrorPage message={message} />
    </div>
  );
}
