
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorLog {
  id: string;
  message: string;
  timestamp: Date;
}

// Create a singleton for the error logs
class ErrorLoggerService {
  private static instance: ErrorLoggerService;
  private logs: ErrorLog[] = [];
  private listeners: ((logs: ErrorLog[]) => void)[] = [];

  private constructor() {
    // Initialize error interception
    this.interceptConsoleErrors();
  }

  public static getInstance(): ErrorLoggerService {
    if (!ErrorLoggerService.instance) {
      ErrorLoggerService.instance = new ErrorLoggerService();
    }
    return ErrorLoggerService.instance;
  }

  private interceptConsoleErrors() {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Call the original console.error
      originalConsoleError.apply(console, args);

      // Log the error
      const errorMessage = args.map(arg => 
        typeof arg === 'object' && arg !== null 
          ? arg.message || JSON.stringify(arg) 
          : String(arg)
      ).join(' ');
      
      this.logError(errorMessage);
    };

    // Intercept unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorMessage = event.reason?.message || 'Unhandled Promise Rejection';
      this.logError(errorMessage);
    });
  }

  public logError(message: string) {
    const newLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      timestamp: new Date()
    };

    this.logs = [newLog, ...this.logs].slice(0, 50); // Keep only the last 50 errors
    
    // Notify all listeners
    this.listeners.forEach(listener => listener([...this.logs]));
    
    // Also show in toast for immediate notification
    toast.error(message);
  }

  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.listeners.forEach(listener => listener([]));
  }

  public subscribe(listener: (logs: ErrorLog[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// Export the singleton instance
export const errorLogger = ErrorLoggerService.getInstance();

// React component to display errors
const ErrorLogger: React.FC = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Subscribe to error logs
    const unsubscribe = errorLogger.subscribe(setLogs);
    return unsubscribe;
  }, []);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {expanded ? (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 max-w-md w-full max-h-[70vh] overflow-auto">
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-lg font-medium">Error Logs ({logs.length})</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => errorLogger.clearLogs()} 
                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={() => setExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="p-0">
            {logs.map(log => (
              <div 
                key={log.id} 
                className="p-3 border-b border-gray-100 hover:bg-gray-50 text-sm"
              >
                <div className="text-red-600 font-medium break-words">{log.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {log.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="bg-red-100 text-red-800 px-4 py-2 rounded-full shadow-md hover:bg-red-200 transition-colors flex items-center gap-2"
        >
          <span className="font-medium">View Errors ({logs.length})</span>
        </button>
      )}
    </div>
  );
};

export default ErrorLogger;
