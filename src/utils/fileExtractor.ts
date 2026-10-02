import { extractTextFromPoster } from './ocrService';
import mammoth from 'mammoth';

/**
 * Universal File Extractor: Membaca teks dari berbagai format berkas langsung di browser pengguna.
 * Menjamin zero-backend dan mode privat 100%.
 *
 * @param file - Berkas yang diunggah (Gambar, TXT, DOCX, atau PDF)
 * @param onProgress - Callback persentase kemajuan (0 - 100%)
 * @returns Teks utuh hasil ekstraksi
 */
export async function extractTextFromFile(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();

  // 1. JALUR GAMBAR (PNG, JPG, JPEG, WEBP) -> Tesseract OCR
  if (
    fileType.startsWith('image/') ||
    /\.(png|jpe?g|webp|bmp)$/i.test(fileName)
  ) {
    return await extractTextFromPoster(file, onProgress);
  }

  // 2. JALUR TEKS POLOS (.txt) -> Native FileReader
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    if (onProgress) onProgress(20);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (onProgress) onProgress(100);
        resolve(((e.target?.result as string) || '').trim());
      };
      reader.onerror = (err) => reject(new Error('Gagal membaca file TXT: ' + err));
      reader.readAsText(file, 'utf-8');
    });
  }

  // 3. JALUR DOKUMEN WORD (.docx) -> Mammoth.js
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    if (onProgress) onProgress(20);
    const arrayBuffer = await file.arrayBuffer();
    if (onProgress) onProgress(50);
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (onProgress) onProgress(100);
    return (result.value || '').trim();
  }

  // 4. JALUR DOKUMEN PDF (.pdf) -> PDF.js (Dynamic import untuk ketahanan browser & SSR)
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    if (onProgress) onProgress(15);
    const pdfjsLib = await import('pdfjs-dist');
    if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '5.6.205'}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    if (onProgress) onProgress(35);

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';
    const totalPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item) => {
          if ('str' in item && typeof item.str === 'string') {
            return item.str;
          }
          return '';
        })
        .filter(Boolean)
        .join(' ');

      fullText += pageStrings + '\n';

      if (onProgress) {
        const percent = Math.round(35 + ((pageNum / totalPages) * 65));
        onProgress(percent);
      }
    }

    if (onProgress) onProgress(100);
    return fullText.trim();
  }

  throw new Error('Format berkas belum didukung. Silakan gunakan PDF, DOCX, TXT, PNG, atau JPG.');
}