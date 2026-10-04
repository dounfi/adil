/**
 * Pembersihan Teks Berkas Proposal (PDF / DOCX / TXT)
 * Dilengkapi integrasi Gemini AI dengan mekanisme Multi-API Key Fallback
 * untuk mengekstrak ide inti proposal tanpa sampah daftar isi, bab, dan nomor halaman.
 */

// Daftar Model Gemini yang dicoba berurutan jika ada model yang sedang sibuk atau deprecated
const GEMINI_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash',
];

/**
 * Mengambil daftar API Key Gemini dari environment variable.
 * Mendukung multiple keys dari VITE_GEMINI_API_KEYS (koma-terpisah)
 * dan VITE_GEMINI_API_KEY tunggal.
 */
export function getGeminiApiKeys(): string[] {
    const keys: string[] = [];

    try {
        // 1. Cek VITE_GEMINI_API_KEYS (daftar dipisah koma)
        const envMulti =
            typeof import.meta !== 'undefined' && import.meta.env
                ? (import.meta.env as Record<string, string>)['VITE_GEMINI_API_KEYS']
                : undefined;
        if (typeof envMulti === 'string' && envMulti.trim()) {
            envMulti.split(',').forEach((k) => {
                const trimmed = k.trim();
                if (trimmed && !keys.includes(trimmed)) keys.push(trimmed);
            });
        }

        // 2. Cek VITE_GEMINI_API_KEY (kunci utama)
        const envSingle =
            typeof import.meta !== 'undefined' && import.meta.env
                ? (import.meta.env as Record<string, string>)['VITE_GEMINI_API_KEY']
                : undefined;
        if (typeof envSingle === 'string' && envSingle.trim()) {
            const trimmed = envSingle.trim();
            if (!keys.includes(trimmed)) keys.push(trimmed);
        }

        // 3. Fallback jika berjalan di lingkungan Node.js (misal test / SSR)
        if (typeof process !== 'undefined' && process.env) {
            const nodeMulti = process.env['VITE_GEMINI_API_KEYS'] || process.env['GEMINI_API_KEYS'];
            if (nodeMulti) {
                nodeMulti.split(',').forEach((k) => {
                    const trimmed = k.trim();
                    if (trimmed && !keys.includes(trimmed)) keys.push(trimmed);
                });
            }
            const nodeSingle = process.env['VITE_GEMINI_API_KEY'] || process.env['GEMINI_API_KEY'];
            if (nodeSingle && !keys.includes(nodeSingle.trim())) {
                keys.push(nodeSingle.trim());
            }
        }
    } catch (err) {
        console.warn('Gagal membaca API Key dari environment:', err);
    }

    return keys;
}

/**
 * Panggilan REST API ke Google Generative Language API.
 * Pendekatan native fetch ini bekerja 100% mulus di browser client-side,
 * minim dependensi runtime dan mendukung timeout secara presisi.
 */
async function callGeminiApi(
    apiKey: string,
    model: string,
    prompt: string,
    timeoutMs = 15000
): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1024,
            },
        }),
        signal: AbortSignal.timeout(timeoutMs),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMsg = data?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(errorMsg);
    }

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
        throw new Error('Respon Gemini tidak memuat kandidat teks.');
    }

    return generatedText.trim();
}

/**
 * Menggunakan Gemini AI untuk mengekstrak IDE INTI dari teks berkas proposal mentah.
 * Dilengkapi failover multi-API key: jika Key #1 kehabisan kuota atau bermasalah,
 * otomatis beralih ke Key #2, #3, dst.
 *
 * Jika seluruh key habis atau offline, otomatis fallback ke pembersihan lokal agar tidak crash.
 */
