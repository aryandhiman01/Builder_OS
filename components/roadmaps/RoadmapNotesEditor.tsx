"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  Wand2,
  FileText,
  Check,
  Copy,
  Download,
  Eye,
  Edit3,
  Columns,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Table,
  Link as LinkIcon,
  Save,
  Loader2,
  Zap,
  Clock,
  Type,
  ChevronDown,
  Maximize2,
  Minimize2,
  FileCode,
  Highlighter,
  HelpCircle,
  X,
  Keyboard,
  Undo2,
  Redo2,
} from "lucide-react";

interface RoadmapNotesEditorProps {
  notes: string;
  roadmapTitle?: string;
  onSave: (newNotes: string) => Promise<void>;
  saving?: boolean;
}

interface HistoryEntry {
  value: string;
  cursorStart: number;
  cursorEnd: number;
}

// Map language keys to user-friendly titles
const LANGUAGE_NAME_MAP: Record<string, string> = {
  cpp: "C++",
  c: "C",
  cs: "C#",
  csharp: "C#",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  py: "Python",
  python: "Python",
  java: "Java",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  json: "JSON",
  bash: "Bash/Shell",
  sh: "Shell",
  go: "Go",
  golang: "Go",
  rs: "Rust",
  rust: "Rust",
  php: "PHP",
  rb: "Ruby",
  ruby: "Ruby",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
};

// Code Snippet templates for quick code insertion
const CODE_TEMPLATES: Record<
  string,
  { label: string; lang: string; code: string }
