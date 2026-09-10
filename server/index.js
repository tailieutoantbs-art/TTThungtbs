import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.redirect('http://localhost:5173');
});

// Helper to get GoogleGenerativeAI instance and execute content generation with fallback models
function getGenAI(clientApiKey) {
  const apiKey = (clientApiKey && clientApiKey.trim()) || process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('Chưa cấu hình Gemini API Key. Vui lòng nhập API Key trên giao diện hoặc kiểm tra biến môi trường GEMINI_API_KEY.');
  }
  return new GoogleGenerativeAI(apiKey);
}

// Helper to clean & repair JSON text from LLM response (handling LaTeX backslashes & truncation)
function repairLlmJson(rawText) {
  if (!rawText) return '';

  let str = rawText.trim();
  str = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const firstBrace = str.indexOf('{');
  if (firstBrace === -1) return str;

  str = str.substring(firstBrace);

  let result = '';
  let inString = false;
  let isEscaped = false;
  let stack = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}' || char === ']') {
        if (stack.length > 0) stack.pop();
      } else if (char === '"') {
        inString = true;
      }
      result += char;
      continue;
    }

    // Inside string literal
    if (isEscaped) {
      isEscaped = false;
      result += char;
      continue;
    }

    if (char === '\\') {
      const nextChar = str[i + 1];
      if (nextChar === '"' || nextChar === '\\' || nextChar === '/') {
        isEscaped = true;
        result += char;
      } else if (
        nextChar === 'u' &&
        /^[0-9a-fA-F]{4}$/.test(str.substring(i + 2, i + 6))
      ) {
        isEscaped = true;
        result += char;
      } else {
        // Double escape LaTeX/TikZ backslashes (\begin, \frac, \node, \draw, etc.)
        result += '\\\\';
      }
    } else if (char === '"') {
      inString = false;
      result += char;
    } else if (char === '\n') {
      result += '\\n';
    } else if (char === '\r') {
      result += '\\r';
    } else if (char === '\t') {
      result += '\\t';
    } else {
      result += char;
    }
  }

  if (inString) {
    result += '"';
  }

  result = result.trim().replace(/,\s*$/, '');

  while (stack.length > 0) {
    const open = stack.pop();
    if (open === '{') result += '}';
    else if (open === '[') result += ']';
  }

  return result;
}

// Generates content with automatic fallback if the requested model returns 404
async function generateContentWithFallback(genAI, requestedModel, contents, isJson = false) {
  const candidates = [
    requestedModel,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.5-pro',
    'gemini-1.5-flash'
  ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

  let lastError = null;
  for (const modelName of candidates) {
    try {
      const config = {};
      if (isJson) {
        config.responseMimeType = 'application/json';
      }
      const model = genAI.getGenerativeModel({ model: modelName, generationConfig: config });
      const result = await model.generateContent(contents);
      return { result, modelName };
    } catch (err) {
      lastError = err;
      const errMsg = (err && err.message) || '';
      if (errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('not supported') || errMsg.includes('responseMimeType')) {
        console.warn(`Model "${modelName}" retry fallback: ${errMsg}`);
        // Retry without responseMimeType if it caused an error
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(contents);
          return { result, modelName };
        } catch (innerErr) {
          lastError = innerErr;
        }
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// 1. Test Key Endpoint
app.post('/api/gemini/test-key', async (req, res) => {
  try {
    const { apiKey, model: modelName = 'gemini-2.5-flash' } = req.body;
    const genAI = getGenAI(apiKey);
    const { result, modelName: usedModel } = await generateContentWithFallback(
      genAI,
      modelName,
      'Hãy trả về duy nhất từ "OK" để xác nhận API Key hoạt động tốt.'
    );
    const responseText = result.response.text();

    if (responseText) {
      return res.json({
        success: true,
        message: `Kết nối thành công tới Google Gemini API (${usedModel})!`,
      });
    }
    return res.status(400).json({ success: false, message: 'Không thể nhận phản hồi từ Gemini API.' });
  } catch (error) {
    console.error('Test Key Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi kiểm tra kết nối Gemini API. Vui lòng kiểm tra lại khóa API.',
    });
  }
});

// 2. Analyze Problem Endpoint
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { problemText, options, apiKey, model: modelName = 'gemini-2.5-flash' } = req.body;
    const genAI = getGenAI(apiKey);

    const prompt = `Bạn là Chuyên gia Giáo dục Toán & Khoa học GDPT 2018. Hãy phân tích đề bài toán gốc sau đây:

--- ĐỀ BÀI GỐC ---
${problemText}

--- CẤU HÌNH TÙY CHỌN ---
Lớp: ${options?.grade || 'Tự động'}
Phân môn: ${options?.domain || 'Tự động'}
Mức độ: ${options?.difficulty || 'Tự động'}
Bối cảnh: ${options?.context || 'Tự động'}

Hãy trả về phản hồi dưới dạng JSON thuần túy (không chứa mã markdown \`\`\`json) với cấu trúc như sau:
{
  "grade": "Lớp phù hợp (ví dụ: Lớp 9)",
  "domain": "Phân môn (ví dụ: Đại số)",
  "topic": "Tên chủ đề bài toán",
  "difficulty": "Mức độ nhận thức",
  "coreConcepts": ["Khái niệm 1", "Khái niệm 2"],
  "variables": ["Biến 1: Tên biến", "Biến 2: Tên biến"],
  "problemType": "Dạng bài toán",
  "realWorldContext": "Bối cảnh thực tế chính trong bài gốc",
  "recommendedPrompts": ["Gợi ý thay đổi bối cảnh 1", "Gợi ý phân hóa 2"]
}`;

    const { result } = await generateContentWithFallback(genAI, modelName, prompt, true);
    const cleanText = repairLlmJson(result.response.text());
    const analysis = JSON.parse(cleanText);
    return res.json({ success: true, analysis });
  } catch (error) {
    console.error('Analyze Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi khi phân tích bài toán gốc.' });
  }
});

