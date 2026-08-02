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

    <div className="my-6 overflow-hidden rounded-2xl border border-white/10">

      <div className="flex items-center justify-between border-b border-white/10 bg-zinc-900 px-4 py-3">

        <span className="text-sm font-medium capitalize text-zinc-400">

          {language || "code"}

        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >

          {copied ? (

            <>
              <Check className="h-4 w-4 text-green-400" />
              Copied
            </>

          ) : (

            <>
              <Copy className="h-4 w-4" />
              Copy
            </>

          )}

        </button>

      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "24px",
          background: "#09090b",
          fontSize: "14px",
        }}
      >
        {value}
      </SyntaxHighlighter>

    </div>

  );

}