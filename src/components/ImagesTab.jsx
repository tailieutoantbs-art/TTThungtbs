import React, { useState, useEffect } from 'react';
import {
  Image,
  Code,
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Edit,
  Eye,
  Maximize2,
  X,
  Wand2,
  AlertCircle,
  FileCode,
} from 'lucide-react';

const TikZCompiledViewer = ({ tikzCode, title, onZoom }) => {
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tikzCode || !tikzCode.trim()) {
      setSvgContent('');
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch('/api/tikz/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tikzCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.svg) {
          setSvgContent(data.svg);
        } else {
          setError(data.error || 'Mã TikZ cần điều chỉnh cú pháp.');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Lỗi kết nối khi biên dịch TikZ.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [tikzCode]);

  if (!tikzCode) return null;

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-emerald-600" /> Hình Vẽ TikZ Đã Biên Dịch Trực Quan (SVG Vector)
        </span>
        {svgContent && (
          <button
            onClick={() => onZoom(svgContent, title)}
            className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" /> Phóng to Sơ đồ
          </button>
        )}
      </div>

      <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[160px] overflow-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-6">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" /> Đang biên dịch mã TikZ LaTeX ra hình vẽ...
          </div>
        ) : svgContent ? (
          <div
            className="tikz-svg-container max-h-72 overflow-auto text-slate-900 dark:text-slate-100 flex items-center justify-center p-2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="text-center text-xs text-slate-500 py-4 space-y-1">
            <AlertCircle className="w-6 h-6 mx-auto text-amber-500" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">{error || 'Mã TikZ cần điều chỉnh cú pháp.'}</p>
            <p className="text-[10px] text-slate-400">Bạn có thể dùng nút "Tạo TikZ AI" bên trên để Gemini viết lại mã TikZ hợp lệ.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ImagesTab = ({
  problems,
  apiKey,
  selectedImageModel,
  onUpdateProblem,
  onLoadSample10,
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTikZ, setEditedTikZ] = useState('');
  const [editedPrompt, setEditedPrompt] = useState('');
  const [loadingAiId, setLoadingAiId] = useState(null);
  const [zoomMedia, setZoomMedia] = useState(null); // { type: 'svg' | 'image', content: '', title: '' }
  const [imageErrorState, setImageErrorState] = useState({});

  if (!problems || problems.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <Image className="w-12 h-12 mx-auto text-slate-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Chưa Có Dữ Liệu Hình Ảnh & Mã TikZ</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Tạo bộ 10 bài toán ở tab Nhập Đề Bài hoặc nạp bộ 10 bài toán mẫu demo để ứng dụng hiển thị Prompt ảnh giáo dục & Mã TikZ vẽ hình.
        </p>
        {onLoadSample10 && (
          <button
            onClick={onLoadSample10}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" /> Nạp Bộ 10 Bài Toán Mẫu Demo (Có Mã TikZ & Prompt Ảnh)
          </button>
        )}
      </div>
    );
  }

  const handleCopyTikZ = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(`tikz_${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(`prompt_${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadAllTikZ = () => {
    const allCode = problems
      .map((p, idx) => `% --- Câu ${idx + 1}: ${p.title} ---\n${p.tikzCode || '% Không có mã TikZ'}\n`)
      .join('\n\n');

    const blob = new Blob([allCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ma_TikZ_Full_10_Bai_Toan.tex`;
    a.click();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditedTikZ(p.tikzCode || '');
    setEditedPrompt(p.imagePrompt || '');
  };

  const saveEdit = (p) => {
    onUpdateProblem({
      ...p,
      tikzCode: editedTikZ,
      imagePrompt: editedPrompt,
    });
    setEditingId(null);
  };

  const handleRegenerateTikZAi = async (p) => {
    if (!apiKey) {
      alert('Vui lòng cài đặt Gemini API Key trước khi sử dụng AI.');
      return;
    }
    setLoadingAiId(`tikz_${p.id}`);
    try {
      const res = await fetch('/api/gemini/regenerate-tikz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: p.title,
          statement: p.statement,
          apiKey,
          model: selectedImageModel,
        }),
      });

      const data = await res.json();
      if (data.success && data.tikzCode) {
        onUpdateProblem({ ...p, tikzCode: data.tikzCode });
        alert(`Đã biên dịch lại thành công mã TikZ mới cho Câu ${p.id}!`);
      } else {
        alert(data.error || 'Không thể tạo lại mã TikZ.');
      }
    } catch {
      alert('Lỗi kết nối khi gọi Gemini API tạo TikZ.');
    } finally {
      setLoadingAiId(null);
    }
  };

  const handleRegeneratePromptAi = async (p) => {
    if (!apiKey) {
      alert('Vui lòng cài đặt Gemini API Key trước khi sử dụng AI.');
      return;
    }
    setLoadingAiId(`prompt_${p.id}`);
    try {
      const res = await fetch('/api/gemini/regenerate-image-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: p.title,
          statement: p.statement,
          apiKey,
          model: selectedImageModel,
        }),
      });

      const data = await res.json();
      if (data.success && data.imagePrompt) {
        onUpdateProblem({ ...p, imagePrompt: data.imagePrompt });
        setImageErrorState((prev) => ({ ...prev, [p.id]: false }));
        alert(`Đã khởi tạo thành công Prompt ảnh mới cho Câu ${p.id}!`);
      } else {
        alert(data.error || 'Không thể tạo lại Prompt ảnh.');
      }
    } catch {
      alert('Lỗi kết nối khi gọi Gemini API tạo Prompt ảnh.');
    } finally {
      setLoadingAiId(null);
    }
  };

  const [imageSeedState, setImageSeedState] = useState({});

  const cleanPromptForPollinations = (rawPrompt) => {
    if (!rawPrompt) return 'Educational math geometry diagram realistic';
    return rawPrompt
      .replace(/\\[a-zA-Z]+\{[^}]*\}/g, ' ')
      .replace(/\\[a-zA-Z]+/g, ' ')
      .replace(/[$\\{}#%_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleRetryImage = (pId) => {
    setImageErrorState((prev) => ({ ...prev, [pId]: false }));
    setImageSeedState((prev) => ({ ...prev, [pId]: Date.now() }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Trình Biên Dịch Trực Quan Mã TikZ LaTeX & Ảnh AI Giáo Dục
            </h2>
            <p className="text-xs text-slate-500">
              Biên dịch mã TikZ thành hình vẽ vector trực quan, hỗ trợ chỉnh sửa trực tiếp và khởi tạo lại bằng Gemini AI.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadAllTikZ}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" /> Xuất File Mã TikZ (.tex)
        </button>
      </div>

      {/* List of Problems with TikZ Compiler & AI Image Generator */}
      <div className="space-y-6">
        {problems.map((p, idx) => {
          const isEditing = editingId === p.id;
          const cleanPrompt = cleanPromptForPollinations(p.imagePrompt);
          const encodedPrompt = encodeURIComponent(cleanPrompt);
          const seed = imageSeedState[p.id] || (idx + 1) * 100;
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=400&nologo=true&seed=${seed}`;

          return (
            <div
              key={p.id || idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              {/* Card Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">Câu {idx + 1}</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {p.contextTag || 'Thực tế'}
                  </span>
                  {!isEditing ? (
                    <button
                      onClick={() => startEdit(p)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-600" /> Sửa TikZ / Prompt
                    </button>
                  ) : (
                    <button
                      onClick={() => saveEdit(p)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Lưu & Biên Dịch Lại
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: TikZ Code & Visual Render */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-indigo-600" /> Mã TikZ Hình Vẽ LaTeX
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRegenerateTikZAi(p)}
                        disabled={loadingAiId === `tikz_${p.id}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3.5 h-3.5 ${loadingAiId === `tikz_${p.id}` ? 'animate-spin' : ''}`} />
                        <span>Tạo TikZ AI</span>
                      </button>

                      {p.tikzCode && (
                        <button
                          onClick={() => handleCopyTikZ(p.tikzCode, p.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1"
                        >
                          {copiedId === `tikz_${p.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Edit mode vs Read mode */}
                  {isEditing ? (
                    <textarea
                      rows={6}
                      value={editedTikZ}
                      onChange={(e) => setEditedTikZ(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                      placeholder="\begin{tikzpicture} ... \end{tikzpicture}"
                    />
                  ) : (
                    <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-48 scrollbar-thin">
                      {p.tikzCode || `% Không có mã TikZ cho câu này`}
                    </pre>
                  )}

                  {/* TikZ Live Visual Render Component */}
                  <TikZCompiledViewer
                    tikzCode={p.tikzCode}
                    title={p.title}
                    onZoom={(svg, title) => setZoomMedia({ type: 'svg', content: svg, title })}
                  />
                </div>

                {/* Right Column: Educational Image Prompt & Preview */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Prompt Ảnh Minh Họa Giáo Dục
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRegeneratePromptAi(p)}
                        disabled={loadingAiId === `prompt_${p.id}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <Wand2 className={`w-3.5 h-3.5 ${loadingAiId === `prompt_${p.id}` ? 'animate-spin' : ''}`} />
                        <span>Tạo Prompt AI</span>
                      </button>

                      {p.imagePrompt && (
                        <button
                          onClick={() => handleCopyPrompt(p.imagePrompt, p.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1"
                        >
                          {copiedId === `prompt_${p.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-amber-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter English image prompt..."
                    />
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic">
                      "{p.imagePrompt || 'Educational illustration of real world math problem'}"
                    </div>
                  )}

                  {/* Rendered Image Preview with Error Handling */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {!imageErrorState[p.id] ? (
                      <img
                        src={imageUrl}
                        alt={`Minh họa câu ${idx + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        loading="lazy"
                        onError={() => setImageErrorState((prev) => ({ ...prev, [p.id]: true }))}
                      />
                    ) : (
                      <div className="p-4 text-center space-y-2">
                        <AlertCircle className="w-8 h-8 mx-auto text-amber-500" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Không thể tải ảnh minh họa trực tiếp</p>
                        <p className="text-[10px] text-slate-500">Thử bấm "Tải lại" hoặc sao chép prompt để dán vào Midjourney/DALL-E</p>
                        <button
                          onClick={() => handleRetryImage(p.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" /> Tải Lại Ảnh
                        </button>
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <button
                        onClick={() => setZoomMedia({ type: 'image', content: imageUrl, title: p.title })}
                        className="px-2 py-1 rounded bg-slate-950/80 backdrop-blur-sm text-[10px] text-white font-medium hover:bg-slate-900 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Phóng To
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Zoom Preview */}
      {zoomMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setZoomMedia(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 pr-8">{zoomMedia.title}</h3>

            <div className="flex items-center justify-center p-6 bg-slate-950 rounded-xl max-h-[75vh] overflow-auto">
              {zoomMedia.type === 'svg' ? (
                <div
                  className="tikz-svg-zoom text-slate-100 max-h-[65vh] overflow-auto flex items-center justify-center p-4"
                  dangerouslySetInnerHTML={{ __html: zoomMedia.content }}
                />
              ) : (
                <img src={zoomMedia.content} alt={zoomMedia.title} className="max-h-[65vh] object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
