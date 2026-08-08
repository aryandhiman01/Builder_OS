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

    <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed sm:leading-relaxed prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-3 prose-headings:mb-1.5 prose-p:text-zinc-200 prose-p:my-1.5 sm:prose-p:my-2.5 prose-li:text-zinc-200 prose-li:my-0.5 prose-a:text-orange-400 prose-a:underline prose-code:text-orange-300 prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none overflow-x-auto">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <div className="my-1.5 sm:my-2.5 text-zinc-200">{children}</div>
          ),
          code(props) {

            const { children, className } = props;

            const match = /language-(\w+)/.exec(
              className || ""
            );

            const code = String(children).replace(/\n$/, "");

            if (!match) {

              return (

                <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-xs text-orange-300">

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