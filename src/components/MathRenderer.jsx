import React from 'react';
import katex from 'katex';

export const MathRenderer = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by LaTeX math delimiters $$...$$ or $...$
  const parts = [];
  const regex = /(\$\$.*?\$\$|\$.*?\$)/gs;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchStr = match[0];

    // Push plain text before match
    if (matchStart > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, matchStart) });
    }

    // Process math
    if (matchStr.startsWith('$$') && matchStr.endsWith('$$')) {
      parts.push({ type: 'math-block', content: matchStr.slice(2, -2).trim() });
    } else if (matchStr.startsWith('$') && matchStr.endsWith('$')) {
      parts.push({ type: 'math-inline', content: matchStr.slice(1, -1).trim() });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return (
    <div className={`leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index} className="whitespace-pre-line">{part.content}</span>;
        }

        try {
          const html = katex.renderToString(part.content, {
            displayMode: part.type === 'math-block',
            throwOnError: false,
          });

          if (part.type === 'math-block') {
            return (
              <div
                key={index}
                className="my-3 p-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          return (
            <span
              key={index}
              className="inline-block px-1"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={index} className="text-red-500 font-mono text-sm">{part.content}</code>;
        }
      })}
    </div>
  );
};
