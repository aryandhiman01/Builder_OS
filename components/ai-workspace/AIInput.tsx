"use client";

import {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
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
  GitBranch,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttachOption {
  icon: typeof ImagePlus;
  title: string;
  description: string;
  connect?: boolean;
}

const attachOptions: AttachOption[] = [
  {
    icon: ImagePlus,
    title: "Add photos & files",
    description: "Upload from your device",
  },
  {
    icon: FolderOpen,
    title: "Browse project files",
    description: "PRDs, docs & architecture",
  },
  {
    icon: Workflow,
    title: "Generate diagram",
    description: "Visualize a flow or system",
  },
  {
    icon: Globe,
    title: "Web search",
    description: "Look up current information",
  },
  {
    icon: Telescope,
    title: "Deep research",
    description: "Get a detailed written report",
  },
];

const connectOptions: AttachOption[] = [
  {
    icon: GitBranch,
    title: "GitHub",
    description: "Sync repositories & issues",
    connect: true,
  },
  {
    icon: MessageSquareText,
    title: "Slack",
    description: "Pull in team discussions",
    connect: true,
  },
];

interface AIInputProps {
  loading: boolean;
  onSend: (message: string) => void;
}

export default function AIInput({
  loading,
  onSend,
}: AIInputProps) {

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");

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

    if (!value || loading) return;

    onSend(value);

    setMessage("");
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

  return (

    <div className="rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">

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
        className="max-h-[220px] min-h-[56px] w-full resize-none overflow-y-auto bg-transparent text-[15px] leading-7 text-white placeholder:text-zinc-500 focus:outline-none"
      />

      <div className="mt-4 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl text-zinc-400 hover:bg-white/5 hover:text-cyan-400 aria-expanded:bg-white/5 aria-expanded:text-cyan-400"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="start"
              className="w-80 rounded-2xl border border-white/10 bg-[#0a0a0c]/95 p-2 text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >

              {attachOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.title}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus:bg-white/[0.06]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-1 items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-white">
                        {option.title}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {option.description}
                      </span>
                    </span>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator className="bg-white/10" />

              {connectOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.title}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 focus:bg-white/[0.06]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-1 items-center justify-between gap-2">
                      <span className="flex flex-col">
                        <span className="text-[13px] font-medium text-white">
                          {option.title}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {option.description}
                        </span>
                      </span>
                      <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300">
                        Connect
                      </span>
                    </span>
                  </DropdownMenuItem>
                );
              })}

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

          {message.trim().length === 0 && (
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
              message.trim().length === 0
            }
            onClick={handleSubmit}
            className="h-11 w-11 rounded-2xl bg-cyan-500 text-black hover:bg-cyan-400"
          >

            {loading ? (

              <Loader2 className="h-5 w-5 animate-spin" />

            ) : (

              <ArrowUp className="h-5 w-5" />

            )}

          </Button>

        </div>

      </div>

    </div>

  );

}