
import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { generateToolbox } from '../services/geminiService';
import { FormData, ToolType } from '../types';
import { marked } from 'marked';

interface Props {
  type: ToolType;
  data: FormData;
  onClose: () => void;
}

const ToolboxModal: React.FC<Props> = ({ type, data, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const titles: Record<ToolType, string> = {
    icebreaker: 'Ide Ice Breaker',
    banksoal: 'Bank Soal Materi',
    rubrik: 'Rubrik Penilaian',
    refleksi: 'Pertanyaan Refleksi'
  };

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await generateToolbox(type, data);
        setContent(res);
      } catch (error) {
        setContent("Terjadi kesalahan saat menghubungi AI.");
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [type, data]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-blue-900 text-white rounded-t-xl">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={20} />
            {titles[type]}
          </h3>
          <button onClick={onClose} className="hover:bg-blue-800 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-blue-900" size={48} />
              <p className="text-gray-500 font-medium">AI sedang meracik ide untuk Anda...</p>
            </div>
          ) : (
            <div 
              className="prose prose-blue max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: marked(content) }}
            />
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolboxModal;
