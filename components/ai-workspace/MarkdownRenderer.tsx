"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {

  return (

    <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-a:text-cyan-400">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {

            const { children, className } = props;

            const match = /language-(\w+)/.exec(
              className || ""
            );

            const code = String(children).replace(/\n$/, "");

            if (!match) {

              return (

                <code className="rounded bg-zinc-900 px-1.5 py-1 text-cyan-300">

                  {children}

                </code>

              );

            }

            return (

              <CodeBlock
                language={match[1]}
                value={code}
              />

            );

          },
        }}
      >
        {content}
      </ReactMarkdown>

    </div>

  );

}