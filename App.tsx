
import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Send, 
  Sparkles, 
  ChevronRight, 
  RefreshCw,
  Coffee,
  HelpCircle,
  ClipboardList,
  MessageCircle,
  GraduationCap,
  Calendar,
  MapPin,
  Clock,
  Layers,
  User,
  School,
  BookOpen
} from 'lucide-react';
import { marked } from 'marked';
import { generateRPM } from './services/geminiService';
import { FormData, ToolType } from './types';
import ToolboxModal from './components/ToolboxModals';

const INITIAL_FORM: FormData = {
  sekolah: 'SD Negeri 1 Contoh',
  kepsek: 'Drs. Budi Santoso, M.Pd.',
  nipKepsek: '19700101 199501 1 001',
  guru: 'Hairur Rahman, S.Pd.',
  nipGuru: '19900505 201501 1 002',
  tempat: 'Sumenep',
  tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  mapel: 'Bahasa Indonesia',
  kelas: 'IV/B',
  semester: 'Ganjil',
  tahun: '2023/2024',
  alokasiWaktu: '2 JP (2 x 35 Menit)',
  jumlahPertemuan: 1,
  capaianPembelajaran: 'Peserta didik mampu memahami ide pokok (gagasan) suatu pesan lisan, informasi dari media audio, teks aural (teks yang dibacakan dan/atau didengar), dan instruksi lisan yang berkaitan dengan tujuan berkomunikasi.',
  tujuanPembelajaran: 'Peserta didik mampu menceritakan kembali isi teks narasi dengan bahasa sendiri secara runtut.'
};

const MAPEL_OPTIONS = [
  "Pendidikan Agama Islam", "Pendidikan Pancasila", "Bahasa Indonesia", 
  "Matematika", "IPAS", "Seni Rupa", "Seni Tari", "Seni Musik", 
  "PJOK", "Bahasa Inggris", "Bahasa Madura"
];

