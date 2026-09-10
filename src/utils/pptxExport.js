import pptxgen from 'pptxgenjs';

export function exportPowerPointSlides(problems, options = {}) {
  if (!problems || problems.length === 0) {
    alert('Không có dữ liệu bài toán để xuất PowerPoint.');
    return;
  }

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  // Title Slide
  const titleSlide = pres.addSlide();
  titleSlide.background = { color: '0F172A' };

  titleSlide.addText('TRỢ LÝ SÁNG TẠO BÀI TOÁN THỰC TẾ 4.0', {
    x: 0.8,
    y: 1.8,
    w: 8.4,
    h: 1.2,
    fontSize: 28,
    bold: true,
    color: '38BDF8',
    align: 'center',
    fontFace: 'Be Vietnam Pro',
  });

  titleSlide.addText(`Bộ 10 Bài Toán Thực Tế — ${options.domain || 'Toán học'} (${options.grade || 'GDPT 2018'})`, {
    x: 0.8,
    y: 3.2,
    w: 8.4,
    h: 0.8,
    fontSize: 20,
    color: 'E2E8F0',
    align: 'center',
    fontFace: 'Be Vietnam Pro',
  });

  titleSlide.addText('Thầy Hùng TBS | Khoa Học & Giáo Dục 4.0', {
    x: 0.8,
    y: 4.5,
    w: 8.4,
    h: 0.5,
    fontSize: 14,
    color: '94A3B8',
    align: 'center',
    fontFace: 'Be Vietnam Pro',
  });

  // Problem Slides
  problems.forEach((p, idx) => {
    const slide = pres.addSlide();
    slide.background = { color: 'F8FAFC' };

    // Card Header
    slide.addText(`CÂU ${idx + 1}: ${p.title || 'Bài Toán Thực Tế'}`, {
      x: 0.5,
      y: 0.4,
      w: 9.0,
      h: 0.6,
      fontSize: 20,
      bold: true,
      color: '1E3A8A',
      fontFace: 'Be Vietnam Pro',
    });

    // Statement Box
    slide.addText(p.statement || '', {
      x: 0.5,
      y: 1.1,
      w: 9.0,
      h: 2.2,
      fontSize: 15,
      color: '0F172A',
      fill: { color: 'FFFFFF' },
      line: { color: 'CBD5E1', width: 1 },
      inset: 0.2,
      valign: 'top',
      fontFace: 'Be Vietnam Pro',
    });

    // Options or Answer Box
    if (p.options && Array.isArray(p.options) && p.options.length > 0) {
      slide.addText(p.options.join('\n'), {
        x: 0.5,
        y: 3.5,
        w: 9.0,
        h: 1.6,
        fontSize: 13,
        color: '334155',
        fill: { color: 'F1F5F9' },
        inset: 0.15,
        fontFace: 'Be Vietnam Pro',
      });
    }

    // Solution Slide for this problem
    const solSlide = pres.addSlide();
    solSlide.background = { color: '0F172A' };

    solSlide.addText(`LỜI GIẢI CHI TIẾT - CÂU ${idx + 1}`, {
      x: 0.5,
      y: 0.4,
      w: 9.0,
      h: 0.6,
      fontSize: 20,
      bold: true,
      color: 'F59E0B',
      fontFace: 'Be Vietnam Pro',
    });

    solSlide.addText(`Đáp án đúng: ${p.correctOption || p.shortAnswer || 'A'}`, {
      x: 0.5,
      y: 1.0,
      w: 9.0,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: '10B981',
      fontFace: 'Be Vietnam Pro',
    });

    solSlide.addText(p.detailedSolution || 'Chi tiết lời giải...', {
      x: 0.5,
      y: 1.6,
      w: 9.0,
      h: 3.5,
      fontSize: 14,
      color: 'E2E8F0',
      fill: { color: '1E293B' },
      inset: 0.2,
      valign: 'top',
      fontFace: 'Be Vietnam Pro',
    });
  });

  pres.writeFile({ fileName: 'Slide_Giang_Day_10_Bai_Toan_Thuc_Te.pptx' });
}
