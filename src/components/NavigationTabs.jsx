import React from 'react';
import { SlidersHorizontal, ListOrdered, Database, Image, CheckSquare, Download } from 'lucide-react';

export const NavigationTabs = ({ activeTab, onSelectTab, hasProblems, problemCount = 0, repoCount = 0 }) => {
  const tabs = [
    {
      id: 'input',
      label: 'Nhập & Cấu Hình Đề',
      icon: SlidersHorizontal,
      badge: null,
    },
    {
      id: 'problems',
      label: '10 Bài Toán Thực Tế',
      icon: ListOrdered,
      badge: problemCount > 0 ? problemCount : null,
    },
    {
      id: 'repository',
      label: 'Kho Ngân Hàng Đề',
      icon: Database,
      badge: repoCount > 0 ? repoCount : null,
    },
    {
      id: 'images',
      label: 'Ảnh & Mã TikZ',
      icon: Image,
      badge: problemCount > 0 ? problemCount : null,
    },
    {
      id: 'solutions',
      label: 'Lời Giải Chi Tiết',
      icon: CheckSquare,
      badge: problemCount > 0 ? problemCount : null,
    },
    {
      id: 'export',
      label: 'Xuất Word & PPTX',
      icon: Download,
      badge: problemCount > 0 ? 'Sẵn sàng' : null,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
