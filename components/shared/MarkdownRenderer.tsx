"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  return (
    <div
      className="
      prose
      prose-invert
      max-w-none

      prose-headings:font-bold
      prose-headings:text-white

      prose-p:text-zinc-300
      prose-p:leading-8

      prose-strong:text-white

      prose-a:text-blue-400
      prose-a:no-underline
      hover:prose-a:underline

      prose-blockquote:border-l-blue-500
      prose-blockquote:text-zinc-400

      prose-code:rounded
      prose-code:bg-zinc-900
      prose-code:px-1.5
      prose-code:py-1
      prose-code:text-blue-300

      prose-pre:border
      prose-pre:border-white/10
      prose-pre:bg-[#090909]

      prose-li:text-zinc-300

      prose-table:block
      prose-table:w-full
      prose-table:overflow-x-auto

      prose-th:border
      prose-th:border-white/10
      prose-th:bg-white/5
      prose-th:px-4
      prose-th:py-2

      prose-td:border
      prose-td:border-white/10
      prose-td:px-4
      prose-td:py-2
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1
              className="
              mt-10
              mb-6
              text-4xl
              font-bold
              tracking-tight
              text-white
              "
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="
              mt-10
              mb-5
              text-3xl
              font-semibold
              text-white
              "
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="
              mt-8
              mb-4
              text-2xl
              font-semibold
              text-white
              "
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="
              mb-5
              leading-8
              text-zinc-300
              "
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul
              className="
              mb-6
              ml-6
              list-disc
              space-y-2
              text-zinc-300
              "
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className="
              mb-6
              ml-6
              list-decimal
              space-y-2
              text-zinc-300
              "
            >
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="
              my-8
              rounded-r-xl
              border-l-4
              border-blue-500
              bg-blue-500/5
              px-6
              py-4
              italic
              text-zinc-400
              "
            >
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="
              text-blue-400
              underline-offset-4
              transition
              hover:underline
              "
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("language-");

            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code
                className="
                rounded-md
                bg-zinc-900
                px-1.5
                py-1
                text-sm
                text-blue-300
                "
                {...props}
              >
                {children}
              </code>
            );
          },
          hr: () => (
            <hr
              className="
              my-10
              border-white/10
              "
            />
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto">
              <table
                className="
                w-full
                border-collapse
                "
              >
                {children}
              </table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}