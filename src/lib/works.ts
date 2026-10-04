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

// 69 Karya Resmi dari Arsip Pemenang Publik (Gemastik, PIMNAS, LIDM)
export const WORKS: Work[] = [
  {
    "id": "W001",
    "title": "Penugasan Otomatis Laporan Masyarakat pada Platform Cepat Respon Masyarakat Menggunakan Early Fusion Multimodal Transformer",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Penambangan Data",
    "institution": "Universitas Indonesia",
    "category": "APP",
    "summary": "Model yang membaca teks dan gambar dari laporan warga di platform CRM Jakarta, lalu otomatis menentukan instansi yang harus menanganinya.",
    "keyphrases": [
      "lapor warga",
      "tugas otomatis",
      "teks",
      "klasifikasi multimodal",
      "platform crm",
      "baca teks",
      "crm jakarta",
      "layan publik",
      "model",
      "tangan",
      "baca",
      "transformer",
      "lapor masyarakat"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W002",
    "title": "Deteksi Dini Tumor Otak Berdasarkan Citra MRI",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Penambangan Data",
    "institution": "Universitas Indonesia",
    "category": "APP",
    "summary": "Model Computer Vision menggunakan Convolutional Neural Network untuk membantu dokter radiologi mendeteksi area tumor pada hasil pindaian MRI otak secara presisi.",
    "keyphrases": [
      "tumor otak",
      "citra mri",
      "deteksi tumor",
      "computer vision",
      "convolutional neural network",
      "cnn",
      "radiologi",
      "pindaian otak",
      "machine learning kesehatan",
      "deep learning"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W003",
    "title": "Analisis Kerusakan Wilayah Akibat Bencana Berbasis Citra Satelit Menggunakan Algoritma ViT-S16 dan BiT-M",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Penambangan Data",
    "institution": "Universitas Telkom",
    "category": "APP",
    "summary": "Menilai tingkat kerusakan wilayah setelah bencana dari citra satelit dengan dua model visi komputer.",
    "keyphrases": [
      "kerusakan bencana",
      "citra satelit",
      "computer vision",
      "vision transformer",
      "ViT",
      "klasifikasi kerusakan",
      "bencana alam",
      "penilaian wilayah",
      "penginderaan jauh"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W004",
    "title": "Pemrosesan Akurat Klasifikasi Laporan Masyarakat pada JAKI melalui Pembelajaran Berkelanjutan berbasis Transformer",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Penambangan Data",
    "institution": "Universitas Indonesia",
    "category": "APP",
    "summary": "Mengklasifikasikan laporan warga di aplikasi JAKI dengan model transformer yang terus diperbarui.",
    "keyphrases": [
      "laporan masyarakat",
      "klasifikasi teks",
      "JAKI",
      "transformer",
      "pembelajaran berkelanjutan",
      "layanan publik",
      "pengaduan warga",
      "platform pengaduan",
      "natural language processing",
      "nlp",
      "penugasan otomatis"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W005",
    "title": "Ainetra: Asisten Cerdas Tunanetra berbasis Voice User Interface (VUI) dan Realtime Video to Voice Recognition guna Pemenuhan Aksesibilitas Tunanetra",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Desain Pengalaman Pengguna",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "APP",
    "summary": "Rancangan asisten suara untuk tunanetra yang mengubah video real-time menjadi ucapan.",
    "keyphrases": [
      "tunanetra",
      "aksesibilitas",
      "voice user interface",
      "video ke suara",
      "asisten cerdas",
      "realtime",
      "vui",
      "disabilitas visual",
      "pengenalan objek",
      "ui ux inklusif"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W006",
    "title": "GluCare: Aplikasi Penanganan Diabetes Tipe 2 terintegrasi Non-invasive Wearable Glucose Monitor untuk Mendukung Program Pengelolaan Penyakit Kronis",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Desain Pengalaman Pengguna",
    "institution": "Universitas Brawijaya",
    "category": "APP",
    "summary": "Rancangan aplikasi pengelolaan diabetes tipe 2 yang terhubung ke alat pemantau gula darah tanpa jarum.",
    "keyphrases": [
      "diabetes",
      "wearable",
      "pemantauan glukosa",
      "penyakit kronis",
      "non-invasive",
      "gula darah",
      "monitoring kesehatan",
      "pengelolaan penyakit",
      "aplikasi kesehatan",
      "sensor medis"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W007",
    "title": "SatuHati: Aplikasi untuk Meningkatkan Partisipasi dan Kesadaran Suami dalam Mendukung Kehamilan sebagai Upaya Menurunkan Angka Kematian Ibu Kelahiran Pertama",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Desain Pengalaman Pengguna",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "APP",
    "summary": "Rancangan aplikasi yang mengajak suami lebih terlibat selama kehamilan pertama istri.",
    "keyphrases": [
      "kehamilan",
      "peran suami",
      "kematian ibu",
      "kesehatan ibu",
      "partisipasi suami",
      "kehamilan pertama",
      "angka kematian ibu",
      "edukasi kehamilan",
      "aplikasi kesehatan",
      "akm"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W008",
    "title": "Nusa Food: Optimalisasi Transparansi School Meal Program Melalui Design Pengalaman Pengguna",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Desain Pengalaman Pengguna",
    "institution": "Universitas Indonesia",
    "category": "APP",
    "summary": "Rancangan pengalaman pengguna agar program makan di sekolah lebih transparan.",
    "keyphrases": [
      "makan sekolah",
      "transparansi",
      "ux design",
      "pendidikan",
      "school meal program",
      "gizi siswa",
      "pengalaman pengguna",
      "akuntabilitas",
      "digitalisasi program sekolah"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W009",
    "title": "SISRI (Surabaya Integrated Smart Road Infrastructure): Solusi Lalu Lintas Cerdas untuk Mencapai Smart Transport dan Smart Governance di Kota Surabaya",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Kota Cerdas",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "APP",
    "summary": "Konsep infrastruktur jalan terpadu untuk lalu lintas cerdas di Surabaya.",
    "keyphrases": [
      "kota cerdas",
      "lalu lintas",
      "infrastruktur jalan",
      "surabaya",
      "smart city",
      "transportasi cerdas",
      "manajemen lalu lintas",
      "iot kota",
      "smart governance"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W010",
    "title": "AHMS (Ambulance Health Monitoring System)",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Kota Cerdas",
    "institution": "Institut Teknologi Bandung",
    "category": "APP",
    "summary": "Sistem pemantauan kondisi kesehatan pasien di dalam ambulans.",
    "keyphrases": [
      "ambulans",
      "pemantauan kesehatan",
      "kota cerdas",
      "monitoring pasien",
      "sensor vital",
      "iot medis",
      "gawat darurat",
      "smart health"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W011",
    "title": "Implementasi Smartpole Terintegrasi Sebagai Solusi Cerdas Sistem Informasi Publik dan Early Warning System di Kawasan Pariwisata dan Ekonomi Khusus Kota Denpasar",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Kota Cerdas",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "APP",
    "summary": "Tiang pintar yang menyajikan informasi publik dan peringatan dini di kawasan wisata Denpasar.",
    "keyphrases": [
      "smartpole",
      "informasi publik",
      "peringatan dini",
      "pariwisata",
      "early warning system",
      "iot kota",
      "kawasan wisata",
      "denpasar",
      "infrastruktur cerdas"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W012",
    "title": "LAPORIN!: One-Stop-Solution Pengaduan Masalah, Pengaduan Gawat Darurat, dan Pemantauan Masyarakat dengan Klasifikasi Masalah Berbasis AI untuk Pelayanan Publik yang Lebih Efektif dan Efisien",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Kota Cerdas",
    "institution": "Universitas Telkom",
    "category": "APP",
    "summary": "Satu aplikasi untuk pengaduan warga dan keadaan darurat, dengan klasifikasi masalah otomatis oleh AI.",
    "keyphrases": [
      "pengaduan masyarakat",
      "layanan publik",
      "klasifikasi ai",
      "gawat darurat",
      "laporan warga",
      "satu pintu",
      "pengaduan darurat",
      "platform crm",
      "kota cerdas",
      "penanganan masalah"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W013",
    "title": "Non-Contact Vital Sign Monitoring Based on Thermal Imaging Using Spatio-Temporal Filtering",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Karya Tulis Ilmiah TIK",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "ESSAY",
    "summary": "Pemantauan tanda vital tanpa kontak fisik dengan citra termal dan penyaringan ruang-waktu.",
    "keyphrases": [
      "tanda vital",
      "citra termal",
      "pemantauan tanpa kontak",
      "thermal imaging",
      "spatio-temporal filtering",
      "monitoring non-kontak",
      "karya tulis ilmiah",
      "sensor suhu"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W014",
    "title": "Penerjemahan Sinyal Elektroensefalogram ke Kata Menggunakan Low Dimensional Computing",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Karya Tulis Ilmiah TIK",
    "institution": "Universitas Indonesia",
    "category": "ESSAY",
    "summary": "Menerjemahkan sinyal otak (EEG) menjadi kata dengan komputasi berdimensi rendah.",
    "keyphrases": [
      "eeg",
      "sinyal otak",
      "terjemahan ke kata",
      "low dimensional computing",
      "elektroensefalogram",
      "brain computer interface",
      "bci",
      "komputasi dimensi rendah"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W015",
    "title": "ATRU-NET: Attention Transformer U-Net untuk Segmentasi Tumor Otak Berdasarkan Citra MRI",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Karya Tulis Ilmiah TIK",
    "institution": "Universitas Gadjah Mada",
    "category": "ESSAY",
    "summary": "Model segmentasi tumor otak pada citra MRI dengan arsitektur U-Net dan attention transformer.",
    "keyphrases": [
      "tumor otak",
      "segmentasi",
      "mri",
      "u-net",
      "transformer",
      "attention mechanism",
      "citra medis",
      "deep learning",
      "arsitektur neural network"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W016",
    "title": "Pengembangan Sistem Model Hybrid CNN sebagai Peningkatan Akurasi Deteksi Tumor Otak dengan Ekstraksi Fitur dan Ensemble Learning pada Citra MRI",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Karya Tulis Ilmiah TIK",
    "institution": "Universitas Negeri Semarang",
    "category": "ESSAY",
    "summary": "Model hybrid CNN dengan ensemble learning untuk mendeteksi tumor otak dari citra MRI.",
    "keyphrases": [
      "tumor otak",
      "cnn hybrid",
      "ensemble learning",
      "mri",
      "ekstraksi fitur",
      "deteksi tumor",
      "deep learning",
      "klasifikasi citra medis"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W017",
    "title": "Metode Optimasi Cerdas untuk Jalur Evakuasi Bencana Menggunakan Ant Colony Optimization (ACO)",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Karya Tulis Ilmiah TIK",
    "institution": "Universitas Sulawesi Barat",
    "category": "ESSAY",
    "summary": "Karya tulis tentang mencari jalur evakuasi bencana dengan algoritma koloni semut.",
    "keyphrases": [
      "jalur evakuasi",
      "bencana",
      "ant colony optimization",
      "optimasi",
      "aco",
      "algoritma koloni semut",
      "mitigasi bencana",
      "pencarian jalur optimal"
    ],
    "sourceUrl": "https://www.unsulbarnews.com/sempat-down-tim-unsulbar-raih-the-most-inspiring-team-gemastik-2024"
  },
  {
    "id": "W018",
    "title": "NaviGo: Solusi Advis Hukum Terpadu Kreator dan UMKM Berbasis AI",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Perangkat Lunak",
    "institution": "Universitas Indonesia",
    "category": "APP",
    "summary": "Platform berbasis AI yang memberi arahan hukum bagi kreator konten dan pelaku UMKM.",
    "keyphrases": [
      "nasihat hukum",
      "kreator",
      "umkm",
      "ai",
      "legal tech",
      "advis hukum",
      "kekayaan intelektual",
      "kontrak kreator",
      "platform hukum",
      "bantuan hukum digital"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W019",
    "title": "BISABILITAS: Pengembangan Aplikasi Mobile dan Ekstensi Website untuk Mempermudah Aksesibilitas Internet bagi Penyandang Disabilitas",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Perangkat Lunak",
    "institution": "Universitas Telkom",
    "category": "APP",
    "summary": "Aplikasi seluler dan ekstensi peramban untuk memudahkan penyandang disabilitas mengakses internet.",
    "keyphrases": [
      "disabilitas",
      "aksesibilitas web",
      "ekstensi browser",
      "aplikasi mobile",
      "penyandang disabilitas",
      "inklusif digital",
      "screen reader",
      "teks ke suara",
      "ux inklusif"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W020",
    "title": "Aura: Sahabat Fashion bagi Para Tunanetra dengan Teknologi AI dan RFID Berbasis Aplikasi Mobile",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Perangkat Lunak",
    "institution": "Universitas Bina Nusantara",
    "category": "APP",
    "summary": "Aplikasi yang membantu tunanetra memilih pakaian memakai AI dan penanda RFID.",
    "keyphrases": [
      "tunanetra",
      "fashion",
      "rfid",
      "ai",
      "aplikasi mobile",
      "pengenalan pakaian",
      "asisten visual",
      "aksesibilitas",
      "disabilitas visual"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W021",
    "title": "CODINGIN: Website Pembelajaran Coding Berbasis Blok dengan Unsur Gamifikasi guna Meningkatkan Minat dan Kemampuan Digital Talenta Indonesia",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Perangkat Lunak",
    "institution": "Universitas Hasanuddin",
    "category": "APP",
    "summary": "Situs belajar coding berbasis blok yang memakai gamifikasi agar peserta lebih tertarik belajar.",
    "keyphrases": [
      "belajar coding",
      "blok",
      "gamifikasi",
      "pendidikan digital",
      "scratch",
      "block-based programming",
      "literasi digital",
      "platform edukasi",
      "minat belajar",
      "talenta digital"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W022",
    "title": "Embedded Systems sebagai Virtual Assistant bagi Penyandang Tuna Netra dan Demensia Berbasis Generative AI dan Framework RAViS (Resource Aware Video Streaming)",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Piranti Cerdas, Sistem Benam dan IoT",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "APP",
    "summary": "Asisten virtual pada perangkat tertanam untuk tunanetra dan penderita demensia, memakai AI generatif dan streaming video hemat sumber daya.",
    "keyphrases": [
      "tunanetra",
      "demensia",
      "asisten virtual",
      "generative ai",
      "embedded system",
      "streaming video",
      "perangkat tertanam",
      "aksesibilitas",
      "iot",
      "ai generatif"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W023",
    "title": "GAMAPALAPA (Gadjah Mada Payload for Aerial Vehicle Application): Deteksi Radiasi Menggunakan Fotogrametri Berbasis IoT dengan UAV untuk Mendukung Kawasan Berkelanjutan",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Piranti Cerdas, Sistem Benam dan IoT",
    "institution": "Universitas Gadjah Mada",
    "category": "APP",
    "summary": "Muatan drone untuk mendeteksi radiasi lewat fotogrametri berbasis IoT.",
    "keyphrases": [
      "deteksi radiasi",
      "drone uav",
      "fotogrametri",
      "iot",
      "kawasan berkelanjutan",
      "penginderaan udara",
      "lingkungan",
      "sensor radiasi"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W024",
    "title": "\"MAPS TRACKING\" Navigasi Titik Point Lokasi untuk Penanggulangan Pasca Bencana",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Piranti Cerdas, Sistem Benam dan IoT",
    "institution": "Universitas Gunadarma",
    "category": "APP",
    "summary": "Alat navigasi titik lokasi untuk membantu penanganan setelah bencana.",
    "keyphrases": [
      "navigasi lokasi",
      "pasca bencana",
      "pelacakan",
      "gps",
      "titik evakuasi",
      "iot bencana",
      "penanggulangan bencana"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W025",
    "title": "Kursi Roda dengan Sistem Kontrol Berbasis Gerakan Mata dengan Algoritma CNN sebagai Solusi Kemudahan Mobilisasi Difabel",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Piranti Cerdas, Sistem Benam dan IoT",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "APP",
    "summary": "Kursi roda yang dikendalikan lewat gerakan mata dengan model CNN.",
    "keyphrases": [
      "kursi roda",
      "gerakan mata",
      "cnn",
      "difabel",
      "kontrol mata",
      "eye tracking",
      "mobilitas disabilitas",
      "embedded system",
      "asisten fisik"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W026",
    "title": "Financial Streams",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Aplikasi Permainan",
    "institution": "Institut Teknologi Bandung",
    "category": "APP",
    "summary": "Permainan simulasi pengelolaan keuangan pribadi dengan alur cerita interaktif.",
    "keyphrases": [
      "keuangan",
      "simulasi",
      "permainan edukasi",
      "literasi keuangan",
      "game edukasi",
      "manajemen uang"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W027",
    "title": "Pulang",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Aplikasi Permainan",
    "institution": "Universitas Telkom",
    "category": "APP",
    "summary": "Permainan bertema perjalanan pulang kampung dengan nuansa budaya dan nostalgia Indonesia.",
    "keyphrases": [
      "budaya indonesia",
      "permainan petualangan",
      "nostalgia",
      "game naratif"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W028",
    "title": "DETECTIVE UCING: THE HOLLOW WOODS",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Aplikasi Permainan",
    "institution": "Universitas Indonesia",
    "category": "APP",
    "summary": "Game detektif bertema hutan misterius dengan teka-teki dan pengungkapan kasus.",
    "keyphrases": [
      "game detektif",
      "petualangan",
      "teka-teki",
      "misteri",
      "game android"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W029",
    "title": "Segel",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Aplikasi Permainan",
    "institution": "Universitas Brawijaya",
    "category": "APP",
    "summary": "Permainan bertema segel warisan budaya dengan elemen strategi dan eksplorasi.",
    "keyphrases": [
      "budaya",
      "game strategi",
      "eksplorasi",
      "warisan",
      "game mobile"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W030",
    "title": "IUSTITIA: Solusi Cerdas untuk Masalah Hukum Anda",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Bisnis TIK",
    "institution": "Universitas Indonesia",
    "category": "BUSINESS_PLAN",
    "summary": "Ide bisnis layanan cerdas untuk membantu orang menangani masalah hukum.",
    "keyphrases": [
      "masalah hukum",
      "layanan hukum",
      "bisnis tik",
      "konsultasi hukum",
      "legal ai",
      "bantuan hukum digital",
      "legaltech",
      "akses keadilan"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W031",
    "title": "GLUCO SCAN: Jaga Konsumsi Gula Anda, Hidup Sehat Bersama!",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Bisnis TIK",
    "institution": "Universitas Indonesia",
    "category": "BUSINESS_PLAN",
    "summary": "Ide bisnis untuk membantu orang memantau konsumsi gula harian.",
    "keyphrases": [
      "konsumsi gula",
      "kesehatan",
      "bisnis tik",
      "pemindaian gula",
      "diet sehat",
      "nutrisi",
      "hidup sehat",
      "aplikasi kesehatan"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W032",
    "title": "DisaBisa: Platform Inklusif Berbasis AI dengan Pelatihan dan Penyaluran Kerja Langsung untuk Lima Kategori Penyandang Disabilitas",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Bisnis TIK",
    "institution": "Universitas Brawijaya",
    "category": "BUSINESS_PLAN",
    "summary": "Platform yang memberi pelatihan dan menyalurkan kerja bagi penyandang disabilitas dengan bantuan AI.",
    "keyphrases": [
      "disabilitas",
      "pelatihan kerja",
      "penyaluran kerja",
      "inklusif",
      "ai",
      "platform kerja inklusif",
      "lima kategori disabilitas",
      "ketenagakerjaan",
      "pemberdayaan disabilitas"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W033",
    "title": "DRAFTER PRO: Platform Drafter 3D Pertama di Indonesia",
    "year": 2024,
    "competition": "Gemastik XVII 2024 - Pengembangan Bisnis TIK",
    "institution": "Universitas Internasional Semen Indonesia",
    "category": "BUSINESS_PLAN",
    "summary": "Platform jasa drafter 3D untuk kebutuhan desain teknik.",
    "keyphrases": [
      "drafter 3D",
      "desain teknik",
      "platform jasa"
    ],
    "sourceUrl": "https://si.ft.unesa.ac.id/post/peringkat-kompetisi-gemastik"
  },
  {
    "id": "W034",
    "title": "TB Vector",
    "year": 2025,
    "competition": "Gemastik XVIII 2025 - Pengembangan Perangkat Lunak",
    "institution": "Institut Teknologi Sepuluh Nopember",
    "category": "APP",
    "summary": "Sistem pemantauan suara yang mengenali batuk TB dan melacak asal suaranya secara real-time di ruang publik.",
    "keyphrases": [
      "tuberkulosis",
      "deteksi batuk",
      "pemantauan akustik",
      "machine learning",
      "ruang publik"
    ],
    "sourceUrl": "https://www.its.ac.id/id/inovasi-tb-vector-membawa-tim-doalert-its-meraih-kemenangan-di-gemastik-2025/"
  },
  {
    "id": "W035",
    "title": "TumbuhKeun!: Pot Tray Biodegradable Berperforasi Kaya Nutrisi Berbasis Jerami Padi, Biochar, dan Kompos Eceng Gondok untuk Efisiensi Transplantasi Tanaman",
    "year": 2025,
    "competition": "PIMNAS ke-38 - PKM-K",
    "institution": "Universitas Padjadjaran",
    "category": "OTHER",
    "summary": "Wadah semai yang bisa terurai dan mengandung nutrisi dari limbah pertanian, supaya pemindahan tanaman lebih efisien.",
    "keyphrases": [
      "pot tray biodegradable",
      "jerami padi",
      "biochar",
      "eceng gondok",
      "transplantasi"
    ],
    "sourceUrl": "https://gentra.unpad.ac.id/2025/11/28/unpad-raih-1-medali-emas-1-perak-dan-1-perunggu-di-pimnas-38/"
  },
  {
    "id": "W036",
    "title": "Cardioguard",
    "year": 2025,
    "competition": "PIMNAS ke-38 - PKM-KC",
    "institution": "Universitas Gadjah Mada",
    "category": "OTHER",
    "summary": "Perangkat wearable berbasis AI untuk mendeteksi dini risiko henti jantung.",
    "keyphrases": [
      "henti jantung",
      "wearable",
      "deteksi dini",
      "AI",
      "kesehatan"
    ],
    "sourceUrl": "https://jteti.ugm.ac.id/2026/01/12/inovasi-cardioguard-antarkan-mahasiswa-dteti-raih-emas-dan-perak-pimnas-38/"
  },
  {
    "id": "W037",
    "title": "EnviroBlock: Batako Interior dari Sampah Plastik dengan Agregat Limbah Sekam Padi dan Oli Bekas Peminimalisir Dampak Gempa Bumi",
    "year": 2024,
    "competition": "PIMNAS ke-37 - PKM-K",
    "institution": "Universitas Gadjah Mada",
    "category": "OTHER",
    "summary": "Batako interior dari sampah plastik, sekam padi, dan oli bekas yang dirancang untuk mengurangi dampak gempa.",
    "keyphrases": [
      "batako",
      "sampah plastik",
      "sekam padi",
      "oli bekas",
      "gempa"
    ],
    "sourceUrl": "https://tf.ugm.ac.id/2024/11/25/dtntf-pimnas-37"
  },
  {
    "id": "W038",
    "title": "Inovasi Pembelajaran Aksara Jawa dengan Permainan Edukatif Digital berbasis Augmented Reality pada Peserta Didik SMP Negeri 1 Nglipar",
    "year": 2024,
    "competition": "PIMNAS ke-37 - PKM-PM",
    "institution": "Universitas Gadjah Mada",
    "category": "OTHER",
    "summary": "Permainan edukatif digital berbasis augmented reality untuk mengajarkan aksara Jawa kepada siswa SMP.",
    "keyphrases": [
      "aksara Jawa",
      "augmented reality",
      "permainan edukatif",
      "pembelajaran"
    ],
    "sourceUrl": "https://tf.ugm.ac.id/2024/11/25/dtntf-pimnas-37"
  },
  {
    "id": "W039",
    "title": "NALARIA (Navigasi Belajar Siaga Bencana): Edutainment Bencana Alam untuk Anak Sekolah Dasar",
    "year": 2024,
    "competition": "PIMNAS ke-37 - PKM-PM",
    "institution": "Universitas Ahmad Dahlan",
    "category": "OTHER",
    "summary": "Edutainment untuk menumbuhkan kesadaran bencana alam pada siswa SD di daerah rawan bencana lewat cara yang menyenangkan.",
    "keyphrases": [
      "siaga bencana",
      "edutainment",
      "anak SD",
      "pendidikan"
    ],
    "sourceUrl": "https://news.uad.ac.id/?p=28144"
  },
  {
    "id": "W040",
    "title": "E-Collect",
    "year": 2024,
    "competition": "Digital Business Competition 2024 (INSTIKI)",
    "institution": "Primakara University",
    "category": "BUSINESS_PLAN",
    "summary": "Situs yang membantu pengelola sampah organik mendapatkan bahan baku, dengan hadiah bagi orang yang menukarkan sampahnya.",
    "keyphrases": [
      "sampah organik",
      "tukar sampah",
      "reward",
      "bisnis digital",
      "pengolahan sampah",
      "circular economy",
      "insentif limbah",
      "daur ulang"
    ],
    "sourceUrl": "https://primakara.ac.id/blog/berita/mahasiswa-primakara-raih-juara-1-business-plan-competition-instiki"
  },
  {
    "id": "W041",
    "title": "Moelung",
    "year": 2025,
    "competition": "Business Plan IDEAS Batch 11 (UGM)",
    "institution": "Universitas Indonesia",
    "category": "BUSINESS_PLAN",
    "summary": "Platform yang menghubungkan pengumpulan dan pengolahan sampah, termasuk akses kerja fleksibel bagi pemulung lewat aplikasi.",
    "keyphrases": [
      "pengelolaan sampah",
      "pemulung",
      "platform digital",
      "kerja fleksibel",
      "kesejahteraan pemulung",
      "logistik sampah",
      "ekonomi sirkular",
      "waste management"
    ],
    "sourceUrl": "https://kemahasiswaan.ui.ac.id/mahasiswa-fasilkom-ui-sabet-juara-1-business-plan-ideas-ugm-lewat-inovasi-digital-moelung/"
  },
  {
    "id": "W042",
    "title": "Financial Fun Revolution: Trezo, The Gamified Saving Platform",
    "year": 2025,
    "competition": "National Business Plan Competition EFFECT UNS 2025",
    "institution": "UPN Veteran Yogyakarta",
    "category": "BUSINESS_PLAN",
    "summary": "Platform menabung bergaya game untuk remaja yang kurang tertarik menabung dan sering membeli item virtual.",
    "keyphrases": [
      "menabung",
      "gamifikasi",
      "remaja",
      "literasi keuangan",
      "financial literacy",
      "item virtual",
      "tabungan cerdas",
      "kebiasaan menabung"
    ],
    "sourceUrl": "https://www.upnyk.ac.id/berita/mahasiswa-upnvy-raih-juara-1-national-business-plan-competition-effect-uns-2025"
  },
  {
    "id": "W043",
    "title": "Wisatara",
    "year": 2025,
    "competition": "Business Plan Competition BEM Universitas Trilogi 2025",
    "institution": "Universitas Brawijaya",
    "category": "BUSINESS_PLAN",
    "summary": "Platform digital berbasis budaya dan pariwisata.",
    "keyphrases": [
      "pariwisata",
      "budaya",
      "platform digital",
      "wisata lokal",
      "destinasi wisata",
      "warisan budaya",
      "eksplorasi budaya",
      "travel platform"
    ],
    "sourceUrl": "https://filkom.ub.ac.id/2025/06/03/tim-mahasiswa-si-filkom-ub-juara-1-di-undiknas-business-model-canvas-competition-ubmcc-2025/"
  },
  {
    "id": "W044",
    "title": "Echolang",
    "year": 2025,
    "competition": "National Business Plan Competition Binus University 2025",
    "institution": "Universitas Tarumanagara",
    "category": "BUSINESS_PLAN",
    "summary": "Platform edukasi bahasa interaktif dengan pengenalan suara dan pelafalan real-time untuk pemula dan teman tuli/disabilitas.",
    "keyphrases": [
      "echolang",
      "edukasi bahasa",
      "pengenalan suara",
      "speech recognition",
      "tuna rungu",
      "bahasa isyarat",
      "platform digital",
      "business plan",
      "pembelajaran adaptif"
    ],
    "sourceUrl": "https://feb.untar.ac.id/2025/10/31/tim-mahasiswa-prodi-s1-manajemen-berprestasi-dalam-national-business-plan-competition/"
  },
  {
    "id": "W045",
    "title": "UMKM SIAP",
    "year": 2025,
    "competition": "Hackathon BI-OJK 2025 (kategori Mahasiswa)",
    "institution": "Institut Teknologi Bandung",
    "category": "APP",
    "summary": "Solusi berbasis AI untuk membantu UMKM bersiap melakukan ekspor.",
    "keyphrases": [
      "UMKM",
      "ekspor",
      "AI",
      "kesiapan ekspor",
      "pasar internasional",
      "analisis pasar",
      "akselerasi bisnis",
      "kecerdasan buatan",
      "fintech"
    ],
    "sourceUrl": "https://itb.ac.id/berita/tim-mtaf-impact-itb-juara-1-hackathon-bi-ojk-2025-rancang-solusi-ai-untuk-ekspor-umkm/62996"
  },
  {
    "id": "W046",
    "title": "Sumbu Labs",
    "year": 2025,
    "competition": "National Vibe Coding Competition 2025",
    "institution": "Universitas Gadjah Mada",
    "category": "APP",
    "summary": "Transformasi digital untuk kepatuhan UMKM.",
    "keyphrases": [
      "UMKM",
      "kepatuhan",
      "transformasi digital",
      "agentic AI",
      "regulasi bisnis",
      "otomasi kepatuhan",
      "legal compliance",
      "efisiensi operasional"
    ],
    "sourceUrl": "https://jteti.ugm.ac.id/2026/01/19/hadirkan-solusi-digital-untuk-umkm-dan-event-tim-dteti-ft-ugm-borong-juara-1-dan-2-di-national-vibe-coding-competition-2025/"
  },
  {
    "id": "W047",
    "title": "SpeakUp",
    "year": 2025,
    "competition": "Hackathon Arkavidia 9.0 2025",
    "institution": "Universitas Gadjah Mada",
    "category": "APP",
    "summary": "Aplikasi edukatif berbasis AI untuk melatih kemampuan berbicara.",
    "keyphrases": [
      "kemampuan berbicara",
      "AI",
      "aplikasi edukasi",
      "pendidikan",
      "public speaking",
      "latihan bicara",
      "umpan balik vokal",
      "analisis suara"
    ],
    "sourceUrl": "https://www.klikpendidikan.id/news/35815279294/teknologi-untuk-pendidikan-kisah-inspiratif-di-balik-juara-hackathon-arkavidia-9"
  },
  {
    "id": "W048",
    "title": "Neochat",
    "year": 2025,
    "competition": "Hackathon 15 ICP Indonesia 2025",
    "institution": "IIB Darmajaya",
    "category": "APP",
    "summary": "Platform agen AI percakapan terdesentralisasi yang bisa dipasang di situs, supaya bisnis kecil punya asisten layanan pelanggan murah.",
    "keyphrases": [
      "chatbot",
      "AI agent",
      "UMKM",
      "layanan pelanggan",
      "terdesentralisasi",
      "customer support",
      "web widget",
      "otomasi percakapan"
    ],
    "sourceUrl": "https://www.darmajaya.ac.id/mahasiswa-darmajaya-juara-1-hackathon-dengan-platform-ai-canggih-karya-sendiri/"
  },
  {
    "id": "W049",
    "title": "Atamagri",
    "year": 2025,
    "competition": "Hackathon elevAIte Indonesia 2025",
    "institution": "Universitas Sebelas Maret",
    "category": "APP",
    "summary": "Alat bantu pertanian yang memadukan AI dan IoT.",
    "keyphrases": [
      "pertanian",
      "AI",
      "IoT",
      "alat bantu petani",
      "smart agriculture",
      "sensor tanah",
      "monitoring tanaman",
      "prediksi panen"
    ],
    "sourceUrl": "https://uns.ac.id/id/uns-students/mahasiswa-uns-sabet-juara-1-di-hackathon-elevaite-indonesia-2025.html"
  },
  {
    "id": "W050",
    "title": "Kulkita",
    "year": 2025,
    "competition": "Hackathon eleVAite Indonesia Hub 2025 / National Hackathon 2025",
    "institution": "Universitas Brawijaya",
    "category": "APP",
    "summary": "Aplikasi asisten dapur dan kuliner pintar berbasis AI untuk rekomendasi resep dari bahan sisa kulkas guna meminimalisir food waste.",
    "keyphrases": [
      "kulkita",
      "asisten dapur",
      "food waste",
      "rekomendasi resep",
      "bahan makanan",
      "kecerdasan buatan",
      "smart kitchen",
      "penghematan pangan"
    ],
    "sourceUrl": "https://filkom.ub.ac.id/2025/08/28/mahasiswa-filkom-ub-raih-juara-1-hackathon-elevaite-indonesia-hub-2025/"
  },
  {
    "id": "W051",
    "title": "Wiraga",
    "year": 2025,
    "competition": "INVENTION 2025 - UI/UX Design",
    "institution": "BINUS University @Bandung",
    "category": "APP",
    "summary": "Rancangan aplikasi pembelajaran seni tari tradisional Indonesia berbasis digital.",
    "keyphrases": [
      "tari tradisional",
      "pembelajaran seni",
      "budaya",
      "aplikasi edukasi",
      "motion tracking",
      "seni tari",
      "pelestarian budaya",
      "interaktif"
    ],
    "sourceUrl": "https://binus.ac.id/bandung/computer-science/?p=625"
  },
  {
    "id": "W052",
    "title": "One Energy",
    "year": 2025,
    "competition": "INVOFEST 2025 - UI/UX Design",
    "institution": "BINUS University",
    "category": "APP",
    "summary": "Platform digital untuk meningkatkan keterlibatan masyarakat dalam proyek energi berkelanjutan.",
    "keyphrases": [
      "energi berkelanjutan",
      "partisipasi masyarakat",
      "platform digital",
      "green energy",
      "crowdfunding energi",
      "transisi energi",
      "sustainability",
      "ui ux design"
    ],
    "sourceUrl": "https://binus.ac.id/2025/12/dua-inovasi-berbasis-sustainability-mahasiswa-school-of-information-systems-raih-2-juara-di-invofest-2025/"
  },
  {
    "id": "W053",
    "title": "SaveBite",
    "year": 2025,
    "competition": "INVOFEST 2025 - UI/UX Design",
    "institution": "BINUS University",
    "category": "APP",
    "summary": "Solusi digital untuk membantu rumah tangga mengurangi sisa makanan.",
    "keyphrases": [
      "food waste",
      "rumah tangga",
      "aplikasi",
      "manajemen makanan",
      "tanggal kedaluwarsa",
      "distribusi surplus pangan",
      "sustainability",
      "gaya hidup hijau"
    ],
    "sourceUrl": "https://binus.ac.id/2025/12/dua-inovasi-berbasis-sustainability-mahasiswa-school-of-information-systems-raih-2-juara-di-invofest-2025/"
  },
  {
    "id": "W054",
    "title": "AyoBaca",
    "year": 2025,
    "competition": "Find IT Hackathon 2025",
    "institution": "BINUS University @Bandung",
    "category": "APP",
    "summary": "Aplikasi edukatif untuk membantu anak dengan disleksia belajar membaca dan menulis.",
    "keyphrases": [
      "disleksia",
      "anak",
      "belajar membaca",
      "aplikasi edukasi",
      "baca tulis",
      "terapi disleksia",
      "intervensi literasi",
      "edutech inklusif"
    ],
    "sourceUrl": "https://binus.ac.id/bandung/?p=14700"
  },
  {
    "id": "W055",
    "title": "Microteaching Pemrograman Robot Beroda Berbasis IoT",
    "year": 2025,
    "competition": "LIDM 2025 - Microteaching Digital Pendidikan",
    "institution": "Universitas Pendidikan Ganesha",
    "category": "APP",
    "summary": "Microteaching yang memakai robot beroda berbasis IoT untuk mengajarkan pemrograman dan robotika kepada siswa.",
    "keyphrases": [
      "microteaching",
      "robot beroda",
      "IoT",
      "pemrograman",
      "pendidikan",
      "robotika sekolah",
      "pembelajaran stem",
      "media ajar digital"
    ],
    "sourceUrl": "https://pti.undiksha.ac.id/tim-prodi-pti-raih-juara-1-lidm-2025-dengan-inovasi-microteaching-robot-beroda-berbasis-iot/"
  },
  {
    "id": "W056",
    "title": "Masa Pergerakan Nasional dalam Jejak Perjuangan Menuju Indonesia Merdeka",
    "year": 2025,
    "competition": "Lomba Media Pembelajaran Sejarah Tingkat Nasional (FISIP Unnes)",
    "institution": "Universitas Brawijaya",
    "category": "APP",
    "summary": "Buku digital interaktif untuk belajar sejarah yang memadukan AR, peta digital interaktif, dan evaluasi berbasis web.",
    "keyphrases": [
      "pembelajaran sejarah",
      "augmented reality",
      "buku digital",
      "peta interaktif",
      "sejarah indonesia",
      "pergerakan nasional",
      "media interaktif",
      "edukasi sejarah"
    ],
    "sourceUrl": "https://timesindonesia.co.id/indonesia-positif/565698/mahasiswa-filkom-ub-juara-nasional-lomba-media-pembelajaran-sejarah"
  },
  {
    "id": "W057",
    "title": "Al-Jebret (media pembelajaran Aljabar kelas VII SMP)",
    "year": 2025,
    "competition": "Pekan Gema Matematika 2025 - Lomba Media Pembelajaran",
    "institution": "Universitas Negeri Yogyakarta",
    "category": "APP",
    "summary": "Media pembelajaran untuk materi aljabar kelas VII SMP.",
    "keyphrases": [
      "aljabar",
      "media pembelajaran",
      "matematika SMP",
      "game edukasi",
      "visualisasi aljabar",
      "konsep variabel",
      "pembelajaran matematika"
    ],
    "sourceUrl": "https://s2pmat.fmipa.uny.ac.id/id/print/Pekan%20Gema%20Matematika%20%28PGM%29%20Tahun%202025"
  },
  {
    "id": "W058",
    "title": "BlockDuino",
    "year": 2025,
    "competition": "LIDM 2025 - Inovasi Pembelajaran Digital Pendidikan",
    "institution": "Universitas Negeri Yogyakarta",
    "category": "APP",
    "summary": "Platform pembelajaran pemrograman mikrokontroler Arduino menggunakan visual block-based programming untuk siswa pemula.",
    "keyphrases": [
      "blockduino",
      "arduino",
      "block coding",
      "pemrograman visual",
      "mikrokontroler",
      "edukasi iot",
      "inovasi pembelajaran",
      "stem digital",
      "robotika"
    ],
    "sourceUrl": "https://uny.ac.id/id/berita/raih-juara-1-inovasi-pembelajaran-digital-pendidikan-tim-blockspire-uny-bawa-pulang-medali"
  },
  {
    "id": "W059",
    "title": "RADVent",
    "year": 2025,
    "competition": "LIDM 2025",
    "institution": "Universitas Airlangga",
    "category": "APP",
    "summary": "Media belajar praktik radiologi dengan AR dan NeuroTag Scan agar mahasiswa tidak bergantung pada alat fisik yang mahal dan berisiko radiasi.",
    "keyphrases": [
      "radiologi",
      "augmented reality",
      "praktik",
      "pendidikan",
      "simulasi medis",
      "neurotag scan",
      "kedokteran",
      "pelatihan radiasi",
      "edukasi kesehatan"
    ],
    "sourceUrl": "https://unair.ac.id/tim-radju-unair-raih-juara-1-di-ajang-lomba-inovasi-dan-digital-mahasiswa-lidm-melalui-inovasi-radvent/"
  },
  {
    "id": "W060",
    "title": "Info Magang",
    "year": 2025,
    "competition": "LIDM 2025 - Inovasi Teknologi Digital Pendidikan",
    "institution": "Universitas Pendidikan Indonesia",
    "category": "APP",
    "summary": "Portal integrasi dan pencarian tempat magang pendidikan dan industri berbasis kecocokan kompetensi mahasiswa.",
    "keyphrases": [
      "info magang",
      "magang kependidikan",
      "portal magang",
      "rekomendasi otomatis",
      "mahasiswa keguruan",
      "praktek kerja",
      "teknologi pendidikan",
      "karir mahasiswa"
    ],
    "sourceUrl": "https://berita.upi.edu/upi-raih-tiga-gelar-di-lidm-2025-bukti-kebangkitan-inovasi-digital-mahasiswa/"
  },
  {
    "id": "W061",
    "title": "Decimal Adventure: Petualangan Desimal Berbasis Virtual Reality (VR) dan Scratch",
    "year": 2024,
    "competition": "LIDM 2024 - Microteaching Digital",
    "institution": "Universitas Syiah Kuala",
    "category": "APP",
    "summary": "Microteaching digital untuk belajar bilangan desimal memakai VR dan Scratch.",
    "keyphrases": [
      "desimal",
      "virtual reality",
      "Scratch",
      "microteaching",
      "matematika SD",
      "bilangan desimal",
      "gamifikasi matematika",
      "vr edukasi"
    ],
    "sourceUrl": "https://library.usk.ac.id/mahasiswa-usk-raih-juara-iii-inovasi-digital-di-ipb-university/"
  },
  {
    "id": "W062",
    "title": "Binky (judul karya belum disebut)",
    "year": 2025,
    "competition": "LIDM 2025 - Poster Digital Pendidikan",
    "institution": "Institut Seni Indonesia Yogyakarta",
    "category": "POSTER",
    "summary": "Poster edukasi visual untuk menumbuhkan kepedulian kesehatan mental dan ekspresi diri anak usia dini melalui seni kreatif.",
    "keyphrases": [
      "binky",
      "poster digital",
      "pendidikan seni",
      "kesehatan mental anak",
      "ekspresi diri",
      "desain komunikasi visual",
      "kampanye edukatif"
    ],
    "sourceUrl": "https://kemdiktisaintek.go.id/en/news/article/generasi-kreatif-isi-yogyakarta-torehkan-juara-2-poster-digital-pendidikan-di-lidm-2025"
  },
  {
    "id": "W063",
    "title": "Stunting Menghambat Tumbuh Kembang? Yuk Penuhi dengan Gizi Seimbang!",
    "year": 2025,
    "competition": "Indonesian Nursing Olympiad 2025 - Lomba Poster",
    "institution": "Universitas Jember",
    "category": "POSTER",
    "summary": "Poster edukasi tentang stunting dan pentingnya gizi seimbang.",
    "keyphrases": [
      "stunting",
      "gizi seimbang",
      "edukasi kesehatan",
      "poster",
      "nutrisi balita",
      "pencegahan stunting",
      "promosi kesehatan",
      "kesehatan ibu dan anak"
    ],
    "sourceUrl": "https://kemdiktisaintek.go.id/news/article/mahasiswa-fkep-unej-borong-juara-di-indonesian-nursing-olympiad-2025"
  },
  {
    "id": "W064",
    "title": "TB CARE+ sebagai Sistem Pelayanan Pasien TBC Berbasis Wearable yang Terintegrasi R-Shiny dalam Revitalisasi Layanan Poli Paru di Rumah Sakit",
    "year": 2025,
    "competition": "Indonesian Nursing Olympiad 2025 - Lomba Karya Tulis Ilmiah",
    "institution": "Universitas Jember",
    "category": "ESSAY",
    "summary": "Sistem layanan pasien TBC berbasis wearable yang terhubung ke dasbor R-Shiny untuk memperbaiki layanan poli paru.",
    "keyphrases": [
      "TBC",
      "wearable",
      "R-Shiny",
      "poli paru",
      "layanan kesehatan",
      "tuberkulosis",
      "pemantauan pasien",
      "dashboard klinis",
      "kepatuhan minum obat"
    ],
    "sourceUrl": "https://kemdiktisaintek.go.id/news/article/mahasiswa-fkep-unej-borong-juara-di-indonesian-nursing-olympiad-2025"
  },
  {
    "id": "W065",
    "title": "SEAVOLVE (SEA-based Volunteer E-Learning Program): Model Pendidikan Masa Depan untuk Anak Pesisir Laut Indonesia yang Terlupakan",
    "year": 2025,
    "competition": "National Writing Competition (NWC) 2025 - subtema Pendidikan",
    "institution": "Universitas Malikussaleh",
    "category": "ESSAY",
    "summary": "Program e-learning berbasis relawan untuk mengatasi kesenjangan pendidikan anak di wilayah pesisir.",
    "keyphrases": [
      "e-learning",
      "relawan",
      "pendidikan pesisir",
      "kesenjangan pendidikan",
      "anak pulau",
      "akses belajar",
      "pendidikan inklusif",
      "pemberdayaan masyarakat"
    ],
    "sourceUrl": "https://news.unimal.ac.id/index/cetakberita/7365"
  },
  {
    "id": "W066",
    "title": "Transformasi Pendidikan Inklusif: Roadmap Pendidikan Inklusif dari Finlandia sebagai Solusi Inspiratif",
    "year": 2023,
    "competition": "Education For All (EFA) Competition 2023 - Lomba Esai",
    "institution": "Universitas Gadjah Mada",
    "category": "ESSAY",
    "summary": "Esai yang menjadikan Finlandia sebagai acuan untuk menyusun rencana pengembangan pendidikan inklusif bagi penyandang disabilitas di Indonesia.",
    "keyphrases": [
      "pendidikan inklusif",
      "disabilitas",
      "Finlandia",
      "roadmap",
      "kebijakan pendidikan",
      "sekolah inklusi",
      "kesetaraan akses",
      "kurikulum adaptif"
    ],
    "sourceUrl": "https://feb.ugm.ac.id/id/prestasi/4399-tim-mat-raih-juara-pertama-lomba-esai-pada-efa-competition-2023"
  },
  {
    "id": "W067",
    "title": "Digital Santri Hub: Solusi Menghadapi Hoaks dan Meningkatkan Literasi Digital di Era Society 5.0",
    "year": 2025,
    "competition": "Essay Competition Kopertais Wilayah I Jakarta-Banten",
    "institution": "Universitas Nahdlatul Ulama Indonesia",
    "category": "ESSAY",
    "summary": "Esai yang mengajak mahasiswa PTKIS melawan hoaks, terutama hoaks keagamaan, dan meningkatkan literasi digital lewat teknologi.",
    "keyphrases": [
      "hoaks",
      "literasi digital",
      "Society 5.0",
      "mahasiswa",
      "santri digital",
      "pencegahan misinformasi",
      "etika digital",
      "pesantren modern"
    ],
    "sourceUrl": "https://www.nu.or.id/nasional/juara-1-kompetisi-esai-kopertais-wilayah-i-mahasiswi-pai-unusia-ungguli-puluhan-kampus-yJi1o"
  },
  {
    "id": "W068",
    "title": "Tradisi Sandingan Malam Jumat Legi sebagai Manifestasi Budaya Pandalungan: Telaah Tradisi ke-NU-an dan Egalitarianisme di Lumajang",
    "year": 2025,
    "competition": "Lomba Esai Santri dan Mahasiswa 2025 Tingkat Nasional",
    "institution": "Universitas Nahdlatul Ulama Indonesia",
    "category": "ESSAY",
    "summary": "Esai tentang tradisi sandingan malam Jumat Legi di Lumajang sebagai wujud budaya lokal dan nilai ke-NU-an.",
    "keyphrases": [
      "tradisi lokal",
      "budaya Pandalungan",
      "NU",
      "Lumajang",
      "kearifan lokal",
      "akulturasi budaya",
      "egalitarianisme",
      "kajian sosiokultural"
    ],
    "sourceUrl": "https://nu.or.id/nasional/mahasiswa-s2-unusia-raih-juara-lomba-esai-santri-dan-mahasiswa-tingkat-nasional-oR4A3"
  },
  {
    "id": "W069",
    "title": "Program soft skill dan magang lulusan SMK dengan pendekatan Tripel Helix (judul asli tidak disebut)",
    "year": 2025,
    "competition": "Lomba Esai Nasional Harlah Ekis FEB Universitas Tanjungpura 2025",
    "institution": "Universitas Pendidikan Ganesha",
    "category": "ESSAY",
    "summary": "Gagasan pelatihan soft skill intensif dan magang terstruktur bagi lulusan SMK dengan pendekatan Tripel Helix.",
    "keyphrases": [
      "SMK",
      "soft skill",
      "magang",
      "Tripel Helix",
      "lapangan kerja",
      "kesiapan kerja",
      "vokasi industri",
      "penyerapan lulusan",
      "kolaborasi industri"
    ],
    "sourceUrl": "https://kemdiktisaintek.go.id/news/article/lomba-esai-nasional-tim-undiksha-raih-juara-i"
  }
];

export const EXAMPLE_IDEA = {
  title: "Aplikasi tutor sebaya buat daerah minim guru",
  description:
    "Aplikasi yang menghubungkan siswa di daerah minim guru dengan relawan tutor sebaya lewat video call terjadwal. Ada pencocokan berdasarkan kurikulum dan materi ringkas buat matematika dan sains.",
};
