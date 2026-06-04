import { Article } from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Digitalisasi Sawah Subak: Sensor IoT Bandung Tingkatkan Hasil Panen di Gianyar',
    summary: 'Petani tradisional di Gianyar bekerjasama dengan startup teknologi asal Bandung untuk memasang sensor kelembaban dan kualitas air berbasis Internet of Things (IoT) pada sistem irigasi Subak.',
    content: `GIANYAR — Lanskap persawahan di subak tradisional Gianyar, Bali, kini diperkaya dengan sentuhan modernitas. Penggunaan teknologi Internet of Things (IoT) yang didevelop oleh sekelompok insinyur muda asal Bandung mulai diuji coba secara masif. Sensor-sensor kecil berbentuk bambu buatan ini ditanam langsung ke dalam tanah basah dan saluran irigasi untuk mencatat suhu tanah, kadar pH air, hingga tingkat kelembaban udara secara berkala.

Sistem irigasi Subak, yang telah diakui sebagai Warisan Dunia UNESCO, selama berabad-abad mengandalkan gotong royong dan intuisi adat pengurus air atau Pekaseh. Kehadiran teknologi ini bukan bertujuan untuk melunturkan tradisi tersebut, melainkan memberikan data pendukung objektif demi efisiensi masa tanam ke depan.

I Wayan Suardika (48), salah satu ketua subak setempat, mengungkapkan rasa puasnya setelah menggunakan sistem ini selama dua bulan penuh. "Sebelum ada sensor, kami harus mengamati air secara manual setiap pagi dan meraba tanah. Sekarang, jika debit air berkurang drastis di hulu atau pH tanah mulai tidak seimbang, notifikasi langsung dikirim ke ponsel pintar kami via aplikasi whatsapp," jelasnya dengan gembira.

Teknologi sensor bertenaga surya mini ini dikembangkan oleh "SaniTani", startup inkubasi dari Institut Teknologi Bandung (ITB). Mereka menyebutkan bahwa sistem irigasi cerdas ini mampu menghemat penggunaan air sekunder hingga 23% sekaligus menekan angka serangan hama busuk akar sebesar 15%. Proyek ini ditargetkan mendapat perluasan uji coba hingga 12 wilayah adat subak lainnya di Bali sebelum akhir tahun 2026.`,
    category: 'Teknologi',
    author: 'Rian Hidayat',
    publishedAt: '4 Juni 2026',
    readTime: '4 menit',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=800',
    likes: 312,
    views: 1250,
    comments: [
      {
        id: 'c1',
        user: 'Made Wiranata',
        avatar: 'MW',
        content: 'Kolaborasi yang luar biasa! Menghubungkan tradisi subak dengan IoT adalah langkah revolusioner untuk ketahanan pangan kita.',
        timestamp: '2 jam yang lalu'
      },
      {
        id: 'c2',
        user: 'Sri Utami',
        avatar: 'SU',
        content: 'Semoga alatnya dirancang awet dan tahan dari kondisi cuaca ekstrem di persawahan belumpur.',
        timestamp: '1 jam yang lalu'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Karya Seni Generatif Seniman Yogyakarta Menembus Galeri Kontemporer Tokyo',
    summary: 'Seorang seniman visual berbasis di Kotagede berhasil memukau kurator seni Jepang lewat pameran bayangan interaktif yang menggabungkan algoritma coding komputer dengan seni wayang kulit tradisional.',
    content: `YOGYAKARTA — Batasan antara pemrograman modern dan kerajinan fisik tradisional kian melebur di tangan Aditya Permana (33), seniman generatif asal Kotagede, Yogyakarta. Setelah hampir setahun menyendiri di studionya, karya instalasi bernama "Sombra Algorítmica" miliknya sukses didapuk masuk dalam seleksi kurator khusus di Ginza Art Space, Tokyo.

Karya Aditya memvisualisasikan karakter-karakter wayang yang dibentuk ulang secara dinamis menggunakan algoritma matematika berbasis fraktal. Ketika pengunjung mendekati sensor gerak yang melingkari ruang galeri, proyeksi cahaya akan merespons detak jantung dan frekuensi langkah kaki pengunjung, lalu merekonfigurasi siluet anyaman kulit tradisional menjadi partikel digital berwarna-warni yang terus berubah konstan.

"Ide dasarnya adalah melihat kehidupan di balik bayangan," tutur Aditya saat diwawancarai secara virtual. "Dalam pementasan wayang kulit, esensi sebenarnya ada pada pantulan layar, bukan sosok wayangnya sendiri. Saya ingin menunjukkan bahwa di balik deretan kode matematika digital yang dingin, terdapat jiwa spiritual dan warisan leluhur kita yang tetap mengalir hangat."

Pameran di Tokyo dijadwalkan berlangsung selama tiga minggu penuh. Minat audiens internasional sangat solid; kurator senior Ginza Art Space, Masao Tanaka, menyampaikan bahwa karya Aditya membuktikan seni tradisional Indonesia memiliki fleksibilitas universal untuk dieksplorasi di media baru tanpa menghilangkan martabat otentiknya.`,
    category: 'Gaya Hidup',
    author: 'Siti Amalia',
    publishedAt: '3 Juni 2026',
    readTime: '3 menit',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    likes: 245,
    views: 980,
    comments: [
      {
        id: 'c3',
        user: 'Giri Wijaya',
        avatar: 'GW',
        content: 'Bangga sekali mendengar karya anak bangsa diapresiasi di pusat seni bergengsi dunia semacam Ginza.',
        timestamp: '4 jam yang lalu'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Ekonomi Hijau: Bekas Area Tambang Batu Bara di Kaltim Sukses Dikonversi Jadi Hutan Solar',
    summary: 'Inisiasi bersama antara pemerintah daerah, BUMN, dan kelompok konservasi berhasil merehabilitasi lahan tandus pasca-tambang menjadi pembangkit listrik tenaga surya terapung berdampingan dengan hutan wisata.',
    content: `BALIKPAPAN — Mimpi transisi energi bersih di wilayah Kalimantan Timur perlahan-lahan mewujud di lapangan. Lahan bekas tambang luar terbuka (open-pit) seluas hampir 120 hektar yang dulunya gersang dan dipenuhi genangan air asam asam tinggi kini berubah fungsi menjadi komplek Hutan Eko-Solar Terpadu.

Pusat rehabilitasi ini memiliki keistimewaan tersendiri: di bagian danau kawah pasca-tambang dipasang panel surya terapung (floating solar PV) berkapasitas 45 Megawatt yang mampu menyuplai kebutuhan listrik untuk lebih dari 20.000 rumah tangga lokal. Pada saat yang sama, area bibir danau yang awalnya tandus telah ditanami kembali dengan vegetasi hutan hujan khas Kalimantan seperti pohon Meranti, Ulin, dan berbagai jenis tanaman penutup tanah penyaring racun.

Direktur Transisi Energi Hijau Daerah, Dr. Ir. Gunawan Wibisono, menerangkan bahwa integrasi reboisasi lahan asam dengan panel terapung memiliki dampak ganda. "Air danau membantu mendinginkan suhu panel surya sehingga meningkatkan efisiensi konversi energinya sebesar 8%. Di sisi lain, panel surya terapung membatasi asupan cahaya langsung ke permukaan danau, mencegah pertumbuhan alga beracun dan mengurangi penguapan air secara berlebihan," tandasnya.

Proyek percontohan ini tidak hanya berhasil menstabilkan kualitas ekologi tanah regional, tetapi juga mulai membuka lapangan kerja baru di bidang pariwisata ekologis warga setempat yang menyewakan perahu dayung listrik bertenaga surya kepada pelancong akhir pekan.`,
    category: 'Ekonomi',
    author: 'Dian Wahyudi',
    publishedAt: '2 Juni 2026',
    readTime: '5 menit',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800',
    likes: 410,
    views: 1890,
    comments: [
      {
        id: 'c4',
        user: 'Robby Kurniawan',
        avatar: 'RK',
        content: 'Ini adalah blueprint luar biasa untuk reklamasi tambang di seluruh pelosok Indonesia. Solutif demi ekologi dan ekonomi lokal!',
        timestamp: '1 hari yang lalu'
      },
      {
        id: 'c5',
        user: 'Hana Lestari',
        avatar: 'HL',
        content: 'Bagus banget sinerginya. Semoga kualitas airnya juga terus dipantau agar fauna liar aman minum di sana.',
        timestamp: '12 jam yang lalu'
      }
    ]
  },
  {
    id: 'art-4',
    title: 'Gelar Juara Catur Indonesia Terbuka Direbut Pecatur 16 Tahun asal Surabaya',
    summary: 'Fide Master muda Muhammad Azhar menyabet juara pertama usai mengalahkan rival internasional unggul asal India dalam pertandingan babak final yang menegangkan selama 5 jam.',
    content: `SURABAYA — Bendera Indonesia berkibar tinggi di podium turnamen Catur Terbuka Nasional Indonesia 2026 yang digelar di Ballroom Grand City Mall, Surabaya. Muhammad Azhar, seorang remaja berusia 16 tahun asal kelurahan Gubeng, keluar sebagai jawara utama setelah melumpuhkan Grandmaster senior asal Chennai, India, melalui pertahanan ketat yang berakhir taktis.

Azhar yang saat ini menyandang gelar Fide Master (FM) bermain dengan taktik pembukaan Ruy Lopez hitam yang sangat defensif pada awalnya. Namun memasuki gerakan ke-34, ia melancarkan pengorbanan Kuda kreatif yang memicu guncangan mental pada lawan mainnya yang sarat pengalaman internasional.

"Pada langkah pertengahan, saya menyadari posisi bidak saya sedikit tertekan. Saya memutuskan untuk mengambil spekulasi taktis yang sering saya latih di platform permainan catur daring bersama mesin komputer canggih," aku Azhar dengan tersenyum malu-malu usai menerima trofi juara. "Saya bersyukur fokus saya tidak memudar meskipun kami harus berkonsentrasi penuh selama hampir 5 jam nonstop."

Pelatnas Catur Indonesia menyatakan pencapaian mengejutkan remaja ini membuktikan akselerasi talenta muda yang memanfaatkan teknologi latihan kecerdasan buatan berjalan sangat intensif. Azhar kini dipersiapkan secara akseleratif untuk meraih norma Grandmaster pertamanya di ajang Olimpiade Catur Asia Tenggara mendatang.`,
    category: 'Olahraga',
    author: 'Budi Santoso',
    publishedAt: '1 Juni 2026',
    readTime: '3 menit',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800',
    likes: 198,
    views: 750,
    comments: [
      {
        id: 'c6',
        user: 'Hendra Catur',
        avatar: 'HC',
        content: 'Kombinasi taktis yang menakjubkan bagi anak berumur 16 tahun! Calon legenda catur Indonesia di masa depan.',
        timestamp: '3 hari yang lalu'
      }
    ]
  },
  {
    id: 'art-5',
    title: 'Menjaga Demokrasi Sehat: Urgensi Literasi Informasi di Era Banjir AI Generatif',
    summary: 'Dengan kemudahan manipulasi konten multimedia lewat kecerdasan buatan, portal berita terverifikasi harus menjadi pilar penyaring rumor demi terwujudnya informasi merata.',
    content: `JAKARTA — Kehadiran AI Generatif yang mampu memproduksi teks, suara, hingga video ultra-realistis dalam sekejap membawa berkah bagi efisiensi industri digital, sekaligus badai baru bagi benteng kebenaran informasi publik. Di tengah kemudahan ini, pembedaan antara fakta organik lapangan dengan fabrikasi manipulasi algoritma menjadi sangat tipis dan sulit dinalar secara sekilas oleh pembaca kasual.

Banjir konten artifisial ini membahayakan kualitas demokrasi jika publik terus-menerus disuplai oleh potongan realitas palsu yang diorkestrasi demi klik viral atau kepentingan polarisasi kelompok. Di sinilah urgensi mutlak media independen yang berkomitmen kuat pada verifikasi ganda, cek data ilmiah, dan reportase investigatif langsung.

Menyebarkan informasi secara merata bukan hanya soal keterjangkauan sinyal internet di daerah terdepan, tetapi juga memastikan kualitas kebenaran dari muatan sinyal tersebut. Ketika setiap orang dapat bersuara tanpa akuntabilitas riset, jurnalisme bermartabat bertransformasi menjadi kurator kehidupan sosial yang sangat krusial.

Pendidikan literasi digital sedari tingkat sekolah menengah harus memasukkan modul analisis kritis konten. Kita tidak boleh menjadi bangsa yang reaktif atas visual spektakuler tanpa menyisakan ruang keraguan sehat. Memverifikasi kebenaran sebuah berita sebelum membagikannya ke grup keluarga adalah kontribusi patriotik terkonsolidasi sederhana yang bisa dilakukan setiap individu saat ini.`,
    category: 'Opini',
    author: 'Prof. Ahmad Siregar',
    publishedAt: '31 Mei 2026',
    readTime: '6 menit',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    likes: 380,
    views: 1420,
    comments: [
      {
        id: 'c7',
        user: 'Andi Saputra',
        avatar: 'AS',
        content: 'Sangat setuju Prof. Sekarang tugas Tebarmedia sebagai penjaga gawang berita berkualitas dan merata.',
        timestamp: '5 hari yang lalu'
      }
    ]
  }
];
