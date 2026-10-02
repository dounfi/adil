import { VisualFeatures } from '../types/arsip';

/**
 * Helper untuk memuat File gambar menjadi HTMLImageElement secara asinkron.
 * Menjamin URL object langsung dibersihkan setelah gambar termuat untuk mencegah memory leak.
 */
function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal memuat berkas gambar ke kanvas browser: ' + err));
    };
    img.src = url;
  });
}

/**
 * 1. Hitung dHash 64-bit (16 Karakter Hexadesimal)
 * Algoritma:
 * - Ubah gambar ke skala abu-abu (grayscale) dengan resolusi (width = 9, height = 8).
 * - Bandingkan kecerahan piksel berdekatan secara horizontal: piksel[x+1] > piksel[x].
 * - Menghasilkan 64 bit biner -> dikonversi menjadi 16 karakter Hex.
 */
export function calculateDHash(img: HTMLImageElement): string {
  const width = 9;
  const height = 8;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Gagal menginisialisasi Canvas Context 2D untuk dHash');

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height).data;

  // Ubah ke Grayscale Luminance
  const grayscale: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = imageData[idx] ?? 0;
      const g = imageData[idx + 1] ?? 0;
      const b = imageData[idx + 2] ?? 0;
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      row.push(gray);
    }
    grayscale.push(row);
  }

  // Bandingkan piksel x dengan piksel x+1 (menghasilkan 64 bit biner)
  let binaryString = '';
  for (let y = 0; y < height; y++) {
    const row = grayscale[y];
    if (!row) continue;
    for (let x = 0; x < width - 1; x++) {
      const curr = row[x] ?? 0;
      const next = row[x + 1] ?? 0;
      const bit = next > curr ? '1' : '0';
      binaryString += bit;
    }
  }

  // Konversi 64 bit ke 16 karakter Hex
  let hexString = '';
  for (let i = 0; i < binaryString.length; i += 4) {
    const chunk = binaryString.substring(i, i + 4);
    hexString += parseInt(chunk, 2).toString(16);
  }

  return hexString.padStart(16, '0');
}

/**
 * 2. Hitung Layout Signature 16x16 (256 Nilai Intensitas)
 * Membagi poster menjadi kisi 16x16 untuk merekam pola tata letak elemen visual.
 */
export function calculateLayoutSignature(img: HTMLImageElement): number[] {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Gagal menginisialisasi Canvas Context 2D untuk Layout');

  ctx.drawImage(img, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size).data;

  const layout: number[] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i] ?? 0;
    const g = imageData[i + 1] ?? 0;
    const b = imageData[i + 2] ?? 0;
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    layout.push(gray);
  }

  return layout; // Array 256 angka uint8 (0-255)
}

/**
 * 3. Hitung Color Histogram (64 Bin Ter-normalisasi)
 * Merekam distribusi sebaran warna RGB (4 bin per channel: 4x4x4 = 64 bin).
 */
export function calculateColorHistogram(img: HTMLImageElement): number[] {
  const canvasSize = 64;
  const bins = 4;
  const binSize = 256 / bins;
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Gagal menginisialisasi Canvas Context 2D untuk Color Histogram');

  ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize).data;

  const histogram = new Array(bins * bins * bins).fill(0);
  const totalPixels = canvasSize * canvasSize;

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i] ?? 0;
    const g = imageData[i + 1] ?? 0;
    const b = imageData[i + 2] ?? 0;

    const rBin = Math.min(Math.floor(r / binSize), bins - 1);
    const gBin = Math.min(Math.floor(g / binSize), bins - 1);
    const bBin = Math.min(Math.floor(b / binSize), bins - 1);

    const binIndex = rBin * bins * bins + gBin * bins + bBin;
    const currentCount = histogram[binIndex] ?? 0;
    histogram[binIndex] = currentCount + 1;
  }

  // Normalisasi distribusi sehingga total frekuensi = 1.0
  return histogram.map((count: number) => Number((count / totalPixels).toFixed(6)));
}

/**
 * Ekstraksi Fitur Visual Komprehensif dari Berkas Gambar
 */
export async function extractVisualFeatures(file: File | Blob): Promise<VisualFeatures> {
  const img = await loadImageFromFile(file);

  return {
    dhash: calculateDHash(img),
    layout: calculateLayoutSignature(img),
    colorHist: calculateColorHistogram(img),
  };
}

/**
 * Hitung Hamming Distance selisih bit biner antara dua hex hash 64-bit.
 * Jarak 0-4: Hampir Identik; 5-10: Sangat Mirip; >10: Berbeda.
 */
export function calculateHammingDistance(h1: string, h2: string): number {
  if (!h1 || !h2) return 64;
  try {
    const clean1 = h1.trim().replace(/^0x/, '');
    const clean2 = h2.trim().replace(/^0x/, '');
    const b1 = BigInt(`0x${clean1 || '0'}`);
    const b2 = BigInt(`0x${clean2 || '0'}`);
    let diff = b1 ^ b2;
    let count = 0;
    while (diff > 0n) {
      count += Number(diff & 1n);
      diff >>= 1n;
    }
    return count;
  } catch {
    return 64;
  }
}

/**
 * Hitung Kemiripan Tata Letak (Pearson Correlation Coefficient antar array 256 angka).
 * Rentang output: 0.0 sampai 1.0 (nilai mendekati 1 menandakan tata letak identik).
 */
export function calculateLayoutSimilarity(a: number[], b: number[]): number {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  const n = a.length;
  let sumA = 0;
  let sumB = 0;
  for (let i = 0; i < n; i++) {
    sumA += a[i] ?? 0;
    sumB += b[i] ?? 0;
  }
  const meanA = sumA / n;
  const meanB = sumB / n;

  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const valA = a[i] ?? 0;
    const valB = b[i] ?? 0;
    const diffA = valA - meanA;
    const diffB = valB - meanB;
    num += diffA * diffB;
    denA += diffA * diffA;
    denB += diffB * diffB;
  }
  const den = Math.sqrt(denA * denB);
  if (den === 0) return 0;
  return Math.max(0, Math.min(1, Number((num / den).toFixed(4))));
}

/**
 * Hitung Kemiripan Histogram Warna menggunakan Histogram Intersection.
 * Rentang output: 0.0 sampai 1.0 (1.0 = palet warna sama persis).
 */
export function calculateHistogramIntersection(a: number[], b: number[]): number {
  if (!a?.length || !b?.length) return 0;
  const len = Math.min(a.length, b.length);
  let intersectionSum = 0;
  for (let i = 0; i < len; i++) {
    intersectionSum += Math.min(a[i] ?? 0, b[i] ?? 0);
  }
  return Math.max(0, Math.min(1, Number(intersectionSum.toFixed(4))));
}