// 3. Generate 10 Problems Endpoint
app.post('/api/gemini/generate-10', async (req, res) => {
  try {
    const { problemText, options, analysis, apiKey, model: modelName = 'gemini-2.5-flash', lockedProblems = [] } = req.body;
    const genAI = getGenAI(apiKey);

    const lockedMap = (lockedProblems || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    const prompt = `Bạn là Chuyên gia Biên soạn Đề thi Toán & Khoa học GDPT 2018. 
Nhiệm vụ của bạn là dựa vào đề bài toán gốc và các thông tin phân tích để sáng tạo đúng 10 BÀI TOÁN THỰC TẾ TƯƠNG TỰ.

--- ĐỀ BÀI GỐC ---
${problemText}

--- CẤU HÌNH YÊU CẦU ---
- Lớp: ${options?.grade || 'GDPT'}
- Phân môn: ${options?.domain || 'Toán học'}
- Mức độ độ khó: ${options?.difficulty || 'Theo bài gốc'}
- Hình thức dạng câu hỏi: ${options?.format || 'Tự luận kết hợp Trắc nghiệm'}
- Ngữ cảnh thực tế yêu cầu: ${options?.context || 'Bối cảnh cuộc sống thực tế Việt Nam'}
- Chế độ sáng tạo: ${options?.creativeLevel || 'Sáng tạo đa dạng giữ kiến thức cốt lõi'}
- Phong cách ảnh: ${options?.imageStyle || 'Ảnh thực tế giáo dục / Minh họa 3D'}

--- DANH SÁCH BÀI ĐÃ BỊ KHÓA (CẦN GIỮ NGUYÊN HOÀN TOÀN) ---
${Object.keys(lockedMap).length > 0 ? JSON.stringify(Object.keys(lockedMap)) : 'Không có bài nào bị khóa.'}

YÊU CẦU ĐẦU RA:
Trả về phản hồi định dạng JSON thuần túy có cấu trúc như sau:
{
  "sourceAnalysis": {
    "topic": "${analysis?.topic || 'Bài toán thực tế'}",
    "domain": "${analysis?.domain || options?.domain || 'Toán'}",
    "grade": "${analysis?.grade || options?.grade || 'Lớp 9'}"
  },
  "problems": [
    {
      "id": 1,
      "title": "Câu 1: Tên ngắn gọn bài toán",
      "questionFormat": "Trắc nghiệm nhiều lựa chọn",
      "contextTag": "Bối cảnh thực tế (Giao thông / STEM / Nông nghiệp...)",
      "difficulty": "Mức độ (Nhận biết / Thông hiểu / Vận dụng...)",
      "statement": "Nội dung đề bài chi tiết...",
      "options": ["A. Phương án A", "B. Phương án B", "C. Phương án C", "D. Phương án D"],
      "correctOption": "A",
      "shortAnswer": "Đáp số ngắn gọn",
      "detailedSolution": "Lời giải từng bước chi tiết...",
      "imagePrompt": "English prompt describing real world educational illustration scene...",
      "tikzCode": "\\\\begin{tikzpicture}[scale=0.8]\\n  \\\\draw[thick, fill=blue!10] (0,0) rectangle (4,3);\\n  \\\\node at (2,1.5) {Hình minh họa};\\n\\\\end{tikzpicture}"
    }
  ]
}

LƯU Ý QUAN TRỌNG:
1. Đủ đúng 10 bài từ id 1 đến 10.
2. Công thức toán học dùng KaTeX/LaTeX với dấu $...$ cho inline và $$...$$ cho block equation.
3. BẮT BUỘC: MỖI BÀI TOÁN PHẢI CÓ ĐOẠN MÃ TIKZ THỰC SỰ TRONG TRƯỜNG "tikzCode" (vẽ sơ đồ hình học, biểu đồ, hình vẽ thực tế tương ứng). Sử dụng các màu chuẩn (red, green, blue, yellow, orange, cyan, magenta, gray).
4. QUAN TRỌNG VỀ JSON: Tất cả dấu gạch chéo ngược (backslash) trong LaTeX và TikZ PHẢI ESCAPE THÀNH \\\\ (ví dụ \\\\begin{tikzpicture}, \\\\frac{a}{b}, \\\\draw).
5. Đối với các bài có id bị khóa ở danh sách trên, giữ nguyên bài cũ.`;

    const { result } = await generateContentWithFallback(genAI, modelName, prompt, true);
    const cleanText = repairLlmJson(result.response.text());
    const data = JSON.parse(cleanText);

    if (data.problems && Array.isArray(data.problems)) {
      data.problems = data.problems.map((p) => {
        if (lockedMap[p.id]) {
          return { ...lockedMap[p.id], isLocked: true };
        }
        return { ...p, isLocked: false };
      });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Generate 10 Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi khi tạo 10 bài toán tương tự.' });
  }
});

// 4. Regenerate Single Problem Endpoint
app.post('/api/gemini/regenerate-one', async (req, res) => {
  try {
    const { idToRegenerate, problemText, options, analysis, apiKey, model: modelName = 'gemini-2.5-flash' } = req.body;
    const genAI = getGenAI(apiKey);

    const prompt = `Bạn là Chuyên gia Biên soạn Đề thi Toán & Khoa học. Hãy sáng tạo 01 BÀI TOÁN THỰC TẾ TƯƠNG TỰ mới cho CÂU SỐ ${idToRegenerate}.

Đề bài gốc: ${problemText}
Lớp: ${options?.grade || 'GDPT'} | Phân môn: ${options?.domain || 'Toán học'} | Bối cảnh: ${options?.context || 'Thực tế'} | Độ khó: ${options?.difficulty || 'Vận dụng'}

Trả về định dạng JSON thuần túy cho đúng 1 object bài toán:
{
  "id": ${idToRegenerate},
  "title": "Câu ${idToRegenerate}: Tên bài toán",
  "questionFormat": "Trắc nghiệm / Tự luận / Trả lời ngắn / Đúng Sai",
  "contextTag": "Bối cảnh thực tế",
  "difficulty": "Mức độ",
  "statement": "Nội dung đề bài chi tiết...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correctOption": "A",
  "shortAnswer": "Đáp số",
  "detailedSolution": "Lời giải từng bước chi tiết...",
  "imagePrompt": "English image prompt...",
  "tikzCode": "\\\\begin{tikzpicture} ... \\\\end{tikzpicture}"
}`;

    const { result } = await generateContentWithFallback(genAI, modelName, prompt, true);
    const cleanText = repairLlmJson(result.response.text());
    const problem = JSON.parse(cleanText);
    return res.json({ success: true, problem });
  } catch (error) {
    console.error('Regenerate One Error:', error);
    return res.status(500).json({ success: false, error: error.message || `Lỗi khi tạo lại bài toán #${req.body.idToRegenerate}.` });
  }
});

// 5. OCR Image Endpoint (Gemini Vision)
app.post('/api/gemini/ocr-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', apiKey, model: modelName = 'gemini-2.5-flash' } = req.body;
    const genAI = getGenAI(apiKey);

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Thiếu dữ liệu ảnh base64.' });
    }

    const prompt = `Bạn là chuyên gia OCR tài liệu Toán học & Khoa học. 
Hãy trích xuất CHÍNH XÁC toàn bộ nội dung chữ, công thức toán học (định dạng LaTeX $...$) và bảng biểu trong hình ảnh này.
Chỉ trả về nội dung đề toán đã trích xuất, giữ nguyên bố cục và công thức toán học.`;

    const imagePart = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        mimeType: mimeType,
      },
    };

    const { result } = await generateContentWithFallback(genAI, modelName, [prompt, imagePart]);
    return res.json({ success: true, extractedText: result.response.text() });
  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi khi trích xuất đề từ ảnh (OCR).' });
  }
});

