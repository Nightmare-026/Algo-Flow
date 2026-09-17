export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  correlationId?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

function safeStringify(value: unknown): string {
  try {
    const seen = new WeakSet();
    return JSON.stringify(value, (k, v) => {
      if (typeof v === "object" && v !== null) {
        if (seen.has(v)) return "[Circular]";
        seen.add(v);
      }
      return v;
    });
  } catch {
    return String(value);
  }
}

class Logger {
  private format(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message} ${
      entry.context ? safeStringify(entry.context) : ""
    } ${entry.error ? `\nError: ${entry.error.name}: ${entry.error.message}\n${entry.error.stack || ""}` : ""}`.trim();
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === "development") {
      const entry: LogEntry = {
        level: "debug",
        message,
        timestamp: new Date().toISOString(),
        context,
      };
      console.debug(this.format(entry));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    console.info(this.format(entry));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    console.warn(this.format(entry));
  }

  error(errOrMessage: unknown, context?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    let errorObj: { name: string; message: string; stack?: string } | undefined;
    let message = "Unknown application error";

    if (errOrMessage instanceof Error) {
      errorObj = {
        name: errOrMessage.name,
        message: errOrMessage.message,
        stack: errOrMessage.stack,
      };
      message = errOrMessage.message;
    } else if (typeof errOrMessage === "string") {
      message = errOrMessage;
      errorObj = {
        name: "Error",
        message: errOrMessage,
      };
    }

    const entry: LogEntry = {
      level: "error",
      message,
      timestamp,
      context,
      error: errorObj,
    };

    console.error(this.format(entry));

    // Attempt non-blocking remote error ingestion to application_error_logs
    this.recordRemoteError(entry).catch(() => {
      // Graceful silence if logging service is unreachable
    });
  }

  private async recordRemoteError(entry: LogEntry): Promise<void> {
    if (typeof window !== "undefined") {
      // Client-side report
      try {
        await fetch("/api/observability/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: safeStringify({
            error_name: entry.error?.name || "ApplicationError",
            error_message: entry.message,
            error_stack: entry.error?.stack,
            context: entry.context,
            url: window.location.href,
            user_agent: navigator.userAgent,
          }),
        });
      } catch {
        // Fail open
      }
    }
  }
}

export const logger = new Logger();
