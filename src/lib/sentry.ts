// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Error Tracking & Monitoring Utility
// Lightweight error tracking without external dependencies
// ═══════════════════════════════════════════════════════════════════════════════

interface ErrorEvent {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  componentStack?: string;
  extra?: Record<string, unknown>;
  level: 'error' | 'warning' | 'info';
  tags?: Record<string, string>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: Date;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private isInitialized = false;
  private maxErrors = 100;

  private constructor() {}

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError(error || new Error(String(message)), {
        source,
        lineno,
        colno,
      });
    };

    // Unhandled promise rejection handler
    window.onunhandledrejection = (event) => {
      this.captureError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        { type: 'unhandledrejection' }
      );
    };

    // Performance observer for Web Vitals
    if ('PerformanceObserver' in window) {
      this.observeWebVitals();
    }

    this.isInitialized = true;
    console.log('🔍 Ascendify Error Tracking initialized');
  }

  private observeWebVitals(): void {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (lastEntry) {
          this.captureMetric('LCP', lastEntry.startTime, this.rateLCP(lastEntry.startTime));
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry & { processingStart?: number; startTime: number }) => {
          const fid = entry.processingStart ? entry.processingStart - entry.startTime : 0;
          this.captureMetric('FID', fid, this.rateFID(fid));
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
          if (!entry.hadRecentInput && entry.value) {
            clsValue += entry.value;
            this.captureMetric('CLS', clsValue, this.rateCLS(clsValue));
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

    } catch {
      // PerformanceObserver may not be fully supported
      console.debug('Web Vitals observation not fully supported');
    }
  }

  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  captureError(
    error: Error,
    extra?: Record<string, unknown>,
    level: 'error' | 'warning' | 'info' = 'error'
  ): string {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const errorEvent: ErrorEvent = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      extra,
      level,
    };

    // Add to local storage for persistence
    this.errors.push(errorEvent);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Store in localStorage for debugging
    try {
      const storedErrors = JSON.parse(localStorage.getItem('ascend_errors') || '[]');
      storedErrors.push(errorEvent);
      if (storedErrors.length > 50) storedErrors.shift();
      localStorage.setItem('ascend_errors', JSON.stringify(storedErrors));
    } catch {
      // localStorage may not be available
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Ascendify Error ${errorId}]`, error, extra);
    }

    return errorId;
  }

  captureMessage(
    message: string,
    level: 'error' | 'warning' | 'info' = 'info',
    extra?: Record<string, unknown>
  ): string {
    return this.captureError(new Error(message), extra, level);
  }

  captureComponentError(error: Error, componentStack: string): string {
    const errorId = this.captureError(error, { componentStack });
    return errorId;
  }

  captureMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: new Date(),
    };

    this.metrics.push(metric);

    // Log performance issues
    if (rating === 'poor') {
      console.warn(`[Ascendify Performance] ${name}: ${value.toFixed(2)} (${rating})`);
    }

    // Store metrics
    try {
      const storedMetrics = JSON.parse(localStorage.getItem('ascend_metrics') || '[]');
      storedMetrics.push(metric);
      if (storedMetrics.length > 100) storedMetrics.shift();
      localStorage.setItem('ascend_metrics', JSON.stringify(storedMetrics));
    } catch {
      // localStorage may not be available
    }
  }

  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getStoredErrors(): ErrorEvent[] {
    try {
      return JSON.parse(localStorage.getItem('ascend_errors') || '[]');
    } catch {
      return [];
    }
  }

  getStoredMetrics(): PerformanceMetric[] {
    try {
      return JSON.parse(localStorage.getItem('ascend_metrics') || '[]');
    } catch {
      return [];
    }
  }

  clearErrors(): void {
    this.errors = [];
    try {
      localStorage.removeItem('ascend_errors');
    } catch {
      // localStorage may not be available
    }
  }

  // Generate error report for debugging
  generateReport(): string {
    const errors = this.getStoredErrors();
    const metrics = this.getStoredMetrics();

    const report = {
      generatedAt: new Date().toISOString(),
      errorCount: errors.length,
      errors: errors.slice(-10), // Last 10 errors
      metrics: {
        LCP: metrics.filter(m => m.name === 'LCP').slice(-5),
        FID: metrics.filter(m => m.name === 'FID').slice(-5),
        CLS: metrics.filter(m => m.name === 'CLS').slice(-5),
      },
      environment: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString(),
      },
    };

    return JSON.stringify(report, null, 2);
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

// Convenience exports
export const captureError = (error: Error, extra?: Record<string, unknown>) => 
  errorTracker.captureError(error, extra);

export const captureMessage = (message: string, level?: 'error' | 'warning' | 'info') =>
  errorTracker.captureMessage(message, level);

export const initErrorTracking = () => errorTracker.init();