// 6. Regenerate Single TikZ Code Endpoint
app.post('/api/gemini/regenerate-tikz', async (req, res) => {
  try {
    const { statement, title, apiKey, model: modelName = 'gemini-2.5-flash' } = req.body;
    const genAI = getGenAI(apiKey);

    const prompt = `Bạn là Chuyên gia LaTeX & TikZ toán học giáo dục GDPT.
Hãy viết duy nhất đoạn mã TikZ (bắt đầu bằng \\begin{tikzpicture} và kết thúc bằng \\end{tikzpicture}) để vẽ hình minh họa cho bài toán sau:

Tựa bài: ${title || ''}
Nội dung bài toán: ${statement || ''}

LƯU Ý:
1. Chỉ trả về mã TikZ LaTeX hợp lệ, không bọc trong mã markdown hay văn bản thừa.
2. Dùng các lệnh TikZ chuẩn, màu sắc thuộc bộ chuẩn (red, green, blue, yellow, orange, cyan, magenta, gray), có chú thích kích thước nếu cần.`;

    const { result } = await generateContentWithFallback(genAI, modelName, prompt, false);
    let tikzCode = result.response.text().trim();
    tikzCode = tikzCode.replace(/^```(?:latex|tex)?\s*/i, '').replace(/\s*```$/i, '').trim();

    return res.json({ success: true, tikzCode });
  } catch (error) {
    console.error('Regenerate TikZ Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi khi tạo mã TikZ mới bằng Gemini AI.' });
  }
});

