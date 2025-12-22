/**
 * Production-Ready Logging Utility
 * 
 * Replaces console.log/error/warn with structured logging that:
 * - Respects environment (dev vs production)
 * - Supports log levels
 * - Allows context metadata
 * - Can be extended for error tracking (Sentry, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
    [key: string]: any
}

interface LoggerConfig {
    isDevelopment: boolean
    minLevel: LogLevel
}

class Logger {
    private config: LoggerConfig

    constructor() {
        this.config = {
            isDevelopment: process.env.NODE_ENV === 'development',
            minLevel: process.env.LOG_LEVEL as LogLevel || 'info'
        }
    }

    /**
     * Debug - Detailed information for debugging
     * Only shown in development
     */
    debug(message: string, context?: LogContext) {
        if (!this.config.isDevelopment) return

        const timestamp = new Date().toISOString()
        console.debug(`🔍 [${timestamp}] DEBUG:`, message, context || '')
    }

    /**
     * Info - General informational messages
     * Only shown in development
     */
    info(message: string, context?: LogContext) {
        if (!this.config.isDevelopment) return

        const timestamp = new Date().toISOString()
        console.info(`ℹ️  [${timestamp}] INFO:`, message, context || '')
    }

    /**
     * Warn - Warning messages that should be reviewed
     * Shown in all environments
     */
    warn(message: string, context?: LogContext) {
        const timestamp = new Date().toISOString()
        console.warn(`⚠️  [${timestamp}] WARN:`, message, context || '')

        // TODO: Send to monitoring service in production
    }

    /**
     * Error - Error messages that require attention
     * Shown in all environments
     */
    error(message: string, error?: Error | unknown, context?: LogContext) {
        const timestamp = new Date().toISOString()
        console.error(`❌ [${timestamp}] ERROR:`, message, error, context || '')

        // TODO: Send to error tracking service (e.g., Sentry)
        // if (process.env.NODE_ENV === 'production') {
        //   Sentry.captureException(error, { extra: context })
        // }
    }

    /**
     * Service-specific logger with automatic prefixing
     */
    service(serviceName: string) {
        return {
            debug: (message: string, context?: LogContext) =>
                this.debug(`[${serviceName}] ${message}`, context),
            info: (message: string, context?: LogContext) =>
                this.info(`[${serviceName}] ${message}`, context),
            warn: (message: string, context?: LogContext) =>
                this.warn(`[${serviceName}] ${message}`, context),
            error: (message: string, error?: Error | unknown, context?: LogContext) =>
                this.error(`[${serviceName}] ${message}`, error, context),
        }
    }

    /**
     * Action-specific logger with automatic prefixing
     */
    action(actionName: string) {
        return {
            debug: (message: string, context?: LogContext) =>
                this.debug(`[Action:${actionName}] ${message}`, context),
            info: (message: string, context?: LogContext) =>
                this.info(`[Action:${actionName}] ${message}`, context),
            warn: (message: string, context?: LogContext) =>
                this.warn(`[Action:${actionName}] ${message}`, context),
            error: (message: string, error?: Error | unknown, context?: LogContext) =>
                this.error(`[Action:${actionName}] ${message}`, error, context),
        }
    }
}

// Singleton instance
export const logger = new Logger()

// Convenience exports
export const createServiceLogger = (serviceName: string) => logger.service(serviceName)
export const createActionLogger = (actionName: string) => logger.action(actionName)
