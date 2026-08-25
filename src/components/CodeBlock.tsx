import React, { useState, useMemo } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function highlightLine(line: string, keywordsRegex: RegExp, builtinsRegex: RegExp): string {
  // Extract strings
  const stringRegex = /(".*?"|'.*?'|`.*?`)/g;
  const segments = line.split(stringRegex);

  return segments
    .map((segment) => {
      if (
        (segment.startsWith('"') && segment.endsWith('"')) ||
        (segment.startsWith("'") && segment.endsWith("'")) ||
        (segment.startsWith('`') && segment.endsWith('`'))
      ) {
        return `<span class="token string">${escapeHtml(segment)}</span>`;
      }

      let escaped = escapeHtml(segment);

      // Numbers
      escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="token number">$1</span>');

      // Functions (name followed by '(')
      escaped = escaped.replace(
        /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
        '<span class="token function">$1</span>'
      );

      // Keywords
      escaped = escaped.replace(keywordsRegex, '<span class="token keyword">$1</span>');

      // Built-ins
      escaped = escaped.replace(builtinsRegex, '<span class="token class-name">$1</span>');

      return escaped;
    })
    .join('');
}

function highlightCode(code: string, language: string = 'javascript'): string {
  const lang = (language || 'javascript').toLowerCase();

  // Python highlighting
  if (lang === 'python' || lang === 'py') {
    const pythonKeywords = /\b(def|class|if|elif|else|while|for|in|return|import|from|as|try|except|finally|raise|with|lambda|yield|async|await|pass|break|continue|global|nonlocal|True|False|None|self|and|or|not|is)\b/g;
    const pythonBuiltins = /\b(print|len|range|str|int|float|list|dict|set|tuple|enumerate|zip|map|filter|super|type|isinstance|open)\b/g;

    const parts: string[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      const commentIdx = line.indexOf('#');
      if (commentIdx !== -1) {
        const before = line.slice(0, commentIdx);
        const comment = line.slice(commentIdx);
        parts.push(
          highlightLine(before, pythonKeywords, pythonBuiltins) +
            `<span class="token comment">${escapeHtml(comment)}</span>`
        );
      } else {
        parts.push(highlightLine(line, pythonKeywords, pythonBuiltins));
      }
    }
    return parts.join('\n');
  }

  // JS/TS/Java/C++/C#/Go highlighting
  const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|interface|type|extends|implements|new|this|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|void|null|undefined|true|false|public|private|protected|static|readonly|abstract|func|struct|package|nil)\b/g;
  const jsBuiltins = /\b(console|Promise|Array|Object|String|Number|Boolean|Map|Set|JSON|Math|Date|Error|RegExp|document|window|setTimeout|setInterval|fetch)\b/g;

  const parts: string[] = [];
  const lines = code.split('\n');

  for (const line of lines) {
    const commentIdx = line.indexOf('//');
    if (commentIdx !== -1) {
      const before = line.slice(0, commentIdx);
      const comment = line.slice(commentIdx);
      parts.push(
        highlightLine(before, jsKeywords, jsBuiltins) +
          `<span class="token comment">${escapeHtml(comment)}</span>`
      );
    } else {
      parts.push(highlightLine(line, jsKeywords, jsBuiltins));
    }
  }
  return parts.join('\n');
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const cleanLang = (language || 'javascript').toLowerCase().trim();

  const highlightedHtml = useMemo(() => {
    return highlightCode(code, cleanLang);
  }, [code, cleanLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  return (
    <div
      className={`relative group rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] my-2 text-left ${className}`}
      dir="ltr"
    >
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#161b22] border-b border-slate-800/80 text-slate-400 text-xs">
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          {cleanLang}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-2 py-0.5 rounded transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">הועתק</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>העתק</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-xs leading-relaxed font-mono text-slate-200">
        <pre className="!m-0 !p-0 !bg-transparent">
          <code
            className={`language-${cleanLang}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
};

interface FormattedSolutionViewProps {
  text: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export const FormattedSolutionView: React.FC<FormattedSolutionViewProps> = ({
  text,
  codeSnippet,
  codeLanguage = 'javascript',
}) => {
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore) {
      parts.push(
        <span key={`text-${keyCounter++}`} className="whitespace-pre-line leading-relaxed">
          {textBefore}
        </span>
      );
    }

    const lang = match[1] || codeLanguage || 'javascript';
    const code = match[2].trim();
    parts.push(
      <CodeBlock key={`code-${keyCounter++}`} code={code} language={lang} />
    );

    lastIndex = match.index + match[0].length;
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    parts.push(
      <span key={`text-${keyCounter++}`} className="whitespace-pre-line leading-relaxed">
        {remainingText}
      </span>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-slate-800 text-sm leading-relaxed">
        {parts.length > 0 ? parts : <span className="whitespace-pre-line">{text}</span>}
      </div>

      {codeSnippet && codeSnippet.trim() && (
        <div className="mt-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>מימוש בקוד ({codeLanguage || 'קוד'})</span>
          </div>
          <CodeBlock code={codeSnippet} language={codeLanguage || 'javascript'} />
        </div>
      )}
    </div>
  );
};
