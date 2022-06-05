export * from "./storage";

export function isBrowserSupported(key: string): boolean {
  return typeof Window !== "undefined" && key in window;
}

export function urlToImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      requestAnimationFrame(() => {
        resolve(img);
      });
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
}

export function imageToBase64(
  img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap,
  type?: string
): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!canvas || !ctx) {
    throw new Error("Can‘t draw canvas");
  }
  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL(type || "image/png");
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        resolve(JSON.stringify(result));
      } else {
        resolve(result || "");
      }
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(blob);
  });
}

// export async function blobToBase64(blob: Blob): Promise<string> {
//   let binary = "";
//   const blobText = await blob.text();
//   for (let i = 0; i < blobText.length; i++) {
//     binary += String.fromCharCode(blobText.charCodeAt(i) & 255);
//   }
//   return "data:" + blob.type + ";base64," + window.btoa(binary);
// }

export function base64toBlob(base64Buf: string, type?: string): Blob {
  const arr = base64Buf.split(",");
  const mime = (() => {
    if (/^data:(\w|\/)+;base64/.test(base64Buf) && arr[0]) {
      const mineRegexp = arr[0].match(/:(.*?);/);
      return mineRegexp ? mineRegexp[1] : "";
    } else {
      return type || "";
    }
  })();
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  if (!mime) {
    throw new Error("Mime is not type.");
  }
  return new Blob([u8arr], { type: mime });
}
