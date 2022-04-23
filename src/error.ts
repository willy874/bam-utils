export function messageFormat(message: string, data: Record<string, string>): string {
  let logMessage = message
  for (const key in data) {
    const reg = new RegExp('{' + key + '}', 'g')
    logMessage = logMessage.replace(reg, () => data[key])
  }
  return logMessage
}

interface HttpErrorOption {
  message?: string;
  status?: number;
  url?: string;
  method?: string;
} 

export class HttpError extends Error {
  status: number
  method: string
  url: string
  constructor(args: HttpErrorOption = {}) {
    const message = args.message || '' 
    super(message)
    this.status = args.status || 0
    this.method = args.method?.toUpperCase() || 'GET'
    this.url = args.url || ''
  }
}

export function handleErrorLog(error: unknown, data: Record<string,string> = {}): void {
  if (error instanceof Error) {
    console.error(messageFormat(error.message, data))
  }
  if (typeof error === 'string') {
    console.error(messageFormat(error, data))
  }
  
}

export function handleHttpErrorLog(error: unknown): Error | HttpError {
  if (error instanceof HttpError) {
    console.error(`%s [%s] %s\n%s`, error.method || 'GET', error.status || 0, error.url || '', error.message)
    return error
  }
  if (error instanceof Error) {
    handleErrorLog(error)
    return error
  }
  return new Error('The function param name of error is not Error().')
}

export function handleWarningLog(message: string | string[], data: Record<string, string> = {}): void  {
  if (message instanceof Array) {
    console.error(...message)
  }
  if (typeof message === 'string') {
    console.warn(messageFormat(message, data))
  }
}
