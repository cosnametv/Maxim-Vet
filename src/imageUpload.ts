// Reads an image file, downscales/compresses it, and resolves to a data URL.
// Compression keeps localStorage under its ~5MB quota so content actually
// persists (placeholder until a real storage/database upload is wired in).
export function compressImageFile(file: File, maxEdge = 1000, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result);
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxEdge || height > maxEdge) {
          const scale = Math.min(maxEdge / width, maxEdge / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(raw);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          resolve(raw);
        }
      };
      img.onerror = () => resolve(raw);
      img.src = raw;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
