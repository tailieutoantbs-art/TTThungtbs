import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { InputTab } from './components/InputTab';
import { ProblemsTab } from './components/ProblemsTab';
import { RepositoryTab } from './components/RepositoryTab';
import { ImagesTab } from './components/ImagesTab';
import { SolutionsTab } from './components/SolutionsTab';
import { ExportTab } from './components/ExportTab';
import { ApiKeyModal } from './components/ApiKeyModal';
import { UserGuideModal } from './components/UserGuideModal';
import { ToastNotification } from './components/ToastNotification';
import { INITIAL_OPTIONS, SAMPLE_PROBLEMS, SAMPLE_10_PROBLEMS } from './utils/sampleData';
import { getAllProblemSets, saveProblemSetToRepo } from './db/repository';
import { exportWordDocument } from './utils/wordExport';

export default function App() {
  const [sourceProblemText, setSourceProblemText] = useState(SAMPLE_PROBLEMS[0].text);
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [analysis, setAnalysis] = useState(null);
  const [problems, setProblems] = useState(SAMPLE_10_PROBLEMS);
  const [activeTab, setActiveTab] = useState('input');

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (type, message, title = '') => {
    setToast({ type, message, title, autoClose: type === 'success' });
  };

  const closeToast = () => setToast(null);

  // API Key & Model State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || sessionStorage.getItem('gemini_api_key') || '');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [apiStatus, setApiStatus] = useState('unconnected');
  const [apiMessage, setApiMessage] = useState('');
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('color_theme') || 'gold');

  // Modals & UI State
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showAnswers, setShowAnswers] = useState(true);
  const [repoCount, setRepoCount] = useState(0);

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // Dark Mode & Color Theme side effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleColorThemeChange = (newTheme) => {
    setColorTheme(newTheme);
    localStorage.setItem('color_theme', newTheme);
  };

  // Initial API Key Test & Repo Count
  useEffect(() => {
    if (apiKey) {
      testApiKey(apiKey);
    }
    updateRepoCount();
  }, []);

  const updateRepoCount = async () => {
    try {
      const list = await getAllProblemSets();
      setRepoCount(list.length);
    } catch {
      setRepoCount(0);
    }
  };

  // Test API Key Endpoint
  const testApiKey = async (key) => {
    const trimmedKey = key ? key.trim() : '';
    setApiStatus('checking');
    setApiMessage('Đang kiểm tra kết nối với Gemini API...');

    try {
      const res = await fetch('/api/gemini/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: trimmedKey, model: selectedModel }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApiStatus('connected');
        setApiMessage(data.message || 'Kết nối Gemini API thành công (Đã lưu vĩnh viễn trên trình duyệt).');
      } else {
        setApiStatus('error');
        setApiMessage(data.message || 'Lỗi kết nối Gemini API. API Key có thể đã hết hạn hoặc hết ngạch miễn phí.');
        setIsApiKeyModalOpen(true);
      }
    } catch {
      setApiStatus('error');
      setApiMessage('Không thể kết nối đến server backend tại http://localhost:3000');
    }
  };

  const handleSaveApiKey = (key, saveLocal = true) => {
    const trimmed = key ? key.trim() : '';
    setApiKey(trimmed);
    if (saveLocal) {
      localStorage.setItem('gemini_api_key', trimmed);
      sessionStorage.setItem('gemini_api_key', trimmed);
    } else {
      localStorage.removeItem('gemini_api_key');
      sessionStorage.removeItem('gemini_api_key');
    }

    if (trimmed) {
      testApiKey(trimmed);
    } else {
      setApiStatus('unconnected');
      setApiMessage('');
    }
  };

  const handleDeleteApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    sessionStorage.removeItem('gemini_api_key');
    setApiStatus('unconnected');
    setApiMessage('');
  };

  // Analyze Source Problem
  const handleAnalyzeProblem = async () => {
    if (!sourceProblemText.trim()) {
      showToast('error', 'Vui lòng nhập đề bài gốc.', 'Thiếu Đề Bài');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: sourceProblemText,
          options,
          apiKey,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        showToast('success', 'Phân tích đề bài gốc thành công!');
      } else {
        showToast('error', data.error || 'Lỗi khi phân tích đề bài.', 'Phân Tích Thất Bại');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi gọi AI phân tích bài toán.', 'Lỗi Kết Nối');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate 10 Problems
  const handleGenerate10 = async () => {
    if (!sourceProblemText.trim()) {
      showToast('error', 'Vui lòng nhập hoặc nạp một đề bài toán gốc.', 'Thiếu Đề Bài');
      return;
    }

    if (!apiKey.trim()) {
      setIsApiKeyModalOpen(true);
      showToast('error', 'Chưa cài đặt Gemini API Key! Vui lòng nhập API Key để khởi tạo bài toán mới.', 'Thiếu API Key');
      return;
    }

    setIsGenerating(true);

    const countToGenerate = options.problemCount || 10;
    const steps = [
      { step: '1. Đang kết nối tới Gemini API...', pct: 10 },
      { step: '2. Đang phân tích kiến thức bài gốc...', pct: 20 },
      { step: '3. Đang xây dựng ngữ cảnh thực tế...', pct: 40 },
      { step: `4. Đang sáng tạo ${countToGenerate} bài toán tương tự...`, pct: 60 },
      { step: '5. Đang tạo mã TikZ & prompt minh họa...', pct: 80 },
      { step: '6. Đang kiểm tra và hoàn thiện...', pct: 95 },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length - 1) {
        currentStepIdx++;
        setProgressStep(steps[currentStepIdx].step);
        setProgressPercent(steps[currentStepIdx].pct);
      }
    }, 1500);

    try {
      setProgressStep(steps[0].step);
      setProgressPercent(10);

      const lockedProblems = problems.filter((p) => p.isLocked);

      const res = await fetch('/api/gemini/generate-10', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: sourceProblemText,
          options,
          analysis,
          apiKey,
          model: selectedModel,
          lockedProblems,
        }),
      });

      clearInterval(interval);
      const data = await res.json();

      if (data.success && data.data) {
        if (data.data.sourceAnalysis) setAnalysis(data.data.sourceAnalysis);
        if (data.data.problems && Array.isArray(data.data.problems) && data.data.problems.length > 0) {
          setProblems(data.data.problems);
          setProgressPercent(100);
          setProgressStep(`Hoàn tất tạo ${data.data.problems.length} bài toán thực tế!`);
          setActiveTab('problems');
          showToast('success', `Đã tạo thành công ${data.data.problems.length} bài toán thực tế!`);
        } else {
          showToast('error', 'Dữ liệu AI trả về chưa đúng cấu trúc bài toán.', 'Lỗi Cấu Trúc');
        }
      } else {
        showToast('error', data.error || 'Lỗi khi khởi tạo bài toán từ Gemini API.', 'Lỗi Tạo Bài');
      }
    } catch (err) {
      clearInterval(interval);
      showToast('error', 'Lỗi kết nối khi gọi Gemini API: ' + (err.message || err), 'Lỗi Kết Nối');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate Single Problem
  const handleRegenerateOne = async (id) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/regenerate-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToRegenerate: id,
          problemText: sourceProblemText,
          options,
          analysis,
          apiKey,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (data.success && data.problem) {
        setProblems((prev) =>
          prev.map((item) => (item.id === id ? { ...data.problem, id, isLocked: false } : item))
        );
        showToast('success', `Đã khởi tạo thành công bài toán mới cho Câu ${id}!`);
      } else {
        showToast('error', data.error || `Không thể tạo lại Câu ${id}.`, 'Lỗi Tạo Bài');
      }
    } catch {
      showToast('error', `Lỗi kết nối khi tạo lại Câu ${id}.`, 'Lỗi Kết Nối');
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle Lock
  const handleToggleLock = (id) => {
    setProblems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLocked: !item.isLocked } : item))
    );
  };

  // Update Single Problem Inline
  const handleUpdateProblem = (updated) => {
    setProblems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  // Clear & Draft Handlers
  const handleClearData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ đề bài và danh sách 10 bài toán đã tạo?')) {
      setSourceProblemText('');
      setAnalysis(null);
      setProblems([]);
      showToast('success', 'Đã xóa dữ liệu đề bài!');
    }
  };

  const handleSaveDraft = () => {
    const draft = { sourceProblemText, options, analysis, problems };
    localStorage.setItem('math_assistant_draft', JSON.stringify(draft));
    showToast('success', 'Đã lưu bản nháp thành công vào trình duyệt!');
  };

  const handleRestoreDraft = () => {
    const draftStr = localStorage.getItem('math_assistant_draft');
    if (!draftStr) {
      showToast('error', 'Không tìm thấy bản nháp nào trước đó.', 'Không Có Dữ Liệu');
      return;
    }
    try {
      const draft = JSON.parse(draftStr);
      if (draft.sourceProblemText) setSourceProblemText(draft.sourceProblemText);
      if (draft.options) setOptions(draft.options);
      if (draft.analysis) setAnalysis(draft.analysis);
      if (draft.problems) setProblems(draft.problems);
      showToast('success', 'Khôi phục bản nháp thành công!');
    } catch {
      showToast('error', 'Lỗi đọc bản nháp.', 'Lỗi Dữ Liệu');
    }
  };

  // Repository Load Set
  const handleLoadProblemSet = (item) => {
    if (item.sourceProblemText) setSourceProblemText(item.sourceProblemText);
    if (item.options) setOptions(item.options);
    if (item.problems) setProblems(item.problems);
    setActiveTab('problems');
    showToast('success', `Đã nạp bộ đề "${item.title || ''}"!`);
  };

  // Repository Save with Custom Title ("Lưu Với Tên")
  const handleSaveToRepo = async () => {
    if (!problems || problems.length === 0) return;
    const defaultTitle = `Bộ ${problems.length} Bài Toán ${options.domain || 'Thực Tế'} ${options.grade || ''} (${new Date().toLocaleDateString('vi-VN')})`;
    const customTitle = window.prompt('Nhập tên đặt cho Bộ Bài Toán này để lưu vào Kho Ngân Hàng:', defaultTitle);
    
    if (customTitle === null) return; // Cancelled

    const finalTitle = customTitle.trim() || defaultTitle;
    await saveProblemSetToRepo({
      title: finalTitle,
      grade: options.grade,
      domain: options.domain,
      context: options.context,
      sourceProblemText,
      options,
      problems,
      tags: ['#ToanThucTe', `#${options.grade.replace(/\s+/g, '')}`],
    });
    showToast('success', `Đã lưu bộ đề "${finalTitle}" vào Kho Ngân Hàng thành công!`);
    updateRepoCount();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Header
        apiStatus={apiStatus}
        apiMessage={apiMessage}
        apiKey={apiKey}
        isDarkMode={isDarkMode}
        colorTheme={colorTheme}
        repoCount={repoCount}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onChangeColorTheme={handleColorThemeChange}
        onSaveDraft={handleSaveDraft}
        onRestoreDraft={handleRestoreDraft}
        onDownloadWord={() => exportWordDocument(problems, options, false)}
        hasProblems={problems.length > 0}
      />

      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasProblems={problems.length > 0}
        problemCount={problems.length}
        repoCount={repoCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'input' && (
          <InputTab
            sourceProblemText={sourceProblemText}
            options={options}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
            isGenerating={isGenerating}
            progressStep={progressStep}
            progressPercent={progressPercent}
            onChangeSourceText={setSourceProblemText}
            onChangeOptions={setOptions}
            onAnalyzeProblem={handleAnalyzeProblem}
            onGenerate10={handleGenerate10}
            onLoadSample={() => {}}
            onClearData={handleClearData}
            onSaveDraft={handleSaveDraft}
            onRestoreDraft={handleRestoreDraft}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            apiKey={apiKey}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'problems' && (
          <ProblemsTab
            problems={problems}
            showAnswers={showAnswers}
            onToggleShowAnswers={() => setShowAnswers(!showAnswers)}
            onToggleLock={handleToggleLock}
            onUpdateProblem={handleUpdateProblem}
            onRegenerateOne={handleRegenerateOne}
            onRegenerateUnlocked={handleGenerate10}
            onNavigateToTab={setActiveTab}
            onSaveToRepository={handleSaveToRepo}
            onExportJson={() => {
              const jsonStr = JSON.stringify(problems, null, 2);
              const blob = new Blob([jsonStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '10_bai_toan_thuc_te.json';
              a.click();
              showToast('success', 'Đã xuất file JSON thành công!');
            }}
            isGenerating={isGenerating}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'repository' && (
          <RepositoryTab
            currentProblems={problems}
            currentOptions={options}
            sourceProblemText={sourceProblemText}
            onLoadProblemSet={handleLoadProblemSet}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'images' && (
          <ImagesTab
            problems={problems}
            apiKey={apiKey}
            selectedImageModel={selectedModel}
            onUpdateProblem={handleUpdateProblem}
            onLoadSample10={() => setProblems(SAMPLE_10_PROBLEMS)}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'solutions' && (
          <SolutionsTab
            problems={problems}
            showAnswers={showAnswers}
            onToggleShowAnswers={() => setShowAnswers(!showAnswers)}
            onNavigateToTab={setActiveTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'export' && (
          <ExportTab
            problems={problems}
            options={options}
            onImportJson={(importedProblems) => {
              setProblems(importedProblems);
              setActiveTab('problems');
              showToast('success', 'Nhập dữ liệu bài toán từ file JSON thành công!');
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Trợ Lý Sáng Tạo Bài Toán Thực Tế 4.0 Pro — Thầy Hùng TBS | Khoa Học & Giáo Dục GDPT 2018</p>
        </div>
      </footer>

      {/* Modals & Toast Notifications */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        apiKey={apiKey}
        selectedModel={selectedModel}
        apiStatus={apiStatus}
        apiMessage={apiMessage}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveApiKey={handleSaveApiKey}
        onTestConnection={testApiKey}
        onDeleteApiKey={handleDeleteApiKey}
        onSelectModel={setSelectedModel}
      />

      <UserGuideModal isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />

      {/* Custom Toast Notification System */}
      <ToastNotification toast={toast} onClose={closeToast} />
    </div>
  );
}
