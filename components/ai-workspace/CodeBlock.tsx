"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  value: string;
}

export default function CodeBlock({
  language,
  value,
}: CodeBlockProps) {

  const [copied, setCopied] = useState(false);

  async function handleCopy() {

    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);

  }

  return (

    <div className="my-3 sm:my-5 overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 w-full max-w-full">

      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-3 py-2 sm:px-4 sm:py-2.5">

        <span className="text-xs sm:text-sm font-medium capitalize text-zinc-400">

          {language || "code"}

        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >

          {copied ? (

            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span>Copied</span>
            </>

          ) : (

            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>

          )}

        </button>

      </div>

      <div className="overflow-x-auto w-full no-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "12px 14px",
            background: "#09090b",
            fontSize: "12.5px",
            lineHeight: "1.5",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>

    </div>

  );

}