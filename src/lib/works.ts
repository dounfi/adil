export interface Work {
  id: string;
  title: string;
  year: number;
  competition: string;
  institution: string;
  category: string;
  summary: string;
  keyphrases: string[];
  sourceUrl: string;
}

// Data contoh — bukan klaim tentang karya nyata.
export const WORKS: Work[] = [
  {
    id: "tutor-sebaya",
    title: "Tutorin: Platform Tutor Sebaya untuk Daerah Minim Guru",
    year: 2024,
    competition: "Lomba Inovasi Teknologi Pendidikan Nasional",
    institution: "Universitas Contoh Nusantara",
    category: "Pendidikan",
    summary:
      "Aplikasi yang menghubungkan siswa SMA di daerah minim guru dengan relawan tutor sebaya lewat video call terjadwal dan materi ringkas. Fokus pada mata pelajaran matematika dan sains dengan sistem pencocokan berdasarkan kurikulum.",
    keyphrases: ["tutor sebaya", "daerah minim guru", "video call", "pendidikan", "pencocokan kurikulum", "relawan"],
    sourceUrl: "https://example.com/karya/tutorin",
  },
  {
    id: "bank-sampah",
    title: "SampahQu: Bank Sampah Digital Berbasis RT",
    year: 2023,
    competition: "Kompetisi Aplikasi Lingkungan Hijau",
    institution: "Institut Teknologi Contoh",
    category: "Lingkungan",
    summary:
      "Aplikasi bank sampah digital yang mencatat setoran sampah warga per RT, mengonversi berat sampah menjadi poin yang bisa ditukar sembako. Dilengkapi jadwal penjemputan dan laporan bulanan untuk pengurus RT.",
    keyphrases: ["bank sampah", "poin reward", "penjemputan sampah", "lingkungan", "RT", "sembako"],
    sourceUrl: "https://example.com/karya/sampahqu",
  },
  {
    id: "deteksi-hoaks",
    title: "CekFakta AI: Deteksi Hoaks Bahasa Indonesia",
    year: 2024,
    competition: "Hackathon Media Digital",
    institution: "Universitas Contoh Digital",
    category: "Kecerdasan Buatan",
    summary:
      "Ekstensi browser yang menandai potensi hoaks pada artikel berbahasa Indonesia menggunakan model NLP. Memberi skor kepercayaan dan tautan ke sumber pembanding untuk setiap klaim yang terdeteksi.",
    keyphrases: ["deteksi hoaks", "NLP", "ekstensi browser", "skor kepercayaan", "bahasa Indonesia", "verifikasi fakta"],
    sourceUrl: "https://example.com/karya/cekfakta",
  },
  {
    id: "tani-pintar",
    title: "TaniPintar: Prediksi Harga Panen untuk Petani Kecil",
    year: 2022,
    competition: "Lomba Karya Tulis Ilmiah Pertanian",
    institution: "Universitas Contoh Agrikultur",
    category: "Pertanian",
    summary:
      "Aplikasi prediksi harga komoditas panen berbasis data historis pasar dan cuaca. Membantu petani kecil memutuskan waktu jual terbaik lewat notifikasi SMS sederhana.",
    keyphrases: ["prediksi harga", "petani", "data cuaca", "notifikasi SMS", "komoditas panen", "pasar"],
    sourceUrl: "https://example.com/karya/tanipintar",
  },
  {
    id: "konseling-sebaya",
    title: "TemanCerita: Konseling Sebaya Anonim untuk Remaja",
    year: 2024,
    competition: "Festival Inovasi Kesehatan Mental",
    institution: "Universitas Contoh Psikologi",
    category: "Kesehatan",
    summary:
      "Platform konseling sebaya anonim yang mempertemukan remaja dengan pendamping sebaya terlatih. Ada moderasi psikolog, tombol darurat, dan konten edukasi kesehatan mental harian.",
    keyphrases: ["konseling sebaya", "anonim", "kesehatan mental", "remaja", "pendamping terlatih", "moderasi"],
    sourceUrl: "https://example.com/karya/temancerita",
  },
  {
    id: "absensi-wajah",
    title: "Hadirin: Absensi Wajah Anti-Titip untuk Kampus",
    year: 2023,
    competition: "Kompetisi Sistem Informasi Nasional",
    institution: "Politeknik Contoh",
    category: "Kecerdasan Buatan",
    summary:
      "Sistem absensi berbasis pengenalan wajah dengan deteksi keaktifan (liveness) untuk mencegah titip absen. Terintegrasi dengan sistem akademik kampus dan rekap otomatis untuk dosen.",
    keyphrases: ["absensi", "pengenalan wajah", "liveness detection", "kampus", "rekap otomatis", "anti titip"],
    sourceUrl: "https://example.com/karya/hadirin",
  },
  {
    id: "umkm-kasir",
    title: "KasirKita: Aplikasi Kasir Offline untuk UMKM",
    year: 2022,
    competition: "Lomba Aplikasi UMKM Go Digital",
    institution: "Universitas Contoh Bisnis",
    category: "Bisnis",
    summary:
      "Aplikasi kasir yang bekerja penuh tanpa internet untuk warung dan toko kecil. Sinkronisasi otomatis saat online, laporan laba harian, dan pencatatan utang pelanggan.",
    keyphrases: ["kasir", "offline", "UMKM", "laporan laba", "sinkronisasi", "warung"],
    sourceUrl: "https://example.com/karya/kasirkita",
  },
  {
    id: "donor-darah",
    title: "DarahKu: Pencocokan Donor Darah Darurat",
    year: 2024,
    competition: "Hackathon Kesehatan Nasional",
    institution: "Universitas Contoh Medika",
    category: "Kesehatan",
    summary:
      "Aplikasi yang menghubungkan pasien butuh transfusi darurat dengan pendonor golongan darah cocok di radius terdekat. Notifikasi real-time dan verifikasi lewat PMI setempat.",
    keyphrases: ["donor darah", "golongan darah", "darurat", "radius terdekat", "notifikasi real-time", "transfusi"],
    sourceUrl: "https://example.com/karya/darahku",
  },
  {
    id: "belajar-isyarat",
    title: "IsyaratKu: Belajar Bahasa Isyarat dengan Kamera",
    year: 2023,
    competition: "Lomba Teknologi Inklusif",
    institution: "Institut Contoh Inklusi",
    category: "Pendidikan",
    summary:
      "Aplikasi belajar bahasa isyarat Indonesia (BISINDO) yang menilai gerakan tangan pengguna lewat kamera. Modul bertingkat dari alfabet sampai percakapan, dengan umpan balik visual langsung.",
    keyphrases: ["bahasa isyarat", "BISINDO", "kamera", "umpan balik visual", "inklusif", "tuli"],
    sourceUrl: "https://example.com/karya/isyaratku",
  },
  {
    id: "antre-puskesmas",
    title: "AntreSehat: Antrean Online Puskesmas",
    year: 2022,
    competition: "Kompetisi Smart City",
    institution: "Universitas Contoh Kota",
    category: "Kesehatan",
    summary:
      "Sistem antrean online puskesmas dengan estimasi waktu tunggu, pendaftaran via WhatsApp, dan prioritas lansia. Mengurangi penumpukan pasien di ruang tunggu.",
    keyphrases: ["antrean online", "puskesmas", "estimasi waktu", "WhatsApp", "prioritas lansia", "pendaftaran"],
    sourceUrl: "https://example.com/karya/antresehat",
  },
  {
    id: "peta-banjir",
    title: "SiagaBanjir: Peta Rawan Banjir Crowdsourced",
    year: 2024,
    competition: "Lomba Inovasi Kebencanaan",
    institution: "Universitas Contoh Geografi",
    category: "Lingkungan",
    summary:
      "Peta interaktif titik rawan banjir yang diisi laporan warga dengan foto dan ketinggian air. Data diverifikasi komunitas dan dibagikan ke BPBD sebagai peringatan dini.",
    keyphrases: ["peta banjir", "crowdsourced", "laporan warga", "peringatan dini", "BPBD", "verifikasi komunitas"],
    sourceUrl: "https://example.com/karya/siagabanjir",
  },
  {
    id: "magang-matcher",
    title: "MagangMatch: Pencocokan Magang Kampus-Industri",
    year: 2023,
    competition: "Kompetisi Startup Kampus",
    institution: "Universitas Contoh Karier",
    category: "Bisnis",
    summary:
      "Platform pencocokan magang yang memasangkan mahasiswa dengan lowongan industri berdasarkan skill, portofolio, dan preferensi lokasi. Ada tracking progres magang untuk dosen pembimbing.",
    keyphrases: ["magang", "pencocokan skill", "portofolio", "industri", "mahasiswa", "tracking progres"],
    sourceUrl: "https://example.com/karya/magangmatch",
  },
];

export const EXAMPLE_IDEA = {
  title: "Aplikasi tutor sebaya buat daerah minim guru",
  description:
    "Aplikasi yang menghubungkan siswa di daerah minim guru dengan relawan tutor sebaya lewat video call terjadwal. Ada pencocokan berdasarkan kurikulum dan materi ringkas buat matematika dan sains.",
};
