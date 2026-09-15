import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const { type = 'success', title, message, autoClose = type === 'success' } = toast;

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); // Tự động đóng sau đúng 1 giây đối với thông báo thành công
      return () => clearTimeout(timer);
    }
  }, [toast, autoClose, onClose]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl border text-center transform transition-all scale-100 ${
          isSuccess
            ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-emerald-500/25 text-slate-900 dark:text-slate-100'
            : 'bg-white dark:bg-slate-900 border-rose-500 shadow-rose-500/25 text-slate-900 dark:text-slate-100'
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          {/* Icon */}
          {isSuccess ? (
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>
          )}

          {/* Title */}
          <h3
            className={`text-base font-bold ${
              isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {title || (isSuccess ? 'Thành Công!' : 'Thất Bại / Có Lỗi')}
          </h3>

          {/* Message */}
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed max-h-48 overflow-y-auto px-1">
            {message}
          </p>

          {/* Manual confirmation button for failure / errors */}
          {!autoClose && (
            <button
              onClick={onClose}
              className="mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xác Nhận & Đóng</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
