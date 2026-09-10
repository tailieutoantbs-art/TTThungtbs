import React, { useState, useEffect } from 'react';
import { getAllProblemSets, searchProblemSets, deleteProblemSet, saveProblemSetToRepo } from '../db/repository';
import { Database, Search, Trash2, RotateCcw, Tag, Calendar, Layers, Download, Upload, PlusCircle, Check, HardDrive, ExternalLink, Save } from 'lucide-react';

export const RepositoryTab = ({ currentProblems, currentOptions, sourceProblemText, onLoadProblemSet }) => {
  const [repoList, setRepoList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveTitle, setSaveTitle] = useState('');
  const [saveTags, setSaveTags] = useState('#ToanThucTe, #Lop9');
  const [isSaving, setIsSaving] = useState(false);
  const [activeSetDetail, setActiveSetDetail] = useState(null);

  useEffect(() => {
    loadRepository();
  }, []);

  const loadRepository = async () => {
    const list = await getAllProblemSets();
    setRepoList(list);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    const results = await searchProblemSets(query);
    setRepoList(results);
  };

  const handleSaveCurrentSet = async () => {
    if (!currentProblems || currentProblems.length === 0) {
      alert('Chưa có 10 bài toán nào để lưu vào kho ngân hàng đề.');
      return;
    }

    setIsSaving(true);
    try {
      const tagsArr = saveTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t);

      await saveProblemSetToRepo({
        title: saveTitle || `Bộ Đề ${currentOptions.domain || 'Toán'} ${currentOptions.grade || ''} (${new Date().toLocaleDateString('vi-VN')})`,
        grade: currentOptions.grade,
        domain: currentOptions.domain,
        context: currentOptions.context,
        sourceProblemText: sourceProblemText,
        options: currentOptions,
        problems: currentProblems,
        tags: tagsArr,
      });

      alert('Đã lưu bộ 10 bài toán vào Kho Ngân Hàng Bài Toán thành công!');
      setSaveTitle('');
      loadRepository();
    } catch {
      alert('Không thể lưu vào kho bài toán.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ đề này khỏi kho?')) {
      await deleteProblemSet(id);
      loadRepository();
    }
  };

  const handleRestore = (item) => {
    if (window.confirm(`Khôi phục bộ đề "${item.title}" vào trình chỉnh sửa chính?`)) {
      onLoadProblemSet(item);
    }
  };

  const handleExportRepoJson = () => {
    const jsonStr = JSON.stringify(repoList, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kho_Ngan_Hang_De_Toan_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Save Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Kho Ngân Hàng Bài Toán Thực Tế (Local Repository)
              </h2>
              <p className="text-xs text-slate-500">
                Lưu trữ, quản lý, tìm kiếm và phân loại các bộ 10 bài toán đã khởi tạo theo Thẻ (Tags) & Cấp lớp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://drive.google.com/drive/u/0/folders/1kTksrY_Uk13yRTY_pmA6peLzZwkw-rZr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              <HardDrive className="w-3.5 h-3.5" /> Mở Kho Google Drive <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            <button
              onClick={handleExportRepoJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Xuất Toàn Bộ Kho (JSON)
            </button>
          </div>
        </div>

        {/* Save Current Set Section */}
        {currentProblems && currentProblems.length > 0 && (
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" /> Lưu Bộ 10 Bài Đang Mở Vào Kho
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                placeholder="Tên bộ đề (ví dụ: Bộ đề ôn tập HK1 Lớp 9 - Thực tế)"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                className="sm:col-span-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 text-slate-900 dark:text-slate-100"
              />
              <input
                type="text"
                placeholder="Thẻ tags (ví dụ: #Lop9, #ThiHK1)"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              onClick={handleSaveCurrentSet}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" /> {isSaving ? 'Đang lưu...' : 'Lưu Vào Ngân Hàng Bài Toán'}
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bộ đề toán trong kho theo Tên, Lớp, Phân môn, Bối cảnh hoặc Thẻ tag (#Lop9, #STEM)..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
        />
      </div>

      {/* List of Saved Problem Sets */}
      {repoList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <Database className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Kho Bài Toán Chưa Có Dữ Liệu</h3>
          <p className="text-xs text-slate-500">
            Tạo bộ 10 bài toán ở tab Nhập Đề Bài rồi bấm nút <strong>"Lưu Vào Kho Bài Toán"</strong> để lưu giữ lâu dài.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repoList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-blue-600">{item.grade}</span>
                    <span>•</span>
                    <span>{item.domain}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  title="Xóa bộ đề khỏi kho"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Tags List */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Restore / Load Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 font-medium">{item.problems ? item.problems.length : 10} câu hỏi</span>
                <button
                  onClick={() => handleRestore(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Nạp Bộ Đề Này
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
