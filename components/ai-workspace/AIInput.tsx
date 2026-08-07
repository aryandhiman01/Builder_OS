"use client";

import {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  ChangeEvent,
} from "react";

import {
  ArrowUp,
  Loader2,
  Plus,
  Mic,
  AudioLines,
  ImagePlus,
  FolderOpen,
  Globe,
  Telescope,
  Workflow,
  X,
  FileText,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Mode = "web-search" | "deep-research" | "diagram";

interface Attachment {
  id: string;
  name: string;
  subtitle: string;
  content: string;
}

interface ProjectFileItem {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface ProjectFileGroup {
  id: string;
  title: string;
  items: ProjectFileItem[];
}

const modeMeta: Record<Mode, { label: string; icon: typeof Globe }> = {
  "web-search": { label: "Web search", icon: Globe },
  "deep-research": { label: "Deep research", icon: Telescope },
  diagram: { label: "Diagram mode", icon: Workflow },
};

const TEXT_FILE_EXTENSIONS = [
  ".txt",
  ".md",
  ".json",
  ".csv",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".yml",
  ".yaml",
  ".log",
];

function isTextFile(file: File) {
  const lower = file.name.toLowerCase();
  return (
    file.type.startsWith("text/") ||
    TEXT_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext))
  );
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

interface AIInputProps {
  loading: boolean;
  onSend: (
    message: string,
    options?: { context?: string; mode?: string | null }
  ) => void;
}

export default function AIInput({
  loading,
  onSend,
}: AIInputProps) {

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [mode, setMode] = useState<Mode | null>(null);

  const [browseOpen, setBrowseOpen] = useState(false);

  const [projectFiles, setProjectFiles] = useState<ProjectFileGroup[]>([]);

  const [browseLoading, setBrowseLoading] = useState(false);

  const [browseError, setBrowseError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {

    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      220
    )}px`;

  }, [message]);

  function handleSubmit() {

    const value = message.trim();

    if ((!value && attachments.length === 0) || loading) return;

    const context = attachments.length
      ? attachments
          .map((item) => `[${item.subtitle}: ${item.name}]\n${item.content}`)
          .join("\n\n")
      : undefined;

    onSend(value || "Summarize the attached context.", {
      context,
      mode,
    });

    setMessage("");
    setAttachments([]);
    setMode(null);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSubmit();

    }

  }

  function toggleMode(next: Mode) {
    setMode((current) => (current === next ? null : next));

    if (next === "diagram" && !message.trim()) {
      setMessage("Generate a diagram for: ");
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    for (const file of files) {
      if (isTextFile(file)) {
        try {
          const content = await readFileAsText(file);
          setAttachments((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              name: file.name,
              subtitle: "Attached file",
              content: content.slice(0, 8000),
            },
          ]);
        } catch {
          // Skip files that fail to read.
        }
      } else {
        setAttachments((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: file.name,
            subtitle: "Attached (binary, not parsed)",
            content: `The user attached a file named "${file.name}" (${file.type || "unknown type"}). Its contents could not be read as text.`,
          },
        ]);
      }
    }
  }

  async function openBrowseFiles() {
    setBrowseOpen(true);

    if (projectFiles.length > 0) return;

    setBrowseLoading(true);
    setBrowseError(null);

    try {
      const response = await fetch("/api/ai/context-sources");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to load project files.");
      }

      setProjectFiles(data.projects ?? []);
    } catch (error) {
      setBrowseError(
        error instanceof Error ? error.message : "Failed to load project files."
      );
    } finally {
      setBrowseLoading(false);
    }
  }

  function selectProjectFile(
    projectTitle: string,
    item: ProjectFileItem
  ) {
    setAttachments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: item.title,
        subtitle: `${projectTitle} · ${item.type}`,
        content: item.excerpt,
      },
    ]);

    setBrowseOpen(false);
  }

  const filteredProjectFiles = projectFiles
    .map((project) => ({
      ...project,
      items: project.items.filter((item) =>
        `${project.title} ${item.title}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    }))
    .filter((project) => project.items.length > 0);

  return (

    <div className="rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-3 sm:p-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />

      {(attachments.length > 0 || mode) && (
        <div className="mb-3 flex flex-wrap gap-2">

          {mode && (
            (() => {
              const Meta = modeMeta[mode];
              const Icon = Meta.icon;
              return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
                  <Icon className="h-3.5 w-3.5" />
                  {Meta.label}
                  <button
                    onClick={() => setMode(null)}
                    className="ml-1 rounded-full p-0.5 hover:bg-orange-500/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })()
          )}

          {attachments.map((item) => (
            <span
              key={item.id}
              title={item.subtitle}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300"
            >
              <FileText className="h-3.5 w-3.5 text-zinc-500" />
              <span className="max-w-[120px] sm:max-w-[160px] truncate">{item.name}</span>
              <button
                onClick={() => removeAttachment(item.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

        </div>
      )}

      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        disabled={loading}
        onKeyDown={handleKeyDown}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        placeholder="Ask BuilderOS AI anything..."
        className="max-h-[220px] min-h-[50px] sm:min-h-[56px] w-full resize-none overflow-y-auto bg-transparent text-sm sm:text-[15px] leading-6 sm:leading-7 text-white placeholder:text-zinc-500 focus:outline-none"
      />

      <div className="mt-3 sm:mt-4 flex items-center justify-between">

        <div className="flex items-center gap-1.5 sm:gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl text-zinc-400 hover:bg-white/5 hover:text-orange-400 aria-expanded:bg-white/5 aria-expanded:text-orange-400"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="start"
              className="w-[calc(100vw-32px)] sm:w-80 rounded-2xl border border-white/10 bg-[#0a0a0c]/95 p-2 text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >

              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setTimeout(() => fileInputRef.current?.click(), 0);
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus:bg-white/[0.06]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10 text-orange-400">
                  <ImagePlus className="h-4 w-4" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-white">
                    Add photos & files
                  </span>
                  <span className="text-xs text-zinc-500">
                    Upload from your device
                  </span>
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setTimeout(openBrowseFiles, 0);
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus:bg-white/[0.06]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10 text-orange-400">
                  <FolderOpen className="h-4 w-4" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-white">
                    Browse project files
                  </span>
                  <span className="text-xs text-zinc-500">
                    PRDs, docs & architecture
                  </span>
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => toggleMode("diagram")}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus:bg-white/[0.06]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10 text-orange-400">
                  <Workflow className="h-4 w-4" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-white">
                    Generate diagram
                  </span>
                  <span className="text-xs text-zinc-500">
                    Visualize a flow or system
                  </span>
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => toggleMode("web-search")}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus:bg-white/[0.06]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/25 bg-orange-500/10 text-orange-400">
                  <Globe className="h-4 w-4" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-white">
                    Web search
                  </span>
                  <span className="text-xs text-zinc-500">
                    Look up current information
                  </span>
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => toggleMode("deep-research")}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus:bg-white/[0.06]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10 text-violet-300">
                  <Telescope className="h-4 w-4" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-white">
                    Deep research
                  </span>
                  <span className="text-xs text-zinc-500">
                    Get a detailed written report
                  </span>
                </span>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="icon"
            variant="ghost"
            disabled
            className="rounded-xl text-zinc-500"
          >
            <Mic className="h-4 w-4" />
          </Button>

          <span className="hidden text-xs text-zinc-500 sm:inline">

            Shift + Enter for new line

          </span>

        </div>

        <div className="flex items-center gap-2">

          {message.trim().length === 0 && attachments.length === 0 && (
            <Button
              size="icon"
              variant="ghost"
              disabled
              className="h-11 w-11 rounded-2xl border border-white/10 text-zinc-400"
            >
              <AudioLines className="h-5 w-5" />
            </Button>
          )}

          <Button
            size="icon"
            disabled={
              loading ||
              (message.trim().length === 0 && attachments.length === 0)
            }
            onClick={handleSubmit}
            className="btn-shimmer h-11 w-11 rounded-2xl bg-white text-black hover:bg-zinc-100 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-black" />
            ) : (
              <ArrowUp className="h-5 w-5 text-black" strokeWidth={2.5} />
            )}
          </Button>

        </div>

      </div>

      <Dialog open={browseOpen} onOpenChange={setBrowseOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0c] p-0 text-white sm:max-w-lg">

          <div className="border-b border-white/10 p-5">
            <DialogHeader>
              <DialogTitle className="text-white">
                Browse project files
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Attach a PRD, roadmap, architecture doc or research note as context.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your projects..."
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-3">

            {browseLoading && (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading your project files...
              </div>
            )}

            {browseError && (
              <p className="px-2 py-6 text-center text-sm text-red-400">
                {browseError}
              </p>
            )}

            {!browseLoading && !browseError && filteredProjectFiles.length === 0 && (
              <p className="px-2 py-10 text-center text-sm text-zinc-500">
                No project files found yet. Generate a PRD, roadmap or
                architecture in one of your projects first.
              </p>
            )}

            {!browseLoading &&
              filteredProjectFiles.map((project) => (
                <div key={project.id} className="mb-3">
                  <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                    {project.title}
                  </p>

                  <div className="flex flex-col gap-0.5">
                    {project.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectProjectFile(project.title, item)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10 text-violet-300">
                          <FileText className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-white">
                            {item.title}
                          </span>
                          <span className="block text-xs capitalize text-zinc-500">
                            {item.type}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

          </div>

        </DialogContent>
      </Dialog>

    </div>

  );

}
