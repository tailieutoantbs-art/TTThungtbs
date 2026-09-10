import React, { useState } from 'react';
import { exportWordDocument } from '../utils/wordExport';
import { exportPowerPointSlides } from '../utils/pptxExport';
import { Download, FileText, Presentation, FileCode, Upload, Layers, Check, Sparkles, HardDrive, ExternalLink } from 'lucide-react';

export const ExportTab = ({ problems, options, onImportJson }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSingleWord = async () => {
    setIsExporting(true);
    try {
      await exportWordDocument(problems, options, false);
    } catch (e) {
      alert('Lỗi xuất file Word: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport4VariantsWord = async () => {
    setIsExporting(true);
    try {
      await exportWordDocument(problems, options, true);
    } catch (e) {
      alert('Lỗi xuất file Word 4 mã đề: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPTX = () => {
    try {
      exportPowerPointSlides(problems, options);
    } catch (e) {
      alert('Lỗi xuất PowerPoint: ' + e.message);
    }
  };

  const handleImportJsonFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          onImportJson(data);
          alert('Nhập dữ liệu 10 bài toán từ file JSON thành công!');
        } else if (data.problems && Array.isArray(data.problems)) {
          onImportJson(data.problems);
          alert('Nhập dữ liệu 10 bài toán từ file JSON thành công!');
        } else {
          alert('File JSON không đúng cấu trúc bộ 10 bài toán.');
        }
      } catch {
        alert('Không thể đọc dữ liệu từ file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(problems, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bo_10_Bai_Toan_Thuc_Te_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  if (!problems || problems.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <Download className="w-12 h-12 mx-auto text-slate-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Chưa Có Dữ Liệu Để Xuất File</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Tạo bộ 10 bài toán ở tab Nhập Đề Bài trước khi thực hiện xuất file Word hoặc PowerPoint.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Xuất Đề Thi Word (.docx), PowerPoint (.pptx) & JSON</h2>
            <p className="text-xs text-slate-500">
              Xuất bộ 10 bài toán thực tế thành file Word in ấn, trộn 4 mã đề thi (101-104), hoặc slide trình chiếu PowerPoint.
            </p>
          </div>
        </div>

        <a
          href="https://drive.google.com/drive/u/0/folders/1kTksrY_Uk13yRTY_pmA6peLzZwkw-rZr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors whitespace-nowrap"
        >
          <HardDrive className="w-4 h-4" /> Mở Thư Mục Google Drive <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Dataset Status Summary Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Dữ Liệu Đang Kích Hoạt ({problems.length} Bài Toán Thực Tế)
            </h4>
            <p className="text-slate-500">
              Môn: {options.domain || 'Toán học'} | Khối: {options.grade || 'GDPT'} | Mã TikZ: {problems.filter(p => p.tikzCode).length}/10 câu | Prompt Ảnh: {problems.filter(p => p.imagePrompt).length}/10 câu
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
          Đã Đồng Bộ 100%
        </span>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Option 1: File Word Full (1 File) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Xuất File Word (.docx) Chuẩn</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tạo 01 file Word duy nhất chứa toàn bộ 10 bài toán, bảng đáp án và hệ thống lời giải chi tiết từng bước.
            </p>
          </div>
          <button
            onClick={handleExportSingleWord}
            disabled={isExporting}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Xuất Word (Full 10 Câu)
          </button>
        </div>

        {/* Option 2: Trộn 4 Mã Đề Thi (101-104) */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-900/10 to-teal-900/10 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 shadow-sm hover:border-emerald-500 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 w-fit rounded-xl bg-emerald-600 text-white shadow-md">
                <Layers className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase">
                PRO FEATURE
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Trộn 4 Mã Đề Thi (Mã 101 - 104)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tự động xáo trộn thứ tự bài toán & đáp án thành 4 mã đề thi khác nhau kèm <strong>Bảng Ma Trận Đáp Án Đề 101-104</strong>.
            </p>
          </div>
          <button
            onClick={handleExport4VariantsWord}
            disabled={isExporting}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" /> Xuất 4 Mã Đề Thi (Word)
          </button>
        </div>

        {/* Option 3: PowerPoint Slide (.pptx) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Presentation className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Xuất Slide PowerPoint (.pptx)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tự động tạo file trình chiếu PowerPoint 16:9 với từng slide bài toán và lời giải để giáo viên chiếu trên lớp.
            </p>
          </div>
          <button
            onClick={handleExportPPTX}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Presentation className="w-4 h-4" /> Xuất Slide PowerPoint (.pptx)
          </button>
        </div>
      </div>

      {/* JSON Import/Export Backup Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-600" /> Quản Lý Dữ Liệu Cấu Trúc JSON
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-500">
            Xuất dữ liệu 10 bài toán thành file JSON để lưu trữ dự phòng hoặc nhập file JSON có sẵn từ đồng nghiệp.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Xuất File JSON
            </button>
            <label className="cursor-pointer px-3.5 py-2 rounded-xl font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Nhập File JSON
              <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