export async function extractIdeaWithGemini(
    rawPdfText: string,
    onStatusUpdate?: (status: string) => void
): Promise<string> {
    if (!rawPdfText || rawPdfText.trim().length < 30) {
        return rawPdfText || '';
    }

    const apiKeys = getGeminiApiKeys();

    // Jika tidak ada API Key yang dikonfigurasi, gunakan pembersihan lokal
    if (apiKeys.length === 0) {
        console.warn('Tidak ada VITE_GEMINI_API_KEY yang ditemukan. Menggunakan pembersihan teks lokal.');
        return cleanUserPdfText(rawPdfText);
    }

    // Siapkan teks mentah terpotong (max ~12.000 karakter agar cepat dan hemat token)
    const slicedRawText = rawPdfText.slice(0, 12000);

    const prompt = `
Kamu adalah sistem penilai proposal karya dan inovasi lomba. Tugasmu adalah mengekstrak IDE INTI dari teks proposal di bawah ini.
Abaikan seluruh daftar isi, kata pengantar, nomor bab (seperti 1.1, 2.1.2), lembar pengesahan, biodata tim, nomor halaman, dan struktur formalitas dokumen.

Format Output Ringkas dan Padat:
- Judul & Solusi Utama: [Tuliskan judul dan solusi utama dalam 1-2 kalimat]
- Ringkasan Ide Inti: [Jelaskan apa masalahnya, cara kerja solusi, dan teknologi yang dipakai dalam 2-4 kalimat]
- Kata Kunci Utama: [Tuliskan 5-8 kata kunci konsep utama dipisahkan koma]

Teks Proposal Mentah:
${slicedRawText}
`.trim();

    // Looping fallback antar API Key (seperti referensi Python user)
    for (let keyIdx = 0; keyIdx < apiKeys.length; keyIdx++) {
        const key = apiKeys[keyIdx];
        if (!key) continue;

        // Coba model yang tersedia
        for (const model of GEMINI_MODELS) {
            try {
                if (onStatusUpdate) {
                    onStatusUpdate("Mengekstrak dan memproses ide inti dokumen...");
                }

                const aiResponse = await callGeminiApi(key, model, prompt);
                if (aiResponse && aiResponse.length > 30) {
                    console.log(`[ADIL AI] Ekstraksi ide berhasil via model ${model} (Key #${keyIdx + 1})`);
                    return aiResponse;
                }
            } catch (err: unknown) {
                const errMsg = err instanceof Error ? err.message : String(err);

                // Jika error karena model tidak ditemukan/deprecated, coba model berikutnya di key yang sama
                if (errMsg.includes('not found') || errMsg.includes('404')) {
                    continue;
                }

                // Jika error kuota (429/RESOURCE_EXHAUSTED) atau key invalid, log dan lanjut ke key cadangan berikutnya
                console.warn(
                    `[ADIL AI] Key #${keyIdx + 1} bermasalah (${errMsg}), mencoba API Key berikutnya...`
                );
                break; // Lanjut ke key berikutnya
            }
        }
    }

    console.warn(
        '[ADIL AI] Semua API Key telah mencapai batas kuota atau terjadi kendala jaringan. Menggunakan pembersihan teks lokal.'
    );

    // Fallback lokal jika semua API Key gagal / kuota habis
    return cleanUserPdfText(rawPdfText);
}

/**
 * Pembersihan lokal rule-based (Fallback aman tanpa internet / tanpa AI)
 */
export function cleanUserPdfText(rawText: string): string {
    if (!rawText) return '';

    let cleaned = rawText;

    // 1. Potong Halaman Sampul & Front-matter
    const startKeywords = [
        'ABSTRAK',
        'RINGKASAN',
        'LATAR BELAKANG',
        'BAB 1',
        'BAB I',
        'PENDAHULUAN',
    ];
    for (const kw of startKeywords) {
        const idx = cleaned.toUpperCase().indexOf(kw);
        if (idx !== -1 && cleaned.length - idx > 100) {
            cleaned = cleaned.substring(idx);
            break;
        }
    }

    // 2. Hapus Pola Titik-Titik Daftar Isi (contoh: "............. 12" atau "............ ii")
    cleaned = cleaned.replace(/\.{3,}\s*[\d+a-zA-Z]+/g, ' ');

    // 3. Filter Kata Formal/Noise Template Proposal
    const proposalNoise = [
        'proposal',
        'tahap',
        'ditulis oleh',
        'disusun oleh',
        'daftar isi',
        'daftar gambar',
        'daftar tabel',
        'bab',
        'pendahuluan',
        'universitas',
        'institut',
        'subtema',
        'bidang',
        'lomba',
        'halaman',
        'nim',
        'nidn',
        'pembimbing',
        'fakultas',
        'program studi',
        'jurusan',
        'logo',
    ];

    const noiseRegex = new RegExp(`\\b(${proposalNoise.join('|')})\\b`, 'gi');
    cleaned = cleaned.replace(noiseRegex, ' ');

    // 4. Bersihkan Karakter Khusus & Spasi Berlebih
    return cleaned
        .replace(/[^a-zA-Z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Mencoba mengekstrak judul proposal dari format keluaran Gemini AI
 */
export function extractTitleFromGeminiText(aiText: string): string | null {
    if (!aiText) return null;
    const match = aiText.match(/(?:Judul & Solusi Utama|Judul Proposal|Judul Solusi|Judul)\s*:\s*([^\n\r]+)/i);
    if (match && match[1]) {
        const raw = match[1].trim().replace(/^[-*•]\s*/, '');
        const firstSentence = (raw.split(/[.?!]/)[0] ?? "").trim();
        if (firstSentence.length >= 5 && firstSentence.length <= 150) {
            return firstSentence;
        }
        if (raw.length >= 5 && raw.length <= 150) {
            return raw;
        }
    }
    return null;
}