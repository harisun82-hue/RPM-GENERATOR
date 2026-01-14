
import { GoogleGenAI } from "@google/genai";
import { FormData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateRPM(data: FormData): Promise<string> {
  // Step 1: Generate Identitas to Pengalaman Belajar
  const prompt1 = `
    Bertindaklah sebagai Ahli Kurikulum Merdeka di Indonesia. Buatkan draft Rencana Pembelajaran Mendalam (RPM) bagian awal.
    
    PENTING: JANGAN BERIKAN KATA PENGANTAR (seperti "Berikut adalah..."). LANGSUNG MULAI DENGAN OUTPUT MARKDOWN.
    
    DATA INPUT:
    Sekolah: ${data.sekolah}
    Kepala Sekolah: ${data.kepsek} (NIP: ${data.nipKepsek})
    Guru: ${data.guru} (NIP: ${data.nipGuru})
    Tempat/Tanggal: ${data.tempat}, ${data.tanggal}
    Mapel: ${data.mapel}
    Kelas/Fase: ${data.kelas}
    Semester: ${data.semester}
    Tahun: ${data.tahun}
    Alokasi: ${data.alokasiWaktu}
    Jumlah Pertemuan: ${data.jumlahPertemuan}
    Capaian Pembelajaran: ${data.capaianPembelajaran}
    Tujuan Pembelajaran: ${data.tujuanPembelajaran}

    STRUKTUR YANG HARUS DIIKUTI (Markdown):
    # RENCANA PEMBELAJARAN MENDALAM (RPM)

    ## A. IDENTITAS MODUL
    (Tabel Markdown: Sekolah, Penyusun, Mapel, Kelas, Semester, Tahun, Topik, Alokasi Waktu Total).

    ## B. IDENTIFIKASI
    1. **Identifikasi Peserta Didik**: Analisis profil belajar murid.
    2. **Materi Pelajaran**: Konsep esensial.
    3. **Dimensi Profil Lulusan (DPL)**: Pilih 3 dimensi yang paling relevan.

    ## C. DESAIN PEMBELAJARAN
    (Tabel 2 Kolom: CP, TP, Strategi Pedagogis, Kemitraan, Lingkungan Belajar, Alat Digital).

    ## D. PENGALAMAN BELAJAR
    Ulangi struktur berikut sebanyak ${data.jumlahPertemuan} kali:

    ### PERTEMUAN KE-[X]
    **1. Kegiatan Awal** 
    - Langkah konkret (Apersepsi, Motivasi, Tujuan).
    - *Prinsip: (Pilih yang relevan: Berkesadaran / Bermakna / Menggembirakan)*.

    **2. Kegiatan Inti (Deep Learning)** 
    - **Memahami (Eksplorasi)**: Aktivitas konkret & Produk murid. *Prinsip: (Pilih yang relevan: Berkesadaran / Bermakna / Menggembirakan)*.
    - **Mengaplikasikan (Aksi Nyata)**: Tugas Kontekstual & Produk murid. *Prinsip: (Pilih yang relevan: Berkesadaran / Bermakna / Menggembirakan)*.
    - **Merefleksi (Makna)**: Pertanyaan refleksi. *Prinsip: (Pilih yang relevan: Berkesadaran / Bermakna / Menggembirakan)*.

    **3. Kegiatan Penutup** 
    - Kesimpulan, Umpan Balik, Doa.
    - *Prinsip: (Pilih yang relevan: Berkesadaran / Bermakna / Menggembirakan)*.
    
    CATATAN: JANGAN tuliskan kolom tanda tangan di sini.
  `;

  const response1 = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt1,
  });

  const part1 = response1.text || "";

  // Step 2: Generate Assessment to Appendices
  const prompt2 = `
    Lanjutkan draft RPM berikut ini. 
    PENTING: JANGAN BERIKAN KATA PENGANTAR. LANGSUNG MULAI DENGAN OUTPUT MARKDOWN.
    
    Mapel: ${data.mapel}
    CP: ${data.capaianPembelajaran}
    TP: ${data.tujuanPembelajaran}
    Jumlah Pertemuan: ${data.jumlahPertemuan}
    
    STRUKTUR:
    ## E. ASESMEN
    (Detail Asesmen Awal, Formatif, dan Sumatif). JANGAN lampirkan kolom tanda tangan.

    ## F. PENGESAHAN
    Gunakan format HTML ini:
    <table border="0" width="100%" style="margin-top: 50px; border: none; font-family: 'Times New Roman';">
      <tr>
        <td width="50%" align="center" style="border: none; vertical-align: top;">
          Mengetahui,<br>Kepala Sekolah<br><br><br><br><br>
          <strong>${data.kepsek}</strong><br>NIP. ${data.nipKepsek}
        </td>
        <td width="50%" align="center" style="border: none; vertical-align: top;">
          ${data.tempat}, ${data.tanggal}<br>Guru Kelas<br><br><br><br><br>
          <strong>${data.guru}</strong><br>NIP. ${data.nipGuru}
        </td>
      </tr>
    </table>

    ## G. LAMPIRAN
    1. **LKPD (Lembar Kerja Peserta Didik)**
       (Buatkan LKPD yang berbeda untuk SETIAP pertemuan. Karena ada ${data.jumlahPertemuan} pertemuan, buatkan LKPD 1 sampai LKPD ${data.jumlahPertemuan}).
    2. **MATERI AJAR**
       (Ringkasan esensial).
    3. **RUBRIK ASESMEN**
       (Tabel Markdown: Aspek, Kriteria, Skor).
  `;

  const response2 = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt2,
  });

  const part2 = response2.text || "";

  // Combine and clean up common AI conversational phrases
  let fullContent = `${part1}\n\n${part2}`;
  fullContent = fullContent.replace(/^(Berikut adalah|Tentu|Berikut ini|Lanjutan|Tentu saja).*?\n/gi, '');
  
  return fullContent.trim();
}

export async function generateToolbox(type: string, data: FormData): Promise<string> {
  const prompt = `Berikan ide kreatif untuk ${type} pada mata pelajaran ${data.mapel} kelas ${data.kelas} dengan tujuan: ${data.tujuanPembelajaran}. Tampilkan dalam format Markdown. JANGAN berikan kata pembuka.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  return response.text?.trim() || "Gagal menghasilkan data.";
}
