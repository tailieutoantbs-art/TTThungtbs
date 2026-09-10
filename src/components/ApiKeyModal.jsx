import React, { useState } from 'react';
import { Key, CheckCircle2, AlertCircle, RefreshCw, X, ExternalLink, ShieldCheck } from 'lucide-react';

export const ApiKeyModal = ({
  isOpen,
  apiKey,
  selectedModel,
  apiStatus,
  apiMessage,
  onClose,
  onSaveApiKey,
  onTestConnection,
  onDeleteApiKey,
  onSelectModel,
}) => {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [saveInSession, setSaveInSession] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput, saveInSession);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl space-y-5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Cấu Hình Khóa Gemini API Key</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner */}
        {apiMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
              apiStatus === 'connected'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50'
                : apiStatus === 'checking'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/50'
            }`}
          >
            {apiStatus === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : apiStatus === 'checking' ? (
              <RefreshCw className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>{apiMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Gemini API Key</label>
            <input
              type="password"
              placeholder="Nhập Gemini API Key (AIzaSy...)"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Mô Hình AI (Gemini Model)</label>
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Nhanh & Tối Ưu Tốc Độ)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Nâng Cao & Phân Tích Sâu)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveSession"
              checked={saveInSession}
              onChange={(e) => setSaveInSession(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="saveSession" className="text-slate-600 dark:text-slate-400">
              Lưu trong phiên làm việc hiện tại (SessionStorage)
            </label>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Bảo mật API Key
            </div>
            <p>
              Khóa API của bạn được lưu an toàn trong trình duyệt và không chia sẻ cho bên thứ ba.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline mt-1"
            >
              Lấy khóa Google Gemini API miễn phí tại đây <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setKeyInput('');
                onDeleteApiKey();
              }}
              className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 font-semibold"
            >
              Xóa Khóa API
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onTestConnection(keyInput)}
                className="px-3.5 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
              >
                Kiểm Tra Kết Nối
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                Lưu Khóa API
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
