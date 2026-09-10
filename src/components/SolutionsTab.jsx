import React, { useState } from 'react';
import { MathRenderer } from './MathRenderer';
import { CheckSquare, Copy, Check, Eye, EyeOff, BookOpen } from 'lucide-react';

export const SolutionsTab = ({ problems, showAnswers, onToggleShowAnswers, onNavigateToTab }) => {
  const [copiedId, setCopiedId] = useState(null);

  if (!problems || problems.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <CheckSquare className="w-12 h-12 mx-auto text-slate-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Chưa Có Dữ Liệu Lời Giải Chi Tiết</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Vui lòng tạo 10 bài toán ở tab Nhập Đề Bài để xem hệ thống Lời giải chi tiết từng bước.
        </p>
      </div>
    );
  }

  const handleCopySolution = (problem) => {
    const text = `LỜI GIẢI CÂU ${problem.id}: ${problem.title}\nĐáp án: ${problem.correctOption || problem.shortAnswer || ''}\n${problem.detailedSolution || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(problem.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Hệ Thống Lời Giải Chi Tiết & Đáp Án Chuẩn GDPT 2018</h2>
            <p className="text-xs text-slate-500">
              Trình bày lời giải khoa học từng bước cho 10 bài toán thực tế kèm công thức toán KaTeX.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleShowAnswers}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
        >
          {showAnswers ? <EyeOff className="w-4 h-4 text-rose-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
          <span>{showAnswers ? 'Ẩn Lời Giải' : 'Hiện Lời Giải'}</span>
        </button>
      </div>

      {/* List of Solutions */}
      <div className="space-y-4">
        {problems.map((p, idx) => (
          <div
            key={p.id || idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white">Câu {idx + 1}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Đáp án: {p.correctOption || p.shortAnswer || 'A'}
                </span>
              </div>

              <button
                onClick={() => handleCopySolution(p)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Sao Chép Lời Giải</span>
              </button>
            </div>

            {/* Problem Recap */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-slate-100">Đề bài: </span>
              <MathRenderer text={p.statement} />
            </div>

            {/* Detailed Solution */}
            {showAnswers ? (
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Các Bước Giải Chi Tiết:</h4>
                <MathRenderer text={p.detailedSolution || 'Đang cập nhật lời giải...'} className="text-xs text-slate-800 dark:text-slate-200" />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-700 dark:text-amber-300 italic">
                Lời giải đang được ẩn. Bấm nút <strong>"Hiện Lời Giải"</strong> ở góc trên để hiển thị.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
