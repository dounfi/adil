import { createWorker, LoggerMessage } from 'tesseract.js';

/**
 * Membaca teks dari gambar poster pengguna secara privat di browser menggunakan Tesseract.js.
 * Pemrosesan 100% lokal di RAM browser pengguna tanpa pengiriman ke server eksternal.
 * 
 * @param imageFile - Berkas gambar (PNG, JPG, WEBP)
 * @param onProgress - Callback persentase progress (0 - 100%)
 * @returns Teks hasil ekstraksi OCR dalam Bahasa Indonesia
 */
export async function extractTextFromPoster(
  imageFile: File | Blob,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  let imageUrl: string | null = null;
  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

  try {
    // 1. Buat URL sementara dari blob file lokal
    imageUrl = URL.createObjectURL(imageFile);

    // 2. Inisialisasi Tesseract Worker untuk Bahasa Indonesia ('ind')
    worker = await createWorker('ind', 1, {
      logger: (m: LoggerMessage) => {
        if (m.status === 'recognizing text' && onProgress && typeof m.progress === 'number') {
          const progressPercent = Math.min(100, Math.max(0, Math.round(m.progress * 100)));
          onProgress(progressPercent);
        }
      },
    });

    // 3. Eksekusi pengenalan teks
    const { data } = await worker.recognize(imageUrl);
    const cleanedText = data.text ? data.text.trim().replace(/\s+/g, ' ') : '';
    
    if (onProgress) {
      onProgress(100);
    }
    
    return cleanedText;
  } catch (error) {
    console.error('Gagal memproses Tesseract.js OCR:', error);
    throw error;
  } finally {
    // 4. Penanganan memori ketat: hentikan web worker dan bebaskan object URL
    if (worker) {
      try {
        await worker.terminate();
      } catch (err) {
        console.warn('Gagal menterminasi worker Tesseract:', err);
      }
    }
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  }
}