const KELAS_OPTIONS = ["I/A", "II/A", "III/B", "IV/B", "V/C", "VI/C"];

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'jumlahPertemuan' ? parseInt(value) || 1 : value 
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedContent('');
    try {
      const result = await generateRPM(formData);
      setGeneratedContent(result);
    } catch (error) {
      alert("Gagal menghubungi AI. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!previewRef.current) return;
    const element = previewRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `RPM_${formData.mapel}_${formData.kelas}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: [210, 330], orientation: 'portrait' }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  const exportWord = () => {
    if (!generatedContent) return;
    
    const bodyHtml = marked.parse(generatedContent);
    
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'>
      <style>
        @page { size: 21.0cm 33.0cm; margin: 2.5cm 2.0cm 2.5cm 2.0cm; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
        h1 { font-size: 16pt; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 20pt; }
        h2 { font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; color: #1e3a8a; }
        h3 { font-size: 12pt; font-weight: bold; margin-top: 15pt; }
        table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
        table, th, td { border: 1px solid black; }
        table.no-border, table.no-border td { border: none !important; }
        th, td { padding: 8pt; vertical-align: top; }
        p { margin-bottom: 10pt; text-align: justify; }
        ul { margin-bottom: 10pt; }
      </style>
      </head><body>
    `;
    const footer = `</body></html>`;
    
    const cleanedHtml = bodyHtml.replace(/<table border="0"/g, '<table border="0" class="no-border"');
    
    const source = header + cleanedHtml + footer;
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPM_${formData.mapel}_${formData.kelas}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const inputClasses = "w-full mt-1.5 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-900 transition-all font-medium shadow-sm";
  const labelClasses = "text-xs font-bold text-slate-700 uppercase tracking-wider";

  return (
    <div className="flex h-screen overflow-hidden text-gray-800">
      {/* LEFT PANEL: INPUT (35%) */}
      <aside className="w-[35%] h-full bg-slate-100 border-r shadow-lg flex flex-col overflow-y-auto scrollbar-hide">
        <header className="p-6 bg-[#1e3a8a] text-white sticky top-0 z-20 shadow-md">
          <h1 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <FileText className="text-blue-400" />
            RPM GENERATOR
          </h1>
          <p className="text-xs text-blue-200 mt-1 opacity-100 font-bold uppercase tracking-widest">By Hairur Rahman</p>
        </header>

        <div className="p-6 space-y-6">
          {/* Section A: Identitas */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
            <h2 className="flex items-center gap-2 font-black text-blue-900 mb-6 border-b border-slate-100 pb-3">
              <School size={20} className="text-blue-600" /> A. IDENTITAS SEKOLAH
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Nama Sekolah</label>
                <input name="sekolah" value={formData.sekolah} onChange={handleInputChange} className={inputClasses} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Kepala Sekolah</label>
                  <input name="kepsek" value={formData.kepsek} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>NIP Kepsek</label>
                  <input name="nipKepsek" value={formData.nipKepsek} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Nama Guru</label>
                  <input name="guru" value={formData.guru} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>NIP Guru</label>
                  <input name="nipGuru" value={formData.nipGuru} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Tempat</label>
                  <input name="tempat" value={formData.tempat} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Tanggal</label>
                  <input name="tanggal" value={formData.tanggal} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Modul */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
            <h2 className="flex items-center gap-2 font-black text-blue-900 mb-6 border-b border-slate-100 pb-3">
              <Layers size={20} className="text-blue-600" /> B. MODUL PEMBELAJARAN
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Mata Pelajaran</label>
                  <select name="mapel" value={formData.mapel} onChange={handleInputChange} className={inputClasses}>
                    {MAPEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Kelas/Fase</label>
                  <select name="kelas" value={formData.kelas} onChange={handleInputChange} className={inputClasses}>
                    {KELAS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Semester</label>
                  <select name="semester" value={formData.semester} onChange={handleInputChange} className={inputClasses}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Tahun Pelajaran</label>
                  <input name="tahun" value={formData.tahun} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Alokasi Waktu</label>
                  <input name="alokasiWaktu" value={formData.alokasiWaktu} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Jumlah Pertemuan</label>
                  <input name="jumlahPertemuan" type="number" min="1" value={formData.jumlahPertemuan} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Materi */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
            <h2 className="flex items-center gap-2 font-black text-blue-900 mb-6 border-b border-slate-100 pb-3">
              <GraduationCap size={20} className="text-blue-600" /> C. TUJUAN & CAPAIAN
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Capaian Pembelajaran (CP)</label>
                <textarea 
                  name="capaianPembelajaran" 
                  value={formData.capaianPembelajaran} 
                  onChange={handleInputChange} 
                  className={`${inputClasses} min-h-[100px] resize-none leading-relaxed`} 
                  placeholder="Isi Capaian Pembelajaran sesuai kurikulum..." 
                />
              </div>
              <div>
                <label className={labelClasses}>Tujuan Pembelajaran (TP)</label>
                <textarea 
                  name="tujuanPembelajaran" 
                  value={formData.tujuanPembelajaran} 
                  onChange={handleInputChange} 
                  className={`${inputClasses} min-h-[100px] resize-none leading-relaxed`} 
                  placeholder="Apa yang ingin dicapai dalam pembelajaran ini?" 
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-4 hover:bg-blue-900 transition-all shadow-xl active:scale-[0.97] disabled:opacity-70 group"
          >
            {loading ? (
              <>
                <RefreshCw size={28} className="animate-spin" />
                MENGHUBUNGI AI...
              </>
            ) : (
              <>
                <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                GENERATE RPM (PRO AI)
              </>
            )}
          </button>

          {/* Toolbox */}
          <div className="grid grid-cols-4 gap-3 pb-16">
            {[
              { type: 'icebreaker', icon: Coffee, label: 'ICE BREAK', bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-200' },
              { type: 'banksoal', icon: HelpCircle, label: 'SOAL', bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-200' },
              { type: 'rubrik', icon: ClipboardList, label: 'RUBRIK', bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200' },
              { type: 'refleksi', icon: MessageCircle, label: 'REFLEKSI', bg: 'bg-pink-100', text: 'text-pink-900', border: 'border-pink-200' }
            ].map((tool) => (
              <button 
                key={tool.type}
                onClick={() => setActiveTool(tool.type as ToolType)} 
                className={`flex flex-col items-center p-3 ${tool.bg} ${tool.text} rounded-2xl hover:scale-105 active:scale-95 transition-all border-2 ${tool.border} shadow-sm group`}
              >
                <tool.icon size={24} className="group-hover:rotate-6 transition-transform" />
                <span className="text-[10px] mt-2 font-black uppercase tracking-tighter text-center leading-none">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: PREVIEW (65%) */}
      <main className="w-[65%] h-full bg-[#1e1e1e] overflow-y-auto p-12 flex flex-col items-center relative scrollbar-thin scrollbar-thumb-gray-600">
        <div className="fixed top-6 right-12 flex gap-4 z-30">
          <button 
            onClick={exportPDF} 
            disabled={!generatedContent}
            className="flex items-center gap-2 bg-white text-rose-700 px-7 py-3.5 rounded-full font-black shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-rose-50 transition-all active:scale-95 border-2 border-rose-100"
          >
            <Printer size={22} /> SIMPAN PDF
          </button>
          <button 
            onClick={exportWord} 
            disabled={!generatedContent}
            className="flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-full font-black shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95"
          >
            <Download size={22} /> EKSPOR WORD
          </button>
        </div>

        {/* Paper Component */}
        <div className="paper-f4 prose prose-slate max-w-none shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] relative z-10" ref={previewRef} id="preview-content">
          {generatedContent ? (
            <div dangerouslySetInnerHTML={{ __html: marked(generatedContent) }} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-gray-400 border-4 border-dashed border-white/5 rounded-[40px] p-24 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                <Sparkles size={100} className="relative opacity-20 text-white animate-bounce" />
              </div>
              <p className="text-3xl font-black text-white/40 tracking-tight italic">Mulai Desain RPM Anda</p>
              <p className="text-sm mt-4 max-w-sm opacity-40 text-white/50 leading-relaxed">Gunakan kecerdasan buatan Gemini Pro untuk menghasilkan rencana pembelajaran yang mendalam, bermakna, dan menyenangkan.</p>
            </div>
          )}
        </div>

        <footer className="mt-16 text-white/10 text-xs pb-16 font-bold uppercase tracking-widest text-center border-t border-white/5 pt-8 w-full max-w-4xl">
          RPM Generator &copy; 2025 Hairur Rahman - Professional Deep Learning Architect
        </footer>
      </main>

      {/* Toolbox Modal */}
      {activeTool && (
        <ToolboxModal 
          type={activeTool} 
          data={formData} 
          onClose={() => setActiveTool(null)} 
        />
      )}
    </div>
  );
};

export default App;
