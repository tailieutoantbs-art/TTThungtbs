import Dexie from 'dexie';

export const db = new Dexie('QuestionBankDB');

db.version(1).stores({
  problemSets: '++id, title, grade, domain, context, createdAt, *tags',
});

// Helper functions for Question Bank Repository
export async function saveProblemSetToRepo(data) {
  const { title, grade, domain, context, sourceProblemText, options, problems, tags = [] } = data;
  const newId = await db.problemSets.add({
    title: title || `Bộ 10 bài toán ${domain} - ${grade} (${new Date().toLocaleDateString('vi-VN')})`,
    grade: grade || options?.grade || 'Chưa rõ',
    domain: domain || options?.domain || 'Chưa rõ',
    context: context || options?.context || 'Thực tế',
    sourceProblemText: sourceProblemText || '',
    options: options || {},
    problems: problems || [],
    tags: tags.length > 0 ? tags : ['#BaiToanThucTe', `#${grade.replace(/\s+/g, '')}`],
    createdAt: new Date().toISOString(),
  });
  return newId;
}

export async function getAllProblemSets() {
  return await db.problemSets.orderBy('createdAt').reverse().toArray();
}

export async function searchProblemSets(query) {
  if (!query || !query.trim()) {
    return getAllProblemSets();
  }
  const q = query.toLowerCase().trim();
  const all = await getAllProblemSets();
  return all.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.grade.toLowerCase().includes(q) ||
      item.domain.toLowerCase().includes(q) ||
      item.context.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q)))
  );
}

export async function deleteProblemSet(id) {
  return await db.problemSets.delete(id);
}

export async function clearAllProblemSets() {
  return await db.problemSets.clear();
}
