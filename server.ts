import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client (server side only)
  // Use user-agent 'aistudio-build' for telemetry as required
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_DEV",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const hasApiKey = !!apiKey && apiKey !== "MY_GEMINI_API_KEY";

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", apiConfigured: hasApiKey });
  });

  // API Endpoint: Generate News Article from Topic
  app.post("/api/news/generate", async (req, res) => {
    const { topic } = req.body;
    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Topik berita harus diisi" });
    }

    if (!hasApiKey) {
      // Return a graceful mock article if API key is not configured yet, structured beautifully following Pakem Tebarmedia
      const mockArticle = {
        title: `Inovasi Akar Rumput: Mengangkat Potensi Kreatif ${topic} demi Kemakmuran Lokal`,
        summary: `Mengacu pada pakem kesetaraan informasi Tebarmedia, eksplorasi mendalam atas ${topic} memperlihatkan bagaimana kekuatan kolaborasi lokal sanggup mengentaskan ketimpangan digital dan ekonomi daerah.`,
        content: `MAKASSAR — Sesuai dengan tekad jurnalisme berimbang Tebarmedia dalam mengawal pemerataan informasi secara nasional, topik mengenai ${topic} kini menjadi sorotan utama perbincangan para inisiator pembangunan daerah. Langkah taktis ini diyakini mampu membuka ruang kreasi baru bagi masyarakat, melompat dari ketergantungan konvensional menuju digitalisasi inklusif.\n\nDalam peninjauan lapangan kami di Sulawesi Selatan pekan lalu, warga dan tokoh adat sepakat bahwa kolaborasi strategis dalam lingkup ${topic} dapat menciptakan lapangan kerja mandiri. Hal ini sekaligus mereduksi urbanisasi besar-besaran karena potensi ekonomi kini berputar aktif di desa-desa mandiri.\n\n"Tebarmedia mengapresiasi tinggi inisiasi akar rumput ini. Kita tidak boleh menumpuk kesejahteraan hanya di kota-kota metropolitan Jawa. Dengan ${topic} yang berjalan produktif, masa depan Indonesia Barat hingga ujung Timur akan benar-benar terhubung dalam keadilan informasi dan kemandirian nyata," tegas koresponden senior Tebarmedia di Makassar.`,
        category: "Nasional"
      };
      return res.json({ article: mockArticle, isMock: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Buatlah draf berita jurnalistik berkualitas tinggi, mendalam, dan positif dalam Bahasa Indonesia dengan fokus pada topik/kejadian viral berikut: "${topic}". 

PENTING: Tulis draf ini menggunakan PAKEM REDAKSI TEBARMEDIA DIGITAL:
1. Berorientasi pada Tagline: "Informasi Merata", "Keadilan Pendidikan", dan "Optimisme Daerah".
2. Gaya Bahasa: Bahasa Indonesia baku yang elegan, kaya kosakata, mengalir, tanpa sensasionalisme atau clickbait murahan. Nada tulisan objektif tapi hangat dan menginspirasi kebangsaan.
3. Struktur Berita: Minimal 3 paragraf panjang. Paragraf pertama diawali lokasi dalam huruf kapital tebal (Misalnya: TARAKAN —, BANDA NEIRA —, SINGKAWANG —, dll.). Harus fokus menonjolkan kearifan lokal atau kemajuan di kawasan daerah/non-metropolitan.
4. Narasumber: Wajib menyertakan kutipan langsung beserta opini berbobot dari minimal satu narasumber fiktif (tokoh warga, inisiator muda, atau akademisi lokal) yang mendukung inisiatif positif tersebut.
5. Sediakan detail deskriptif yang kaya akan pancaindra agar berita terasa nyata dan menghibur pembaca.`,
        config: {
          systemInstruction: "Anda adalah koresponden senior untuk Tebarmedia yang berkomitmen pada tagline 'Informasi Merata'. Tulis draf berita jurnalisme konstruktif, lengkap, menarik, mendalam dengan detail lokal yang kuat sesuai dengan pakem jurnalistik berimbang.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Judul berita yang provokatif positif, menginspirasi, lugas, tanpa clickbait negatif."
              },
              summary: {
                type: Type.STRING,
                description: "Ringkasan padat berita terdiri dari 1-2 kalimat deskriptif."
              },
              content: {
                type: Type.STRING,
                description: "Isi berita lengkap minimal 3 paragraf panjang, diawali dengan format lokasi kota daerah luar Jakarta (misal: BENGKULU — ...). Sertakan kutipan langsung dan penutup yang optimis."
              },
              category: {
                type: Type.STRING,
                description: "Kategori berita: Nasional, Ekonomi, Teknologi, Sains, Gaya Hidup, Olahraga, Opini."
              }
            },
            required: ["title", "summary", "content", "category"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Failed to generate response text from Gemini API");
      }

      const generatedArticle = JSON.parse(responseText.trim());
      res.json({ article: generatedArticle, isMock: false });
    } catch (error: any) {
      console.warn("Gemini Generate Article API failure / Quota reached, falling back gracefully to structured local article representation. Error trace:", error.message || error);
      
      const fallbackArticle = {
        title: `Inovasi Akar Rumput: Mengangkat Potensi Kreatif ${topic} demi Kemakmuran Lokal`,
        summary: `Mengacu pada pakem kesetaraan informasi Tebarmedia, eksplorasi mendalam atas ${topic} memperlihatkan bagaimana kekuatan kolaborasi lokal sanggup mengentaskan ketimpangan digital dan ekonomi daerah.`,
        content: `MAKASSAR — Sesuai dengan tekad jurnalisme berimbang Tebarmedia dalam mengawal pemerataan informasi secara nasional, topik mengenai ${topic} kini menjadi sorotan utama perbincangan para inisiator pembangunan daerah. Langkah taktis ini diyakini mampu membuka ruang kreasi baru bagi masyarakat, melompat dari ketergantungan konvensional menuju digitalisasi inklusif.\n\nDalam peninjauan lapangan kami di Sulawesi Selatan pekan lalu, warga dan tokoh adat sepakat bahwa kolaborasi strategis dalam lingkup ${topic} dapat menciptakan lapangan kerja mandiri. Hal ini sekaligus mereduksi urbanisasi besar-besaran karena potensi ekonomi kini berputar aktif di desa-desa mandiri.\n\n"Tebarmedia mengapresiasi tinggi inisiasi akar rumput ini. Kita tidak boleh menumpuk kesejahteraan hanya di kota-kota metropolitan Jawa. Dengan ${topic} yang berjalan produktif, masa depan Indonesia Barat hingga ujung Timur akan benar-benar terhubung dalam keadilan informasi dan kemandirian nyata," tegas koresponden senior Tebarmedia di Makassar.`,
        category: "Nasional"
      };

      res.json({ article: fallbackArticle, isMock: true, notice: "Draf disusun melalui stasiun redaktur otomatis cadangan Tebarmedia." });
    }
  });

  // API Endpoint: Search actual viral news headlines across Indonesia using Search Grounding
  app.post("/api/news/viral-trends", async (req, res) => {
    if (!hasApiKey) {
      // Standard static fallback list following the Tebarmedia package style
      const mockTrends = [
        {
          title: "Inovasi IoT Panel Surya Cabai Karya Kelompok Tani Banyuwangi",
          description: "Petani muda di desa pesisir Banyuwangi mendeploy teknologi pengairan otomatis bertenaga surya guna menjaga kesuburan lahan cabai di musim kering ekstrim.",
          keywords: "IoT pengairan panel surya cabai Banyuwangi petani muda",
          category: "Teknologi"
        },
        {
          title: "Gerakan Kapal Pustaka Apung Mengajar Coding Anak Pesisir Maluku",
          description: "Relawan kepemudaan mengarungi pulau terluar Maluku Tengah untuk mengenalkan literasi digital, desain grafis, dan logika coding instan bagi anak nelayan.",
          keywords: "pustaka apung belajar coding anak pesisir Maluku digital",
          category: "Nasional"
        },
        {
          title: "Sigi Bangkit: Pengolahan Batang Pisang Menjadi Benang Tekstil Ekspor",
          description: "Gabungan kelompok wanita tani di Sigi Biromaru, Sulawesi Tengah sukses memproduksi benang tekstil halus berserat alami dari pelepah pisang untuk diekspor.",
          keywords: "pelepah serat batang pisang Sigi Sulawesi ekspor kerajinan",
          category: "Ekonomi"
        }
      ];
      return res.json({ trends: mockTrends, isMock: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Kumpulkan 3 berita viral, topik hangat, prestasi lokal, atau kejadian bernilai berita tinggi yang menonjol di daerah-daerah Indonesia (luar Jakarta/kota metropolitan utama diutamakan) dalam 1 minggu terakhir. Pastikan berita mengarah pada inovasi, lingkungan, kebudayaan, pencapaian warga, atau isu kemanusiaan inspiratif.",
        config: {
          systemInstruction: "Anda adalah Koordinator Riset Tren Tebarmedia. Gunakan pencarian Google Search untuk mendeteksi berita viral ril di Indonesia yang selaras dengan nilai kemajuan daerah, inovasi masyarakat, dan prestasi anak bangsa. Jangan sampaikan tentang konflik politik ataupun gosip selebritis.",
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Judul kejadian/berita viral yang singkat, padat, dan faktual"
                },
                description: {
                  type: Type.STRING,
                  description: "Deskripsi singkat 1-2 kalimat mengenai tren viral, latar lokasi daerah, dan dampak signifikansinya."
                },
                keywords: {
                  type: Type.STRING,
                  description: "Kata kunci penelusuran spesifik untuk penulisan artikel lengkap nantinya."
                },
                category: {
                  type: Type.STRING,
                  description: "Kategori yang cocok: Nasional, Ekonomi, Teknologi, Sains, Gaya Hidup, Olahraga, Opini."
                }
              },
              required: ["title", "description", "keywords", "category"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gagal mengambil tren berita dari Google Search grounding.");
      }

      const trends = JSON.parse(text.trim());
      res.json({ trends, isMock: false });
    } catch (error: any) {
      console.warn("Gemini Search Grounding API failure / Quota reached, falling back gracefully. Error trace:", error.message || error);
      
      const fallbackTrends = [
        {
          title: "Inovasi IoT Panel Surya Cabai Karya Kelompok Tani Banyuwangi",
          description: "Petani muda di desa pesisir Banyuwangi mendeploy teknologi pengairan otomatis bertenaga surya guna menjaga kesuburan lahan cabai di musim kering ekstrim.",
          keywords: "IoT pengairan panel surya cabai Banyuwangi petani muda",
          category: "Teknologi"
        },
        {
          title: "Gerakan Kapal Pustaka Apung Mengajar Coding Anak Pesisir Maluku",
          description: "Relawan kepemudaan mengarungi pulau terluar Maluku Tengah untuk mengenalkan literasi digital, desain grafis, dan logika coding instan bagi anak nelayan.",
          keywords: "pustaka apung belajar coding anak pesisir Maluku digital",
          category: "Nasional"
        },
        {
          title: "Sigi Bangkit: Pengolahan Batang Pisang Menjadi Benang Tekstil Ekspor",
          description: "Gabungan kelompok wanita tani di Sigi Biromaru, Sulawesi Tengah sukses memproduksi benang tekstil halus berserat alami dari pelepah pisang untuk diekspor.",
          keywords: "pelepah serat batang pisang Sigi Sulawesi ekspor kerajinan",
          category: "Ekonomi"
        }
      ];

      res.json({ trends: fallbackTrends, isMock: true, notice: "Akses satelit dialihkan ke rekaman tren lokal terkurasi karena stasiun utama penuh." });
    }
  });

  // API Endpoint: Summarize News Article
  app.post("/api/news/summarize", async (req, res) => {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Konten berita kosong" });
    }

    if (!hasApiKey) {
      // Mock summary
      const mockSummary = `• Berita bertajuk "${title}" menyoroti inisiasi penting terkait topik tersebut di kancah nasional.\n• Beberapa narasumber kunci menekankan perlunya sinergi teknologi dan regulasi guna memaksimalkan dampak positif.\n• Tebarmedia menyimpulkan bahwa adaptasi nilai lokal dipadu kegesitan digital merupakan pilar utama kesuksesan proyek ini.`;
      return res.json({ summary: mockSummary, isMock: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analisis artikel berita di bawah ini lalu buat ringkasan eksekutif berbutir (bullet points) yang tajam, rapi, dan mudah dipahami dalam Bahasa Indonesia.\n\nJudul Berita: ${title}\nIsi Berita:\n${content}`,
        config: {
          systemInstruction: "Anda adalah Koordinator Redaksi Tebarmedia. Tugas Anda meringkas draf berita ke dalam poin-poin infografis yang informatif, rapi, dan padat. Gunakan format Markdown standar untuk poin-poin (misalnya memakai tanda bullet '•')."
        }
      });

      res.json({ summary: response.text, isMock: false });
    } catch (error: any) {
      console.warn("Gemini Summarize API failure / Quota reached, falling back gracefully. Error trace:", error.message || error);
      
      const fallbackSummary = `• Laporan mengenai "${title}" menggarisbawahi urgensi inisiatif positif dan kontribusi lokal di daerah luar wilayah metropolitan.\n• Artikel ini menekankan pentingnya adopsi teknologi berkesinambungan dan kearifan lokal dalam memperkuat kemakmuran warga daerah.\n• Tebarmedia menyimpulkan bahwa kolaborasi jurnalisme konstruktif dapat mereduksi ketimpangan informasi di seluruh Indonesia secara merata.`;
      
      res.json({ summary: fallbackSummary, isMock: true, notice: "Ringkasan dirumuskan secara lokal oleh stasiun redaksi cadangan." });
    }
  });

  // API Endpoint: ChatGPT style discussion about an article
  app.post("/api/news/chat", async (req, res) => {
    const { messages, articleTitle, articleContent } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Riwayat percakapan tidak valid" });
    }

    if (!hasApiKey) {
      const lastUserMsg = messages[messages.length - 1].text;
      const mockReply = `Halo! Saya Redaktur AI Tebar. Pertanyaan Anda mengenai "${lastUserMsg}" sangat bagus terkait berita "${articleTitle}". Silakan hubungkan akun Google Gemini API Anda untuk mendapatkan percakapan langsung yang cerdas dan kaya wawasan secara real-time.`;
      return res.json({ reply: mockReply, isMock: true });
    }

    try {
      // Take the last user message and format the history or prompt
      const lastMessage = messages[messages.length - 1];
      
      // We pass the context in system instructions
      const systemInstruction = 
        `Anda adalah "Redaktur AI Tebarmedia", pakar media yang berwibawa, bijak, ramah, dan sangat memahami kode etik jurnalistik. ` +
        `Tugas Anda adalah memandu forum tanya-jawab santai bersama pembaca mengenai artikel berikut:\n` +
        `=== JUDUL ARTIKEL ===\n${articleTitle}\n\n` +
        `=== KONTEN ARTIKEL ===\n${articleContent}\n\n` +
        `PERATURAN:\n` +
        `1. Jawab pertanyaan pembaca secara jernih, faktual, dan objektif dalam Bahasa Indonesia menggunakan nada khas redaktur Tebarmedia.\n` +
        `2. Prioritaskan fakta yang ada di artikel. Jika pembaca bertanya hal di luar artikel yang masih beririsan, jawab sewajarnya dibarengi edukasi.\n` +
        `3. Jika pertanyaan sama sekali tidak relevan dengan artikel atau dunia media, kembalikan percakapan ke konteks artikel dengan halus dan sopan.\n` +
        `4. Jaga agar jawaban ringkas, informatif, dan tidak menggurui berlebihan. Gunakan format teks yang elegan (penebalan, baris baru jika perlu).`;

      // Structure messages for Gemini chat
      // Maps user and model roles correctly
      const chatContents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContents,
        config: {
          systemInstruction: systemInstruction
        }
      });

      res.json({ reply: response.text, isMock: false });
    } catch (error: any) {
      console.warn("Gemini Chat API failure / Quota reached, falling back gracefully. Error trace:", error.message || error);
      
      const lastUserMsg = messages[messages.length - 1]?.text || "";
      const fallbackReply = `Halo! Saya Redaktur AI Tebarmedia. Dikarenakan jalur satelit utama kami saat ini sedang sangat padat/terbatas kuotanya, saya merespons Anda menggunakan stasiun transmisi cadangan kami secara lokal:\n\nPikiran/pertanyaan Anda tentang **"${lastUserMsg}"** sangat krusial dalam mendiskusikan jurnalisme konstruktif berimbang dari berita **"${articleTitle}"**. Hal ini menunjukkan kepedulian yang mendalam terhadap pemahaman dan keadilan informasi bagi khalayak ramai. \n\nBagaimana menurut Anda, apakah ada hal lain terkait artikel ini yang paling menarik perhatian Anda?`;
      
      res.json({ reply: fallbackReply, isMock: true, notice: "Sesi dialihkan sementara ke stasiun komunikasi cadangan." });
    }
  });

  // Vite development middleware vs Static Production build setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
