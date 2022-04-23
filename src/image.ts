export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (result instanceof ArrayBuffer) {
        resolve(JSON.stringify(result))
      } else {
        resolve(result || '')
      }
    }
    reader.onerror = (e) => {
      reject(e)
    }
    reader.readAsDataURL(blob)
  })
}

export function urlToImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      requestAnimationFrame(() => {
        resolve(img)
      })
    }
    img.onerror = (e) => {
      reject(e)
    }
    img.src = url
  })
}

export function imageToBase64(
  img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap,
  type?: string
): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!canvas || !ctx) {
    throw new Error('Can‘t draw canvas')
  }
  canvas.height = img.height
  canvas.width = img.width
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL(type || 'image/png')
}

export function transformFileSize(value: unknown): number {
  if (typeof value === 'string') {
    const size = value.replace(/\s+/g, '').toUpperCase()
    if (/KB$/.test(size)) {
      const num = Number(size.replace(/KB$/, ''))
      return num * 10 ** 3
    }
    if (/MB$/.test(size)) {
      const num = Number(size.replace(/MB$/, ''))
      return num * 10 ** 6
    }
    if (/GB$/.test(size)) {
      const num = Number(size.replace(/GB$/, ''))
      return num * 10 ** 9
    }
    if (/TB$/.test(size)) {
      const num = Number(size.replace(/TB$/, ''))
      return num * 10 ** 12
    }
    return Number(size)
  }
  if (typeof value === 'number') {
    return value
  }
  return NaN
}
