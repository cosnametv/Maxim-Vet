import { useRef, KeyboardEvent } from 'react';
import { Heading2, Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // execCommand('insertText') keeps the native undo/redo stack intact.
  const insert = (text: string) => {
    const ta = ref.current;
    if (!ta) return;
    ta.focus();
    document.execCommand('insertText', false, text);
    onChange(ta.value);
  };

  const wrap = (before: string, after: string, placeholderText = '') => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const sel = v.slice(s, e) || placeholderText;
    ta.focus();
    document.execCommand('insertText', false, before + sel + after);
    if (s === e) {
      const pos = s + before.length + sel.length;
      ta.setSelectionRange(s + before.length, pos);
    }
    onChange(ta.value);
  };

  const prefixLines = (makePrefix: (i: number) => string) => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const lineStart = v.lastIndexOf('\n', s - 1) + 1;
    const nlAfter = v.indexOf('\n', e);
    const lineEnd = nlAfter === -1 ? v.length : nlAfter;
    const lines = v.slice(lineStart, lineEnd).split('\n');
    const transformed = lines.map((ln, i) => makePrefix(i) + ln.replace(/^(\s*([-*]|\d+\.)\s+|##\s+)/, '')).join('\n');
    ta.focus();
    ta.setSelectionRange(lineStart, lineEnd);
    document.execCommand('insertText', false, transformed);
    onChange(ta.value);
  };

  const addLink = () => {
    const url = window.prompt('Link URL (https://...)');
    if (!url) return;
    wrap('[', `](${url.trim()})`, 'link text');
  };

  const handleKeyDown = (ev: KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key !== 'Enter' || ev.shiftKey) return;
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, value: v } = ta;
    const lineStart = v.lastIndexOf('\n', s - 1) + 1;
    const line = v.slice(lineStart, s);
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    const ul = line.match(/^([-*])\s+(.*)$/);
    if (ol) {
      ev.preventDefault();
      if (ol[2].trim() === '') {
        ta.setSelectionRange(lineStart, s);
        document.execCommand('insertText', false, '');
      } else {
        insert(`\n${parseInt(ol[1], 10) + 1}. `);
        return;
      }
      onChange(ta.value);
    } else if (ul) {
      ev.preventDefault();
      if (ul[2].trim() === '') {
        ta.setSelectionRange(lineStart, s);
        document.execCommand('insertText', false, '');
      } else {
        insert(`\n${ul[1]} `);
        return;
      }
      onChange(ta.value);
    }
  };

  const btn =
    'w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer';

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-emerald-600">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-200 bg-white">
        <button type="button" title="Subtitle (## )" onClick={() => prefixLines(() => '## ')} className={btn}>
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" title="Bold" onClick={() => wrap('**', '**', 'bold text')} className={btn}>
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" title="Italic" onClick={() => wrap('*', '*', 'italic text')} className={btn}>
          <Italic className="w-4 h-4" />
        </button>
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" title="Bullet list" onClick={() => prefixLines(() => '- ')} className={btn}>
          <List className="w-4 h-4" />
        </button>
        <button type="button" title="Numbered list" onClick={() => prefixLines((i) => `${i + 1}. `)} className={btn}>
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" title="Insert link" onClick={addLink} className={btn}>
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? 'Write your article…'}
        rows={14}
        className="w-full px-4 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none resize-y leading-relaxed"
      />

      <div className="px-3 py-2 border-t border-slate-200 bg-white text-[11px] text-slate-400">
        <span className="font-bold text-slate-500">Tips:</span> blank line = new paragraph ·{' '}
        <code className="text-slate-500">##</code> subtitle · Enter on a numbered line adds the next number ·
        Ctrl+Z undo · Ctrl+Y redo
      </div>
    </div>
  );
}
