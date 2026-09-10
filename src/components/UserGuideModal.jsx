import React from 'react';
import { BookOpen, X, Sparkles, SlidersHorizontal, ListOrdered, Database, Image, Download, Layers, CheckCircle2 } from 'lucide-react';

export const UserGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Hướng Dẫn Sử Dụng Chi Tiết — Trợ Lý Sáng Tạo Bài Toán 4.0 Pro
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Bước 1: Nhập Đề Bài Gốc & Cấu Hình Tùy Chọn
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Nhập thủ công hoặc Nạp đề mẫu</strong>: Dán nội dung bài toán vào ô văn bản hoặc bấm nút chọn đề mẫu GDPT 2018.
              </li>
              <li>
                <strong>Trích xuất từ Ảnh chụp / File PDF</strong>: Bấm "Tải Ảnh Đề" để Gemini Vision AI trích xuất chữ và công thức toán học tự động.
              </li>
              <li>
                <strong>Tùy chọn đa dạng</strong>: Chọn Lớp (6-12), Phân môn (Số học, Đại số, Hình học,...), Mức độ độ khó (Nhận biết - Vận dụng cao), Ngữ cảnh thực tế (STEM, Kiến trúc, Giao thông,...).
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <ListOrdered className="w-4 h-4" /> Bước 2: Quản Lý & Tương Tác Danh Sách 10 Bài Toán
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Công thức toán KaTeX</strong>: Hiển thị đẹp mắt công thức toán dạng $...$ và $$...$$.
              </li>
              <li>
                <strong>Tính năng Khóa (Lock)</strong>: Bấm icon Khóa ở bài toán muốn giữ nguyên khi bấm "Tạo lại các bài chưa khóa".
              </li>
              <li>
                <strong>Tạo lại riêng từng bài</strong>: Bấm icon Tạo lại ở góc từng bài để AI tạo mới duy nhất câu hỏi đó.
              </li>
              <li>
                <strong>Chỉnh sửa trực tiếp</strong>: Bấm icon Chỉnh sửa để sửa lại nội dung bài toán theo ý muốn.
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <Database className="w-4 h-4" /> Bước 3: Kho Ngân Hàng Bài Toán (Question Bank Repository)
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lưu trữ không giới hạn bộ 10 bài toán vào cơ sở dữ liệu local trong trình duyệt.</li>
              <li>Gắn thẻ tag (#Lop9, #ThiHK1) để dễ dàng tìm kiếm và lọc bộ đề cũ.</li>
              <li>Nạp lại bất kỳ bộ đề cũ nào vào trình chỉnh sửa chính chỉ với 1 cú nhấp chuột.</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Image className="w-4 h-4" /> Bước 4: Sinh Prompt Ảnh Giáo Dục & Mã TikZ Hình Học
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sinh Prompt tiếng Anh chuẩn cho Midjourney/Stable Diffusion/Pollinations tạo ảnh minh họa 3D giáo dục.</li>
              <li>Tự động viết mã TikZ vẽ hình tam giác, hình nón, đồ thị hàm số chuẩn LaTeX.</li>
              <li>Tải toàn bộ mã TikZ dưới dạng file `.tex`.</li>
            </ul>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Download className="w-4 h-4" /> Bước 5: Xuất File Word (.docx) & Slide PowerPoint (.pptx)
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Xuất File Word chuẩn</strong>: 01 file Word chứa đề bài, đáp án và lời giải chi tiết.
              </li>
              <li>
                <strong>Trộn 4 Mã Đề Thi (101 - 104)</strong>: Tự động đảo bài & phương án thành 4 mã đề kèm Bảng Ma Trận Đáp Án.
              </li>
              <li>
                <strong>Xuất Slide PowerPoint (.pptx)</strong>: Tạo file trình chiếu 16:9 chiếu trực tiếp trên lớp.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl font-bold bg-blue-600 text-white">
            Đã Hiểu & Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
