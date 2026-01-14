
export interface FormData {
  sekolah: string;
  kepsek: string;
  nipKepsek: string;
  guru: string;
  nipGuru: string;
  tempat: string;
  tanggal: string;
  mapel: string;
  kelas: string;
  semester: string;
  tahun: string;
  alokasiWaktu: string;
  jumlahPertemuan: number;
  tujuanPembelajaran: string;
  capaianPembelajaran: string;
}

export type ToolType = 'icebreaker' | 'banksoal' | 'rubrik' | 'refleksi';

export interface ToolModalProps {
  type: ToolType;
  onClose: () => void;
  data: FormData;
}
