
import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  RefreshCw,
  Coffee,
  HelpCircle,
  ClipboardList,
  MessageCircle,
  GraduationCap,
  Layers,
  School,
  Layout,
  Eye,
  Edit3,
  Menu,
  X as CloseIcon
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
  const [mobileView, setMobileView] = useState<'input' | 'preview'>('input');
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
    try {
      const result = await generateRPM(formData);
      setGeneratedContent(result);
      if (window.innerWidth < 768) {
        setMobileView('preview');
      }
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
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'><style>@page { size: 21.0cm 33.0cm; margin: 2.5cm 2.0cm; } body { font-family: 'Times New Roman', serif; font-size: 12pt; } h1 { text-align: center; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid black; padding: 5pt; } .no-border, .no-border td { border: none !important; }</style></head><body>`;
    const cleanedHtml = (bodyHtml as string).replace(/<table border="0"/g, '<table border="0" class="no-border"');
    const source = header + cleanedHtml + "</body></html>";
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPM_${formData.mapel}_${formData.kelas}.doc`;
    link.click();
  };

  const inputClasses = "w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-900 transition-all font-medium shadow-sm";
  const labelClasses = "text-[10px] md:text-xs font-bold text-slate-700 uppercase tracking-widest";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden text-gray-800 bg-slate-50">
      
      {/* MOBILE HEADER TAB SWITCHER */}
      <div className="md:hidden flex bg-[#1e3a8a] text-white shadow-lg z-50">
        <button 
          onClick={() => setMobileView('input')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${mobileView === 'input' ? 'bg-blue-800 border-b-4 border-white' : 'opacity-70'}`}
        >
          <Edit3 size={18} /> FORM INPUT
        </button>
        <button 
          onClick={() => setMobileView('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition-colors ${mobileView === 'preview' ? 'bg-blue-800 border-b-4 border-white' : 'opacity-70'}`}
        >
          <Eye size={18} /> HASIL PREVIEW
        </button>
      </div>

      {/* LEFT PANEL: INPUT */}
      <aside className={`${mobileView === 'input' ? 'flex' : 'hidden'} md:flex w-full md:w-[35%] h-full bg-slate-100 border-r shadow-lg flex-col overflow-y-auto scrollbar-hide`}>
        <header className="hidden md:block p-6 bg-[#1e3a8a] text-white sticky top-0 z-20 shadow-md">
          <h1 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <FileText className="text-blue-400" />
            RPM GENERATOR
          </h1>
          <p className="text-xs text-blue-200 mt-1 opacity-100 font-bold uppercase tracking-widest">By Hairur Rahman</p>
        </header>

        <div className="p-4 md:p-6 space-y-6 pb-24 md:pb-6">
          {/* Identity Section */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="flex items-center gap-2 font-black text-blue-900 mb-4 md:mb-6 border-b border-slate-100 pb-3">
              <School size={18} className="text-blue-600" /> IDENTITAS SEKOLAH
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Nama Sekolah</label>
                <input name="sekolah" value={formData.sekolah} onChange={handleInputChange} className={inputClasses} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Kepala Sekolah</label>
                  <input name="kepsek" value={formData.kepsek} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>NIP Kepsek</label>
                  <input name="nipKepsek" value={formData.nipKepsek} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Guru</label>
                  <input name="guru" value={formData.guru} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>NIP Guru</label>
                  <input name="nipGuru" value={formData.nipGuru} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
            </div>
          </div>

          {/* Module Section */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="flex items-center gap-2 font-black text-blue-900 mb-4 md:mb-6 border-b border-slate-100 pb-3">
              <Layers size={18} className="text-blue-600" /> MODUL PEMBELAJARAN
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Mapel</label>
                  <select name="mapel" value={formData.mapel} onChange={handleInputChange} className={inputClasses}>
                    {MAPEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Kelas</label>
                  <select name="kelas" value={formData.kelas} onChange={handleInputChange} className={inputClasses}>
                    {KELAS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Pertemuan</label>
                  <input name="jumlahPertemuan" type="number" min="1" value={formData.jumlahPertemuan} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Alokasi</label>
                  <input name="alokasiWaktu" value={formData.alokasiWaktu} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>
            </div>
          </div>

          {/* CP/TP Section */}
          <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="flex items-center gap-2 font-black text-blue-900 mb-4 md:mb-6 border-b border-slate-100 pb-3">
              <GraduationCap size={18} className="text-blue-600" /> TUJUAN & CAPAIAN
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Capaian Pembelajaran</label>
                <textarea name="capaianPembelajaran" value={formData.capaianPembelajaran} onChange={handleInputChange} className={`${inputClasses} min-h-[80px]`} />
              </div>
              <div>
                <label className={labelClasses}>Tujuan Pembelajaran</label>
                <textarea name="tujuanPembelajaran" value={formData.tujuanPembelajaran} onChange={handleInputChange} className={`${inputClasses} min-h-[80px]`} />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-4 md:py-5 rounded-3xl font-black text-base md:text-lg flex items-center justify-center gap-3 md:gap-4 hover:bg-blue-900 transition-all shadow-xl active:scale-[0.97] disabled:opacity-70 group"
          >
            {loading ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                MENGHUBUNGI AI...
              </>
            ) : (
              <>
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                GENERATE RPM (PRO AI)
              </>
            )}
          </button>

          {/* Toolbox Grid */}
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {[
              { type: 'icebreaker', icon: Coffee, label: 'ICE', bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-200' },
              { type: 'banksoal', icon: HelpCircle, label: 'SOAL', bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-200' },
              { type: 'rubrik', icon: ClipboardList, label: 'RUBRIK', bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200' },
              { type: 'refleksi', icon: MessageCircle, label: 'REFLX', bg: 'bg-pink-100', text: 'text-pink-900', border: 'border-pink-200' }
            ].map((tool) => (
              <button 
                key={tool.type}
                onClick={() => setActiveTool(tool.type as ToolType)} 
                className={`flex flex-col items-center p-2 md:p-3 ${tool.bg} ${tool.text} rounded-2xl hover:scale-105 active:scale-95 transition-all border-2 ${tool.border} shadow-sm`}
              >
                <tool.icon size={20} />
                <span className="text-[8px] md:text-[10px] mt-1 font-black uppercase tracking-tighter text-center">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: PREVIEW */}
      <main className={`${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 h-full bg-[#1e1e1e] overflow-y-auto p-4 md:p-12 flex-col items-center relative scrollbar-thin`}>
        
        {/* Floating Export Buttons for Mobile */}
        <div className="flex md:fixed top-4 md:top-6 right-4 md:right-12 gap-2 md:gap-4 z-30 w-full md:w-auto justify-center mb-6 md:mb-0">
          <button 
            onClick={exportPDF} 
            disabled={!generatedContent}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-rose-700 px-4 md:px-7 py-3 md:py-3.5 rounded-full font-black shadow-2xl disabled:opacity-30 border-2 border-rose-100 text-xs md:text-sm"
          >
            <Printer size={18} /> <span className="hidden sm:inline">SIMPAN</span> PDF
          </button>
          <button 
            onClick={exportWord} 
            disabled={!generatedContent}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-7 py-3 md:py-3.5 rounded-full font-black shadow-2xl disabled:opacity-30 text-xs md:text-sm"
          >
            <Download size={18} /> <span className="hidden sm:inline">EKSPOR</span> WORD
          </button>
        </div>

        {/* Paper Container */}
        <div className="paper-f4 prose prose-slate max-w-none shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] relative z-10" ref={previewRef} id="preview-content">
          {generatedContent ? (
            <div dangerouslySetInnerHTML={{ __html: marked(generatedContent) }} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] md:min-h-[500px] text-gray-400 border-4 border-dashed border-white/5 rounded-[40px] p-6 md:p-24 text-center">
              <Sparkles size={60} className="opacity-20 text-white mb-6" />
              <p className="text-xl md:text-3xl font-black text-white/40 italic">Mulai Desain RPM</p>
              <p className="text-xs md:text-sm mt-4 opacity-40 text-white/50">Klik "GENERATE RPM" untuk melihat hasil AI.</p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-white/10 text-[10px] md:text-xs pb-16 font-bold uppercase tracking-widest text-center border-t border-white/5 pt-8 w-full max-w-4xl">
          RPM Generator &copy; 2025 Hairur Rahman
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
