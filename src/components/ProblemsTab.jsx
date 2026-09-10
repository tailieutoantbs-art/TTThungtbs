import React, { useState } from 'react';
import { MathRenderer } from './MathRenderer';
import {
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  EyeOff,
  Edit,
  Download,
  Database,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Tag,
  BookOpen,
} from 'lucide-react';

export const ProblemsTab = ({
  problems,
  showAnswers,
  onToggleShowAnswers,
  onToggleLock,
  onUpdateProblem,
  onRegenerateOne,
  onRegenerateUnlocked,
  onNavigateToTab,
  onSaveToRepository,
  onExportJson,
  isGenerating,
}) => {
  const [editingProblem, setEditingProblem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  if (!problems || problems.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Chưa Có Danh Sách 10 Bài Toán</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Vui lòng chuyển sang Tab <strong>"Nhập & Cấu Hình Đề"</strong>, nhập bài toán gốc và bấm <strong>"TẠO 10 BÀI TOÁN TƯƠNG TỰ"</strong>.
        </p>
        <button
          onClick={() => onNavigateToTab('input')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
        >
          Đến Tab Nhập Đề Bài
        </button>
      </div>
    );
  }

  const handleCopyText = (problem) => {
    const text = `${problem.title}\n${problem.statement}\n${problem.options ? problem.options.join('\n') : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(problem.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingProblem) {
      onUpdateProblem(editingProblem);
      setEditingProblem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Danh Sách 10 Bài Toán Thực Tế</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            {problems.length} câu
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Show/Hide Answers Toggle */}
          <button
            onClick={onToggleShowAnswers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            {showAnswers ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5 text-emerald-500" />}
            <span>{showAnswers ? 'Ẩn Đáp Án & Lời Giải' : 'Hiện Đáp Án & Lời Giải'}</span>
          </button>

          {/* Regenerate Unlocked */}
          <button
            onClick={onRegenerateUnlocked}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Tạo Lại Các Bài Chưa Khóa</span>
          </button>

          {/* Save to Repository */}
          <button
            onClick={onSaveToRepository}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Lưu Vào Kho Bài Toán</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={onExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất JSON</span>
          </button>
        </div>
      </div>

      {/* Grid of 10 Cards */}
      <div className="space-y-4">
        {problems.map((p, idx) => (
          <div
            key={p.id || idx}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
              p.isLocked
                ? 'border-amber-400 dark:border-amber-500/50 shadow-md shadow-amber-500/5'
                : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white">
                  Câu {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {p.difficulty || 'Vận dụng'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {p.contextTag || 'Thực tế'}
                </span>
              </div>

              {/* Card Controls */}
              <div className="flex items-center gap-1.5">
                {/* Lock Toggle */}
                <button
                  onClick={() => onToggleLock(p.id)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    p.isLocked
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  title={p.isLocked ? 'Bài này đang bị KHÓA (không bị thay đổi khi tạo lại)' : 'Bấm để KHÓA bài này'}
                >
                  {p.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                {/* Regenerate Single Câu */}
                <button
                  onClick={() => onRegenerateOne(p.id)}
                  disabled={isGenerating}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Tạo lại duy nhất câu này"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Navigate to TikZ & Image */}
                <button
                  onClick={() => onNavigateToTab('images')}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Xem và chỉnh sửa Mã TikZ & Ảnh cho câu này"
                >
                  <Tag className="w-3.5 h-3.5" /> TikZ & Ảnh
                </button>

                {/* Edit inline */}
                <button
                  onClick={() => setEditingProblem({ ...p })}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Chỉnh sửa bài toán"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                {/* Copy Text */}
                <button
                  onClick={() => handleCopyText(p)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Sao chép nội dung câu hỏi"
                >
                  {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Problem Statement KaTeX */}
            <div className="text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200 mb-4">
              <MathRenderer text={p.statement} />
            </div>

            {/* Options List */}
            {p.options && Array.isArray(p.options) && p.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 pl-2">
                {p.options.map((opt, oIdx) => {
                  const isCorrect = showAnswers && p.correctOption && opt.startsWith(p.correctOption);
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border text-xs font-sans transition-colors ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MathRenderer text={opt} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Short Answer */}
            {p.shortAnswer && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 mb-3">
                <span className="font-bold text-blue-600">Đáp số: </span>
                <MathRenderer text={p.shortAnswer} />
              </div>
            )}

            {/* Answer & Detailed Solution Block (if showAnswers is true) */}
            {showAnswers && p.detailedSolution && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Lời Giải Chi Tiết (Đáp án đúng: {p.correctOption || p.shortAnswer || 'A'})</span>
                </div>
                <MathRenderer text={p.detailedSolution} className="text-slate-800 dark:text-slate-200" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Problem Modal */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Chỉnh Sửa Câu {editingProblem.id}</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Tên / Tiêu đề câu hỏi</label>
                <input
                  type="text"
                  value={editingProblem.title || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Nội dung đề bài (Hỗ trợ $...$ LaTeX)</label>
                <textarea
                  rows={4}
                  value={editingProblem.statement || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, statement: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Lời giải chi tiết</label>
                <textarea
                  rows={4}
                  value={editingProblem.detailedSolution || ''}
                  onChange={(e) => setEditingProblem({ ...editingProblem, detailedSolution: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Mã TikZ LaTeX Vẽ Hình</label>
                  <textarea
                    rows={4}
                    value={editingProblem.tikzCode || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, tikzCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800"
                    placeholder="\begin{tikzpicture} ... \end{tikzpicture}"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Prompt Ảnh Minh Họa Giáo Dục</label>
                  <textarea
                    rows={4}
                    value={editingProblem.imagePrompt || ''}
                    onChange={(e) => setEditingProblem({ ...editingProblem, imagePrompt: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    placeholder="English image prompt..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="px-4 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white">
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
