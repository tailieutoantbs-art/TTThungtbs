import React from 'react';
import { Sparkles, Key, Moon, Sun, BookOpen, Database, FileText, CheckCircle2, AlertCircle, RefreshCw, HardDrive, ExternalLink } from 'lucide-react';

export const Header = ({
  apiStatus,
  apiMessage,
  apiKey,
  isDarkMode,
  repoCount = 0,
  onOpenApiKeyModal,
  onOpenUserGuide,
  onToggleDarkMode,
  onSaveDraft,
  onRestoreDraft,
  onDownloadWord,
  hasProblems,
}) => {
  const getApiBadge = () => {
    switch (apiStatus) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã kết nối Gemini AI
          </span>
        );
      case 'checking':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang kiểm tra...
          </span>
        );
      case 'quota_exceeded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Hết hạn mức API
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Lỗi kết nối API
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Chưa kết nối API Key
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  TRỢ LÝ SÁNG TẠO BÀI TOÁN THỰC TẾ 4.0 PRO
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                  STEM & MATH
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Thầy Hùng TBS | Hỗ trợ giáo viên ứng dụng AI trong dạy học GDPT 2018
              </p>
            </div>
          </div>

          {/* Action Tools & API Status */}
          <div className="flex items-center gap-2 flex-wrap">
            {getApiBadge()}

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Cấu hình Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>{apiKey ? 'API Key: ****' : 'Nhập API Key'}</span>
            </button>

            {/* User Guide Button */}
            <button
              onClick={onOpenUserGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hướng Dẫn</span>
            </button>

            {/* Google Drive Link Button */}
            <a
              href="https://drive.google.com/drive/u/0/folders/1kTksrY_Uk13yRTY_pmA6peLzZwkw-rZr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors"
              title="Mở thư mục lưu trữ Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Kho Google Drive</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* Word Download Quick Button */}
            {hasProblems && (
              <button
                onClick={onDownloadWord}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Xuất Word</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={isDarkMode ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
