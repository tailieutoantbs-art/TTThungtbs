import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

// Clean LaTeX syntax tags for Word export text readability
function cleanLaTeX(text) {
  if (!text) return '';
  return text
    .replace(/\$\$/g, '')
    .replace(/\$/g, '')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\pi/g, 'π')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\degree/g, '°');
}

export async function exportWordDocument(problems, options = {}, isMultipleVariants = false) {
  if (!problems || problems.length === 0) {
    alert('Không có dữ liệu bài toán để xuất file Word.');
    return;
  }

  const sections = [];

  // If multiple exam variants selected
  if (isMultipleVariants) {
    const variantCodes = [101, 102, 103, 104];
    const masterAnswerMatrix = [];

    variantCodes.forEach((code) => {
      // Shuffle problems order pseudo-randomly for each variant code
      const shuffled = [...problems].sort(() => (Math.sin(code) > 0 ? 1 : -1));

      const children = [
        new Paragraph({
          text: `SỞ GIÁO DỤC VÀ ĐÀO TẠO — TRƯỜNG THPT / THCS`,
          alignment: AlignmentType.CENTER,
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `ĐỀ THI / KIỂM TRA BÀI TOÁN THỰC TẾ (MÃ ĐỀ ${code})`, bold: true, size: 28, color: '1E3A8A' }),
          ],
          alignment: AlignmentType.CENTER,
          space: { after: 300 },
        }),
        new Paragraph({
          text: `Thời gian làm bài: 45 phút | Phân môn: ${options.domain || 'Toán học'} | Khối: ${options.grade || 'GDPT'}`,
          alignment: AlignmentType.CENTER,
          space: { after: 400 },
        }),
      ];

      const variantAnswers = { code, answers: {} };

      shuffled.forEach((p, idx) => {
        const qNum = idx + 1;
        variantAnswers.answers[qNum] = p.correctOption || p.shortAnswer || 'A';

        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Câu ${qNum} (${p.difficulty || 'Vận dụng'} - ${p.contextTag || 'Thực tế'}): `, bold: true, size: 24 }),
              new TextRun({ text: cleanLaTeX(p.statement), size: 24 }),
            ],
            space: { before: 200, after: 100 },
          })
        );

        if (p.options && Array.isArray(p.options) && p.options.length > 0) {
          p.options.forEach((opt) => {
            children.push(
              new Paragraph({
                text: cleanLaTeX(opt),
                indent: { left: 360 },
                space: { after: 50 },
              })
            );
          });
        }
      });

      masterAnswerMatrix.push(variantAnswers);

      sections.push({
        properties: {},
        children,
      });
    });

    // Add Master Answer Key Matrix Section
    const matrixRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Mã Đề', bold: true })], width: { size: 15, type: WidthType.PERCENTAGE } }),
          ...Array.from({ length: 10 }, (_, i) => new TableCell({ children: [new Paragraph({ text: `C${i + 1}`, bold: true })] })),
        ],
      }),
    ];

    masterAnswerMatrix.forEach((m) => {
      matrixRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: `Đề ${m.code}`, bold: true })] }),
            ...Array.from({ length: 10 }, (_, i) => new TableCell({ children: [new Paragraph({ text: `${m.answers[i + 1] || '-'}` })] })),
          ],
        })
      );
    });

    sections.push({
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'BẢNG MA TRẬN ĐÁP ÁN 4 MÃ ĐỀ (101 - 104)', bold: true, size: 28, color: '047857' })],
          alignment: AlignmentType.CENTER,
          space: { before: 400, after: 300 },
        }),
        new Table({
          rows: matrixRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
      ],
    });
  } else {
    // Single Master Word Document Export
    const children = [
      new Paragraph({
        children: [new TextRun({ text: 'TRỢ LÝ SÁNG TẠO BÀI TOÁN THỰC TẾ 4.0 — GDPT 2018', bold: true, size: 32, color: '1E40AF' })],
        alignment: AlignmentType.CENTER,
        space: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Bộ 10 Bài Toán Thực Tế — ${options.domain || 'Toán'} (${options.grade || 'GDPT'})`, italic: true, size: 22 }),
        ],
        alignment: AlignmentType.CENTER,
        space: { after: 400 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'PHẦN I: DANH SÁCH 10 BÀI TOÁN THỰC TẾ', bold: true, size: 26, color: '1E3A8A' })],
        space: { before: 200, after: 200 },
      }),
    ];

    problems.forEach((p, idx) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Câu ${idx + 1}: ${p.title || ''} `, bold: true, size: 24, color: '0F766E' }),
            new TextRun({ text: `[${p.difficulty || 'Thông hiểu'} | ${p.contextTag || 'Thực tế'}]`, italic: true, size: 20, color: '64748B' }),
          ],
          space: { before: 200, after: 100 },
        })
      );

      children.push(
        new Paragraph({
          text: cleanLaTeX(p.statement),
          space: { after: 150 },
        })
      );

      if (p.options && Array.isArray(p.options) && p.options.length > 0) {
        p.options.forEach((opt) => {
          children.push(
            new Paragraph({
              text: cleanLaTeX(opt),
              indent: { left: 360 },
              space: { after: 60 },
            })
          );
        });
      }

      if (p.shortAnswer) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Đáp số ngắn: ', bold: true }),
              new TextRun({ text: cleanLaTeX(p.shortAnswer) }),
            ],
            indent: { left: 360 },
            space: { after: 100 },
          })
        );
      }
    });

    // Section 2: Detailed Solutions
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'PHẦN II: LỜI GIẢI CHI TIẾT VÀ ĐÁP ÁN', bold: true, size: 26, color: '1E3A8A' })],
        space: { before: 500, after: 200 },
      })
    );

    problems.forEach((p, idx) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Lời Giải Câu ${idx + 1}: `, bold: true, size: 24, color: 'B45309' }),
            new TextRun({ text: `(Đáp án đúng: ${p.correctOption || p.shortAnswer || 'A'})`, bold: true, size: 22, color: '047857' }),
          ],
          space: { before: 200, after: 100 },
        })
      );

      children.push(
        new Paragraph({
          text: cleanLaTeX(p.detailedSolution || 'Đang cập nhật lời giải...'),
          space: { after: 200 },
        })
      );

      if (p.tikzCode) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'Mã TikZ hình vẽ:', bold: true, size: 20, color: '475569' })],
          }),
          new Paragraph({
            text: p.tikzCode,
            indent: { left: 360 },
            space: { after: 150 },
          })
        );
      }
    });

    sections.push({
      properties: {},
      children,
    });
  }

  const doc = new Document({
    sections,
  });

  const buffer = await Packer.toBlob(doc);
  const fileName = isMultipleVariants ? 'Bo_4_Ma_De_Thi_Toan_Thuc_Te_101-104.docx' : 'Bo_10_Bai_Toan_Thuc_Te_Full.docx';
  saveAs(buffer, fileName);
}
