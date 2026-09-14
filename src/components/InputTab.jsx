import React, { useState } from 'react';
import { SAMPLE_PROBLEMS } from '../utils/sampleData';
import { MathRenderer } from './MathRenderer';
import {
  FileText,
  UploadCloud,
  Sparkles,
  BookOpen,
  Sliders,
  Trash2,
  Save,
  RotateCcw,
  Layers,
  HelpCircle,
  Zap,
  Check,
  AlertTriangle,
  FileImage,
  RefreshCw,
} from 'lucide-react';

export const InputTab = ({
  sourceProblemText,
  options,
  analysis,
  isAnalyzing,
  isGenerating,
  progressStep,
  progressPercent,
  onChangeSourceText,
  onChangeOptions,
  onAnalyzeProblem,
  onGenerate10,
  onLoadSample,
  onClearData,
  onSaveDraft,
  onRestoreDraft,
  onOpenApiKeyModal,
  apiKey,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  const handleSelectSample = (e) => {
    const id = e.target.value;
    setSelectedSampleId(id);
    const sample = SAMPLE_PROBLEMS.find((s) => s.id === id);
    if (sample) {
      onChangeSourceText(sample.text);
      if (sample.grade) onChangeOptions({ ...options, grade: sample.grade });
      if (sample.domain) onChangeOptions({ ...options, domain: sample.domain });
    }
  };

  const handleOptionChange = (key, value) => {
    onChangeOptions({ ...options, [key]: value });
  };

  // OCR Image/PDF upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsOcrLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        const res = await fetch('/api/gemini/ocr-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
            apiKey: apiKey,
          }),
        });

        const data = await res.json();
        if (data.success && data.extractedText) {
          onChangeSourceText(data.extractedText);
          alert('Trích xuất văn bản từ ảnh/tài liệu thành công!');
        } else {
          alert(data.error || 'Không thể trích xuất văn bản từ ảnh.');
        }
        setIsOcrLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Lỗi đọc file ảnh/tài liệu.');
      setIsOcrLoading(false);
    }
  };

  // Clipboard Image Paste Handler (Ctrl + V direct OCR)
  const handlePasteImage = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type && item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (!blob) continue;

        if (!apiKey) {
          alert('Chưa cài đặt Gemini API Key. Vui lòng cài đặt API Key để trích xuất đề từ ảnh dán.');
          return;
        }

        setIsOcrLoading(true);
        try {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64 = event.target.result;
            const res = await fetch('/api/gemini/ocr-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: base64,
                mimeType: blob.type || 'image/png',
                apiKey: apiKey,
              }),
            });

            const data = await res.json();
            if (data.success && data.extractedText) {
              onChangeSourceText(data.extractedText);
              alert('Đã trích xuất thành công đề bài từ ảnh chụp dán trực tiếp (Ctrl + V)!');
            } else {
              alert(data.error || 'Không thể trích xuất nội dung từ ảnh dán.');
            }
            setIsOcrLoading(false);
          };
          reader.readAsDataURL(blob);
        } catch {
          alert('Lỗi đọc dữ liệu ảnh từ clipboard.');
          setIsOcrLoading(false);
        }
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Instructions Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-sky-900/10 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Nhập Đề Bài Gốc & Thiết Lập Tùy Chỉnh Sáng Tạo 4.0
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Nhập văn bản, dán trực tiếp ảnh (Ctrl+V) hoặc nạp đề mẫu để Gemini AI trích xuất tự động.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" /> Lưu Nháp
            </button>
            <button
              onClick={onRestoreDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" /> Khôi Phục
            </button>
            <button
              onClick={onClearData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa Dữ Liệu
            </button>
          </div>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Source Problem Text & OCR */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Đề Bài Toán / Khoa Học Gốc
                </label>
                {sourceProblemText && (
                  <button
                    onClick={() => onChangeSourceText('')}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors flex items-center gap-1"
                    title="Xóa nhanh nội dung đề bài cũ"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa Nhanh Đề Cũ
                  </button>
                )}
              </div>

              {/* Sample Select Box */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSampleId}
                  onChange={handleSelectSample}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn Đề Bài Mẫu GDPT 2018 --</option>
                  {SAMPLE_PROBLEMS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Textarea Input with Clipboard Image Paste Handler */}
            <div className="relative">
              <textarea
                value={sourceProblemText}
                onChange={(e) => onChangeSourceText(e.target.value)}
                onPaste={handlePasteImage}
                placeholder="Nhập/dán chữ đề bài toán gốc HOẶC DÁN TRỰC TIẾP ẢNH CHỤP ĐỀ (Ctrl + V) vào đây để AI đọc tự động..."
                rows={8}
                className="w-full p-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed resize-y"
              />
              {isOcrLoading && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-xs font-bold gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
                  Đang dùng AI đọc & trích xuất văn bản từ ảnh chụp...
                </div>
              )}
            </div>

            {/* OCR Vision Upload Dropzone */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <FileImage className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Trích xuất đề từ Ảnh chụp / Clipboard (Ctrl + V)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bấm nút tải ảnh HOẶC chụp màn hình rồi bấm <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 font-mono font-bold">Ctrl + V</code> dán thẳng vào ô khung đề bên trên.
                  </p>
                </div>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm whitespace-nowrap">
                {isOcrLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang đọc ảnh...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" /> Tải Ảnh Đề
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Analysis Result Display Card */}
          {analysis && (
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Kết Quả Phân Tích Bài Toán Gốc
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                  {analysis.grade || 'GDPT 2018'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="font-semibold text-slate-500">Chủ đề:</span>{' '}
                  <span className="font-bold text-slate-900 dark:text-slate-100">{analysis.topic || 'Bài toán thực tế'}</span>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="font-semibold text-slate-500">Phân môn:</span>{' '}
                  <span className="font-bold text-slate-900 dark:text-slate-100">{analysis.domain || 'Đại số'}</span>
                </div>
              </div>

              {analysis.coreConcepts && analysis.coreConcepts.length > 0 && (
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Kiến thức cốt lõi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.coreConcepts.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Custom Options Grid */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Cấu Hình Tùy Chọn Sáng Tạo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Lớp */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cấp Lớp Học</label>
                <select
                  value={options.grade}
                  onChange={(e) => handleOptionChange('grade', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Lớp 6">Lớp 6</option>
                  <option value="Lớp 7">Lớp 7</option>
                  <option value="Lớp 8">Lớp 8</option>
                  <option value="Lớp 9">Lớp 9</option>
                  <option value="Lớp 10">Lớp 10</option>
                  <option value="Lớp 11">Lớp 11</option>
                  <option value="Lớp 12">Lớp 12</option>
                </select>
              </div>

              {/* Phân môn */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phân Môn / Lĩnh Vực</label>
                <select
                  value={options.domain}
                  onChange={(e) => handleOptionChange('domain', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Số học">Số học</option>
                  <option value="Đại số">Đại số</option>
                  <option value="Hình học">Hình học</option>
                  <option value="Hàm số">Hàm số</option>
                  <option value="Thống kê">Thống kê</option>
                  <option value="Xác suất">Xác suất</option>
                  <option value="Giải tích">Giải tích</option>
                  <option value="Toán tài chính">Toán tài chính</option>
                  <option value="Toán chuyển động">Toán chuyển động</option>
                  <option value="Toán thực tế">Toán thực tế</option>
                  <option value="Tự động nhận diện">Tự động nhận diện</option>
                </select>
              </div>

              {/* Mức độ */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mức Độ Nhận Thức</label>
                <select
                  value={options.difficulty}
                  onChange={(e) => handleOptionChange('difficulty', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Nhận biết">Nhận biết</option>
                  <option value="Thông hiểu">Thông hiểu</option>
                  <option value="Vận dụng">Vận dụng</option>
                  <option value="Vận dụng cao">Vận dụng cao</option>
                  <option value="Tương đồng độ khó gốc">Tương đồng độ khó gốc</option>
                  <option value="Phân hóa từ dễ đến khó">Phân hóa từ dễ đến khó</option>
                </select>
              </div>

              {/* Dạng câu hỏi */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hình Thức Câu Hỏi</label>
                <select
                  value={options.format}
                  onChange={(e) => handleOptionChange('format', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tự luận">Tự luận</option>
                  <option value="Trắc nghiệm nhiều lựa chọn">Trắc nghiệm A/B/C/D (4 Lựa chọn)</option>
                  <option value="Trắc nghiệm đúng hoặc sai">Trắc nghiệm Đúng / Sai (4 ý)</option>
                  <option value="Trả lời ngắn">Trả lời ngắn</option>
                  <option value="Kết hợp nhiều dạng">Kết hợp nhiều dạng</option>
                </select>
              </div>

              {/* Ngữ cảnh thực tế */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ngữ Cảnh Thực Tế</label>
                <select
                  value={options.context}
                  onChange={(e) => handleOptionChange('context', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ngữ cảnh Việt Nam">Ngữ cảnh Việt Nam (Nông nghiệp, Đời sống, Trường học)</option>
                  <option value="Kiến trúc">Kiến trúc & Xây dựng</option>
                  <option value="Giao thông">Giao thông & Vận tải</option>
                  <option value="Mua bán">Mua bán & Thương mại</option>
                  <option value="Du lịch">Du lịch & Trải nghiệm</option>
                  <option value="Môi trường">Môi trường & Biến đổi khí hậu</option>
                  <option value="Thể thao">Thể thao & Sức khỏe</option>
                  <option value="Y tế">Y tế & Sinh học</option>
                  <option value="Khoa học và STEM">Khoa học & Dự án STEM</option>
                  <option value="Tài chính cá nhân">Tài chính cá nhân & Ngân hàng</option>
                  <option value="Công nghệ">Công nghệ & AI</option>
                  <option value="Sản xuất">Sản xuất & Công nghiệp</option>
                  <option value="Tự động lựa chọn">Tự động lựa chọn bối cảnh phù hợp</option>
                </select>
              </div>

              {/* Mức độ sáng tạo */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mức Độ Sáng Tạo</label>
                <select
                  value={options.creativeLevel}
                  onChange={(e) => handleOptionChange('creativeLevel', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Chỉ thay đổi số liệu">Chỉ thay đổi số liệu</option>
                  <option value="Thay đổi số liệu và bối cảnh">Thay đổi số liệu và bối cảnh</option>
                  <option value="Thay đổi cách hỏi nhưng giữ phương pháp">Thay đổi cách hỏi nhưng giữ phương pháp</option>
                  <option value="Sáng tạo đa dạng nhưng giữ kiến thức cốt lõi">Sáng tạo đa dạng nhưng giữ kiến thức cốt lõi</option>
                  <option value="Phân hóa từ cơ bản đến nâng cao">Phân hóa từ cơ bản đến nâng cao</option>
                </select>
              </div>

              {/* Số lượng bài toán cần tạo */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Số Lượng Bài Toán Cần Tạo (1 đến 10 Bài)
                </label>
                <select
                  value={options.problemCount || 10}
                  onChange={(e) => handleOptionChange('problemCount', parseInt(e.target.value, 10))}
                  className="w-full p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-amber-500"
                >
                  <option value={1}>01 Bài Toán Thực Tế</option>
                  <option value={2}>02 Bài Toán Thực Tế</option>
                  <option value={3}>03 Bài Toán Thực Tế</option>
                  <option value={4}>04 Bài Toán Thực Tế</option>
                  <option value={5}>05 Bài Toán Thực Tế</option>
                  <option value={6}>06 Bài Toán Thực Tế</option>
                  <option value={7}>07 Bài Toán Thực Tế</option>
                  <option value={8}>08 Bài Toán Thực Tế</option>
                  <option value={9}>09 Bài Toán Thực Tế</option>
                  <option value={10}>10 Bài Toán Thực Tế (Khuyên dùng)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={onAnalyzeProblem}
                disabled={isAnalyzing || isGenerating}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> Đang Phân Tích...
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 text-blue-600" /> PHÂN TÍCH BÀI TOÁN GỐC
                  </>
                )}
              </button>

              <button
                onClick={onGenerate10}
                disabled={isGenerating || isAnalyzing}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang Khởi Tạo...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current text-amber-200" /> TẠO {options.problemCount || 10} BÀI TOÁN TƯƠNG TỰ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Progress Overlay */}
      {isGenerating && (
        <div className="p-6 rounded-2xl bg-blue-900 text-white shadow-2xl space-y-4 border border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600 animate-bounce">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Đang Khởi Tạo 10 Bài Toán Thực Tế 4.0</h3>
                <p className="text-xs text-blue-200">{progressStep || 'Đang xử lý dữ liệu AI...'}</p>
              </div>
            </div>
            <span className="text-lg font-black text-amber-400">{progressPercent}%</span>
          </div>

          <div className="w-full bg-blue-950 rounded-full h-3 overflow-hidden p-0.5 border border-blue-700">
            <div
              className="bg-gradient-to-r from-amber-400 via-blue-400 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