// 7. Regenerate Single Educational Image Prompt Endpoint
app.post('/api/gemini/regenerate-image-prompt', async (req, res) => {
  try {
    const { statement, title, apiKey, model: modelName = 'gemini-2.5-flash' } = req.body;
    const genAI = getGenAI(apiKey);

    const prompt = `Bạn là Chuyên gia Thiết kế Mỹ thuật Giáo dục & AI Image Prompt.
Hãy tạo 01 prompt tiếng Anh ngắn gọn, giàu hình ảnh minh họa bối cảnh thực tế cho bài toán sau:

Tựa bài: ${title || ''}
Nội dung bài toán: ${statement || ''}

LƯU Ý: Chỉ trả về duy nhất chuỗi text prompt tiếng Anh (không chứa ký tự LaTeX rác như $, \\frac, \\begin,...).`;

    const { result } = await generateContentWithFallback(genAI, modelName, prompt, false);
    let imagePrompt = result.response.text().trim();
    imagePrompt = imagePrompt.replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    return res.json({ success: true, imagePrompt });
  } catch (error) {
    console.error('Regenerate Image Prompt Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi khi tạo Prompt ảnh bằng Gemini AI.' });
  }
});

// Helper to sanitize Vietnamese accents for LaTeX TikZ compilation
function sanitizeTikZForLatex(text) {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// 8. TikZ Compiler Endpoint (Kroki Engine)
app.post('/api/tikz/compile', async (req, res) => {
  try {
    const { tikzCode } = req.body;
    if (!tikzCode || !tikzCode.trim()) {
      return res.status(400).json({ success: false, error: 'Thiếu mã TikZ.' });
    }

    let code = sanitizeTikZForLatex(tikzCode.trim());
    if (!code.includes('\\begin{document}')) {
      code = `\\documentclass[tikz,border=2mm]{standalone}
\\usepackage[utf8]{inputenc}
\\usepackage[dvipsnames,svgnames,x11names]{xcolor}
\\usepackage{tikz}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\begin{document}
${code}
\\end{document}`;
    }

    const krokiRes = await fetch('https://kroki.io/tikz/svg', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: code,
    });

    if (krokiRes.ok) {
      const svgText = await krokiRes.text();
      if (svgText.includes('<svg') && !svgText.includes('Error 400')) {
        return res.json({ success: true, svg: svgText });
      }
      console.warn('Kroki compilation error:', svgText.substring(0, 300));
    } else {
      console.warn('Kroki HTTP status error:', krokiRes.status);
    }

    return res.status(400).json({ success: false, error: 'Cú pháp TikZ cần chỉnh sửa để biên dịch.' });
  } catch (error) {
    console.error('TikZ Compile Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Lỗi kết nối khi biên dịch TikZ.' });
  }
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server Trợ Lý Sáng Tạo Bài Toán 4.0 đang chạy tại http://localhost:${PORT}`);
  });
}

export default app;