> = {
  cpp: {
    label: "C++",
    lang: "cpp",
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write C++ code here\n  cout << "Hello World!" << endl;\n  return 0;\n}`,
  },
  c: {
    label: "C",
    lang: "c",
    code: `#include <stdio.h>\n\nint main() {\n  // Write C code here\n  printf("Hello World!\\n");\n  return 0;\n}`,
  },
  typescript: {
    label: "TypeScript / JS",
    lang: "typescript",
    code: `interface Task {\n  id: string;\n  title: string;\n  completed: boolean;\n}\n\nfunction processTask(task: Task): void {\n  console.log(\`Task: \${task.title}\`);\n}`,
  },
  python: {
    label: "Python",
    lang: "python",
    code: `def calculate_metrics(data: list[int]) -> dict:\n    """Calculate basic metrics."""\n    total = sum(data)\n    avg = total / len(data) if data else 0\n    return {"total": total, "average": avg}\n\nprint(calculate_metrics([10, 20, 30, 40]))`,
  },
  java: {
    label: "Java",
    lang: "java",
    code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Builder OS!");\n    }\n}`,
  },
  html: {
    label: "HTML",
    lang: "html",
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Notes Spec</title>\n</head>\n<body>\n  <h1>Title</h1>\n</body>\n</html>`,
  },
  css: {
    label: "CSS",
    lang: "css",
    code: `.code-container {\n  display: flex;\n  background-color: #09090c;\n  border-radius: 12px;\n  padding: 16px;\n}`,
  },
  sql: {
    label: "SQL",
    lang: "sql",
    code: `SELECT id, title, status, created_at\nFROM roadmaps\nWHERE status = 'ACTIVE'\nORDER BY created_at DESC;`,
  },
  json: {
    label: "JSON",
    lang: "json",
    code: `{\n  "project": "Builder_OS",\n  "version": "1.0.0",\n  "features": ["Smart Notes", "Code Autocomplete"]\n}`,
  },
  bash: {
    label: "Bash / Shell",
    lang: "bash",
    code: `#!/bin/bash\n# Run build script\necho "Running dev server..."\nnpm run dev`,
  },
  go: {
    label: "Go",
    lang: "go",
    code: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}`,
  },
  rust: {
    label: "Rust",
    lang: "rust",
    code: `fn main() {\n    let message = "Hello from Rust!";\n    println!("{}", message);\n}`,
  },
  php: {
    label: "PHP",
    lang: "php",
    code: `<?php\nfunction greet($name) {\n    return "Hello, " . $name;\n}\necho greet("World");\n?>`,
  },
};

// CodeBlock renderer component for markdown preview
function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang =
    LANGUAGE_NAME_MAP[language.toLowerCase()] ||
    (language ? language.toUpperCase() : "CODE");

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#050508] shadow-2xl">
      {/* Header bar with language title & copy button */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 animate-pulse" />
          <span className="font-bold text-emerald-400 tracking-wider">
            {displayLang}
          </span>
          <span className="text-[10px] text-[#8a8a93]">
            ({value.split("\n").length} lines)
          </span>
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax highlighted code block */}
      <div className="p-3 overflow-x-auto text-xs leading-relaxed custom-scrollbar">
        <SyntaxHighlighter
          language={language || "text"}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "8px 4px",
            background: "transparent",
            fontSize: "12px",
            lineHeight: "1.6",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
          showLineNumbers={value.split("\n").length > 1}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#4a4a58",
            textAlign: "right",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function RoadmapNotesEditor({
  notes,
  roadmapTitle,
  onSave,
  saving = false,
}: RoadmapNotesEditorProps) {
  const [value, setValue] = useState(notes || "");
  const [debouncedValue, setDebouncedValue] = useState(notes || "");
  const [mode, setMode] = useState<"edit" | "split" | "preview">("split");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const isSyncingEditorScroll = useRef<boolean>(false);
  const isSyncingPreviewScroll = useRef<boolean>(false);

  // Debounce preview rendering to eliminate typing lag
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 150);
    return () => clearTimeout(timer);
  }, [value]);

  // Auto-grow textarea height natively without internal middle scrollbars
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || isFullscreen) return;
    textarea.style.height = "auto";
    const contentHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.max(500, contentHeight)}px`;
  }, [value, isFullscreen, mode]);

  // Custom Undo / Redo History Stack Management
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoOperation = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Push new state into history stack
  const pushHistory = (val: string, cursorStart?: number, cursorEnd?: number) => {
    if (isUndoRedoOperation.current) return;

    const textarea = textareaRef.current;
    const start = cursorStart !== undefined ? cursorStart : textarea?.selectionStart || 0;
    const end = cursorEnd !== undefined ? cursorEnd : textarea?.selectionEnd || 0;

    const currentHistory = historyRef.current;
    const currentIdx = historyIndexRef.current;

    if (currentIdx >= 0 && currentHistory[currentIdx]?.value === val) {
      return;
    }

    const truncatedHistory = currentHistory.slice(0, currentIdx + 1);
    truncatedHistory.push({ value: val, cursorStart: start, cursorEnd: end });

    if (truncatedHistory.length > 150) {
      truncatedHistory.shift();
    }

    historyRef.current = truncatedHistory;
    historyIndexRef.current = truncatedHistory.length - 1;
  };

  // Initial history setup
  useEffect(() => {
    if (historyRef.current.length === 0) {
      historyRef.current = [{ value: notes || "", cursorStart: 0, cursorEnd: 0 }];
      historyIndexRef.current = 0;
    }
  }, [notes]);

  // Sync internal state if prop notes change externally
  useEffect(() => {
    setValue(notes || "");
    setDebouncedValue(notes || "");
    setIsDirty(false);
  }, [notes]);

  // Handle value change with debounced history push
  const handleChange = (val: string) => {
    setValue(val);
    setIsDirty(true);

    if (!isUndoRedoOperation.current) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        pushHistory(val);
      }, 350);
    }
  };

  // Undo Handler (Ctrl+Z)
  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const entry = historyRef.current[historyIndexRef.current];
      isUndoRedoOperation.current = true;
      setValue(entry.value);
      setDebouncedValue(entry.value);
      setIsDirty(true);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(entry.cursorStart, entry.cursorEnd);
        }
        isUndoRedoOperation.current = false;
      }, 0);
    }
  };

  // Redo Handler (Ctrl+Y / Ctrl+Shift+Z)
  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const entry = historyRef.current[historyIndexRef.current];
      isUndoRedoOperation.current = true;
      setValue(entry.value);
      setDebouncedValue(entry.value);
      setIsDirty(true);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(entry.cursorStart, entry.cursorEnd);
        }
        isUndoRedoOperation.current = false;
      }, 0);
    }
  };

  // Delete word to left (Ctrl + Backspace)
  const handleCtrlBackspace = (start: number, end: number) => {
    if (start !== end) {
      const newText = value.substring(0, start) + value.substring(end);
      setValue(newText);
      setIsDirty(true);
      pushHistory(newText, start, start);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start, start);
      }, 0);
      return;
    }

    if (start === 0) return;

    const textBefore = value.substring(0, start);
    let newStart = start;

    // Step 1: Skip trailing whitespace
    while (newStart > 0 && /\s/.test(textBefore[newStart - 1])) {
      newStart--;
    }
    // Step 2: Delete word characters or non-whitespace block
    if (newStart > 0) {
      const isWordChar = /[\w\$]/.test(textBefore[newStart - 1]);
      while (newStart > 0) {
        const char = textBefore[newStart - 1];
        if (/\s/.test(char)) break;
        if (isWordChar && !/[\w\$]/.test(char)) break;
        if (!isWordChar && /[\w\$]/.test(char)) break;
        newStart--;
      }
    }

    const newText = value.substring(0, newStart) + value.substring(start);
    setValue(newText);
    setIsDirty(true);
    pushHistory(newText, newStart, newStart);

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newStart, newStart);
    }, 0);
  };

  // Delete word to right (Ctrl + Delete)
  const handleCtrlDelete = (start: number, end: number) => {
    if (start !== end) {
      const newText = value.substring(0, start) + value.substring(end);
      setValue(newText);
      setIsDirty(true);
      pushHistory(newText, start, start);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start, start);
      }, 0);
      return;
    }

    if (start >= value.length) return;

    let newEnd = start;
    // Step 1: Skip whitespace
    while (newEnd < value.length && /\s/.test(value[newEnd])) {
      newEnd++;
    }
    // Step 2: Delete word characters
    if (newEnd < value.length) {
      const isWordChar = /[\w\$]/.test(value[newEnd]);
      while (newEnd < value.length) {
        const char = value[newEnd];
        if (/\s/.test(char)) break;
        if (isWordChar && !/[\w\$]/.test(char)) break;
        if (!isWordChar && /[\w\$]/.test(char)) break;
        newEnd++;
      }
    }

    const newText = value.substring(0, start) + value.substring(newEnd);
    setValue(newText);
    setIsDirty(true);
    pushHistory(newText, start, start);

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, start);
    }, 0);
  };

  // Keyboard shortcut Ctrl+S for saving
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [value]);

  const handleSave = async () => {
    try {
      await onSave(value);
      setLastSaved(new Date());
      setIsDirty(false);
    } catch {
      // toast error handled in parent
    }
  };

  // Synchronized scroll when scrolling Editor (Textarea)
  const handleEditorScroll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 1. Sync line numbers gutter
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }

    // 2. Sync Preview pane in Split Mode
    if (mode === "split" && previewScrollRef.current) {
      if (isSyncingPreviewScroll.current) {
        isSyncingPreviewScroll.current = false;
        return;
      }

      const preview = previewScrollRef.current;
      const maxEditorScroll = textarea.scrollHeight - textarea.clientHeight;
      const maxPreviewScroll = preview.scrollHeight - preview.clientHeight;

      if (maxEditorScroll > 0 && maxPreviewScroll > 0) {
        const scrollPercentage = textarea.scrollTop / maxEditorScroll;
        isSyncingEditorScroll.current = true;
        preview.scrollTop = scrollPercentage * maxPreviewScroll;
      }
    }
  };

  // Synchronized scroll when scrolling Preview Pane
  const handlePreviewScroll = () => {
    if (mode !== "split") return;
    const preview = previewScrollRef.current;
    const textarea = textareaRef.current;
    if (!preview || !textarea) return;

    if (isSyncingEditorScroll.current) {
      isSyncingEditorScroll.current = false;
      return;
    }

    const maxPreviewScroll = preview.scrollHeight - preview.clientHeight;
    const maxEditorScroll = textarea.scrollHeight - textarea.clientHeight;

    if (maxPreviewScroll > 0 && maxEditorScroll > 0) {
      const scrollPercentage = preview.scrollTop / maxPreviewScroll;
      const targetEditorScroll = scrollPercentage * maxEditorScroll;

      isSyncingPreviewScroll.current = true;
      textarea.scrollTop = targetEditorScroll;

      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = targetEditorScroll;
      }
    }
  };

  // Insert markdown formatting or tags at current selection
  const insertMarkdown = (
    prefix: string,
    suffix: string = "",
    defaultText: string = ""
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      const newText = value + `${prefix}${defaultText}${suffix}`;
      setValue(newText);
      setIsDirty(true);
      pushHistory(newText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    setValue(newValue);
    setIsDirty(true);

    const targetStart = start + prefix.length;
    const targetEnd = targetStart + selectedText.length;
    pushHistory(newValue, targetStart, targetEnd);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(targetStart, targetEnd);
    }, 10);
  };

  // Insert code snippet block for chosen programming language
  const insertCodeTemplate = (key: string) => {
    const templateObj = CODE_TEMPLATES[key];
    if (!templateObj) return;

    const textarea = textareaRef.current;
    setLangMenuOpen(false);

    if (!textarea) {
      const newText = `${value.trim()}\n\n\`\`\`${templateObj.lang}\n${templateObj.code}\n\`\`\`\n`;
      setValue(newText);
      setIsDirty(true);
      pushHistory(newText);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const codeContent = selectedText ? selectedText : templateObj.code;

    const formattedBlock = `\n\`\`\`${templateObj.lang}\n${codeContent}\n\`\`\`\n`;

    const newValue =
      value.substring(0, start) + formattedBlock + value.substring(end);
    setValue(newValue);
    setIsDirty(true);

    const newCursor = start + formattedBlock.length;
    pushHistory(newValue, newCursor, newCursor);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  // Insert Markdown Table
  const insertTable = () => {
    const tableTemplate = `\n| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Item 1   | Value 1  | Status 1 |\n| Item 2   | Value 2  | Status 2 |\n`;
    insertMarkdown(tableTemplate, "", "");
  };

  // Smart KeyDown handler for Textarea: Auto-Indentation, Ctrl+Z, Ctrl+Y, Ctrl+Backspace, Tab, Braces
  const handleEditorKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    // ── 0. Handle Modifiers (Ctrl/Cmd Shortcuts) ──
    if (isCtrlOrCmd) {
      const key = e.key.toLowerCase();

      // Undo: Ctrl + Z
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl + Y or Ctrl + Shift + Z
      if (key === "y" || (key === "z" && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Ctrl + Backspace (Delete word left)
      if (e.key === "Backspace") {
        e.preventDefault();
        handleCtrlBackspace(start, end);
        return;
      }

      // Ctrl + Delete (Delete word right)
      if (e.key === "Delete") {
        e.preventDefault();
        handleCtrlDelete(start, end);
        return;
      }

      // Let native clipboard & select all work freely (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X)
      if (["a", "c", "v", "x"].includes(key)) {
        return;
      }

      // Formatting shortcuts
      if (key === "b") {
        e.preventDefault();
        insertMarkdown("**", "**", "bold text");
        return;
      }
      if (key === "i") {
        e.preventDefault();
        insertMarkdown("*", "*", "italic text");
        return;
      }
      if (key === "u") {
        e.preventDefault();
        insertMarkdown("<u>", "</u>", "underlined text");
        return;
      }
      if (key === "k") {
        e.preventDefault();
        insertMarkdown("`", "`", "code");
        return;
      }
    }

    // ── 1. Tab & Shift+Tab Handling ──
    if (e.key === "Tab") {
      e.preventDefault();
      const hasSelection = start !== end;

      if (hasSelection) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const lineEnd = value.indexOf("\n", end);
        const actualEnd = lineEnd === -1 ? value.length : lineEnd;

        const selectedBlock = value.substring(lineStart, actualEnd);
        const lines = selectedBlock.split("\n");

        if (e.shiftKey) {
          // Unindent
          let removedCharsTotal = 0;
          let firstLineRemoved = 0;

          const newLines = lines.map((line, idx) => {
            let spacesToRemove = 0;
            if (line.startsWith("  ")) spacesToRemove = 2;
            else if (line.startsWith(" ")) spacesToRemove = 1;

            if (idx === 0) firstLineRemoved = spacesToRemove;
            removedCharsTotal += spacesToRemove;

            return line.substring(spacesToRemove);
          });

          const newText =
            value.substring(0, lineStart) +
            newLines.join("\n") +
            value.substring(actualEnd);
          setValue(newText);
          setIsDirty(true);

          const targetStart = Math.max(lineStart, start - firstLineRemoved);
          const targetEnd = Math.max(lineStart, end - removedCharsTotal);
          pushHistory(newText, targetStart, targetEnd);

          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(targetStart, targetEnd);
          }, 0);
        } else {
          // Indent 2 spaces per line
          const newLines = lines.map((line) => "  " + line);
          const addedCharsTotal = lines.length * 2;

          const newText =
            value.substring(0, lineStart) +
            newLines.join("\n") +
            value.substring(actualEnd);
          setValue(newText);
          setIsDirty(true);

          const targetStart = start + 2;
          const targetEnd = end + addedCharsTotal;
          pushHistory(newText, targetStart, targetEnd);

          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(targetStart, targetEnd);
          }, 0);
        }
      } else {
        if (e.shiftKey) {
          // Unindent current line
          const lineStart = value.lastIndexOf("\n", start - 1) + 1;
          const lineText = value.substring(lineStart, start);
          let spacesToRemove = 0;
          if (lineText.endsWith("  ")) spacesToRemove = 2;
          else if (lineText.endsWith(" ")) spacesToRemove = 1;

          if (spacesToRemove > 0) {
            const newText =
              value.substring(0, start - spacesToRemove) +
              value.substring(start);
            setValue(newText);
            setIsDirty(true);

            const targetPos = start - spacesToRemove;
            pushHistory(newText, targetPos, targetPos);

            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(targetPos, targetPos);
            }, 0);
          }
        } else {
          // Insert 2 spaces
          const newText =
            value.substring(0, start) + "  " + value.substring(end);
          setValue(newText);
          setIsDirty(true);

          const targetPos = start + 2;
          pushHistory(newText, targetPos, targetPos);

          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(targetPos, targetPos);
          }, 0);
        }
      }
      return;
    }

    // ── 2. Enter Key Handling: Auto-Indentation & Smart Brace Split ──
    if (e.key === "Enter") {
      e.preventDefault();

      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : "";

      const charBefore = value[start - 1];
      const charAfter = value[start];

      // Case A: Cursor is directly inside matching braces {}, (), or []
      const isBetweenBraces =
        (charBefore === "{" && charAfter === "}") ||
        (charBefore === "(" && charAfter === ")") ||
        (charBefore === "[" && charAfter === "]");

      if (isBetweenBraces) {
        const extraIndent = "  ";
        const insertion = `\n${currentIndent}${extraIndent}\n${currentIndent}`;
        const newText =
          value.substring(0, start) + insertion + value.substring(end);

        setValue(newText);
        setIsDirty(true);

        const targetPos = start + 1 + currentIndent.length + extraIndent.length;
        pushHistory(newText, targetPos, targetPos);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(targetPos, targetPos);
        }, 0);
        return;
      }

      // Case B: Line ends with block opener: {, (, [, :, =>, ->
      const trimmedLine = currentLine.trimEnd();
      const endsWithBlockOpener = /[\{\(\[\:\=\>\-\>]$/.test(trimmedLine);
      const indentToApply = currentIndent + (endsWithBlockOpener ? "  " : "");

      const insertion = `\n${indentToApply}`;
      const newText =
        value.substring(0, start) + insertion + value.substring(end);

      setValue(newText);
      setIsDirty(true);

      const targetPos = start + insertion.length;
      pushHistory(newText, targetPos, targetPos);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(targetPos, targetPos);
      }, 0);
      return;
    }

    // ── 3. Auto-pair characters ({, (, [) - NO auto-pairing backtick ` or ' on single cursor! ──
    const autoPairs: Record<string, string> = {
      "{": "}",
      "(": ")",
      "[": "]",
      '"': '"',
    };

    if (autoPairs[e.key] && !isCtrlOrCmd && !e.altKey) {
      const closeChar = autoPairs[e.key];

      // If text selected, wrap selection in matching characters
      if (start !== end) {
        e.preventDefault();
        const selectedText = value.substring(start, end);
        const newText =
          value.substring(0, start) +
          e.key +
          selectedText +
          closeChar +
          value.substring(end);
        setValue(newText);
        setIsDirty(true);
        pushHistory(newText, start + 1, end + 1);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 1, end + 1);
        }, 0);
        return;
      }

      // Single cursor auto-pair only for braces {, (, [
      if (["{", "(", "["].includes(e.key)) {
        e.preventDefault();
        const newText =
          value.substring(0, start) + e.key + closeChar + value.substring(end);
        setValue(newText);
        setIsDirty(true);
        pushHistory(newText, start + 1, start + 1);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 1, start + 1);
        }, 0);
        return;
      }
    }

    // If text is selected and user types backtick or quote, wrap selection
    if (["`", "'"].includes(e.key) && start !== end && !isCtrlOrCmd && !e.altKey) {
      e.preventDefault();
      const closeChar = e.key;
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) +
        e.key +
        selectedText +
        closeChar +
        value.substring(end);
      setValue(newText);
      setIsDirty(true);
      pushHistory(newText, start + 1, end + 1);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
      return;
    }

    // ── 4. Backspace between matching auto-pairs ──
    if (e.key === "Backspace" && start === end && start > 0) {
      const charBefore = value[start - 1];
      const charAfter = value[start];
      const pairs: Record<string, string> = {
        "{": "}",
        "(": ")",
        "[": "]",
        '"': '"',
        "'": "'",
        "`": "`",
      };

      if (pairs[charBefore] === charAfter) {
        e.preventDefault();
        const newText =
          value.substring(0, start - 1) + value.substring(start + 1);
        setValue(newText);
        setIsDirty(true);
        pushHistory(newText, start - 1, start - 1);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start - 1, start - 1);
        }, 0);
        return;
      }
    }
  };

  // Run AI Actions
  const runAiAction = async (action: "polish" | "summarize" | "expand") => {
    if (!value.trim()) {
      toast.error("Please add some notes before running AI tools.");
      return;
    }

    try {
      setAiLoading(action);
      setAiMenuOpen(false);

      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: value,
          action,
          context: roadmapTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI action failed");

      if (action === "summarize") {
        const newText = `${value.trim()}\n\n${data.result}`;
        setValue(newText);
        pushHistory(newText);
        toast.success("AI Summary added to notes!");
      } else {
        setValue(data.result);
        pushHistory(data.result);
        toast.success(
          action === "polish"
            ? "Notes polished with AI!"
            : "Notes expanded with AI!"
        );
      }
      setIsDirty(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to execute AI action");
    } finally {
      setAiLoading(null);
    }
  };

  // Copy Markdown to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Notes copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Export as .md file
  const handleExportMd = () => {
    const filename = `${(roadmapTitle || "roadmap")
      .toLowerCase()
      .replace(/\s+/g, "-")}-notes.md`;
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${filename}`);
  };

  // Stats calculation
  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const wordCount = useMemo(() => {
    const trimmed = value.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [value]);
  const charCount = value.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#09090c] shadow-2xl transition-all duration-300 ${isFullscreen
          ? "fixed inset-2 z-50 flex flex-col bg-[#09090c]/98 backdrop-blur-2xl overflow-hidden"
          : "space-y-0 overflow-hidden"
        }`}
    >
      {/* ── 1. Top Header & Primary Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] p-3.5 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-inner">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight font-sora">
                Roadmap Notes & Code Specs
              </h3>
              <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-amber-400">
                <Sparkles size={10} /> Smart Code IDE
              </span>
            </div>
            <p className="text-[11px] text-[#8a8a93]">
              Rich Markdown, Auto-Indent Braces, Multi-Language Code Snippets & AI.
            </p>
          </div>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
            <button
              onClick={() => setMode("edit")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${mode === "edit"
                  ? "bg-white/10 text-white shadow-sm font-semibold"
                  : "text-[#8a8a93] hover:text-white"
                }`}
              title="Editor Mode"
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setMode("split")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${mode === "split"
                  ? "bg-white/10 text-white shadow-sm font-semibold"
                  : "text-[#8a8a93] hover:text-white"
                }`}
              title="Split View Mode"
            >
              <Columns size={13} />
              <span>Split</span>
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${mode === "preview"
                  ? "bg-white/10 text-white shadow-sm font-semibold"
                  : "text-[#8a8a93] hover:text-white"
                }`}
              title="Preview Rendered Markdown"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>

          {/* AI Tools Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setAiMenuOpen(!aiMenuOpen)}
              disabled={!!aiLoading}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-all shadow-sm active:scale-95"
            >
              {aiLoading ? (
                <Loader2 size={13} className="animate-spin text-amber-400" />
              ) : (
                <Wand2 size={13} className="text-amber-400" />
              )}
              <span>AI Assistant</span>
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {aiMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0d0d12] p-2 shadow-2xl backdrop-blur-xl"
                >
                  <button
                    onClick={() => runAiAction("polish")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-all"
                  >
                    <Wand2 size={14} className="text-orange-400" />
                    <div>
                      <div className="font-semibold">Polish & Format</div>
                      <div className="text-[10px] text-[#8a8a93]">
                        Fix grammar & code formatting
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => runAiAction("summarize")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-all"
                  >
                    <Zap size={14} className="text-amber-400" />
                    <div>
                      <div className="font-semibold">Auto-Summarize</div>
                      <div className="text-[10px] text-[#8a8a93]">
                        Generate action items & key points
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => runAiAction("expand")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-all"
                  >
                    <Sparkles size={14} className="text-purple-400" />
                    <div>
                      <div className="font-semibold">Expand Tech Specs</div>
                      <div className="text-[10px] text-[#8a8a93]">
                        Flesh out architecture & code specs
                      </div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-1.5 text-xs text-[#8a8a93] hover:border-white/20 hover:text-white transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* Copy & Export */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[#8a8a93] hover:border-white/20 hover:text-white transition-all"
            title="Copy Markdown"
          >
            {copied ? (
              <Check size={13} className="text-emerald-400" />
            ) : (
              <Copy size={13} />
            )}
          </button>

          <button
            onClick={handleExportMd}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[#8a8a93] hover:border-white/20 hover:text-white transition-all"
            title="Export as .md File"
          >
            <Download size={13} />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition-all ${isDirty
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
                : "bg-white/10 hover:bg-white/20 text-white/90"
              }`}
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            <span>{saving ? "Saving..." : "Save Notes"}</span>
            <span className="hidden lg:inline-block text-[10px] text-white/60 font-mono">
              (Ctrl+S)
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. Rich Formatting & Code Snippet Toolbar ── */}
      {mode !== "preview" && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0d0d12] px-4 py-2">
          {/* Formatting & History buttons */}
          <div className="flex flex-wrap items-center gap-1">
            {/* Undo / Redo controls */}
            <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300 transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={13} />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300 transition-all"
                title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
              >
                <Redo2 size={13} />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* Text Styling */}
            <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              <button
                onClick={() => insertMarkdown("**", "**", "bold text")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Bold (Ctrl+B)"
              >
                <Bold size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("*", "*", "italic text")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Italic (Ctrl+I)"
              >
                <Italic size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("<u>", "</u>", "underlined text")}
                className="rounded p-1.5 text-amber-300 hover:bg-white/10 hover:text-white transition-all"
                title="Underline (Ctrl+U)"
              >
                <Underline size={13} />
              </button>
              <button
                onClick={() =>
                  insertMarkdown("~~", "~~", "strikethrough text")
                }
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Strikethrough"
              >
                <Strikethrough size={13} />
              </button>
              <button
                onClick={() =>
                  insertMarkdown("<mark>", "</mark>", "highlighted text")
                }
                className="rounded p-1.5 text-yellow-400 hover:bg-white/10 hover:text-white transition-all"
                title="Highlight"
              >
                <Highlighter size={13} />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* Headings */}
            <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              <button
                onClick={() => insertMarkdown("\n# ", "", "Heading 1")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Heading 1"
              >
                <Heading1 size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("\n## ", "", "Heading 2")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Heading 2"
              >
                <Heading2 size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("\n### ", "", "Heading 3")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Heading 3"
              >
                <Heading3 size={13} />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* Lists & Quotes */}
            <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              <button
                onClick={() => insertMarkdown("\n- ", "", "List item")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Bullet List"
              >
                <List size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("\n1. ", "", "List item")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Numbered List"
              >
                <ListOrdered size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("\n- [ ] ", "", "Task item")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Task Checklist"
              >
                <ListTodo size={13} />
              </button>
              <button
                onClick={() => insertMarkdown("\n> ", "", "Quote text")}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Blockquote"
              >
                <Quote size={13} />
              </button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-1" />

            {/* Code & Elements */}
            <div className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              <button
                onClick={() => insertMarkdown("`", "`", "code")}
                className="rounded p-1.5 text-emerald-400 hover:bg-white/10 hover:text-white transition-all font-mono"
                title="Inline Code (Ctrl+K)"
              >
                <Code size={13} />
              </button>

              <button
                onClick={insertTable}
                className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                title="Insert Markdown Table"
              >
                <Table size={13} />
              </button>

              <button
                onClick={() =>
                  insertMarkdown("[Link Title](", ")", "https://example.com")
                }
                className="rounded p-1.5 text-blue-400 hover:bg-white/10 hover:text-white transition-all"
                title="Insert Link"
              >
                <LinkIcon size={13} />
              </button>
            </div>
          </div>

          {/* Code Language Dropdown & Shortcuts Legend */}
          <div className="flex items-center gap-2">
            {/* Multi-Language Snippet Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all active:scale-95"
              >
                <FileCode size={13} className="text-emerald-400" />
                <span>Insert Code</span>
                <ChevronDown size={11} />
              </button>

              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 z-50 mt-1.5 grid w-64 grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#0d0d12] p-2 shadow-2xl backdrop-blur-xl max-h-72 overflow-y-auto custom-scrollbar"
                  >
                    <div className="col-span-2 px-2 py-1 text-[10px] font-bold text-[#8a8a93] uppercase tracking-wider">
                      Select Programming Language
                    </div>
                    {Object.entries(CODE_TEMPLATES).map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => insertCodeTemplate(key)}
                        className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs text-white hover:bg-white/10 transition-all font-mono"
                      >
                        <span className="font-semibold text-emerald-300">
                          {template.label}
                        </span>
                        <span className="text-[10px] text-[#8a8a93]">
                          .{template.lang}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shortcuts guide button */}
            <button
              onClick={() => setShortcutsOpen(true)}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-[#8a8a93] hover:text-white hover:border-white/20 transition-all"
              title="Keyboard Shortcuts Guide"
            >
              <Keyboard size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── 3. Main Workspace Area ── */}
      <div
        className={`grid gap-0 ${mode === "split"
            ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10"
            : "grid-cols-1"
          } ${isFullscreen ? "flex-1 min-h-0" : ""}`}
      >
        {/* Editor Area with Synced Line Numbers */}
        {mode !== "preview" && (
          <div className="relative flex h-full bg-[#09090c] overflow-hidden">
            {/* Line numbers gutter */}
            <div
              ref={lineNumbersRef}
              className="select-none py-4 pl-3 pr-2.5 text-right text-[#4a4a52] bg-[#07070a] border-r border-white/5 font-mono text-xs sm:text-sm overflow-hidden leading-relaxed shrink-0 min-w-[44px]"
            >
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Textarea Code/Notes Editor */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleEditorKeyDown}
              onScroll={handleEditorScroll}
              placeholder={`Write down technical notes, architectural decisions, code specs, or draft ideas...\n\nTry writing code:\nfunction example() {\n  return "Auto-Indented!";\n}`}
              className={`w-full bg-[#09090c] p-4 text-xs sm:text-sm font-mono text-white placeholder-[#5a5a63] focus:outline-none resize-none leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar ${isFullscreen ? "h-full overflow-y-auto" : "min-h-[500px]"
                }`}
            />
          </div>
        )}

        {/* Live Rendered Markdown & Code Preview Area */}
        {mode !== "edit" && (
          <div
            ref={previewScrollRef}
            onScroll={handlePreviewScroll}
            className={`flex flex-col bg-[#07070a] p-4 sm:p-6 custom-scrollbar ${isFullscreen ? "h-full overflow-y-auto" : "min-h-[500px] h-auto"
              }`}
          >
            {debouncedValue.trim() ? (
              <div className="prose prose-invert prose-sm max-w-none space-y-3 text-xs sm:text-sm text-slate-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg sm:text-2xl font-extrabold text-white pb-2 border-b border-white/10 font-sora mt-5 mb-3">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base sm:text-xl font-bold text-white mt-5 mb-2 font-sora text-orange-400">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm sm:text-base font-semibold text-white mt-4 mb-1 font-sora text-amber-300">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed my-2">
                        {children}
                      </div>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1 text-slate-300 my-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1 text-slate-300 my-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="my-0.5 text-slate-300">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-orange-500/60 bg-orange-500/5 px-4 py-2.5 rounded-r-xl italic text-slate-300 my-4 shadow-sm">
                        {children}
                      </blockquote>
                    ),
                    pre: ({ children }) => <>{children}</>,
                    code: ({ inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const lang = match ? match[1] : "";
                      const codeString = String(children).replace(/\n$/, "");

                      if (inline) {
                        return (
                          <code
                            className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-amber-300 border border-amber-500/20"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      return <CodeBlock language={lang} value={codeString} />;
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4 rounded-xl border border-white/10 bg-white/[0.01]">
                        <table className="w-full text-left text-xs border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border-b border-white/10 bg-white/[0.04] p-3 font-semibold text-white">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border-b border-white/5 p-3 text-slate-300">
                        {children}
                      </td>
                    ),
                    mark: ({ children }) => (
                      <mark className="rounded bg-yellow-500/20 px-1 py-0.5 text-yellow-300 font-semibold border border-yellow-500/30">
                        {children}
                      </mark>
                    ),
                  }}
                >
                  {debouncedValue}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-xl">
                <FileText size={32} className="text-[#4a4a52] mb-2" />
                <p className="text-xs font-semibold text-[#8a8a93]">
                  No Notes Content Yet
                </p>
                <p className="text-[11px] text-[#5a5a63] mt-1 max-w-xs">
                  Switch to Edit mode or use AI Assistant to draft technical specs and multi-language code snippets.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 4. Footer Metadata Bar & Status ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-2.5 text-[11px] text-[#8a8a93]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Type size={12} className="text-[#8a8a93]" />
            <strong className="text-white">{lineCount}</strong> lines
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-white">{wordCount}</strong> words
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-white">{charCount}</strong> characters
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-[#8a8a93]" />
            ~<strong className="text-white">{readingTimeMin}</strong> min read
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isDirty ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span
              className="flex items-center gap-1.5 text-emerald-400 font-medium"
              suppressHydrationWarning
            >
              <Check size={12} />
              {lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
                : "Saved"}
            </span>
          )}
        </div>
      </div>

      {/* ── 5. Keyboard Shortcuts Legend Modal ── */}
      <AnimatePresence>
        {shortcutsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d12] p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Keyboard size={18} className="text-orange-400" />
                  <h4 className="text-sm font-bold text-white">
                    Notes & Code Shortcuts
                  </h4>
                </div>
                <button
                  onClick={() => setShortcutsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-300">Ctrl + Z / Cmd + Z</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-400 text-[11px]">
                    Undo
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-300">Ctrl + Y / Shift + Cmd + Z</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-400 text-[11px]">
                    Redo
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-300">Ctrl + Backspace</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300 text-[11px]">
                    Delete Word Left
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-300">Enter after {'{'}</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300 text-[11px]">
                    Auto-Indent & Align Braces
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-300">Tab / Shift + Tab</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-300 text-[11px]">
                    Indent / Unindent 2 Spaces
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-300">Ctrl + B / Ctrl + I / Ctrl + U</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-blue-300 text-[11px]">
                    Bold / Italic / Underline
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-300">Ctrl + K</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-blue-300 text-[11px]">
                    Inline Code
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Ctrl + S</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-orange-300 text-[11px]">
                    Save Notes
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShortcutsOpen(false)}
                  className="w-full rounded-xl bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


