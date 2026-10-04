/**
 * Service untuk On-Device Text Embedding menggunakan @xenova/transformers.
 * Berjalan 100% di browser pengguna (Client-Side, zero-backend, privat).
 */

let featureExtractor: any = null;
let isLoadingModel = false;
let modelLoadError: Error | null = null;

// Konfigurasi model ONNX yang kompatibel dan ringan (384 dimensi)
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

/**
 * Menghitung Cosine Similarity antara dua vektor float.
 * Hasil dinormalisasi ke rentang [0, 1].
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  const sim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  
  // Normalisasi ke rentang 0..1 (karena cosine sim berkisar -1..1)
  const normalized = (sim + 1) / 2;
  return Number(Math.max(0, Math.min(1, normalized)).toFixed(4));
}

/**
 * Inisialisasi pipeline transformer secara lazy di browser.
 */
export async function getEmbeddingPipeline() {
  if (featureExtractor) return featureExtractor;
  if (typeof window === 'undefined') return null; // Guard SSR
  if (modelLoadError) return null;

  if (isLoadingModel) {
    // Tunggu jika sedang loading
    while (isLoadingModel) {
      await new Promise((res) => setTimeout(res, 100));
    }
    return featureExtractor;
  }

  isLoadingModel = true;

  try {
    const { pipeline, env } = await import('@xenova/transformers');
    
    // Konfigurasi cache & fetch browser
    env.allowLocalModels = false;
    env.useBrowserCache = true;

    featureExtractor = await pipeline('feature-extraction', MODEL_NAME, {
      quantized: true, // Gunakan model kuantisasi untuk ukuran file kecil (~23MB) & hemat RAM
    });

    return featureExtractor;
  } catch (err: any) {
    console.warn('Gagal menginisialisasi on-device embedding model:', err);
    modelLoadError = err instanceof Error ? err : new Error(String(err));
    return null;
  } finally {
    isLoadingModel = false;
  }
}

/**
 * Menghasilkan vektor embedding 384-dimensi untuk teks input pengguna.
 * Jika model belum siap atau gagal dimuat, fungsi mengembalikan null (fallback aman).
 */
export async function generateTextEmbedding(text: string): Promise<number[] | null> {
  const clean = text.trim();
  if (!clean) return null;

  try {
    const pipe = await getEmbeddingPipeline();
    if (!pipe) return null;

    // Batasi panjang teks untuk inferensi browser optimal (512 token)
    const truncated = clean.slice(0, 1500);
    const output = await pipe(truncated, {
      pooling: 'mean',
      normalize: true,
    });

    if (output && output.data) {
      return Array.from(output.data);
    }
  } catch (err) {
    console.warn('Error saat generateTextEmbedding:', err);
  }

  return null;
}
