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
  Paperclip,
  Mic,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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

          <Button
            size="icon"
            variant="ghost"
            disabled
            className="rounded-xl text-zinc-500"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            disabled
            className="rounded-xl text-zinc-500"
          >
            <Mic className="h-4 w-4" />
          </Button>

          <span className="text-xs text-zinc-500">

            Shift + Enter for new line

          </span>

        </div>

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

  );

}